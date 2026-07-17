/* global document, window */

const STORAGE_KEY = 'study-python-progress';

// Cached state to avoid repeated localStorage reads and DOM queries
let cachedProgress = null;
let cachedVisitedSet = null;
let sidebarItems = null;
let lastSidebarUrl = '';

function loadProgress() {
  if (cachedProgress) return cachedProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedProgress = { visited: [], lastVisit: '' };
      return cachedProgress;
    }
    const data = JSON.parse(raw);
    cachedProgress = {
      visited: Array.isArray(data.visited) ? data.visited : [],
      lastVisit: typeof data.lastVisit === 'string' ? data.lastVisit : '',
    };
    return cachedProgress;
  } catch {
    cachedProgress = { visited: [], lastVisit: '' };
    return cachedProgress;
  }
}

function getVisitedSet() {
  if (cachedVisitedSet) return cachedVisitedSet;
  cachedVisitedSet = new Set(loadProgress().visited);
  return cachedVisitedSet;
}

function invalidateCache() {
  cachedProgress = null;
  cachedVisitedSet = null;
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    invalidateCache();
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

function extractDocId(pathname) {
  const match = pathname.match(/^\/docs\/(.+)/);
  if (!match) return null;
  const id = match[1].replace(/\/$/, '');
  return id || 'intro';
}

function getSidebarItems() {
  // Re-query only if sidebar items are null or page changed significantly
  if (!sidebarItems) {
    sidebarItems = document.querySelectorAll('.sidebar__item a');
  }
  return sidebarItems;
}

function markSidebarVisited() {
  const currentUrl = window.location.pathname;
  if (currentUrl === lastSidebarUrl) return; // Skip if same page
  lastSidebarUrl = currentUrl;

  const visitedSet = getVisitedSet();
  const items = getSidebarItems();

  items.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const docMatch = href.match(/^\/docs\/(.+)/);
    if (!docMatch) return;
    const docId = docMatch[1].replace(/\/$/, '') || 'intro';
    const item = link.closest('.sidebar__item');
    if (!item) return;

    const isVisited = visitedSet.has(docId);
    if (isVisited && !item.hasAttribute('data-doc-visited')) {
      item.setAttribute('data-doc-visited', 'true');
    } else if (!isVisited && item.hasAttribute('data-doc-visited')) {
      item.removeAttribute('data-doc-visited');
    }
  });
}

function forceRefreshSidebar() {
  lastSidebarUrl = ''; // Reset to force refresh
  sidebarItems = null; // Re-query DOM
  markSidebarVisited();
}

if (typeof window !== 'undefined') {
  window.__studyPythonProgress = {
    getVisited() {
      return getVisitedSet();
    },
    isVisited(docId) {
      return getVisitedSet().has(docId);
    },
    getProgress() {
      const { visited } = loadProgress();
      return {
        visitedCount: visited.length,
        visited: getVisitedSet(),
      };
    },
  };
}

let sidebarTimer = null;
function debouncedMarkSidebar() {
  clearTimeout(sidebarTimer);
  sidebarTimer = setTimeout(markSidebarVisited, 150);
}

export function onRouteDidUpdate({ location }) {
  const docId = extractDocId(location.pathname);
  if (!docId) return;

  const progress = loadProgress();
  if (!progress.visited.includes(docId)) {
    progress.visited.push(docId);
  }
  progress.lastVisit = docId;
  saveProgress(progress);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('progress-updated', {
      detail: { docId, visited: progress.visited },
    }));
  }

  if (typeof window !== 'undefined') {
    requestAnimationFrame(debouncedMarkSidebar);
  }
}

export default function () {
  if (typeof window === 'undefined') return;

  // Listen for sidebar DOM changes to invalidate cached items
  const sidebarObserver = new MutationObserver(() => {
    sidebarItems = null;
  });
  const sidebarEl = document.querySelector('.sidebar');
  if (sidebarEl) {
    sidebarObserver.observe(sidebarEl, { childList: true, subtree: true });
  }

  requestAnimationFrame(() => {
    setTimeout(forceRefreshSidebar, 200);
  });

  return () => {
    sidebarObserver.disconnect();
  };
}
