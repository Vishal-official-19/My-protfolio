/* ============================================================
   SCROLL ANIMATIONS
   File: assets/js/animations.js
   ============================================================ */

'use strict';

/* ── Intersection Observer for fade-up / fade-left / fade-right / scale-in ── */
const animatedEls = document.querySelectorAll(
  '.fade-up, .fade-in, .fade-left, .fade-right, .scale-in'
);

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px',
  }
);

animatedEls.forEach((el) => scrollObserver.observe(el));