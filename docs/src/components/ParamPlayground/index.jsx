import { useState, useCallback, useRef, useEffect } from 'react';
import { loadPyodide, setupCapture, getCapturedOutput } from '../PyodideRunner/loader';
import useTheme from '../../hooks/useTheme';
import styles from './styles.module.css';

/**
 * Interactive parameter playground with real-time visualization.
 *
 * Usage in MDX:
 *   <ParamPlayground
 *     title="PID 控制器阶跃响应"
 *     code={`
 * import numpy as np
 * def simulate(kp, ki, kd):
 *     ...
 *     return t, y
 * `}
 *     controls={[
 *       { id: 'kp', label: 'Kp (比例增益)', min: 0.1, max: 5, step: 0.1, default: 1.5 },
 *       { id: 'ki', label: 'Ki (积分增益)', min: 0, max: 2, step: 0.05, default: 0.5 },
 *       { id: 'kd', label: 'Kd (微分增益)', min: 0, max: 2, step: 0.05, default: 0.3 },
 *     ]}
 *     chart={{ xLabel: '时间 (s)', yLabel: '输出', title: '阶跃响应' }}
 *   />
 */

// --- Mini Canvas Chart (zero dependencies) ---

function MiniChart({ data, xLabel, yLabel, title, theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#b8b6c4' : '#5a5a6e';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const lineColor = '#4a6cf7';
    const fillColor = isDark ? 'rgba(74,108,247,0.15)' : 'rgba(74,108,247,0.08)';

    ctx.clearRect(0, 0, W, H);

    const pad = { top: 32, right: 20, bottom: 40, left: 55 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    if (!data.x || !data.y || data.x.length < 2) return;

    const xMin = Math.min(...data.x);
    const xMax = Math.max(...data.x);
    const yMin = Math.min(...data.y);
    const yMax = Math.max(...data.y);
    const yRange = yMax - yMin || 1;
    const xRange = xMax - xMin || 1;

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + plotW, y);
      ctx.stroke();
    }

    // Axes labels
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = yMax - (yRange / 4) * i;
      const y = pad.top + (plotH / 4) * i;
      ctx.fillText(val.toFixed(2), pad.left - 8, y + 4);
    }
    ctx.textAlign = 'center';
    for (let i = 0; i <= 4; i++) {
      const val = xMin + (xRange / 4) * i;
      const x = pad.left + (plotW / 4) * i;
      ctx.fillText(val.toFixed(1), x, H - pad.bottom + 18);
    }

    // Axis titles
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    if (xLabel) ctx.fillText(xLabel, pad.left + plotW / 2, H - 4);
    ctx.save();
    ctx.translate(14, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    if (yLabel) ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Data line + fill
    ctx.beginPath();
    for (let i = 0; i < data.x.length; i++) {
      const px = pad.left + ((data.x[i] - xMin) / xRange) * plotW;
      const py = pad.top + plotH - ((data.y[i] - yMin) / yRange) * plotH;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Fill area under curve
    const lastX = pad.left + ((data.x[data.x.length - 1] - xMin) / xRange) * plotW;
    const baseline = pad.top + plotH - ((0 - yMin) / yRange) * plotH;
    ctx.lineTo(lastX, baseline);
    ctx.lineTo(pad.left + ((data.x[0] - xMin) / xRange) * plotW, baseline);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Title
    if (title) {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 13px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(title, pad.left, 18);
    }
  }, [data, xLabel, yLabel, title, theme]);

  return <canvas ref={canvasRef} className={styles.chartCanvas} />;
}

// --- Slider Control ---

function SliderControl({ control, value, onChange }) {
  return (
    <div className={styles.controlRow}>
      <label className={styles.controlLabel}>
        <span>{control.label}</span>
        <span className={styles.controlValue}>{value.toFixed(2)}</span>
      </label>
      <input
        type="range"
        className={styles.slider}
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className={styles.sliderRange}>
        <span>{control.min}</span>
        <span>{control.max}</span>
      </div>
    </div>
  );
}

// --- Toggle Control ---

