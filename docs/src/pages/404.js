import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './404.module.css';

export default function NotFound() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="页面未找到" description="404 - 页面不存在">
      <main className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <p className={styles.subtitle}>页面未找到</p>
          <p className={styles.description}>
            你访问的页面不存在或已被移动。
          </p>
          <div className={styles.actions}>
            <Link className="ds-btn ds-btn-primary" to="/">
              返回首页
            </Link>
            <Link className="ds-btn ds-btn-secondary" to="/docs/intro">
              开始学习
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
