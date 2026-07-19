import { useState, useCallback } from 'react';
import styles from './styles.module.css';

/**
 * Quick reference card for syntax summaries.
 * Copy-only — no code execution (snippets are not standalone programs).
 */
export default function CheatCard({ title = '速查表', headers = ['语法', '功能', '示例'], rows = [] }) {
  const [copiedIdx, setCopiedIdx] = useState(null);

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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
