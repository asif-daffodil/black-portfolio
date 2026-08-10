/**
 * main3d.js — Portfolio JavaScript
 * ─────────────────────────────────────────────
 * - Three.js 3D hero scene
 * - HORIZONTAL scroll with custom eased animation
 *   (easeInOutQuart via requestAnimationFrame)
 * - CSS scroll-snap fallback for touch swipe
 * - Section dot nav + progress bar
 * - Keyboard arrow navigation
 * - Mobile: fallback to normal vertical scroll
 * - Typewriter effect
 * - Scroll-reveal animations (IntersectionObserver)
 * - Skill bar animations
 * - Contact form handler
 * - Portfolio filter
 * ─────────────────────────────────────────────
 */

'use strict';

/* ── Constants ───────────────────────────────── */
const MOBILE_BP = 768;

const SECTIONS = [
  'hero', 'about', 'skills', 'experience',
  'education', 'certifications', 'ai-section',
  'upwork', 'portfolio', 'contact'
];

/* ── Helpers ─────────────────────────────────── */
const isMobile = () => window.innerWidth <= MOBILE_BP;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─────────────────────────────────────────────
   SMOOTH SCROLL ENGINE
   Custom eased scroll — replaces browser's
   native 'smooth' which can stutter/snap
   ───────────────────────────────────────────── */
const ScrollEngine = (() => {
  let animId       = null;
  let isAnimating  = false;
  let currentPanel = 0;

  /* easeInOutQuart — fast start, smooth deceleration */
  function ease(t) {
    return t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  /**
   * Smoothly scroll the container to a panel index.
   * @param {number} idx    - Target panel index
   * @param {number} duration - Animation duration in ms
   */
  function toPanel(idx, duration = 680) {
    const container = $('#h-container');
    if (!container || isMobile()) return;

    idx = Math.max(0, Math.min(SECTIONS.length - 1, idx));

    // Already there — no-op
    if (isAnimating && idx === currentPanel) return;
    // Cancel any in-flight animation
    if (animId) cancelAnimationFrame(animId);

    const prevPanel = currentPanel;
    currentPanel = idx;
    isAnimating  = true;

    const startLeft  = container.scrollLeft;
    const targetLeft = idx * window.innerWidth;
    const distance   = targetLeft - startLeft;
    const startTime  = performance.now();

    // Trigger directional slide transition
    triggerSlideTransition(prevPanel, idx);

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = startLeft + distance * ease(progress);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        container.scrollLeft = targetLeft; // pin to exact position
        isAnimating = false;
        animId = null;
      }
    }

    animId = requestAnimationFrame(step);
  }

  /** Get the current panel index (nearest) */
  function getCurrentIdx() {
    const container = $('#h-container');
    if (!container) return 0;
    return Math.round(container.scrollLeft / window.innerWidth);
  }

  return { toPanel, getCurrentIdx, get isAnimating() { return isAnimating; } };
})();

/* ─────────────────────────────────────────────
   PANEL SLIDER TRANSITION
   direction: 1 = forward (exit left, enter from right)
   direction: -1 = backward (exit right, enter from left)
   ───────────────────────────────────────────── */

const SLIDE_CLASSES = [
  'panel-exit-left', 'panel-exit-right',
  'panel-enter-from-right', 'panel-enter-from-left'
];

function clearSlideClasses(section) {
  section.classList.remove(...SLIDE_CLASSES);
}

function triggerSlideTransition(fromIdx, toIdx) {
  const direction = toIdx > fromIdx ? 1 : -1; // 1 = forward, -1 = backward

  const allPanels = $$('#h-container > section, #h-container > footer');

  // Clear all slide classes first
  allPanels.forEach(clearSlideClasses);

  const fromSection = fromIdx >= 0 ? document.getElementById(SECTIONS[fromIdx]) : null;
  const toSection   = toIdx   >= 0 ? document.getElementById(SECTIONS[toIdx])   : null;

  if (fromSection && fromIdx !== toIdx) {
    // Outgoing panel
    const exitClass = direction === 1 ? 'panel-exit-left' : 'panel-exit-right';
    fromSection.classList.add(exitClass);
    fromSection.addEventListener('animationend', () => {
      clearSlideClasses(fromSection);
    }, { once: true });
  }

  if (toSection) {
    // Incoming panel — defer one frame so the element is in scroll position
    requestAnimationFrame(() => {
      const enterClass = direction === 1 ? 'panel-enter-from-right' : 'panel-enter-from-left';
      toSection.classList.add(enterClass);
      toSection.addEventListener('animationend', () => {
        clearSlideClasses(toSection);
      }, { once: true });
    });
  }
}

