import { useState, useCallback, useRef, useEffect, Suspense, lazy } from 'react';
import { loadPyodide } from './loader';
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
  const [error, setError] = useState(null);
  const [pythonLang, setPythonLang] = useState(null);
  const [theme, setTheme] = useState('dark');
  const pyodideRef = useRef(null);

  useEffect(() => {
    import('@codemirror/lang-python').then(mod => setPythonLang(() => mod.python));
  }, []);

  // Detect theme from Docusaurus data-theme attribute (client-side only)
  useEffect(() => {
    const getTheme = () =>
      document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(getTheme());

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          setTheme(getTheme());
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
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

      // Capture stdout/stderr
      pyodide.runPython(`
import sys
from io import StringIO
_stdout = StringIO()
_stderr = StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
`);

      // Execute user code
      try {
        pyodide.runPython(code);
      } catch (e) {
        // Get stderr output before re-throwing
        const stderr = pyodide.runPython('_stderr.getvalue()');
        if (stderr) {
          setOutput(prev => prev + stderr);
        }
        throw e;
      }

      // Collect output
      const stdout = pyodide.runPython('_stdout.getvalue()');
      const stderr = pyodide.runPython('_stderr.getvalue()');

      // Restore stdout/stderr
      pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

      const allOutput = stdout + stderr;
      setOutput(allOutput || '(no output)');
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

  return (
    <div className={styles.container}>
      {title && <div className={styles.title}>{title}</div>}

      <div className={styles.editorWrapper}>
        <Suspense fallback={<div className={styles.editor}>Loading editor...</div>}>
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
      </div>

      <div className={styles.toolbar}>
        <button
          onClick={handleRun}
          disabled={isBusy}
          className={styles.runButton}
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
        <div className={`${styles.outputPanel} ${error ? styles.outputError : ''}`}>
          <div className={styles.outputLabel}>
            {error ? 'Error' : 'Output'}
          </div>
          <pre className={styles.outputContent}>
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
