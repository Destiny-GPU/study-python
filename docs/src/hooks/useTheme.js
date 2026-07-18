import { useState, useEffect } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });

  useEffect(() => {
    const getTheme = () =>
      document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(getTheme());

    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}