/* ─────────────────────────────────────────────
   BOOT
   ───────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('#page-loader');
    if (loader) loader.classList.add('hidden');
    initAll();
  }, 1400);
});

function initAll() {
  applyScrollMode();
  initNavbar();
  initMobileNav();
  initHero3D();
  initTyped();
  initHorizontalScroll();
  initSectionDots();
  initAnchorLinks();
  initScrollReveal();
  initSkillBars();
  initScrollTop();
  initContactForm();
  initPortfolioFilter();
  addScrollHint();
}

/* ── Scroll mode setup ───────────────────────── */
function applyScrollMode() {
  const toggle = () => {
    const mobile = isMobile();
    document.documentElement.classList.toggle('h-scroll-active', !mobile);
    document.body.classList.toggle('h-scroll-active', !mobile);
  };
  toggle();
  window.addEventListener('resize', toggle, { passive: true });
}

/* ─────────────────────────────────────────────
   HORIZONTAL SCROLL — WHEEL + KEYBOARD
   ───────────────────────────────────────────── */
function initHorizontalScroll() {
  const container = $('#h-container');
  if (!container) return;

  /* ─── Wheel handler ─── */
  let accDelta   = 0;
  let wheelTimer = null;

  /**
   * Returns the active section panel element currently in view.
   */
  function getActiveSection() {
    const idx = ScrollEngine.getCurrentIdx();
    const id  = SECTIONS[idx];
    return id ? document.getElementById(id) : null;
  }

  /**
   * Check whether the section can still scroll in the given direction.
   * dir: 1 = down (need more content below), -1 = up (need content above)
   */
  function canSectionScroll(section, dir) {
    if (!section) return false;
    const tolerance = 4; // px — handles sub-pixel rounding
    if (dir > 0) {
      // Can scroll down if not yet at the bottom
      return section.scrollTop + section.clientHeight < section.scrollHeight - tolerance;
    } else {
      // Can scroll up if not yet at the top
      return section.scrollTop > tolerance;
    }
  }

  container.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    e.preventDefault();

    // While a panel animation is running, ignore wheel
    if (ScrollEngine.isAnimating) return;

    const delta = e.deltaY + e.deltaX;
    accDelta += delta;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      if (Math.abs(accDelta) < 20) { accDelta = 0; return; } // dead-zone

      const dir     = accDelta > 0 ? 1 : -1;
      const section = getActiveSection();

      if (canSectionScroll(section, dir)) {
        // Still content to scroll within the section — let it scroll naturally
        // (the section already has overflow-y:auto so native scroll handles it)
        section.scrollBy({ top: accDelta * 1.2, behavior: 'smooth' });
      } else {
        // Section is at boundary — navigate to next/previous panel
        ScrollEngine.toPanel(ScrollEngine.getCurrentIdx() + dir);
      }

      accDelta = 0;
    }, 60);

  }, { passive: false });

  /* ─── Keyboard ─── */
  document.addEventListener('keydown', (e) => {
    if (isMobile() || ScrollEngine.isAnimating) return;

    if (['ArrowRight', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      ScrollEngine.toPanel(ScrollEngine.getCurrentIdx() + 1);
    } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      ScrollEngine.toPanel(ScrollEngine.getCurrentIdx() - 1);
    }
  });
}

/* ── Public navigate by section id ──────────── */
function scrollToSection(id) {
  if (isMobile()) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const idx = SECTIONS.indexOf(id);
  if (idx !== -1) ScrollEngine.toPanel(idx);
}

/* ─────────────────────────────────────────────
   SECTION DOTS + PROGRESS BAR
   ───────────────────────────────────────────── */
