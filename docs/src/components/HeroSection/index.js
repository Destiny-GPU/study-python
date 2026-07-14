import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import { getExternalLinkProps } from '@site/src/utils/linkProps';
import styles from './styles.module.css';

export default function HeroSection({ title, description, buttons = [], avatarUrl, subtitle, variant = 'dark' }) {
  return (
    <section className={clsx(styles.hero, variant === 'light' && styles.heroLight)}>
      <div className="container">
        <div className={styles.heroContent}>
          {avatarUrl && (
            <div className={styles.heroAvatar}>
              <img
                src={avatarUrl}
                alt={title || '头像'}
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <Heading as="h1" className={styles.heroTitle}>
            {title}
          </Heading>
          {subtitle && (
            <p className={styles.heroDescription}>
              {subtitle}
            </p>
          )}
          {description && (
            <p className={styles.heroDescription}>
              {description}
            </p>
          )}
          {buttons.length > 0 && (
            <div className={styles.heroButtons}>
              {buttons.map((btn, idx) => (
                <Link
                  key={idx}
                  className={clsx(
                    'ds-btn',
                    `ds-btn-${btn.variant || 'primary'}`
                  )}
                  to={btn.to}
                  {...getExternalLinkProps(btn.to)}
                >
                  {btn.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}