import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const learningSteps = [
  {step: '1', title: '入门准备', desc: '搭建开发环境，编写并运行第一个 Python 程序'},
  {step: '2', title: '基础语法', desc: '掌握变量、数据类型、运算符、输入输出等基本元素'},
  {step: '3', title: '控制流', desc: '学会条件判断与循环，让程序具备逻辑处理能力'},
  {step: '4', title: '数据结构', desc: '熟练使用列表、字典、集合、元组组织和管理数据'},
  {step: '5', title: '函数', desc: '封装可复用代码，理解作用域、装饰器、生成器等进阶用法'},
  {step: '6', title: '面向对象', desc: '掌握类与对象、继承、多态，构建结构化的大型程序'},
  {step: '7', title: '进阶特性', desc: '类型注解、异步编程、模式匹配等现代 Python 技巧'},
  {step: '8', title: '标准库', desc: '熟练使用 os、pathlib、collections 等核心标准库模块'},
];

const stats = [
  {number: '50+', label: '系统教程'},
  {number: '8', label: '核心章节'},
  {number: '3.12+', label: 'Python 版本'},
  {number: '100+', label: '代码示例'},
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroBadge}>Python 3.12+ · 中文系统教程</div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            开始学习 →
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/basics/variables">
            基础语法
          </Link>
        </div>
      </div>
    </header>
  );
}

function LearningPath() {
  return (
    <section className={styles.learningPath}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2">系统化学习路径</Heading>
          <p className={styles.sectionSubtitle}>
            从零基础到熟练运用，按照科学的顺序循序渐进
          </p>
        </div>
        <div className="row">
          {learningSteps.map((item) => (
            <div key={item.step} className="col col--3 col--6@mobile">
              <div className={styles.pathStep}>
                <div className={styles.pathStepNumber}>{item.step}</div>
                <div>
                  <Heading as="h4">{item.title}</Heading>
                  <p className={styles.pathStepDesc}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className="row">
          {stats.map((stat) => (
            <div key={stat.label} className="col col--3">
              <span className={styles.statNumber}>{stat.number}</span>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - 从入门到精通`}
      description="一份系统、完整、精美的 Python 中文教程，覆盖从环境搭建到进阶特性的全部知识，配套丰富代码示例。">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <LearningPath />
        <Stats />
      </main>
    </Layout>
  );
}
