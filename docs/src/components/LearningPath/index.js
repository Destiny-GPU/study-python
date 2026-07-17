import { useRef } from 'react';
import Link from '@docusaurus/Link';
import { useScrollReveal } from '@site/src/hooks/useScrollReveal';
import chapters from '@site/src/data/chapters.json';
import styles from './styles.module.css';

const stages = chapters.learningPath;

export default function LearningPath() {
  const containerRef = useRef(null);

  useScrollReveal(containerRef, `.${styles.node}`, { threshold: 0.2, staggerMs: 80, visibleClass: styles.visible });

  return (
    <div className={styles.pathContainer} ref={containerRef}>
      <div className={styles.line} />
      {stages.map((stage, idx) => (
        <Link key={stage.title} className={styles.node} to={stage.to} style={{ '--i': idx }}>
          <div className={styles.dot}>
            <span className={styles.dotInner} />
          </div>
          <div className={styles.card}>
            <span className={styles.emoji}>{stage.emoji}</span>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>{stage.title}</div>
              <div className={styles.cardDesc}>{stage.desc}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
