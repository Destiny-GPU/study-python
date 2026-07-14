import { useRef } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import { useScrollReveal } from '@site/src/hooks/useScrollReveal';
import { getExternalLinkProps } from '@site/src/utils/linkProps';
import styles from './styles.module.css';

function Card({ icon, logo, title, content, button, href }) {
  const CardWrapper = ({ children }) => {
    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cardLink}
        >
          {children}
        </a>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <div className={styles.card}>
        <div className="text--center">
          {logo ? (
            <img
              src={logo}
              alt={title}
              className={styles.cardLogo}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className={styles.cardEmoji} role="img" aria-label={title}>
              {icon}
            </span>
          )}
        </div>
        <div className={clsx('text--center', 'padding-horiz--md', styles.cardBody)}>
          <Heading as="h3">{title}</Heading>
          <div className={styles.cardContent}>{content}</div>
          {button && (
            <Link
              className={clsx('ds-btn', 'ds-btn-primary', styles.cardButton)}
              to={button.to}
              {...getExternalLinkProps(button.to)}
            >
              {button.text}
            </Link>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}

export default function CardGrid({ items, cols = 3, title, sectionClass }) {
  const colClass = cols === 2 ? 'col--6' : 'col--4';
  const gridRef = useRef(null);

  useScrollReveal(gridRef, `.${styles.cardCol}`, { threshold: 0.15, staggerMs: 100, visibleClass: styles.visible });

  return (
    <section className={clsx(styles.cardGridSection, sectionClass)}>
      <div className="container">
        {title && (
          <Heading as="h2" className={styles.cardGridTitle}>
            {title}
          </Heading>
        )}
        <div className="row" ref={gridRef}>
          {items.map((item, idx) => (
            <div key={item.id || idx} className={clsx('col', colClass, 'col--12-mobile', 'margin-vert--md', styles.cardCol)}>
              <Card
                icon={item.icon}
                logo={item.logo}
                title={item.title}
                content={item.content}
                button={item.button}
                href={item.href}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}