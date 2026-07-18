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
  const [tick, setTick] = useState(0);
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);
  const stateRef = useRef({ lineIdx: 0, charIdx: 0 });
  const pausedRef = useRef(false);
  const intervalRef = useRef(null);
  const loopTimeoutRef = useRef(null);

  // Start / stop interval based on visibility
  const startInterval = () => {
    if (intervalRef.current) return;
    let lastTick = performance.now();
    let pauseUntil = 0;

    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;

      const ts = performance.now();
      if (ts < pauseUntil) return;
      if (ts - lastTick < TICK_MS) return;
      lastTick = ts;

      const s = stateRef.current;
      if (s.lineIdx >= CODE_LINES.length) {
        setDone(true);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }

      const line = CODE_LINES[s.lineIdx];
      const lineLen = line.reduce((sum, t) => sum + t.value.length, 0);

      if (s.charIdx >= lineLen) {
        pauseUntil = ts + LINE_PAUSE_MS;
        s.lineIdx += 1;
        s.charIdx = 0;
      } else {
        s.charIdx = Math.min(s.charIdx + CHARS_PER_TICK, lineLen);
      }
      setTick((t) => t + 1);
    }, TICK_MS);
  };

  // IntersectionObserver: pause when not visible, resume when visible
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          pausedRef.current = false;
          startInterval();
        } else {
          pausedRef.current = true;
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Start animation on mount
  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  // Loop: restart after done
  useEffect(() => {
    if (!done) return;

    loopTimeoutRef.current = setTimeout(() => {
      stateRef.current = { lineIdx: 0, charIdx: 0 };
      setDone(false);
      setTick((t) => t + 1);
      startInterval();
    }, 5000);

    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [done]);

  // Force re-render to read from stateRef
  void tick;

  const { lineIdx, charIdx } = stateRef.current;

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
