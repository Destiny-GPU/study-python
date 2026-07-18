/* global document, window */

const RING_RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

let readingProgress = null;
let backToTop = null;
let ticking = false;

function ensureStyle(id, css) {
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

function createProgressBar() {
  if (document.getElementById('reading-progress')) return;

  ensureStyle('progress-bar-style', `
    @keyframes progressShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    #reading-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0;
      z-index: 9999;
      transition: width 0.1s ease-out, box-shadow 0.3s ease;
      background: linear-gradient(90deg, #4a6cf7 0%, #7c5cfc 25%, #9b7cff 50%, #7c5cfc 75%, #4a6cf7 100%);
      background-size: 200% 100%;
      box-shadow: 0 0 8px rgba(74, 108, 247, 0.4), 0 0 16px rgba(74, 108, 247, 0.2);
    }
    #reading-progress.complete {
      height: 4px;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.5), 0 0 24px rgba(16, 185, 129, 0.3);
      background: linear-gradient(90deg, #10b981, #34d399, #10b981);
      background-size: 200% 100%;
    }
    @media (prefers-reduced-motion: no-preference) {
      #reading-progress {
        animation: progressShimmer 2s linear infinite;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      #reading-progress {
        transition: width 0.05s linear;
      }
    }
  `);

  readingProgress = document.createElement('div');
  readingProgress.id = 'reading-progress';
  document.body.appendChild(readingProgress);
}

function createBackToTop() {
  if (document.getElementById('back-to-top')) return;

  backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.setAttribute('aria-label', '返回顶部');
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: transparent;
    border: none;
    cursor: pointer;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9998;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
  `;

  backToTop.innerHTML = `
    <svg width="48" height="48" style="transform: rotate(-90deg); position: absolute;">
      <circle cx="24" cy="24" r="${RING_RADIUS}" fill="none" stroke="rgba(74,108,247,0.15)" stroke-width="3"/>
      <circle class="progress-ring" cx="24" cy="24" r="${RING_RADIUS}" fill="none" stroke="#4a6cf7" stroke-width="3" stroke-dasharray="${CIRCUMFERENCE}" stroke-dashoffset="${CIRCUMFERENCE}" stroke-linecap="round" style="transition: stroke-dashoffset 0.15s ease-out;"/>
    </svg>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8ba4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="position: relative; z-index: 1;">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  `;

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTop.addEventListener('mouseenter', () => {
    backToTop.style.transform = 'translateY(-3px) scale(1.08)';
  });

  backToTop.addEventListener('mouseleave', () => {
    backToTop.style.transform = 'translateY(0) scale(1)';
  });

  document.body.appendChild(backToTop);
}

function updateScrollUI() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (readingProgress) {
    readingProgress.style.width = scrollPercent + '%';
    readingProgress.classList.toggle('complete', scrollPercent >= 98);
  }

  if (backToTop) {
    backToTop.style.display = scrollTop > 400 ? 'flex' : 'none';
    const ring = backToTop.querySelector('.progress-ring');
    if (ring) {
      ring.style.strokeDashoffset = CIRCUMFERENCE - (scrollPercent / 100) * CIRCUMFERENCE;
    }
  }

  ticking = false;
}

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollUI);
    ticking = true;
  }
}

export function onRouteDidUpdate({ location, previousLocation }) {
  if (location.pathname !== previousLocation?.pathname) {
    updateScrollUI();
  }
}

export default function () {
  if (typeof window === 'undefined') return;

  createProgressBar();
  createBackToTop();
  updateScrollUI();

  window.addEventListener('scroll', onScroll, { passive: true });
}
