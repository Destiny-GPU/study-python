import { useState, useCallback, useRef, useEffect, Suspense, lazy } from 'react';
import { loadPyodide, setupCapture, getCapturedOutput } from '../PyodideRunner/loader';
import ErrorBoundary from '../shared/ErrorBoundary';
import useTheme from '../../hooks/useTheme';
import styles from './styles.module.css';

const CodeMirror = lazy(() => import('@uiw/react-codemirror'));

/**
 * Flight vehicle control challenge component.
 *
 * Usage in MDX:
 *   <ControlChallenge
 *     title="挑战：计算升力系数"
 *     scenario="你的无人机在高度 100m 处平飞..."
 *     objective="编写函数 calculate_lift(v, alpha) 返回升力系数"
 *     starterCode={`def calculate_lift(v, alpha):\n    pass`}
 *     solution={`def calculate_lift(v, alpha):\n    return 2 * 3.14159 * alpha`}
 *     tests={[
 *       { call: 'calculate_lift(50, 0.1)', expected: [0.5, 0.8], label: '迎角 0.1 rad' },
 *     ]}
 *   />
 */
export default function ControlChallenge({
  title = 'Control Challenge',
  scenario,
  objective,
  starterCode = '',
  solution,
  tests = [],
}) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [pythonLang, setPythonLang] = useState(null);
  const theme = useTheme();
  const pyodideRef = useRef(null);

  useEffect(() => {
    import('@codemirror/lang-python').then(mod => setPythonLang(() => mod.python));
  }, []);

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setHasRun(true);
    setError(null);
    setResults(null);

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
        setError(e.message + (stderr ? '\n' + stderr : ''));
        setIsRunning(false);
        return;
      }

      const { stdout } = getCapturedOutput(py);
      setOutput(stdout || '');

      // Run tests
      const testResults = [];
      for (const test of tests) {
        try {
          const val = py.runPython(`str(${test.call})`);
          const numVal = parseFloat(val);
          const passed = !isNaN(numVal) &&
            numVal >= test.expected[0] - (test.tolerance || 0.01) &&
            numVal <= test.expected[1] + (test.tolerance || 0.01);
          testResults.push({
            label: test.label || test.call,
            passed,
            actual: val,
            expected: `[${test.expected[0]}, ${test.expected[1]}]`,
          });
        } catch (e) {
          testResults.push({
            label: test.label || test.call,
            passed: false,
            actual: 'ERROR',
            expected: `[${test.expected[0]}, ${test.expected[1]}]`,
            error: e.message,
          });
        }
      }
      setResults(testResults);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsRunning(false);
    }
  }, [code, tests]);

  const allPassed = results && results.length > 0 && results.every(r => r.passed);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.badge}>Challenge</span>
        <span className={styles.headerTitle}>{title}</span>
      </div>

      {/* Scenario */}
      {scenario && (
        <div className={styles.scenario}>
          <div className={styles.scenarioLabel}>Scenario</div>
          <p>{scenario}</p>
        </div>
      )}

      {/* Objective */}
      {objective && (
        <div className={styles.objective}>
          <span className={styles.objectiveIcon}>🎯</span>
          <span>{objective}</span>
        </div>
      )}

      {/* Editor */}
      <div className={styles.editorSection}>
        <ErrorBoundary>
          <Suspense fallback={<div className={styles.editor} style={{ padding: '2rem', textAlign: 'center', color: 'var(--ifm-color-text-muted)' }}>Loading editor...</div>}>
            <CodeMirror
              value={code}
              onChange={setCode}
              extensions={pythonLang ? [pythonLang()] : []}
              theme={theme}
              basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
              className={styles.editor}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <button className={`${styles.runBtn} ${!hasRun ? styles.breathe : ''}`} onClick={runTests} disabled={isRunning}>
          {isRunning ? '运行中...' : '▶ 运行 & 验证'}
        </button>
        <button className={styles.hintBtn} onClick={() => setShowHint(!showHint)}>
          💡 提示
        </button>
        {solution && (
          <button className={styles.solutionBtn} onClick={() => setShowSolution(!showSolution)}>
            👁 查看答案
          </button>
        )}
      </div>

      {/* Hint */}
      {showHint && (
        <div className={styles.hint}>
          <strong>提示：</strong>思考这个控制问题的物理原理。升力与速度的平方成正比，与迎角成线性关系。
        </div>
      )}

      {/* Solution */}
      {showSolution && solution && (
        <div className={styles.solution}>
          <div className={styles.solutionLabel}>参考答案</div>
          <pre>{solution}</pre>
        </div>
      )}

      {/* Test Results */}
      {results && (
        <div className={styles.results}>
          {allPassed && (
            <div className={styles.successBanner}>
              🎉 全部通过！你成功解决了这个控制挑战。
            </div>
          )}
          <div className={styles.testList}>
            {results.map((r, i) => (
              <div key={i} className={`${styles.testItem} ${r.passed ? styles.testPass : styles.testFail}`}>
                <span className={styles.testIcon}>{r.passed ? '✅' : '❌'}</span>
                <span className={styles.testLabel}>{r.label}</span>
                <span className={styles.testActual}>实际: {r.actual}</span>
                <span className={styles.testExpected}>期望: {r.expected}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {output && !results && (
        <div className={styles.output}>
          <pre>{output}</pre>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}
