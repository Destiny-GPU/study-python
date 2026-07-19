import React, { useState, useCallback, useRef, useEffect } from 'react';
import { loadPyodide, setupCapture, getCapturedOutput } from '../PyodideRunner/loader';
import useTheme from '../../hooks/useTheme';
import { buildWindCode } from './codeBuilder';
import styles from './styles.module.css';

/* ── Configuration ── */

const WIND_TYPES = [
  {
    id: 'steady',
    label: '恒定风',
    desc: '平均风速',
    color: '#64748b',
    params: [
      { id: 'speed', label: '风速 (m/s)', min: 0, max: 20, step: 0.5, default: 5 },
      { id: 'dir', label: '风向 (°)', min: 0, max: 360, step: 5, default: 0 },
      { id: 'variability', label: '变化率 (%/s)', min: 0, max: 2, step: 0.1, default: 0 },
    ],
  },
  {
    id: 'shear',
    label: '风切变',
    desc: '随高度变化',
    color: '#3b82f6',
    params: [
      { id: 'shear_mag', label: '切变强度', min: 0, max: 5, step: 0.1, default: 1.5 },
      { id: 'shear_h', label: '参考高度 (m)', min: 10, max: 200, step: 5, default: 50 },
      { id: 'shear_dir', label: '风向 (°)', min: 0, max: 360, step: 5, default: 45 },
    ],
  },
  {
    id: 'periodic',
    label: '周期风',
    desc: '正弦振荡',
    color: '#8b5cf6',
    params: [
      { id: 'period_amp', label: '振幅 (m/s)', min: 0, max: 8, step: 0.1, default: 2.0 },
      { id: 'period_freq', label: '频率 (Hz)', min: 0.01, max: 1, step: 0.01, default: 0.15 },
      { id: 'period_dir', label: '风向 (°)', min: 0, max: 360, step: 5, default: 90 },
    ],
  },
  {
    id: 'gust',
    label: '阵风',
    desc: '瞬时突变',
    color: '#f59e0b',
    params: [
      { id: 'gust_peak', label: '峰值 (m/s)', min: 0, max: 15, step: 0.5, default: 6.0 },
      { id: 'gust_dur', label: '持续时间 (s)', min: 0.5, max: 5, step: 0.1, default: 2.0 },
      { id: 'gust_onset', label: '起始时刻 (s)', min: 0, max: 15, step: 0.5, default: 5.0 },
      { id: 'gust_dir', label: '风向 (°)', min: 0, max: 360, step: 5, default: 180 },
    ],
  },
  {
    id: 'turbulence',
    label: '湍流',
    desc: '随机脉动',
    color: '#ef4444',
    params: [
      { id: 'turb_i', label: '湍流强度', min: 0, max: 1, step: 0.05, default: 0.3 },
      { id: 'turb_scale', label: '积分尺度 (m)', min: 10, max: 300, step: 5, default: 100 },
      { id: 'turb_dir', label: '风向 (°)', min: 0, max: 360, step: 5, default: 120 },
    ],
  },
];

const STATS_META = [
  { key: '平均风速', label: '平均风速', unit: 'm/s' },
  { key: '最大风速', label: '最大风速', unit: 'm/s' },
  { key: '最小风速', label: '最小风速', unit: 'm/s' },
  { key: '风速标准差', label: '标准差', unit: 'm/s' },
];

const COLOR_MAP = Object.fromEntries(WIND_TYPES.map((w) => [w.id, w.color]));
const LABEL_MAP = Object.fromEntries(WIND_TYPES.map((w) => [w.id, w.label]));

/* ── Canvas Chart ── */

