let pyodideInstance = null;
let loadingPromise = null;

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

// Reusable Python code snippets for stdout/stderr capture
const CAPTURE_SETUP = `
import sys
from io import StringIO
_stdout = StringIO()
_stderr = StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
`;

const CAPTURE_RESTORE = `
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`;

/**
 * Set up stdout/stderr capture in a Pyodide instance.
 */
export function setupCapture(py) {
  py.runPython(CAPTURE_SETUP);
}

/**
 * Get captured stdout and stderr, then restore original streams.
 * @returns {{ stdout: string, stderr: string }}
 */
export function getCapturedOutput(py) {
  const stdout = py.runPython('_stdout.getvalue()') || '';
  const stderr = py.runPython('_stderr.getvalue()') || '';
  py.runPython(CAPTURE_RESTORE);
  return { stdout, stderr };
}

/**
 * Load Pyodide WASM runtime from CDN (singleton).
 */
export async function loadPyodide() {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    pyodideInstance = await window.loadPyodide({
      indexURL: PYODIDE_CDN,
    });
    return pyodideInstance;
  })();

  return loadingPromise;
}
