import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

/**
 * Pre-tokenized code lines for the typing animation.
 * Each line is an array of { value, cls? } tokens.
 * cls values map to CSS module classes for syntax highlighting.
 */
const CODE_LINES = [
  // # 圆周率计算
  [{ value: '# 圆周率计算', cls: styles.codeComment }],
  // from math import atan
  [
    { value: 'from', cls: styles.codeKeyword },
    { value: ' math ', cls: styles.codeIdent },
    { value: 'import', cls: styles.codeKeyword },
    { value: ' atan', cls: styles.codeIdent },
  ],
  // a = atan(1 / 5)
  [
    { value: 'a', cls: styles.codeIdent },
    { value: ' = ', cls: '' },
    { value: 'atan', cls: styles.codeBuiltin },
    { value: '(', cls: '' },
    { value: '1', cls: styles.codeNumber },
    { value: ' / ', cls: '' },
    { value: '5', cls: styles.codeNumber },
    { value: ')', cls: '' },
  ],
  // b = atan(1 / 239)
  [
    { value: 'b', cls: styles.codeIdent },
    { value: ' = ', cls: '' },
    { value: 'atan', cls: styles.codeBuiltin },
    { value: '(', cls: '' },
    { value: '1', cls: styles.codeNumber },
    { value: ' / ', cls: '' },
    { value: '239', cls: styles.codeNumber },
    { value: ')', cls: '' },
  ],
  // pi = 4 * (4 * a - b)
  [
    { value: 'pi', cls: styles.codeIdent },
    { value: ' = ', cls: '' },
    { value: '4', cls: styles.codeNumber },
    { value: ' * (', cls: '' },
    { value: '4', cls: styles.codeNumber },
    { value: ' * ', cls: '' },
    { value: 'a', cls: styles.codeIdent },
    { value: ' - ', cls: '' },
    { value: 'b', cls: styles.codeIdent },
    { value: ')', cls: '' },
  ],
  // print(f"π ≈ {pi:.15f}")
  [
    { value: 'print', cls: styles.codeBuiltin },
    { value: '(', cls: '' },
    { value: 'f"π ≈ {pi:.15f}"', cls: styles.codeString },
    { value: ')', cls: '' },
  ],
  // # π ≈ 3.141592653589793
  [{ value: '# π ≈ 3.141592653589793', cls: styles.codeComment }],
];

const CHARS_PER_TICK = 1;
const TICK_MS = 30;
const LINE_PAUSE_MS = 100;

export default function TypingCode() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);
  const visibleRef = useRef(false);
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const loopTimeoutRef = useRef(null);

  // Pause animation when component is not in viewport
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        // Restart rAF loop when component becomes visible again
        if (entry.isIntersecting && !rafRef.current && !done) {
          lastTickRef.current = performance.now();
          rafRef.current = requestAnimationFrame(() => {
            // Trigger a re-render to restart the loop
            setCharIdx((c) => c);
          });
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (done) return;

    const step = (ts) => {
      // Stop loop entirely when not visible; IntersectionObserver restarts it
      if (!visibleRef.current) {
        lastTickRef.current = ts;
        rafRef.current = null;
        return;
      }
      if (lineIdx >= CODE_LINES.length) {
        setDone(true);
        return;
      }

      if (ts < pauseUntilRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      if (ts - lastTickRef.current < TICK_MS) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      lastTickRef.current = ts;

      const line = CODE_LINES[lineIdx];
      const lineLen = line.reduce((sum, t) => sum + t.value.length, 0);

      if (charIdx >= lineLen) {
        pauseUntilRef.current = ts + LINE_PAUSE_MS;
        setLineIdx((l) => l + 1);
        setCharIdx(0);
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      setCharIdx((c) => Math.min(c + CHARS_PER_TICK, lineLen));
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lineIdx, charIdx, done]);

  useEffect(() => {
    if (!done) return;

    loopTimeoutRef.current = setTimeout(() => {
      setLineIdx(0);
      setCharIdx(0);
      setDone(false);
    }, 5000);

    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [done]);

  return (
    <div ref={containerRef} className={styles.codeAnimation}>
      <div className={styles.codeWindow}>
        <div className={styles.codeWindowBar}>
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
        </div>
        <pre className={styles.codeBlock}>
          <code>
            {CODE_LINES.map((tokens, i) => {
              if (i > lineIdx) return null;
              const isActive = i === lineIdx && !done;
              return (
                <div key={i} className={styles.codeLine}>
                  <HighlightedLine tokens={tokens} visible={i < lineIdx ? Infinity : charIdx} />
                  {isActive && <span className={styles.cursor}>▌</span>}
                </div>
              );
            })}
            {done && (
              <div className={styles.codeLine}>
                <span className={styles.cursor}>▌</span>
              </div>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

function HighlightedLine({ tokens, visible }) {
  let remaining = visible;
  const rendered = [];

  for (const { value, cls } of tokens) {
    if (remaining <= 0) break;
    const slice = remaining === Infinity ? value : value.slice(0, remaining);
    rendered.push(
      <span key={rendered.length} className={cls || ''}>
        {slice}
      </span>,
    );
    remaining -= value.length;
  }

  return <>{rendered}</>;
}
