import React from 'react';
import styles from './styles.module.css';

export default function QuoteBlock({ text, author, role }) {
  if (!text) return null;

  return (
    <div className={styles.quoteBlock}>
      <p className={styles.quoteText}>{text}</p>
      <div className={styles.quoteAttribution}>
        <span className={styles.quoteAuthor}>{author}</span>
        {role && <span className={styles.quoteRole}>{role}</span>}
      </div>
    </div>
  );
}