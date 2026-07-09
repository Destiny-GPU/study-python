import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  emoji: string;
  title: string;
  description: string;
};

const FeatureList: FeatureItem[] = [
  {
    emoji: '🐍',
    title: '简洁优雅的语法',
    description:
      'Python 以可读性强、语法简洁著称，让你专注于解决问题本身，而非语言细节。代码如自然语言般流畅。',
  },
  {
    emoji: '📚',
    title: '系统化学习路径',
    description:
      '从环境搭建、基础语法到面向对象、进阶特性，循序渐进的知识体系，配套完整可运行示例。',
  },
  {
    emoji: '⚡',
    title: '现代 Python 特性',
    description:
      '紧跟 Python 3.12+ 最新特性，涵盖类型注解、模式匹配、海象运算符、数据类等现代写法。',
  },
  {
    emoji: '🚀',
    title: '强大的生态能力',
    description:
      '覆盖 Web 开发、数据科学、人工智能、自动化运维等领域，是当下最受欢迎的编程语言之一。',
  },
  {
    emoji: '🔧',
    title: '实战驱动教学',
    description:
      '每个知识点都配有完整代码示例与实战练习，边学边练，真正掌握 Python 编程能力。',
  },
  {
    emoji: '🌐',
    title: '活跃的社区支持',
    description:
      '庞大的开发者社区、丰富的第三方库、海量的学习资源，遇到问题总能找到答案。',
  },
];

function Feature({emoji, title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', 'margin-vert--md')}>
      <div className={styles.featureCard}>
        <div className="text--center">
          <span className={styles.featureEmoji} role="img" aria-label={title}>
            {emoji}
          </span>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
