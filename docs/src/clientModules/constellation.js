/**
 * Constellation particle system — Canvas-based floating particles with connecting lines.
 * Only runs on the homepage.
 */

const PARTICLE_COUNT_DESKTOP = 18;
const PARTICLE_COUNT_MOBILE = 10;
const CONNECTION_DISTANCE = 200;
const PARTICLE_MIN_SIZE = 2.5;
const PARTICLE_MAX_SIZE = 5.5;

const THEMES = {
  dark: {
    particles: [
      'rgba(107, 138, 255, 0.8)',
      'rgba(155, 124, 255, 0.75)',
      'rgba(56, 189, 248, 0.7)',
      'rgba(139, 164, 255, 0.75)',
    ],
    lines: (alpha) => `rgba(107, 138, 255, ${alpha})`,
    glow: 'rgba(107, 138, 255, 0.15)',
  },
  light: {
    particles: [
      'rgba(74, 108, 247, 0.5)',
      'rgba(124, 92, 252, 0.45)',
      'rgba(14, 165, 233, 0.4)',
      'rgba(107, 138, 255, 0.45)',
    ],
    lines: (alpha) => `rgba(74, 108, 247, ${alpha * 0.5})`,
    glow: 'rgba(74, 108, 247, 0.08)',
  },
};

const MOBILE_BREAKPOINT = 768;
const reducedMotionQuery = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;
let reducedMotion = reducedMotionQuery?.matches ?? false;
reducedMotionQuery?.addEventListener('change', (e) => { reducedMotion = e.matches; });

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function createParticles(width, height) {
  const colors = THEMES[getTheme()] || THEMES.dark;
  const count = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.6,
    size: PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE),
    color: colors.particles[Math.floor(Math.random() * colors.particles.length)],
  }));
}

function initConstellation() {
  const container = document.querySelector('.constellation-canvas');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let lastTheme = getTheme();

  function resize() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  function draw() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const colors = THEMES[getTheme()] || THEMES.dark;
    const showLines = !isMobile();

    ctx.clearRect(0, 0, w, h);

    if (!reducedMotion) {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }
    }

    if (showLines) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = colors.lines(alpha);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = colors.glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    particles = createParticles(w, h);
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  const observer = new MutationObserver(() => {
    const newTheme = getTheme();
    if (newTheme !== lastTheme) {
      lastTheme = newTheme;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      particles = createParticles(w, h);
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const onResize = () => {
    resize();
    const newCount = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    if (particles.length !== newCount) {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      particles = createParticles(w, h);
    }
  };
  window.addEventListener('resize', onResize);

  start();

  return () => {
    if (animId) cancelAnimationFrame(animId);
    observer.disconnect();
    window.removeEventListener('resize', onResize);
    canvas.remove();
  };
}

// Docusaurus client module lifecycle
let cleanup = null;

export function onRouteDidUpdate({ location }) {
  if (cleanup) cleanup();
  cleanup = null;
  if (location.pathname !== '/') return;
  requestAnimationFrame(() => {
    cleanup = initConstellation();
  });
}

export default function () {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => { cleanup = initConstellation(); });
    }, { once: true });
  } else {
    requestAnimationFrame(() => { cleanup = initConstellation(); });
  }
}
