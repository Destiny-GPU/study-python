import { useMemo } from 'react';
import Link from '@docusaurus/Link';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

export default function ChapterNav() {
  const sidebar = useDocsSidebar();

  const { currentCategory, categoryDocs, currentIndex } = useMemo(() => {
    if (!sidebar || !sidebar.items) return { currentCategory: null, categoryDocs: [], currentIndex: -1 };

    const currentPath = window.location.pathname;
    const docMatch = currentPath.match(/^\/docs\/([^/]+)\//);
    if (!docMatch) return { currentCategory: null, categoryDocs: [], currentIndex: -1 };

    const categorySlug = docMatch[1];

    // Search through sidebar items to find the current category
    function findCategory(items) {
      for (const item of items) {
        if (item.type === 'category') {
          // Check if this category matches the current URL
          // Category link can be {type: "doc", id: "slug/index"} or {type: "generated-index", slug: "slug"}
          const linkId = item.link?.id || '';
          const linkSlug = item.link?.slug || '';
          const matchesCategory = linkId.includes(categorySlug) || linkSlug.includes(categorySlug);
          
          if (matchesCategory) {
            const docs = (item.items || [])
              .filter((d) => d.type === 'link' || typeof d === 'string')
              .map((d) => {
                const docId = typeof d === 'string' ? d : d.id;
                const title = typeof d === 'string' ? docId.split('/').pop() : (d.label || d.title || docId.split('/').pop());
                const href = `/docs/${docId}`;
                return { id: docId, title, href };
              });

            const idx = docs.findIndex((d) => currentPath.includes(d.id));
            return { currentCategory: item.label, categoryDocs: docs, currentIndex: idx };
          }
          
          // Recursively search in subcategories
          const result = findCategory(item.items || []);
          if (result.currentCategory) return result;
        }
      }
      return { currentCategory: null, categoryDocs: [], currentIndex: -1 };
    }

    return findCategory(sidebar.items);
  }, [sidebar]);

  const visitedSet = useMemo(() => {
    const api = window.__studyPythonProgress;
    return api ? api.getVisited() : new Set();
  }, []);

  if (!currentCategory || categoryDocs.length < 2) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>📖 本章目录</h3>
      <div className={styles.grid}>
        {categoryDocs.map((doc, idx) => {
          const isCurrent = idx === currentIndex;
          const isVisited = visitedSet.has(doc.id);
          return (
            <Link
              key={doc.id}
              to={doc.href}
              className={`${styles.item} ${isCurrent ? styles.current : ''}`}
            >
              {isVisited && <span className={styles.check}>✓</span>}
              <span className={styles.docTitle}>{doc.title}</span>
              {isCurrent && <span className={styles.badge}>当前</span>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
