import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { HeroSection, CardGrid } from '@site/src/components';
import TypingCode from '@site/src/components/TypingCode';

import styles from './index.module.css';

const FeatureList = [
  {
    id: 'syntax',
    title: '简洁优雅的语法',
    icon: '🐍',
    content: 'Python 以其"优雅、明确、简单"的设计哲学著称，让你专注于解决问题而非语法细节。',
    button: { text: '语法概览', to: '/docs/getting-started/first-program' },
  },
  {
    id: 'learning',
    title: '系统化学习路径',
    icon: '📚',
    content: '从零基础到高级特性，循序渐进掌握 Python，包含丰富的代码示例和实战项目。',
    button: { text: '开始学习', to: '/docs/intro' },
  },
  {
    id: 'tools',
    title: '现代化开发工具',
    icon: '🛠️',
    content: '使用 uv、Ruff 等现代工具链，打造高效的 Python 开发环境。',
    button: { text: '环境配置', to: '/docs/getting-started/ide-setup' },
  },
  {
    id: 'practical',
    title: '实用性优先',
    icon: '🚀',
    content: '每个知识点都配有可运行的代码示例，理论与实践并重，让你真正掌握 Python。',
    button: { text: '查看实践', to: '/docs/getting-started/running-code' },
  },
  {
    id: 'community',
    title: '强大的生态系统',
    icon: '🌐',
    content: 'Python 拥有丰富的第三方库和活跃的社区，从数据科学到 Web 开发，一应俱全。',
    button: { text: '了解更多', to: '/docs/getting-started/installation' },
  },
  {
    id: 'about',
    title: '关于作者',
    icon: '👨‍🎓',
    content: '自动控制 + 强化学习博士，专注于智能控制与深度强化学习的研究与实践。',
    button: { text: '了解作者', to: '/docs/about' },
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={styles.heroBanner}>
      {/* Canvas 星座粒子 */}
      <div className="constellation-canvas" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <TypingCode />
        <div className={styles.buttons}>
          <Link className="ds-btn ds-btn-primary" to="/docs/intro">
            开始学习 →
          </Link>
          <Link className="ds-btn ds-btn-secondary" to="https://github.com/Destiny-GPU/study-python" target="_blank" rel="noopener noreferrer">
            查看源码
          </Link>
        </div>
      </div>
      <div className={styles.heroFade} />
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} - Python 学习指南`}
      description="现代 Python 学习指南，从零开始到高级特性"
    >
      <HomepageHeader />
      <main>
        <CardGrid
          items={FeatureList}
          cols={3}
          title="为什么选择本教程？"
        />
        <HeroSection
          title="准备好开始你的 Python 之旅了吗？"
          description="无论你是编程新手还是有经验的开发者，本教程都能帮助你系统掌握 Python 编程的精髓。"
          buttons={[
            { text: '📖 阅读教程', to: '/docs/intro', variant: 'primary' },
            { text: '💻 查看代码', to: 'https://github.com/Destiny-GPU/study-python', variant: 'secondary' },
          ]}
        />
      </main>
    </Layout>
  );
}