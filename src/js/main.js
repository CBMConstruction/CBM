import {
  createIcons,
  ArrowRight, Award, Building2, CheckCircle, ChevronDown,
  Droplets, Hammer, HeartHandshake, Home, Image, Key,
  Layers, Lightbulb, Mail, MapPin, Paintbrush, Phone,
  PlayCircle, RefreshCw, Send, ShieldCheck, Thermometer,
  TrendingUp, Users, Wrench, Zap,
} from 'lucide';

// ── Lucide icons ──
createIcons({
  icons: {
    ArrowRight, Award, Building2, CheckCircle, ChevronDown,
    Droplets, Hammer, HeartHandshake, Home, Image, Key,
    Layers, Lightbulb, Mail, MapPin, Paintbrush, Phone,
    PlayCircle, RefreshCw, Send, ShieldCheck, Thermometer,
    TrendingUp, Users, Wrench, Zap,
  },
});

// ── Nav: scroll effect + active-page mark ──
const nav = document.getElementById('site-nav');
if (nav) {
  const hasHero = !!document.getElementById('hero');
  if (!hasHero) nav.classList.add('scrolled');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  const currentFile = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

// ── Mobile menu ──
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ── Hero entry animation ──
['anim-hero-1', 'anim-hero-2', 'anim-hero-3', 'anim-hero-4'].forEach((cls, i) => {
  const el = document.querySelector('.' + cls);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  setTimeout(() => {
    el.style.transition = 'all 0.9s cubic-bezier(0.16,1,0.3,1)';
    el.style.opacity = '1';
    el.style.transform = 'none';
  }, 200 + i * 120);
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left').forEach(el => revealObserver.observe(el));

// ── Stats counter (homepage + about) ──
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / 1800, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ── Ticker (homepage only) ──
const tickerInner = document.getElementById('ticker-inner');
if (tickerInner) {
  const items = [
    'Residential Property Maintenance',
    'Commercial Building Services',
    'Domestic Services',
    'Facilities Management',
    'Joinery & Carpentry',
    'Plumbing & Heating',
    'Painting & Decorating',
    'Full Renovations',
    'End-of-Tenancy Repairs',
    'Edinburgh & Lothians',
    'Trusted Since 2014',
    'Professional · Reliable · Innovative',
  ];
  let html = '';
  for (let r = 0; r < 4; r++) {
    items.forEach(item => {
      html += `<span class="ticker-item">${item}<span class="ticker-dot"></span></span>`;
    });
  }
  tickerInner.innerHTML = html;
}

// ── Homepage simple form ──
window.handleSubmit = function (e) {
  e.preventDefault();
  const success = document.getElementById('form-success');
  if (success) success.style.display = 'block';
  e.target.reset();
};

// ── Contact page: service chips ──
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
    const sel = document.getElementById('selected-service');
    if (sel) sel.value = chip.dataset.value;
  });
});

// Pre-select chip from URL query param ?service=...
const urlService = new URLSearchParams(location.search).get('service');
if (urlService) {
  const chip = document.querySelector(`.chip[data-value="${urlService}"]`);
  if (chip) {
    chip.classList.add('selected');
    const sel = document.getElementById('selected-service');
    if (sel) sel.value = urlService;
  }
}

// ── Contact page: full form with validation ──
window.submitForm = function (e) {
  e.preventDefault();
  const form = e.target;
  let valid = true;
  form.querySelectorAll('[required]').forEach(f => {
    if (!f.value.trim() && !f.checked) valid = false;
  });
  const errEl = document.getElementById('form-error');
  const succEl = document.getElementById('form-success');
  if (!valid) {
    if (errEl) errEl.style.display = 'block';
    if (succEl) succEl.style.display = 'none';
    return;
  }
  if (errEl) errEl.style.display = 'none';
  if (succEl) succEl.style.display = 'block';
  form.reset();
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
};

// ── FAQ accordion (contact page) ──
window.toggleFaq = function (el) {
  const item = el.parentElement;
  const answer = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    const a = i.querySelector('.faq-a');
    if (a) a.classList.remove('open');
  });
  if (!isOpen && answer) {
    item.classList.add('open');
    answer.classList.add('open');
  }
};

// ── FAQ grid layout (contact page) ──
function checkFaqLayout() {
  const outer = document.querySelector('.faq-outer');
  if (!outer) return;
  outer.style.gridTemplateColumns = window.innerWidth < 900 ? '1fr' : '1fr 1.8fr';
}
checkFaqLayout();
window.addEventListener('resize', checkFaqLayout);
