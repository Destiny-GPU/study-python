import { useEffect } from 'react';

/**
 * Observe child elements and reveal them with a staggered animation when they enter the viewport.
 */
export function useScrollReveal(containerRef, selector, { threshold = 0.15, staggerMs = 100, visibleClass } = {}) {
  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll(selector);
    if (!nodes || nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    nodes.forEach((node, i) => {
      node.style.transitionDelay = `${i * staggerMs}ms`;
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [containerRef, selector, threshold, staggerMs, visibleClass]);
}
