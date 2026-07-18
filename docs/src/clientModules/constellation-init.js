/**
 * Constellation particle system — Canvas-based floating particles with connecting lines.
 * Dynamically imported only on the homepage to reduce bundle size on other pages.
 *
 * Upgrades:
 *  - Thicker, more visible connecting lines
 *  - Particles accelerate with scroll speed
 *  - Mouse proximity gravity effect (particles attracted to cursor)
 */

const PARTICLE_COUNT_DESKTOP = 20;
const PARTICLE_COUNT_MOBILE = 10;
const CONNECTION_DISTANCE = 220;
const PARTICLE_MIN_SIZE = 2.5;
const PARTICLE_MAX_SIZE = 5.5;
const MOUSE_GRAVITY_RADIUS = 180;
const MOUSE_GRAVITY_STRENGTH = 0.02;

const THEMES = {
  dark: {
    particles: [
      'rgba(107, 138, 255, 0.85)',
      'rgba(155, 124, 255, 0.8)',
      'rgba(56, 189, 248, 0.75)',
      'rgba(139, 164, 255, 0.8)',
    ],
    lines: (alpha) => `rgba(107, 138, 255, ${alpha})`,
    glow: 'rgba(107, 138, 255, 0.18)',
  },
  light: {
    particles: [
      'rgba(74, 108, 247, 0.6)',
      'rgba(124, 92, 252, 0.55)',
      'rgba(14, 165, 233, 0.5)',
      'rgba(107, 138, 255, 0.55)',
    ],
    lines: (alpha) => `rgba(74, 108, 247, ${alpha * 0.6})`,
    glow: 'rgba(74, 108, 247, 0.1)',
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
    baseSpeed: 0.4 + Math.random() * 0.6,
    size: PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE),
    color: colors.particles[Math.floor(Math.random() * colors.particles.length)],
  }));
}

export function initConstellation() {
  const container = document.querySelector('.constellation-canvas');
  if (!container) return null;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId = null;
  let paused = false;
  let lastTheme = getTheme();

  // Mouse tracking
  let mouseX = -1000;
  let mouseY = -1000;

  // Scroll speed tracking
  let lastScrollY = 0;
  let scrollSpeed = 0;
  let scrollDecayTimer = null;

  function onMouseMove(e) {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function onMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  function onScroll() {
    const currentY = window.scrollY;
    scrollSpeed = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;

    // Decay scroll speed over time
    clearTimeout(scrollDecayTimer);
    scrollDecayTimer = setTimeout(() => { scrollSpeed = 0; }, 150);
  }

  container.addEventListener('mousemove', onMouseMove, { passive: true });
  container.addEventListener('mouseleave', onMouseLeave, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

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
      // Scroll speed multiplier: particles move faster when scrolling
      const speedMul = 1 + Math.min(scrollSpeed * 0.08, 3);

      for (const p of particles) {
        // Apply scroll-based speed boost
        const vx = p.vx * p.baseSpeed * speedMul;
        const vy = p.vy * p.baseSpeed * speedMul;

        p.x += vx;
        p.y += vy;

        // Mouse gravity — attract particles toward cursor
        if (mouseX > 0 && mouseY > 0) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_GRAVITY_RADIUS && dist > 1) {
            const force = (1 - dist / MOUSE_GRAVITY_RADIUS) * MOUSE_GRAVITY_STRENGTH;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }
    }

    // Draw connections
    if (showLines) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.45;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = colors.lines(alpha);
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Draw mouse connection lines (stronger, to nearby particles)
      if (mouseX > 0 && mouseY > 0) {
        for (const p of particles) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_GRAVITY_RADIUS) {
            const alpha = (1 - dist / MOUSE_GRAVITY_RADIUS) * 0.3;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = colors.lines(alpha);
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = colors.glow;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    if (!paused) {
      animId = requestAnimationFrame(draw);
    }
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

  const onVisibility = () => {
    if (document.hidden) {
      paused = true;
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    } else if (!reducedMotion) {
      paused = false;
      if (!animId) draw();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  start();

  return () => {
    if (animId) cancelAnimationFrame(animId);
    observer.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    container.removeEventListener('mousemove', onMouseMove);
    container.removeEventListener('mouseleave', onMouseLeave);
    window.removeEventListener('scroll', onScroll);
    canvas.remove();
  };
}