function Chart({ series, xLabel, yLabel, title, theme, fillTotal = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!series?.length || !canvasRef.current) return;
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
    ctx.clearRect(0, 0, W, H);

    const pad = { top: 32, right: 20, bottom: 40, left: 55 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    // Compute bounds
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const s of series) {
      if (!s.x || s.x.length < 2) continue;
      for (const v of s.x) { if (v < xMin) xMin = v; if (v > xMax) xMax = v; }
      for (const v of s.y) { if (v < yMin) yMin = v; if (v > yMax) yMax = v; }
    }
    if (!isFinite(xMin)) return;

    const yAbsMax = Math.max(Math.abs(yMin), Math.abs(yMax)) * 1.1 || 1;
    yMin = -yAbsMax;
    yMax = yAbsMax;
    const yRange = yMax - yMin;
    const xRange = xMax - xMin || 1;

    // Helpers
    const toX = (v) => pad.left + ((v - xMin) / xRange) * plotW;
    const toY = (v) => pad.top + plotH - ((v - yMin) / yRange) * plotH;
    const gridStep = (i) => ({ px: pad.left + (plotW / 5) * i, py: pad.top + (plotH / 5) * i });

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.font = '11px Inter, system-ui, sans-serif';
    for (let i = 0; i <= 5; i++) {
      const { px, py } = gridStep(i);
      ctx.beginPath();
      ctx.moveTo(pad.left, py);
      ctx.lineTo(pad.left + plotW, py);
      ctx.stroke();
      // Y label
      ctx.textAlign = 'right';
      ctx.fillText((yMax - (yRange / 5) * i).toFixed(1), pad.left - 8, py + 4);
      // X label
      ctx.textAlign = 'center';
      ctx.fillText((xMin + (xRange / 5) * i).toFixed(1), px, H - pad.bottom + 18);
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

    // Zero line
    const zeroY = toY(0);
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(pad.left + plotW, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw a polyline from series data
    const drawLine = (s, lineWidth, alpha = 1) => {
      ctx.beginPath();
      for (let i = 0; i < s.x.length; i++) {
        const method = i === 0 ? 'moveTo' : 'lineTo';
        ctx[method](toX(s.x[i]), toY(s.y[i]));
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = alpha;
      ctx.lineJoin = 'round';
      if (s.dash) ctx.setLineDash(s.dash);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    };

    // Component lines (thin, transparent)
    for (const s of series) {
      if (s.isTotal || s.x.length < 2) continue;
      drawLine(s, 1.5, 0.5);
    }

    // Total lines (thick) + optional fill
    const totals = series.filter((s) => s.isTotal && s.x?.length >= 2);
    for (let ti = 0; ti < totals.length; ti++) {
      drawLine(totals[ti], 2.5);
      if (fillTotal && ti === 0) {
        ctx.lineTo(toX(totals[ti].x.at(-1)), zeroY);
        ctx.lineTo(toX(totals[ti].x[0]), zeroY);
        ctx.closePath();
        ctx.fillStyle = isDark ? 'rgba(74,108,247,0.08)' : 'rgba(74,108,247,0.05)';
        ctx.fill();
      }
    }

    // Title
    if (title) {
      ctx.fillStyle = textColor;
      ctx.font = 'bold 13px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(title, pad.left, 18);
    }
  }, [series, xLabel, yLabel, title, theme, fillTotal]);

  return <canvas ref={canvasRef} className={styles.chartCanvas} />;
}

/* ── Slider Control ── */

function Slider({ param, value, onChange }) {
  return (
    <div className={styles.controlRow}>
      <label className={styles.controlLabel}>
        <span>{param.label}</span>
        <span className={styles.controlValue}>{value.toFixed(2)}</span>
      </label>
      <input
        type="range"
        className={styles.slider}
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div className={styles.sliderRange}>
        <span>{param.min}</span>
        <span>{param.max}</span>
      </div>
    </div>
  );
}

/* ── Parse stats from Python stdout ── */

function parseStats(stdout) {
  const stats = {};
  for (const line of stdout.trim().split('\n')) {
    const m = line.match(/^(.+?):\s*([\d.]+)/);
    if (m) stats[m[1]] = parseFloat(m[2]);
  }
  return stats;
}

/* ── Main Component ── */

export default function WindDisturbance({ duration = 20 }) {
  const [enabled, setEnabled] = useState(() => {
    const init = {};
    WIND_TYPES.forEach((w) => { init[w.id] = w.id === 'steady'; });
    return init;
  });
  const [params, setParams] = useState(() => {
    const init = {};
    WIND_TYPES.forEach((w) => {
      w.params.forEach((p) => { init[p.id] = p.default; });
    });
    return init;
  });
  const [speedSeries, setSpeedSeries] = useState(null);
  const [vectorSeries, setVectorSeries] = useState(null);
  const [stats, setStats] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const theme = useTheme();

  const pyodideRef = useRef(null);
  const runTimerRef = useRef(null);
  const enabledRef = useRef(enabled);
  const paramsRef = useRef(params);
  enabledRef.current = enabled;
  paramsRef.current = params;

  const runCode = useCallback(async () => {
    setIsRunning(true);
    try {
      if (!pyodideRef.current) {
        pyodideRef.current = await loadPyodide();
      }
      const py = pyodideRef.current;
      setupCapture(py);
      try {
        py.runPython(buildWindCode(enabledRef.current, paramsRef.current, duration));
      } catch (e) {
        const { stderr } = getCapturedOutput(py);
        console.error('Wind simulation error:', e.message, stderr);
        return;
      }
      const { stdout } = getCapturedOutput(py);
      setStats(parseStats(stdout));

      const x = py.runPython('list(_chart_x)');
      const totalSpeed = py.runPython('list(_chart_speed)');
      const totalU = py.runPython('list(_chart_u)');
      const totalV = py.runPython('list(_chart_v)');

      // Speed chart: total + individual components
      const sSeries = [
        { x, y: totalSpeed, color: '#4a6cf7', label: '叠加风速', isTotal: true },
      ];
      for (const name of py.runPython('list(components.keys())')) {
        sSeries.push({
          x,
          y: py.runPython(`list(components['${name}'])`),
          color: COLOR_MAP[name] || '#999',
          label: LABEL_MAP[name] || name,
          isTotal: false,
        });
      }
      setSpeedSeries(sSeries);

      // Vector chart: u (east+) and v (north+)
      setVectorSeries([
        { x, y: totalU, color: '#06b6d4', label: 'u (东+)', isTotal: true },
        { x, y: totalV, color: '#f97316', label: 'v (北+)', isTotal: true },
      ]);
    } catch (e) {
      console.error('Wind simulation error:', e);
    } finally {
      setIsRunning(false);
    }
  }, [duration]);

  // Initial run after mount
  useEffect(() => {
    const timer = setTimeout(() => runCode(), 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(runTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedRun = useCallback((delay) => {
    clearTimeout(runTimerRef.current);
    runTimerRef.current = setTimeout(() => runCode(), delay);
  }, [runCode]);

  const handleToggle = useCallback((id) => {
    setEnabled((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      enabledRef.current = next;
      debouncedRun(100);
      return next;
    });
  }, [debouncedRun]);

  const handleParamChange = useCallback((id, value) => {
    setParams((prev) => {
      const next = { ...prev, [id]: value };
      paramsRef.current = next;
      debouncedRun(150);
      return next;
    });
  }, [debouncedRun]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        🌬️ 风扰设计 — 叠加多种风扰分量，观察组合风速与矢量风向
      </div>

      <div className={styles.body}>
        {/* Controls */}
        <div className={styles.controlsPanel}>
          <div className={styles.controlsTitle}>风扰分量</div>

          {WIND_TYPES.map((wt) => (
            <div
              key={wt.id}
              className={`${styles.windType} ${enabled[wt.id] ? styles.windTypeEnabled : ''}`}
              style={{ '--cat-color': wt.color }}
            >
              <div className={styles.windTypeHeader}>
                <div className={styles.windTypeLabel}>
                  <span className={styles.windTypeDot} style={{ background: wt.color }} />
                  {wt.label}
                  <span className={styles.windTypeDesc}>{wt.desc}</span>
                </div>
                <button
                  className={`${styles.toggle} ${enabled[wt.id] ? styles.toggleOn : ''}`}
                  onClick={() => handleToggle(wt.id)}
                  type="button"
                >
                  <span className={styles.toggleThumb} />
                </button>
              </div>

              {enabled[wt.id] && (
                <div className={styles.windTypeParams}>
                  {wt.params.map((p) => (
                    <Slider
                      key={p.id}
                      param={p}
                      value={params[p.id]}
                      onChange={(v) => handleParamChange(p.id, v)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          <button className={styles.runBtn} onClick={runCode} disabled={isRunning}>
            {isRunning ? '计算中...' : '▶ 运行'}
          </button>
        </div>

        {/* Visualization */}
        <div className={styles.vizPanel}>
          {speedSeries ? (
            <>
              <Chart
                series={speedSeries}
                xLabel="时间 (s)"
                yLabel="风速 (m/s)"
                title="风速大小"
                theme={theme}
                fillTotal
              />
              <div className={styles.chartSeparator} />
              <Chart
                series={vectorSeries}
                xLabel="时间 (s)"
                yLabel="分量 (m/s)"
                title="矢量分解 (u / v)"
                theme={theme}
                fillTotal={false}
              />
            </>
          ) : (
            <div className={styles.placeholder}>
              {isRunning ? '计算中...' : '开启风扰分量后自动生成曲线'}
            </div>
          )}

          {/* Legend */}
          {speedSeries && (
            <div className={styles.legend}>
              <div className={styles.legendGroup}>
                <span className={styles.legendGroupLabel}>风速</span>
                {speedSeries.map((s) => (
                  <div key={s.label} className={styles.legendItem}>
                    <span
                      className={`${styles.legendLine} ${s.isTotal ? styles.legendLineTotal : ''}`}
                      style={{ background: s.color }}
                    />
                    {s.label}
                  </div>
                ))}
              </div>
              <span className={styles.legendDivider} />
              <div className={styles.legendGroup}>
                <span className={styles.legendGroupLabel}>矢量</span>
                {vectorSeries?.map((s) => (
                  <div key={s.label} className={styles.legendItem}>
                    <span
                      className={`${styles.legendLine} ${styles.legendLineTotal}`}
                      style={{ background: s.color }}
                    />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className={styles.statsBar}>
              {STATS_META.map(({ key, label, unit }) => (
                <div key={key} className={styles.stat}>
                  <span>{label}:</span>
                  <span className={styles.statValue}>{stats[key]} {unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
