import { useRef } from 'react';
import Link from '@docusaurus/Link';
import { useScrollReveal } from '@site/src/hooks/useScrollReveal';
import styles from './styles.module.css';

const stages = [
  { emoji: '🛠️', title: '入门准备', desc: '搭建环境，运行第一个程序', to: '/docs/getting-started/installation' },
  { emoji: '🔤', title: '基础语法', desc: '变量、字符串、数字、运算符', to: '/docs/basics/variables' },
  { emoji: '🔀', title: '流程控制', desc: '条件判断、循环、模式匹配', to: '/docs/control-flow/if-else' },
  { emoji: '⚡', title: '函数', desc: '定义、参数、作用域、装饰器', to: '/docs/functions/defining' },
  { emoji: '📦', title: '数据结构', desc: '列表、字典、集合、推导式', to: '/docs/data-structures/lists' },
  { emoji: '🏗️', title: '面向对象', desc: '类、继承、数据类、魔术方法', to: '/docs/oop/classes' },
  { emoji: '🧩', title: '模块与包', desc: 'import、虚拟环境、uv 工具链', to: '/docs/modules/' },
  { emoji: '🛡️', title: '异常处理', desc: 'try-except、自定义异常、调试', to: '/docs/error-handling/try-except' },
  { emoji: '📁', title: '文件与 IO', desc: '读写文件、路径处理、JSON/CSV', to: '/docs/file-handling/read-write' },
  { emoji: '🧪', title: '测试与调试', desc: 'pytest 基础、调试技巧', to: '/docs/testing-debugging/pytest-basics' },
  { emoji: '📚', title: '标准库巡礼', desc: 'collections、datetime、pathlib 等', to: '/docs/standard-library/collections' },
  { emoji: '🚀', title: '进阶特性', desc: '类型注解、异步、Pythonic 写法', to: '/docs/advanced/type-hints' },
];

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
