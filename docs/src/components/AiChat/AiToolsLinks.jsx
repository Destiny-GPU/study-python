import styles from './styles.module.css';

const TOOLS = [
  { name: '豆包', url: 'https://www.doubao.com', icon: '/img/ai-tools/doubao.svg' },
  { name: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '/img/ai-tools/deepseek.svg' },
  { name: '通义千问', url: 'https://tongyi.aliyun.com', icon: '/img/ai-tools/qianwen.svg' },
  { name: 'Kimi', url: 'https://kimi.moonshot.cn', icon: '/img/ai-tools/kimi.svg' },
  { name: '智谱清言', url: 'https://chatglm.cn', icon: '/img/ai-tools/zhipu.svg' },
];

export default function AiToolsLinks() {
  return (
    <div className={styles.toolsSection}>
      <h3 className={styles.toolsTitle}>更多 AI 工具</h3>
      <div className={styles.toolsGrid}>
        {TOOLS.map(({ name, url, icon }) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" className={styles.toolCard}>
            <img src={icon} alt={name} className={styles.toolIcon} />
            <span className={styles.toolName}>{name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
