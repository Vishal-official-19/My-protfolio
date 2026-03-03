/* ============================================================
   ANIMATIONS.JS — Full Scroll & Interaction Animation System
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────
   1. INTERSECTION OBSERVER — Scroll Animations
   ────────────────────────────────────────────── */
const animatedEls = document.querySelectorAll(
  '.fade-up, .fade-in, .fade-left, .fade-right, .scale-in, .card-appear'
);

const scrollObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      scrollObs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

animatedEls.forEach(el => scrollObs.observe(el));


/* ──────────────────────────────────────────────
   2. STAGGERED CHILDREN — Auto Stagger Groups
   ────────────────────────────────────────────── */
document.querySelectorAll('[data-stagger]').forEach(parent => {
  const children = Array.from(parent.children);
  children.forEach((child, i) => {
    child.classList.add('fade-up');
    child.style.transitionDelay = `${i * 0.08}s`;
    scrollObs.observe(child);
  });
});


/* ──────────────────────────────────────────────
   3. PROGRESS BARS — Fill on Scroll
   ────────────────────────────────────────────── */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const width = fill.dataset.width || '0%';
      setTimeout(() => {
        fill.style.width = width;
      }, 200);
      barObs.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
  barObs.observe(bar);
});


/* ──────────────────────────────────────────────
   4. COUNTER ANIMATION — Count Up on Scroll
   ────────────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const startTime = performance.now();

  function update(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter[data-target]').forEach(el => {
  counterObs.observe(el);
});


/* ──────────────────────────────────────────────
   5. TYPEWRITER EFFECT
   ────────────────────────────────────────────── */
function typewriter(el, texts, speed = 75, pause = 2600) {
  if (!el) return;
  let textIndex    = 0;
  let charIndex    = 0;
  let isDeleting   = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      el.textContent = currentText.slice(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentText.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? speed / 2 : speed;

    if (!isDeleting && charIndex === currentText.length) {
      delay      = pause;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting  = false;
      textIndex   = (textIndex + 1) % texts.length;
      delay       = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* Init typewriter on hero badge */
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


/* ──────────────────────────────────────────────
   6. PARALLAX ORB — Mouse Move Effect
   ────────────────────────────────────────────── */
window.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb-purple, .orb-cyan');
  if (!orbs.length) return;

  const x = (e.clientX / window.innerWidth  - 0.5) * 24;
  const y = (e.clientY / window.innerHeight - 0.5) * 24;

  orbs.forEach((orb, i) => {
    const factor = i % 2 === 0 ? 1 : -0.6;
    orb.style.transform  = `translate(${x * factor}px, ${y * factor}px)`;
    orb.style.transition = 'transform 1s ease';
  });
}, { passive: true });


/* ──────────────────────────────────────────────
   7. SKILL TAGS — Hover Pop on Touch
   ────────────────────────────────────────────── */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('touchstart', () => {
    tag.style.transform  = 'scale(1.1) translateY(-2px)';
    tag.style.transition = 'transform 0.2s ease';
  }, { passive: true });

  tag.addEventListener('touchend', () => {
    setTimeout(() => {
      tag.style.transform = '';
    }, 300);
  }, { passive: true });
});


/* ──────────────────────────────────────────────
   8. CARD TILT — Subtle 3D on Mouse Move
   ────────────────────────────────────────────── */
document.querySelectorAll('.proj-card, .svc-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) *  4;

    card.style.transform  = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.4s ease';
  });
});


/* ──────────────────────────────────────────────
   9. SECTION REVEAL — Add class to sections
   ────────────────────────────────────────────── */
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('section').forEach(sec => {
  sectionObs.observe(sec);
});


/* ──────────────────────────────────────────────
   10. SMOOTH NUMBER — Live Stat Numbers
   ────────────────────────────────────────────── */
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = el.dataset.float === 'true';
      const prefix  = el.dataset.prefix  || '';
      const suffix  = el.dataset.suffix  || '';
      const duration = 1800;
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = eased * target;
        el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target + suffix;
      }

      requestAnimationFrame(tick);
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-stat]').forEach(el => statObs.observe(el));


/* ──────────────────────────────────────────────
   11. NAVBAR ACTIVE LINK — Highlight on Scroll
   ────────────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${id}` ||
          link.getAttribute('href') === `index.html#${id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => activeObs.observe(sec));


/* ──────────────────────────────────────────────
   12. LAZY IMAGE FADE IN
   ────────────────────────────────────────────── */
const imgObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity    = '0';
      img.style.transition = 'opacity 0.6s ease';
      img.onload = () => { img.style.opacity = '1'; };
      if (img.complete) img.style.opacity = '1';
      imgObs.unobserve(img);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  imgObs.observe(img);
});


/* ──────────────────────────────────────────────
   13. TESTI GRID AUTO ROTATE
   ────────────────────────────────────────────── */
const reviews = [
  { name: "Rahul Gupta",   company: "CEO · DataPilot",          initials: "RG", color: "#6C63FF", text: "Vishal delivered our SaaS dashboard in exactly 6 weeks — on time and under budget. Code was clean and documented. Already planning Phase 2.", rating: 5 },
  { name: "Priya Mehta",   company: "Founder · StyleNest India", initials: "PM", color: "#00D4FF", text: "Our store hit ₹12 lakhs GMV in Month 1. Vishal's UX suggestions improved checkout conversion by 28%. Exceptional work.", rating: 5 },
  { name: "Amit Sharma",   company: "CTO · SkillBridge Academy", initials: "AS", color: "#FFD93D", textColor: "#1a1a1a", text: "Communicates proactively, asks the right questions, and doesn't disappear when complex. 8,000+ active learners now.", rating: 5 },
  { name: "Neha Verma",    company: "Director · MedCare",        initials: "NV", color: "#6BCB77", text: "Hospital management system delivered on time with zero critical bugs. Attention to detail and testing was impressive.", rating: 5 },
  { name: "Karan Mehta",   company: "Founder · CloudKitchen",    initials: "KM", color: "#FF6B6B", text: "The food delivery PWA handles 3,200+ orders daily without breaking a sweat. Lightning fast and scales perfectly.", rating: 5 },
  { name: "Sunita Patel",  company: "MD · BuildRight Infra",     initials: "SP", color: "#A78BFA", text: "Website revamp doubled lead inquiries in 30 days. SEO ranking went from page 4 to position 1. Worth every rupee.", rating: 5 },
];

let reviewIndex = 0;

function renderReviews() {
  const grid = document.querySelector('.testi-grid');
  if (!grid) return;

  const cols = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const visible = [];
  for (let i = 0; i < cols; i++) {
    visible.push(reviews[(reviewIndex + i) % reviews.length]);
  }

  grid.style.opacity   = '0';
  grid.style.transform = 'translateY(10px)';

  setTimeout(() => {
    grid.innerHTML = visible.map(r => `
      <div class="testi-card">
        <div class="testi-quote-icon">"</div>
        <p class="testi-text">${r.text}</p>
        <div class="testi-stars">${'★'.repeat(r.rating)}</div>
        <div class="testi-author">
          <div class="testi-avatar" style="background:${r.color};color:${r.textColor || '#fff'}">${r.initials}</div>
          <div>
            <div class="testi-name">${r.name}</div>
            <div class="testi-company">${r.company}</div>
          </div>
        </div>
      </div>
    `).join('');

    grid.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    grid.style.opacity    = '1';
    grid.style.transform  = 'translateY(0)';
    reviewIndex = (reviewIndex + cols) % reviews.length;
  }, 400);
}

if (document.querySelector('.testi-grid')) {
  renderReviews();
  setInterval(renderReviews, 5000);
}


/* ──────────────────────────────────────────────
   14. SCROLL PROGRESS BAR — Top of Page
   ────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
Object.assign(progressBar.style, {
  position:   'fixed',
  top:        '0',
  left:       '0',
  height:     '2px',
  width:      '0%',
  background: 'linear-gradient(135deg, #6C63FF, #00D4FF)',
  zIndex:     '9999',
  transition: 'width 0.1s ease',
  pointerEvents: 'none',
});
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });


/* ──────────────────────────────────────────────
   15. BUTTON CLICK RIPPLE EFFECT
   ────────────────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left  - size / 2;
    const y      = e.clientY - rect.top   - size / 2;

    Object.assign(ripple.style, {
      position:     'absolute',
      width:        size + 'px',
      height:       size + 'px',
      left:         x + 'px',
      top:          y + 'px',
      background:   'rgba(255, 255, 255, 0.25)',
      borderRadius: '50%',
      transform:    'scale(0)',
      animation:    'ripple-expand 0.55s ease-out forwards',
      pointerEvents:'none',
    });

    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple-expand {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});


/* ──────────────────────────────────────────────
   16. PAGE LOAD — Animate body in
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-transition');
});