function initSectionDots() {
  const container = $('#h-container');
  const dots      = $$('.section-dot');
  const progress  = $('#h-progress');
  if (!container) return;

  dots.forEach(dot => {
    dot.addEventListener('click', () => scrollToSection(dot.dataset.target));
  });

  container.addEventListener('scroll', () => {
    if (isMobile()) return;

    const panelW     = window.innerWidth;
    const scrollLeft = container.scrollLeft;
    const totalW     = container.scrollWidth - panelW;

    if (progress) {
      const pct = totalW > 0 ? (scrollLeft / totalW) * 100 : 0;
      progress.style.width = pct.toFixed(2) + '%';
    }

    const activeIdx = Math.round(scrollLeft / panelW);
    dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    syncNavLinks(activeIdx);

  }, { passive: true });
}

function syncNavLinks(activeIdx) {
  const id    = SECTIONS[activeIdx];
  const links = $$('.nav-links a, .nav-drawer a');
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
  });
}

/* ── Anchor links ────────────────────────────── */
function initAnchorLinks() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href').slice(1);
    if (!id || !SECTIONS.includes(id)) return;
    e.preventDefault();
    scrollToSection(id);
    $('#nav-drawer')?.classList.remove('open');
  });
}

/* ── Navbar scrolled class ───────────────────── */
function initNavbar() {
  const navbar    = $('#navbar');
  const container = $('#h-container');
  if (!navbar) return;

  const update = () => {
    const scrolled = isMobile()
      ? window.scrollY > 60
      : (container?.scrollLeft ?? 0) > window.innerWidth * 0.3;
    navbar.classList.toggle('scrolled', scrolled);
  };

  container?.addEventListener('scroll', update, { passive: true });
  window.addEventListener('scroll', update, { passive: true });
}

/* ── Mobile nav drawer ───────────────────────── */
function initMobileNav() {
  const hamburger = $('#nav-hamburger');
  const drawer    = $('#nav-drawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    if (open) {
      s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
      s2.style.opacity   = '0';
      s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      s1.style.transform = s2.style.opacity = s3.style.transform = '';
    }
  });
}

/* ─────────────────────────────────────────────
   THREE.JS HERO SCENE
   ───────────────────────────────────────────── */
function initHero3D() {
  const canvas = $('#hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* Stars */
  const N   = 1800;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const clrP = new THREE.Color(0x8147ff);
  const clrA = new THREE.Color(0x00d4ff);
  const clrW = new THREE.Color(0xffffff);
  for (let i = 0; i < N; i++) {
    const i3 = i * 3;
    pos[i3]   = (Math.random() - 0.5) * 30;
    pos[i3+1] = (Math.random() - 0.5) * 20;
    pos[i3+2] = (Math.random() - 0.5) * 20;
    const r = Math.random();
    const c = r < 0.33 ? clrP : r < 0.66 ? clrA : clrW;
    col[i3] = c.r; col[i3+1] = c.g; col[i3+2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.7, sizeAttenuation: true
  }));
  scene.add(particles);

  /* Icosahedron */
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.8, 1),
    new THREE.MeshPhongMaterial({ color: 0x8147ff, emissive: 0x2a1066, wireframe: true, transparent: true, opacity: 0.18 })
  );
  ico.position.set(4, 0, -2);
  scene.add(ico);

  /* Torus */
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1.4, 0.04, 16, 60),
    new THREE.MeshPhongMaterial({ color: 0x00d4ff, emissive: 0x004455, transparent: true, opacity: 0.25 })
  );
  torus.position.set(4.5, 0.5, -1.5);
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  /* Orbiting spheres */
  const orbitColors = [0x8147ff, 0x00d4ff, 0xffd700];
  const orbitMeshes = orbitColors.map(c => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 })
    );
    scene.add(m);
    return m;
  });

  /* Lights */
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const pl1 = new THREE.PointLight(0x8147ff, 2, 20);
  pl1.position.set(5, 5, 5);
  scene.add(pl1);
  const pl2 = new THREE.PointLight(0x00d4ff, 1.5, 20);
  pl2.position.set(-5, -3, 3);
  scene.add(pl2);

  /* Mouse parallax */
  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    tx += (mx - tx) * 0.03;
    ty += (my - ty) * 0.03;

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.02;
    ico.rotation.x = t * 0.25 + ty * 0.3;
    ico.rotation.y = t * 0.30 + tx * 0.3;
    ico.position.y = Math.sin(t * 0.6) * 0.4;
    torus.rotation.z = t * 0.4;
    torus.rotation.x = Math.PI / 3 + Math.sin(t * 0.3) * 0.2;

    orbitMeshes.forEach((m, i) => {
      const a = t * 0.8 + (i * Math.PI * 2) / 3;
      m.position.set(4 + Math.cos(a) * 2.6, Math.sin(a) * 1.3, -2 + Math.sin(a) * 2.6);
    });

    camera.position.x += (tx * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-ty * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  animate();

  const hero = $('#hero');
  if (hero) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) cancelAnimationFrame(animId);
        else animate();
      });
    }, { threshold: 0 }).observe(hero);
  }
}

