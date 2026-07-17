/**
 * Constellation client module — thin entry point.
 * The actual particle system is dynamically imported only on the homepage,
 * keeping the other pages free of this code.
 */

let cleanup = null;

async function loadAndInit() {
  const { initConstellation } = await import('./constellation-init.js');
  return initConstellation();
}

export function onRouteDidUpdate({ location }) {
  if (cleanup) cleanup();
  cleanup = null;
  if (location.pathname !== '/') return;
  requestAnimationFrame(() => {
    loadAndInit().then((fn) => { cleanup = fn; });
  });
}

export default function () {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => {
        loadAndInit().then((fn) => { cleanup = fn; });
      });
    }, { once: true });
  } else {
    requestAnimationFrame(() => {
      loadAndInit().then((fn) => { cleanup = fn; });
    });
  }
}
