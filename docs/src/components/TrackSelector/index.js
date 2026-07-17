import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const tracks = [
  {
    id: 'full-stack',
    emoji: '🐍',
    title: 'Full Stack Python',
    subtitle: '完整学习路径',
    description: '从零开始，系统学习 Python 全部核心知识。适合初学者或希望全面掌握 Python 的开发者。',
    audience: '零基础初学者、转语言开发者',
    time: '4-6 周',
    categories: ['入门准备', '基础语法', '控制流', '数据结构', '函数', '面向对象', '模块与包', '异常处理', '文件与IO', '标准库', '测试与调试', '进阶特性'],
    color: '#3B82F6',
    startPath: '/docs/getting-started/installation',
  },
  {
    id: 'scientific',
    emoji: '🔬',
    title: 'Scientific Computing',
    subtitle: '科研快速通道',
    description: '直接进入科学计算生态，用 NumPy/SciPy/pandas/PyTorch 解决科研问题。适合有编程基础的研究人员。',
    audience: '科研人员、工程师、博士生',
    time: '2-3 周',
    categories: ['基础语法（精简）', 'NumPy', 'SciPy', 'pandas', 'matplotlib', 'PyTorch', '并行计算', '性能优化'],
    color: '#10B981',
    startPath: '/docs/scientific-computing/numpy-fundamentals',
  },
  {
    id: 'project',
    emoji: '🎯',
    title: 'Project-Driven',
    subtitle: '项目驱动学习',
    description: '从一个完整项目开始，边做边学。遇到什么学什么，最适合"学习即实战"的风格。',
    audience: '实践型学习者、有经验开发者',
    time: '3-4 周',
    categories: ['项目实战（学生成绩系统）', '科研项目（飞行数据分析）', '按需补充基础语法', '按需补充函数/OOP'],
    color: '#F59E0B',
    startPath: '/docs/project-tutorial/complete-project',
  },
];

export default function TrackSelector() {
  return (
    <div className={styles.trackContainer}>
      <div className={styles.header}>
        <h2>选择你的学习路径</h2>
        <p>三条路径，同一目标：掌握 Python。根据你的背景和需求选择最适合的起点。</p>
      </div>
      <div className={styles.trackGrid}>
        {tracks.map((track) => (
          <Link
            key={track.id}
            className={styles.trackCard}
            to={track.startPath}
            style={{ '--track-color': track.color }}
          >
            <div className={styles.trackHeader}>
              <span className={styles.trackEmoji}>{track.emoji}</span>
              <div>
                <div className={styles.trackTitle}>{track.title}</div>
                <div className={styles.trackSubtitle}>{track.subtitle}</div>
              </div>
            </div>
            <p className={styles.trackDescription}>{track.description}</p>
            <div className={styles.trackMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>适合人群</span>
                <span className={styles.metaValue}>{track.audience}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>预计时间</span>
                <span className={styles.metaValue}>{track.time}</span>
              </div>
            </div>
            <div className={styles.trackCategories}>
              {track.categories.map((cat) => (
                <span key={cat} className={styles.categoryTag}>{cat}</span>
              ))}
            </div>
            <div className={styles.trackAction}>
              开始学习 →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
