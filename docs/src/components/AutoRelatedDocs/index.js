import React, {useMemo} from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import docTags from '@site/src/data/doc-tags.json';
import styles from './styles.module.css';

const MAX_RELATED = 5;

// Pre-compute tag index for faster lookup
const docEntries = Object.entries(docTags);

export default function AutoRelatedDocs() {
  const {metadata} = useDoc();
  const currentId = metadata.id;
  const currentTags = metadata.frontMatter?.tags || [];

  const related = useMemo(() => {
    if (currentTags.length === 0) return [];

    const currentDir = currentId.split('/')[0];
    const currentTagSet = new Set(currentTags);
    const scored = [];

    for (const [id, info] of docEntries) {
      if (id === currentId) continue;
      if (id.endsWith('/index')) continue;
      if (id.split('/')[0] === currentDir) continue;

      // Count shared tags using Set for O(1) lookup
      let sharedCount = 0;
      const sharedTags = [];
      for (const tag of info.tags) {
        if (currentTagSet.has(tag)) {
          sharedCount++;
          sharedTags.push(tag);
        }
      }

      if (sharedCount > 0) {
        scored.push({id, title: info.title, description: info.description, score: sharedCount, sharedTags});
      }

      // Early termination: if we have enough high-scoring results
      if (scored.length >= MAX_RELATED * 2) break;
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_RELATED);
  }, [currentId, currentTags]);

  if (related.length === 0) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📚 相关文档</h3>
      <div className={styles.grid}>
        {related.map(doc => {
          const path = doc.id.endsWith('/index') ? doc.id.replace('/index', '') : doc.id;
          return (
            <Link key={doc.id} to={`/docs/${path}`} className={styles.card}>
              <div className={styles.cardTitle}>{doc.title}</div>
              {doc.description && (
                <div className={styles.cardDesc}>
                  {doc.description.length > 60
                    ? doc.description.slice(0, 60) + '...'
                    : doc.description}
                </div>
              )}
              <div className={styles.cardTags}>
                {doc.sharedTags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
