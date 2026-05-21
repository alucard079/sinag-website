/* =============================================================
   THE SINAG MOVEMENT 2026 — Script
   ============================================================= */

// ── Nav: mobile hamburger ─────────────────────────────────────
const hamburger = document.querySelector('.nav__hamburger');
const navMenu   = document.querySelector('#navMenu');

function closeMobileNav() {
  hamburger?.setAttribute('aria-expanded', 'false');
  hamburger?.classList.remove('is-open');
  navMenu?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  const open = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!open));
  hamburger.classList.toggle('is-open', !open);
  navMenu?.classList.toggle('open', !open);
  document.body.style.overflow = open ? '' : 'hidden';
});

navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobileNav();
}, { passive: true });

// ── Nav: sticky shadow ────────────────────────────────────────
const navBar = document.querySelector('.nav-bar');
window.addEventListener('scroll', () => {
  navBar?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

// ── Nav: active page highlight ────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Scroll reveal ─────────────────────────────────────────────
const autoReveal = document.querySelectorAll(
  '.sinag-card, .value-card, .sponsor-package, .about-stats, .theme-context-card, .sponsor-cta-band'
);

autoReveal.forEach((el, i) => {
  if (!el.classList.contains('reveal')) {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal--delay-1');
    if (i % 3 === 2) el.classList.add('reveal--delay-2');
  }
});

// Also pick up elements that already have .reveal in HTML
const allReveal = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

allReveal.forEach(el => revealObserver.observe(el));

// ── Framework scroll theater ──────────────────────────────────
const fwScroll = document.getElementById('fwScroll');
if (fwScroll) {
  const stage        = document.getElementById('fwStage');
  const scenes       = fwScroll.querySelectorAll('.fw-scene');
  const progressFill = document.getElementById('fwProgressFill');
  const counterEl    = document.getElementById('fwCounterCurrent');
  const dots         = fwScroll.querySelectorAll('.fw-dot');
  let current        = 0;
  let isAnimating    = false;

  // Collect bg colors from data-bg attributes
  const bgColors  = Array.from(scenes).map(s => s.dataset.bg || '#002EAB');
  // Light backgrounds (gold, cream) need dark UI chrome
  const lightBgs  = new Set(['#FFC42D', '#FFF7E6']);

  function applyBg(idx) {
    const color = bgColors[idx];
    if (stage) {
      stage.style.backgroundColor = color;
      if (lightBgs.has(color)) {
        stage.removeAttribute('data-dark');
      } else {
        stage.setAttribute('data-dark', '');
      }
    }
    fwScroll.style.backgroundColor = color;
  }

  function goToScene(idx) {
    if (idx === current || isAnimating) return;
    isAnimating = true;
    const prev = current;
    current    = idx;

    scenes[prev].classList.add('exiting');
    scenes[prev].classList.remove('active');
    applyBg(current);

    requestAnimationFrame(() => {
      scenes[current].classList.add('active');
      if (counterEl) counterEl.textContent = String(current + 1).padStart(2, '0');
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    });

    setTimeout(() => {
      scenes[prev].classList.remove('exiting');
      isAnimating = false;
    }, 550);
  }

  function onScroll() {
    const rect            = fwScroll.getBoundingClientRect();
    const totalScrollable = fwScroll.offsetHeight - window.innerHeight;
    const scrolled        = Math.max(0, -rect.top);
    const progress        = Math.min(1, scrolled / totalScrollable);
    const targetIdx       = Math.min(Math.floor(progress * scenes.length), scenes.length - 1);

    if (progressFill) progressFill.style.height = `${progress * 100}%`;
    goToScene(targetIdx);
  }

  // Dot click — scroll to matching position
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const total  = fwScroll.offsetHeight - window.innerHeight;
      const target = fwScroll.offsetTop + (i / scenes.length) * total;
      window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  // Init
  applyBg(0);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Contact form submit (demo) ────────────────────────────────
document.querySelector('.contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = 'Message sent ✓';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
});

// ── Newsletter form submit (demo) ─────────────────────────────
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input) { input.value = ''; input.placeholder = 'Subscribed! ✓'; }
    setTimeout(() => { if (input) input.placeholder = 'Enter your email'; }, 3000);
  });
});
