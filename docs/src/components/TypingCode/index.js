import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const CODE_LINES = [
  '# 圆周率计算',
  'from math import atan',
  'a = atan(1 / 5)',
  'b = atan(1 / 239)',
  'pi = 4 * (4 * a - b)',
  'print(f"π ≈ {pi:.15f}")',
  '# π ≈ 3.141592653589793',
];

const CHARS_PER_TICK = 2;
const TICK_MS = 30;
const LINE_PAUSE_MS = 300;

export default function TypingCode() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    if (done) return;

    const step = (ts) => {
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

      if (charIdx >= line.length) {
        pauseUntilRef.current = ts + LINE_PAUSE_MS;
        setLineIdx((l) => l + 1);
        setCharIdx(0);
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      setCharIdx((c) => Math.min(c + CHARS_PER_TICK, line.length));
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [lineIdx, charIdx, done]);

  return (
    <div className={styles.codeAnimation}>
      <div className={styles.codeWindow}>
        <div className={styles.codeWindowBar}>
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
        </div>
        <pre className={styles.codeBlock}>
          <code>
            {CODE_LINES.map((line, i) => {
              if (i > lineIdx) return null;
              const visible = i < lineIdx ? line : line.slice(0, charIdx);
              const isActive = i === lineIdx && !done;
              return (
                <div key={i} className={styles.codeLine}>
                  <HighlightedLine text={visible} />
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

function HighlightedLine({ text }) {
  if (!text) return null;

  if (text.trimStart().startsWith('#')) {
    return <span className={styles.codeComment}>{text}</span>;
  }

  const tokens = tokenize(text);
  return <>{tokens.map((t, i) => <span key={i} className={t.cls || ''}>{t.value}</span>)}</>;
}

function tokenize(line) {
  const tokens = [];
  let rest = line;

  const KW = /^(import|from|as|def|class|return|if|else|elif|for|while|with|try|except|finally|raise|pass|break|continue|and|or|not|in|is|True|False|None|lambda|yield|global|nonlocal|assert|del)\b/;
  const BUILTIN = /^(print|input|len|range|type|int|float|str|list|dict|set|tuple|open|super|__name__|__init__|format|zip|map|filter|sorted|enumerate|abs|min|max|sum|any|all|isinstance|hasattr|getattr|setattr)\b/;
  const STRING = /^f?("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/;
  const DECORATOR = /^@\w+/;
  const NUMBER = /^\d[\d_]*/;
  const WORD = /^\w+/;

  while (rest.length > 0) {
    const ws = rest.match(/^(\s+)/);
    if (ws) {
      tokens.push({ value: ws[1] });
      rest = rest.slice(ws[1].length);
      continue;
    }

    if (rest.startsWith('#')) {
      tokens.push({ value: rest, cls: styles.codeComment });
      rest = '';
      continue;
    }

    const rules = [
      { re: KW, cls: styles.codeKeyword },
      { re: BUILTIN, cls: styles.codeBuiltin },
      { re: STRING, cls: styles.codeString },
      { re: DECORATOR, cls: styles.codeDecorator },
      { re: NUMBER, cls: styles.codeNumber },
      { re: WORD, cls: styles.codeIdent },
    ];

    let matched = false;
    for (const { re, cls } of rules) {
      const m = rest.match(re);
      if (m) {
        tokens.push({ value: m[0], cls });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ value: rest[0] });
      rest = rest.slice(1);
    }
  }

  return tokens;
}
