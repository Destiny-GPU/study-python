import styles from './styles.module.css';

const TUTOR_BASE = 'https://pythontutor.com/visualize.html';

export default function VisualizeButton({ code }) {
  if (!code) return null;

  const url = `${TUTOR_BASE}#code=${encodeURIComponent(code)}&cumulative=true&py=3`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
    >
      <span className={styles.icon}>👁</span>
      <span>在 Python Tutor 中可视化执行</span>
    </a>
  );
}
