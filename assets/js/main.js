/* ============================================================
   MAIN JS v2.0
   ============================================================ */
'use strict';

/* ── Navbar Scroll ── */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
  const s = window.scrollY > 60;
  navbar?.classList.toggle('scrolled', s);
  scrollTopBtn?.classList.toggle('visible', s);
}, { passive: true });

/* ── Mobile Menu ── */
const navToggle   = document.querySelector('.nav-toggle');
const mobileNav   = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav-close');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

function openMobileNav()  { navToggle?.classList.add('open'); mobileNav?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMobileNav() { navToggle?.classList.remove('open'); mobileNav?.classList.remove('open'); document.body.style.overflow = ''; }

navToggle?.addEventListener('click', openMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);
mobileLinks.forEach(l => l.addEventListener('click', closeMobileNav));

/* ── Active Nav Link ── */
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  // Remove active class from all links
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => link.classList.remove('active'));
  
  // Add active class to matching link
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href.split('/').pop().split('#')[0] || 'index.html';
    
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Set active on page load
setActiveNavLink();

// Also check on hash change
window.addEventListener('hashchange', setActiveNavLink);

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
      closeMobileNav();
    }
  });
});

/* ── Scroll to Top ── */
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Typewriter Effect ── */
function typewriter(el, texts, speed = 75, pause = 2600) {
  if (!el) return;
  let ti = 0, ci = 0, deleting = false;
  function type() {
    const cur = texts[ti];
    el.textContent = deleting ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
    deleting ? ci-- : ci++;
    let delay = deleting ? speed / 2 : speed;
    if (!deleting && ci === cur.length) { delay = pause; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % texts.length; delay = 400; }
    setTimeout(type, delay);
  }
  type();
}

/* ── Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.counter[data-target]').forEach(el => counterObs.observe(el));

/* ── Skill Bar Animation ── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.width; barObs.unobserve(e.target); } });
}, { threshold: 0.4 });
document.querySelectorAll('.progress-fill[data-width]').forEach(b => barObs.observe(b));

/* ── Project / Blog Filter ── */
document.querySelectorAll('.filter-btn, .cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('section') || document;
    parent.querySelectorAll('.filter-btn, .cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter || btn.dataset.cat;
    const cards = parent.querySelectorAll('[data-category], [data-cat]');
    cards.forEach(card => {
      const cat = card.dataset.category || card.dataset.cat;
      const match = filter === 'all' || cat === filter;
      card.style.opacity = match ? '1' : '0.2';
      card.style.transform = match ? '' : 'scale(0.96)';
      card.style.pointerEvents = match ? 'all' : 'none';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
  });
});

/* ── Page Load Animation ── */
document.body.classList.add('page-transition');

/* ── Init Typewriter ── */
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

/* ── Parallax Hero Orbs ── */
window.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb-purple, .orb-cyan');
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbs.forEach((orb, i) => {
    const factor = i % 2 === 0 ? 1 : -0.6;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    orb.style.transition = 'transform 0.8s ease';
  });
}, { passive: true });

