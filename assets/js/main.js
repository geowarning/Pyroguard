/* =========================================================
   PyroGuard Forest Bot — interactions
   hero slider · counters · sticky header · mobile nav ·
   scroll reveal · video player · section highlight
   ========================================================= */
(function () {
  'use strict';

  /* ---------- hero slider ---------- */
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var dotsBox = document.getElementById('dots');
  var idx = 0;
  var timer = null;

  if (slides.length) {
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) b.className = 'is-on';
      b.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(b);
    });
  }

  function go(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-on', i === idx); });
    [].forEach.call(dotsBox.children, function (d, i) { d.classList.toggle('is-on', i === idx); });
  }
  function restart() {
    clearInterval(timer);
    if (slides.length > 1) timer = setInterval(function () { go(idx + 1); }, 7000);
  }

  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  if (prev) prev.addEventListener('click', function () { go(idx - 1); restart(); });
  if (next) next.addEventListener('click', function () { go(idx + 1); restart(); });
  restart();

  /* ---------- sticky header shadow ---------- */
  var hdr = document.getElementById('hdr');
  function onScroll() {
    if (!hdr) return;
    hdr.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 5, 4) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- counters ---------- */
  var nums = [].slice.call(document.querySelectorAll('[data-count]'));
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var start = null;
    var dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); io2.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io2.observe(n); });
  } else {
    nums.forEach(function (n) { n.textContent = n.getAttribute('data-count'); });
  }

  /* ---------- film ---------- */
  var film = document.querySelector('.film');
  var video = document.getElementById('promo');
  var play = document.getElementById('play');
  if (video) {
    var src = video.getAttribute('data-src');
    function load() {
      if (src && !video.src) { video.src = src; video.load(); }
    }
    function start() {
      load();
      video.setAttribute('controls', 'controls');
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      if (film) film.classList.add('is-playing');
    }
    if (play) play.addEventListener('click', start);
    video.addEventListener('play', function () { if (film) film.classList.add('is-playing'); });
    video.addEventListener('pause', function () {
      if (film && video.currentTime === 0) film.classList.remove('is-playing');
    });
    video.addEventListener('ended', function () { if (film) film.classList.remove('is-playing'); });

    if ('IntersectionObserver' in window) {
      var io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { load(); io3.disconnect(); } });
      }, { rootMargin: '300px' });
      io3.observe(video);
    }
  }

  /* ---------- nav highlight ---------- */
  var navLinks = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var targets = navLinks.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  if ('IntersectionObserver' in window && targets.length) {
    var io4 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = targets.indexOf(en.target);
        if (i < 0) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); });
        navLinks[i].classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { if (t) io4.observe(t); });
  }

  /* ---------- year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
