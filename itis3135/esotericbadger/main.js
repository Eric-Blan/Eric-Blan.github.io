/*
 * main.js — Esoteric Badger
 *
 * Three dynamic features:
 *  1. SPA section navigation (show/hide + active nav link)
 *  2. Product category filter (shop page)
 *  3. "What's Your Stone?" randomizer quiz (home page)
 *
 * Also handles: mobile nav toggle, contact form validation.
 */

// ── Helper ───────────────────────────────────────────────────
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

// ── 1. SPA Navigation ────────────────────────────────────────
// Shows the section matching the clicked nav link; hides all others.

const sections = $$('.page-section');
const navLinks = $$('nav a[data-section]');

function showSection(id) {
  sections.forEach(sec => sec.classList.toggle('active', sec.id === id));
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));

  // Update URL hash without triggering a page reload
  history.replaceState(null, '', '#' + id);

  // Move focus to the new section heading for accessibility
  const heading = $('#' + id + ' h2');
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
}

navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    showSection(a.dataset.section);

    // Close mobile nav if open
    const nav = $('nav');
    if (nav) nav.classList.remove('open');
  });
});

// Load the section from the URL hash on page load, defaulting to #home
(function initSection() {
  const hash = location.hash.replace('#', '');
  const valid = sections.some(s => s.id === hash);
  showSection(valid ? hash : 'home');
})();

// ── Mobile nav toggle ────────────────────────────────────────
const toggle = $('#nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const nav = $('nav');
    if (nav) nav.classList.toggle('open');
    toggle.textContent = nav && nav.classList.contains('open') ? '✕' : '☰';
    toggle.setAttribute('aria-expanded', String(nav && nav.classList.contains('open')));
  });
}

// ── 2. Product Category Filter ───────────────────────────────
// Filters .product-card elements by their data-category attribute.
// Selecting "All" shows every card.

const filterBtns = $$('.filter-btn');
const productCards = $$('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const cat = btn.dataset.filter;

    productCards.forEach(card => {
      if (cat === 'all' || card.dataset.category === cat) {
        card.removeAttribute('hidden');
      } else {
        card.setAttribute('hidden', '');
      }
    });
  });
});

// ── 3. "What's Your Stone?" Randomizer Quiz ──────────────────
// On button click, picks a random stone from the list and displays
// a short description. Each call cycles through a different stone.

const stones = [
  { name: 'Amethyst', emoji: '💜', note: 'for calm and clarity of mind' },
  { name: 'Black Tourmaline', emoji: '🖤', note: 'for protection and grounding' },
  { name: 'Rose Quartz', emoji: '🌸', note: 'for love and compassion' },
  { name: 'Citrine', emoji: '💛', note: 'for abundance and creative energy' },
  { name: 'Obsidian', emoji: '⬛', note: 'for truth and releasing negativity' },
  { name: 'Labradorite', emoji: '🌊', note: 'for intuition and transformation' },
  { name: 'Selenite', emoji: '🤍', note: 'for cleansing and higher guidance' },
  { name: 'Carnelian', emoji: '🟠', note: 'for courage and vitality' },
];

let lastStoneIndex = -1;

const quizBtn = $('#quiz-btn');
const quizResult = $('#quiz-result');

if (quizBtn && quizResult) {
  quizBtn.addEventListener('click', () => {
    // Pick a different stone from last time
    let idx;
    do { idx = Math.floor(Math.random() * stones.length); } while (idx === lastStoneIndex);
    lastStoneIndex = idx;

    const s = stones[idx];
    quizResult.textContent = s.emoji + '  ' + s.name + ' — ' + s.note;
    quizResult.setAttribute('aria-live', 'polite');
  });
}

// ── Contact form validation ───────────────────────────────────
const contactForm = $('#contact-form');
const formMsg = $('#form-msg');

if (contactForm && formMsg) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault(); // Prevent default browser submission

    const name  = $('#f-name').value.trim();
    const email = $('#f-email').value.trim();
    const msg   = $('#f-message').value.trim();

    // Basic client-side validation
    if (!name || !email || !msg) {
      formMsg.textContent = 'Please fill in all required fields.';
      formMsg.style.borderLeftColor = '#b5451b';
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      formMsg.textContent = 'Please enter a valid email address.';
      formMsg.style.borderLeftColor = '#b5451b';
      return;
    }

    // In a real site this would POST to a server — for now, show success
    formMsg.textContent = '✦  Your message has been received. We will respond within two moons.';
    formMsg.style.borderLeftColor = 'var(--sage)';
    contactForm.reset();
  });
}
