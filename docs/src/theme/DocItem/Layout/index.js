import React, {useMemo, useRef} from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import QuoteBlock from '@site/src/components/QuoteBlock';
import AutoRelatedDocs from '@site/src/components/AutoRelatedDocs';
import {getQuoteForPage} from '@site/src/data/quotes';
import {useScrollReveal} from '@site/src/hooks/useScrollReveal';
import styles from './styles.module.css';

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return {hidden, mobile, desktop};
}

export default function DocItemLayout({children}) {
  const docTOC = useDocTOC();
  const {metadata, frontMatter} = useDoc();
  const contentRef = useRef(null);

  const quote = useMemo(() => {
    if (frontMatter.hide_quote) return null;
    return getQuoteForPage(
      metadata.slug || '',
      frontMatter.quote_id || null,
    );
  }, [metadata.slug, frontMatter.quote_id, frontMatter.hide_quote]);

  useScrollReveal(contentRef, '.theme-doc-markdown > *', {
    threshold: 0.1,
    staggerMs: 25,
    visibleClass: 'scroll-reveal-visible',
  });

  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            {quote && <QuoteBlock {...quote} />}
            <div ref={contentRef}>
              <DocItemContent>{children}</DocItemContent>
            </div>
            <DocItemFooter />
            <AutoRelatedDocs />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}