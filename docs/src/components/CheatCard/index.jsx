import { useState, useCallback, useRef, useEffect } from 'react';
import { loadPyodide, setupCapture, getCapturedOutput } from '../PyodideRunner/loader';
import styles from './styles.module.css';

/**
 * Interactive cheat card for quick reference tables.
 *
 * Usage in MDX:
 *   <CheatCard
 *     title="速查表"
 *     headers={['语法', '功能', '示例']}
 *     rows={[
 *       ['`if condition:`', '条件判断', '`if x > 0: print("正数")`'],
 *     ]}
 *   />
 */
export default function CheatCard({ title = '速查表', headers = ['语法', '功能', '示例'], rows = [] }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [runningIdx, setRunningIdx] = useState(null);
  const [outputIdx, setOutputIdx] = useState(null);
  const [output, setOutput] = useState('');
  const [outputError, setOutputError] = useState(false);
  const pyodideRef = useRef(null);

  // Copy code to clipboard with fallback
  const handleCopy = useCallback((text, idx) => {
    const write = navigator.clipboard
      ? navigator.clipboard.writeText(text)
      : new Promise((resolve, reject) => {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); resolve(); }
          catch (e) { reject(e); }
          finally { document.body.removeChild(ta); }
        });
    write.then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    }).catch(() => {});
  }, []);

  // Run example in Pyodide
  const handleTry = useCallback(async (code, idx) => {
    if (runningIdx !== null) return;
    setRunningIdx(idx);
    setOutputIdx(idx);
    setOutput('');
    setOutputError(false);

    try {
      if (!pyodideRef.current) {
        pyodideRef.current = await loadPyodide();
      }
      const py = pyodideRef.current;

      setupCapture(py);

      try {
        py.runPython(code);
      } catch (e) {
        const { stderr } = getCapturedOutput(py);
        setOutput(e.message + (stderr ? '\n' + stderr : ''));
        setOutputError(true);
        return;
      }

      const { stdout } = getCapturedOutput(py);
      setOutput(stdout || '(无输出)');
    } catch (e) {
      setOutput(e.message);
      setOutputError(true);
    } finally {
      setRunningIdx(null);
    }
  }, [runningIdx]);

  // Strip markdown backticks for safe rendering
  const stripBackticks = (text) => text.replace(/`([^`]+)`/g, '$1').trim();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>📋</span>
        <span className={styles.title}>{title}</span>
      </div>

      <div className={styles.grid}>
        {rows.map((row, i) => {
          const syntax = row[0] || '';
          const desc = row[1] || '';
          const example = row[2] || '';
          const code = stripBackticks(example);
          const canRun = code && !code.includes('...') && !code.includes('#');

          return (
            <div key={i} className={styles.card}>
              <div className={styles.cardTop}>
                <code className={styles.syntax}>{stripBackticks(syntax)}</code>
                <span className={styles.desc}>{desc}</span>
              </div>

              <div className={styles.cardBottom}>
                <code className={styles.example}>{stripBackticks(example)}</code>
                <div className={styles.actions}>
                  <button
                    className={`${styles.actionBtn} ${copiedIdx === i ? styles.copied : ''}`}
                    onClick={() => handleCopy(code, i)}
                    title="复制代码"
                  >
                    {copiedIdx === i ? '✓' : '⧉'}
                  </button>
                  {canRun && (
                    <button
                      className={`${styles.actionBtn} ${styles.tryBtn} ${runningIdx === i ? styles.running : ''}`}
                      onClick={() => handleTry(code, i)}
                      disabled={runningIdx !== null}
                      title="运行代码"
                    >
                      {runningIdx === i ? '⏳' : '▶'}
                    </button>
                  )}
                </div>
              </div>

              {outputIdx === i && output && (
                <div className={`${styles.output} ${outputError ? styles.outputError : ''}`}>
                  <pre>{output}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
