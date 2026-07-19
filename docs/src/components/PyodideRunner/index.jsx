import { useState, useCallback, useRef, useEffect, Suspense, lazy } from 'react';
import { loadPyodide, setupCapture, getCapturedOutput } from './loader';
import ErrorBoundary from '../shared/ErrorBoundary';
import useTheme from '../../hooks/useTheme';
import styles from './styles.module.css';

const CodeMirror = lazy(() => import('@uiw/react-codemirror'));

/**
 * Interactive Python code runner using Pyodide (WebAssembly).
 *
 * Usage in MDX:
 *   <PyodideRunner>
 *   ```python
 *   print("Hello, World!")
 *   ```
 *   </PyodideRunner>
 */
export default function PyodideRunner({ children, title }) {
  const [code, setCode] = useState(() => extractCodeFromChildren(children));
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [error, setError] = useState(null);
  const [pythonLang, setPythonLang] = useState(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const theme = useTheme();
  const pyodideRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    import('@codemirror/lang-python').then(mod => setPythonLang(() => mod.python));
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setHasRun(true);
    setOutput('');
    setError(null);

    try {
      // Load Pyodide on first run
      if (!pyodideRef.current) {
        setIsLoading(true);
        pyodideRef.current = await loadPyodide();
        setIsLoading(false);
      }

      const pyodide = pyodideRef.current;

      setupCapture(pyodide);

      // Execute user code
      try {
        pyodide.runPython(code);
      } catch (e) {
        const { stderr } = getCapturedOutput(pyodide);
        if (stderr) {
          setOutput(prev => prev + stderr);
        }
        throw e;
      }

      const { stdout, stderr } = getCapturedOutput(pyodide);
      setOutput((stdout + stderr) || '(no output)');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsRunning(false);
      setIsLoading(false);
    }
  }, [code]);

  const handleReset = useCallback(() => {
    setCode(extractCodeFromChildren(children));
    setOutput('');
    setError(null);
  }, [children]);

  const isBusy = isLoading || isRunning;

  // Check if output is scrollable
  useEffect(() => {
    const el = outputRef.current;
    if (el) {
      setIsScrollable(el.scrollHeight > el.clientHeight);
    }
  }, [output, error]);

  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}

      <div className={styles.editorWrapper}>
        <ErrorBoundary>
          <Suspense fallback={<div className={styles.editor} style={{ padding: '1rem', color: 'var(--ifm-color-text-secondary)' }}>Loading editor...</div>}>
            <CodeMirror
              value={code}
              onChange={(value) => setCode(value)}
              extensions={pythonLang ? [pythonLang()] : []}
              theme={theme}
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                highlightActiveLine: true,
              }}
              className={styles.editor}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className={styles.toolbar}>
        <button
          onClick={handleRun}
          disabled={isBusy}
          className={`${styles.runButton} ${!hasRun ? styles.breathe : ''}`}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} />
              Loading Python...
            </>
          ) : isRunning ? (
            <>
              <span className={styles.spinner} />
              Running...
            </>
          ) : (
            <>
              <span className={styles.playIcon}>&#9654;</span>
              Run
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={isBusy}
          className={styles.resetButton}
        >
          Reset
        </button>
      </div>

      {(output || error) && (
        <div className={`${styles.outputPanel} ${error ? styles.outputError : ''} ${isScrollable ? styles.outputScrollable : ''}`}>
          <div className={styles.outputLabel}>
            {error ? 'Error' : 'Output'}
          </div>
          <pre ref={outputRef} className={styles.outputContent}>
            {error || output}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Extract code string from MDX children (fenced code block).
 * Handles MDX v3 nested structures where children.props.children may be an object.
 */
function extractCodeFromChildren(children) {
  if (typeof children === 'string') {
    return children.trim();
  }

  // Handle MDX code block: children.props.children (may be nested)
  if (children?.props?.children) {
    const child = children.props.children;
    if (typeof child === 'string') {
      return child.trim();
    }
    if (typeof child === 'object' && child !== null) {
      return extractCodeFromChildren(child);
    }
  }

  // Handle array of children
  if (Array.isArray(children)) {
    for (const child of children) {
      const code = extractCodeFromChildren(child);
      if (code) return code;
    }
  }

  return '';
}
