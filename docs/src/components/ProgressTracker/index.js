import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const TOTAL_DOCS = 45;

export default function ProgressTracker() {
  const [visitedCount, setVisitedCount] = useState(0);

  useEffect(() => {
    function update() {
      const api = window.__studyPythonProgress;
      if (api) {
        const { visitedCount: count } = api.getProgress();
        setVisitedCount(count);
      }
    }

    update();
    window.addEventListener('progress-updated', update);
    return () => window.removeEventListener('progress-updated', update);
  }, []);

  const percent = Math.min(100, Math.round((visitedCount / TOTAL_DOCS) * 100));

  let barColor = 'var(--ifm-color-primary)';
  if (percent >= 70) barColor = 'var(--ifm-color-success)';
  else if (percent >= 30) barColor = 'var(--ifm-color-violet)';

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        已学习 <strong>{visitedCount}</strong> / {TOTAL_DOCS} 篇教程
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${percent}%`, background: barColor }}
        />
      </div>
      {visitedCount > 0 && (
        <div className={styles.hint}>
          继续加油！你已完成 {percent}% 的内容。
        </div>
      )}
    </div>
  );
}