/* ─────────────────────────────────────────────
   TYPEWRITER
   ───────────────────────────────────────────── */
function initTyped() {
  const el = $('#typed-text');
  if (!el) return;

  const roles = [
    'PHP / Laravel Developer',
    'Zend Certified Engineer',
    'Full-Stack Developer',
    'MERN Stack Developer',
    'AI Integration Expert',
    'Node.js / Next.js Dev',
  ];

  let rIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const role = roles[rIdx];
    if (!deleting) {
      el.textContent = role.substring(0, ++cIdx);
      if (cIdx === role.length) {
        setTimeout(() => { deleting = true; tick(); }, 2200);
        return;
      }
    } else {
      el.textContent = role.substring(0, --cIdx);
      if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 38 : 72);
  }
  setTimeout(tick, 900);
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────────── */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  $$('.reveal, .timeline-item').forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   SKILL BARS
   ───────────────────────────────────────────── */
function initSkillBars() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.style.width = entry.target.dataset.width || '0%'; }, 100);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  $$('.skill-bar-fill, .lang-bar-fill').forEach(bar => obs.observe(bar));
}

/* ─────────────────────────────────────────────
   SCROLL TO TOP
   ───────────────────────────────────────────── */
function initScrollTop() {
  const btn       = $('#scroll-top');
  const container = $('#h-container');
  if (!btn) return;

  const update = () => {
    const far = isMobile()
      ? window.scrollY > 400
      : (container?.scrollLeft ?? 0) > window.innerWidth * 0.8;
    btn.classList.toggle('visible', far);
  };

  container?.addEventListener('scroll', update, { passive: true });
  window.addEventListener('scroll', update, { passive: true });

  btn.addEventListener('click', () => {
    if (isMobile()) window.scrollTo({ top: 0, behavior: 'smooth' });
    else ScrollEngine.toPanel(0);
  });
}

/* ─────────────────────────────────────────────
   CONTACT FORM
   ───────────────────────────────────────────── */
function initContactForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;

    await new Promise(res => setTimeout(res, 1200));

    form.reset();
    btn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
    btn.disabled  = false;

    if (success) {
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }
  });
}

/* ─────────────────────────────────────────────
   PORTFOLIO FILTER
   ───────────────────────────────────────────── */
function initPortfolioFilter() {
  const btns  = $$('.filter-btn');
  const items = $$('.portfolio-item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const cats = (item.dataset.category || '').toLowerCase().split(/\s+/);
        const show = filter === 'all' || cats.includes(filter.toLowerCase());
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = ''; });
        } else {
          item.style.opacity = '0'; item.style.transform = 'scale(0.92)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

/* ─────────────────────────────────────────────
   KEYBOARD HINT
   ───────────────────────────────────────────── */
function addScrollHint() {
  if (isMobile()) return;
  const hero = $('#hero');
  if (!hero) return;
  const hint = document.createElement('div');
  hint.className = 'h-scroll-hint';
  hint.innerHTML = `
    <span class="key">→</span><span>navigate sections</span>
    <span style="margin-left:8px;opacity:.5;">|</span>
    <span class="key" style="margin-left:8px;">↓</span><span>scroll within</span>
  `;
  hero.appendChild(hint);
}