function ToggleControl({ control, value, onChange }) {
  return (
    <div className={styles.controlRow}>
      <label className={styles.controlLabel}>
        <span>{control.label}</span>
        <button
          className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
          onClick={() => onChange(!value)}
          type="button"
        >
          <span className={styles.toggleThumb} />
        </button>
      </label>
    </div>
  );
}

// --- Main Component ---

export default function ParamPlayground({
  title,
  code,
  controls = [],
  chart = {},
}) {
  const [params, setParams] = useState(() => {
    const initial = {};
    controls.forEach((c) => { initial[c.id] = c.default; });
    return initial;
  });
  const [chartData, setChartData] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const theme = useTheme();
  const pyodideRef = useRef(null);
  const runTimerRef = useRef(null);

  const runCode = useCallback(async (currentParams) => {
    if (!code) return;
    setIsRunning(true);
    setError(null);

    try {
      if (!pyodideRef.current) {
        pyodideRef.current = await loadPyodide();
      }
      const py = pyodideRef.current;

      // Build param assignments
      const paramLines = Object.entries(currentParams)
        .map(([k, v]) => `${k} = ${typeof v === 'boolean' ? (v ? 'True' : 'False') : v}`)
        .join('\n');

      const fullCode = `${paramLines}\n${code}`;

      setupCapture(py);

      let result;
      try {
        result = py.runPython(fullCode);
      } catch (e) {
        const { stderr } = getCapturedOutput(py);
        setError(e.message);
        setOutput(stderr || '');
        return;
      }

      const { stdout } = getCapturedOutput(py);
      setOutput(stdout || '');

      // Try to extract chart data from globals
      try {
        const hasData = py.runPython(
          '"_chart_x" in globals() and "_chart_y" in globals()'
        );
        if (hasData) {
          const x = py.runPython('list(_chart_x)');
          const y = py.runPython('list(_chart_y)');
          setChartData({ x, y });
        } else {
          setChartData(null);
        }
      } catch {
        setChartData(null);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  // Debounced auto-run on param change
  const handleParamChange = useCallback((id, value) => {
    setParams((prev) => {
      const next = { ...prev, [id]: value };
      clearTimeout(runTimerRef.current);
      runTimerRef.current = setTimeout(() => runCode(next), 150);
      return next;
    });
  }, [runCode]);

  // Initial run on mount + cleanup on unmount
  useEffect(() => {
    if (code) {
      const timer = setTimeout(() => runCode(params), 500);
      return () => {
        clearTimeout(timer);
        clearTimeout(runTimerRef.current);
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.container}>
      {title && <div className={styles.header}>{title}</div>}

      <div className={styles.body}>
        {/* Controls panel */}
        <div className={styles.controlsPanel}>
          <div className={styles.controlsTitle}>参数调节</div>
          {controls.map((ctrl) =>
            ctrl.type === 'toggle' ? (
              <ToggleControl
                key={ctrl.id}
                control={ctrl}
                value={params[ctrl.id]}
                onChange={(v) => handleParamChange(ctrl.id, v)}
              />
            ) : (
              <SliderControl
                key={ctrl.id}
                control={ctrl}
                value={params[ctrl.id]}
                onChange={(v) => handleParamChange(ctrl.id, v)}
              />
            )
          )}
          <button
            className={styles.runBtn}
            onClick={() => runCode(params)}
            disabled={isRunning}
          >
            {isRunning ? '运行中...' : '▶ 运行'}
          </button>
        </div>

        {/* Visualization panel */}
        <div className={styles.vizPanel}>
          {chartData ? (
            <MiniChart
              data={chartData}
              xLabel={chart.xLabel}
              yLabel={chart.yLabel}
              title={chart.title}
              theme={theme}
            />
          ) : (
            <div className={styles.placeholder}>
              {isRunning ? '计算中...' : '调整参数后自动生成图表'}
            </div>
          )}

          {/* Output panel */}
          {(output || error) && (
            <div className={`${styles.output} ${error ? styles.outputError : ''}`}>
              <pre>{error || output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
