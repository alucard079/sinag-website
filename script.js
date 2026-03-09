const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('#navMenu');
const navBar = document.querySelector('.nav');

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', (!expanded).toString());
  navMenu?.classList.toggle('open');
});

// Sticky nav state on scroll
const handleScroll = () => {
  if (!navBar) return;
  navBar.classList.toggle('nav--scrolled', window.scrollY > 24);
};
window.addEventListener('scroll', handleScroll);
handleScroll();

// Nav indicator + section syncing
const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');
const navIndicator = document.querySelector('.nav__indicator');
let activeLink = navLinks[0] || null;

const moveIndicator = (target) => {
  if (!navIndicator || !navMenu || !target) return;
  if (window.matchMedia('(max-width: 900px)').matches) {
    navIndicator.style.opacity = '0';
    return;
  }
  const targetRect = target.getBoundingClientRect();
  const menuRect = navMenu.getBoundingClientRect();
  navIndicator.style.width = `${targetRect.width}px`;
  navIndicator.style.transform = `translateX(${targetRect.left - menuRect.left}px)`;
  navIndicator.style.opacity = '1';
};

const setActiveLink = (link) => {
  if (!link) return;
  navLinks.forEach((item) => item.classList.remove('active'));
  link.classList.add('active');
  activeLink = link;
  moveIndicator(link);
};

navLinks.forEach((link) => {
  link.addEventListener('mouseenter', () => moveIndicator(link));
  link.addEventListener('focus', () => moveIndicator(link));
  link.addEventListener('click', () => {
    setActiveLink(link);
    if (navMenu?.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

navMenu?.addEventListener('mouseleave', () => moveIndicator(activeLink));
window.addEventListener('resize', () => moveIndicator(activeLink));
moveIndicator(activeLink);

// Tabs for core values
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;
    tabButtons.forEach((btn) => {
      const isActive = btn === button;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive.toString());
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === target);
    });
  });
});

// Timeline filter
const filterSelect = document.querySelector('#timelineFilter');
const timelineItems = document.querySelectorAll('.timeline-item');

filterSelect?.addEventListener('change', (event) => {
  const value = event.target.value;
  timelineItems.forEach((item) => {
    const matches = value === 'all' || item.dataset.phase === value;
    item.style.display = matches ? 'block' : 'none';
  });
});

// Accordion logic
const accordionItems = document.querySelectorAll('.accordion__item');

accordionItems.forEach((item) => {
  item.addEventListener('click', () => {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    accordionItems.forEach((other) => other.setAttribute('aria-expanded', 'false'));
    item.setAttribute('aria-expanded', (!expanded).toString());
  });
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('.section, .team-card, .timeline-item');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Highlight nav link while scrolling through sections
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = document.querySelector(`.nav__menu a[href="#${entry.target.id}"]`);
      if (link) {
        setActiveLink(link);
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => sectionObserver.observe(section));

// Provide a lightweight video placeholder interaction
const heroPosterButton = document.querySelector('.hero__poster button');
heroPosterButton?.addEventListener('click', () => {
  alert('Swap this placeholder with your actual highlight reel embed.');
});