/* ── Auto Reviews System ── */
const reviews = [
  { name: "Rahul Gupta", company: "CEO · DataPilot Technologies", initials: "RG", color: "#6C63FF", text: "Vishal delivered our SaaS dashboard in exactly 6 weeks — on time, under budget. Code was clean and documented. We're already planning Phase 2.", rating: 5 },
  { name: "Priya Mehta", company: "Founder · StyleNest India", initials: "PM", color: "#00D4FF", text: "Our store hit ₹12 lakhs GMV in Month 1. Checkout conversion improved by 28%. Highly recommend.", rating: 5 },
  { name: "Amit Sharma", company: "CTO · SkillBridge Academy", initials: "AS", color: "#FFD93D", textColor: "#1a1a1a", text: "Great communication and attention to detail. Handles complex issues smartly. 8,000+ active users on the platform now.", rating: 4.5 },
  { name: "Neha Verma", company: "Director · MedCare Solutions", initials: "NV", color: "#6BCB77", text: "Our hospital management system was delivered on time with minimal bugs. Testing was thorough. Very impressed.", rating: 5 },
  { name: "Karan Mehta", company: "Founder · CloudKitchen Co.", initials: "KM", color: "#FF6B6B", text: "The food delivery PWA handles thousands of orders daily without issues. Outstanding performance and design.", rating: 5 },
  { name: "Sunita Patel", company: "MD · BuildRight Infra", initials: "SP", color: "#6C63FF", text: "Website revamp doubled our leads in 30 days. SEO improved significantly. Would work with Vishal again.", rating: 4.5 },
  { name: "Vikram Singh", company: "Founder · TechStart Ventures", initials: "VS", color: "#FF9F43", text: "The API integration was seamless. Vishal understood our requirements well and delivered without scope creep.", rating: 4 },
  { name: "Meera Kapoor", company: "Product Lead · DigitalEdge", initials: "MK", color: "#A4DE6C", text: "Responsive, reliable, and delivers quality work. Could improve communication a bit, but overall excellent experience.", rating: 4.5 },
];
];

let reviewIndex = 0;

function renderReviews() {
  const grid = document.querySelector('.testi-grid');
  if (!grid) return;

  const visible = [
    reviews[reviewIndex % reviews.length],
    reviews[(reviewIndex + 1) % reviews.length],
    reviews[(reviewIndex + 2) % reviews.length],
  ];

  grid.style.opacity = '0';
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
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';

    reviewIndex = (reviewIndex + 3) % reviews.length;
  }, 400);
}

/* Auto-rotate reviews every 1 hour (60 minutes) */
if (document.querySelector('.testi-grid')) {
  renderReviews();
  setInterval(renderReviews, 3600000);
}

/* ── Auto Case Studies (Projects Page) ── */
const autoProjects = [
  { title: "SaaS Analytics Dashboard", cat: "webapp", color: "#4F8EF7", year: "2025", results: ["3x Faster", "40% Retention↑", "98 Lighthouse"], stack: ["Next.js", "Node.js", "PostgreSQL", "Redis"], desc: "Real-time B2B analytics platform for 5,000+ users with live dashboards." },
  { title: "Multi-Vendor Marketplace", cat: "ecommerce", color: "#34D399", year: "2024", results: ["₹12L GMV", "150+ Vendors", "2.1s Load"], stack: ["React", "Express.js", "MongoDB", "Razorpay"], desc: "Fashion marketplace with live inventory and automated vendor payouts." },
  { title: "EdTech Learning Platform", cat: "webapp", color: "#FBBF24", year: "2024", results: ["8K+ Students", "200+ Courses", "99.9% Uptime"], stack: ["Next.js", "WebRTC", "Socket.io", "PostgreSQL"], desc: "Full LMS with live classes, quiz engine, and certificate generation." },
  { title: "Logistics REST API", cat: "backend", color: "#A78BFA", year: "2024", results: ["50K Req/Day", "99ms Latency", "99.8% Uptime"], stack: ["Node.js", "PostgreSQL", "Redis", "Docker"], desc: "Scalable API for shipment tracking and real-time driver location." },
  { title: "Hospital Management System", cat: "webapp", color: "#34D399", year: "2023", results: ["200 Bed Hospital", "60% Time Saved", "500+ Daily Users"], stack: ["React", "Node.js", "MySQL", "AWS"], desc: "Full hospital system with patient records, billing, and pharmacy." },
  { title: "Food Delivery PWA", cat: "ecommerce", color: "#FBBF24", year: "2023", results: ["3.2K Orders/Day", "4.8★ Rating", "1.8s Load"], stack: ["React", "Socket.io", "MongoDB", "PWA"], desc: "Progressive web app for cloud kitchen with real-time order tracking." },
];

/* Expose globally for projects page */
window.autoProjects = autoProjects;