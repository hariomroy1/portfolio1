(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle
  var themeBtn = document.getElementById('theme-toggle');
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.getElementById('menu-toggle');
  var links = document.getElementById('nav-links');
  function closeMenu() {
    links.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // Nav border on scroll
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll + active nav link
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    var navLinks = {};
    links.querySelectorAll('a').forEach(function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = navLinks[en.target.id];
        if (a && en.isIntersecting) {
          Object.keys(navLinks).forEach(function (k) { navLinks[k].classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navLinks).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Project filters
  var filters = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      projects.forEach(function (p) {
        var tags = (p.getAttribute('data-tags') || '').split(' ');
        var show = f === 'all' || tags.indexOf(f) !== -1;
        p.classList.toggle('hidden', !show);
        if (show) p.classList.add('in');
      });
    });
  });

  // Copy email
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
  }
  var copyBtn = document.getElementById('copy-email');
  copyBtn.addEventListener('click', function () {
    var email = copyBtn.getAttribute('data-email');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(
        function () { showToast('Email copied to clipboard'); },
        function () { showToast(email); }
      );
    } else {
      showToast(email);
    }
  });
})();
