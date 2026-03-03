/* ============================================================
   MAIN JS
   File: assets/js/main.js
   ============================================================ */

'use strict';

/* ── Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
    scrollTopBtn?.classList.add('visible');
  } else {
    navbar?.classList.remove('scrolled');
    scrollTopBtn?.classList.remove('visible');
  }
});

/* ── Mobile Menu ── */
const navToggle    = document.querySelector('.nav-toggle');
const mobileNav    = document.querySelector('.mobile-nav');
const mobileClose  = document.querySelector('.mobile-nav-close');
const mobileLinks  = document.querySelectorAll('.mobile-nav-links a');

function openMobileNav() {
  navToggle?.classList.add('open');
  mobileNav?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  navToggle?.classList.remove('open');
  mobileNav?.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

/* ── Active Nav Link (current page) ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Smooth Scroll for Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileNav();
    }
  });
});

/* ── Scroll to Top ── */
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Typewriter Effect ── */
function typewriter(element, texts, speed = 80, pause = 2400) {
  if (!element) return;
  let textIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = texts[textIdx];

    if (isDeleting) {
      element.textContent = current.slice(0, charIdx - 1);
      charIdx--;
    } else {
      element.textContent = current.slice(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? speed / 2 : speed;

    if (!isDeleting && charIdx === current.length) {
      delay = pause;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      textIdx = (textIdx + 1) % texts.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ── Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const tick = () => {
    current += step;
    if (current < target) {
      el.textContent = Math.floor(current);
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  };

  requestAnimationFrame(tick);
}

/* ── Observe Counters ── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ── Skill Bar Animation ── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width;
      barObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
  barObserver.observe(bar);
});

/* ── Project Filter Buttons ── */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.opacity = match ? '1' : '0.25';
      card.style.transform = match ? 'scale(1)' : 'scale(0.97)';
      card.style.pointerEvents = match ? 'all' : 'none';
    });
  });
});

/* ── Page Load Animation ── */
document.body.classList.add('page-transition');

/* ── Init Typewriter on Hero (if element exists) ── */
const typeEl = document.getElementById('hero-typewriter');
if (typeEl) {
  typewriter(typeEl, [
    'Full-Stack Developer',
    'React Specialist',
    'Node.js Expert',
    'UI/UX Enthusiast',
    'Your Tech Partner',
  ]);
}