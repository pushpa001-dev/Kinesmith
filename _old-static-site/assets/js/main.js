/* ==========================================================================
   KINESMITH — motion
   GSAP + ScrollTrigger, vendored locally. Transform/opacity only.
   Everything degrades to a plain visible page if GSAP fails to load.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';
  var body = document.body;

  /* ---------------- theme ---------------- */
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem('ks-theme');
    if (stored) root.setAttribute('data-theme', stored);
  } catch (e) {}

  var toggle = document.getElementById('themetoggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var attr = root.getAttribute('data-theme');
      var now = attr || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = now === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ks-theme', next); } catch (e) {}
    });
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------------- no-GSAP / reduced-motion fallback ---------------- */
  function revealAll() {
    body.classList.remove('preload');
    var els = document.querySelectorAll('[data-a]');
    for (var i = 0; i < els.length; i++) {
      els[i].style.opacity = '1';
      els[i].style.transform = 'none';
      var inner = els[i].querySelectorAll('.l > i, .person__name > span');
      for (var j = 0; j < inner.length; j++) inner[j].style.transform = 'none';
    }
  }

  if (!hasGSAP || reduced) {
    revealAll();
    initVideo();
    initLightbox();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- set initial states before first paint ---------------- */
  var lineInners = gsap.utils.toArray('[data-a="lines"] .l > i');
  var nameInners = gsap.utils.toArray('.person__name > span');
  var fades      = gsap.utils.toArray('[data-a="fade"]');
  var cards      = gsap.utils.toArray('[data-a="card"]');
  var rows       = gsap.utils.toArray('[data-a="row"]');
  var steps      = gsap.utils.toArray('[data-a="step"]');
  var tierEls    = gsap.utils.toArray('[data-a="tier"]');
  var people     = gsap.utils.toArray('[data-a="person"]');
  var player     = document.querySelector('[data-a="player"]');

  gsap.set(lineInners, { yPercent: 116 });
  gsap.set(nameInners, { yPercent: 110 });
  gsap.set(fades, { opacity: 0, y: 20 });
  gsap.set(cards, { opacity: 0, y: 44 });
  gsap.set(rows, { opacity: 0, y: 26 });
  gsap.set(steps, { opacity: 0, y: 26 });
  gsap.set(tierEls, { opacity: 0, y: 32 });
  gsap.set(people.map(function (p) { return p.querySelector('.person__i'); }), { opacity: 0 });
  gsap.set(people.map(function (p) { return [p.querySelector('.person__role'), p.querySelector('.person__line')]; }).flat(), { opacity: 0, y: 16 });
  if (player) gsap.set(player, { opacity: 0, y: 40, scale: 0.97 });

  body.classList.remove('preload');

  /* ---------------- hero load sequence ---------------- */
  var heroLines = gsap.utils.toArray('.hero__h1 .l > i');
  var heroFades = gsap.utils.toArray('.hero .eyebrow, .hero__sub, .hero__cta, .stats');

  var intro = gsap.timeline({
    defaults: { ease: 'expo.out' },
    delay: 0.12
  });

  intro
    .from('.nav', { y: -22, opacity: 0, duration: 0.9 }, 0)
    .to('.hero .eyebrow', { opacity: 1, y: 0, duration: 0.8 }, 0.15)
    .to(heroLines, { yPercent: 0, duration: 1.25, stagger: 0.075 }, 0.22)
    .to(player, { opacity: 1, y: 0, scale: 1, duration: 1.3 }, 0.42)
    .to('.hero__sub', { opacity: 1, y: 0, duration: 0.85 }, 0.72)
    .to('.hero__cta', { opacity: 1, y: 0, duration: 0.85 }, 0.82)
    .to('.stats', { opacity: 1, y: 0, duration: 0.85, onStart: runCounters }, 0.92);

  function runCounters() {
    gsap.utils.toArray('.stats [data-count]').forEach(function (el) {
      var end = parseFloat(el.getAttribute('data-count'));
      // A backgrounded tab freezes rAF mid-tween and would strand a wrong
      // number on screen. Only count when we can actually finish.
      if (document.hidden) { el.textContent = end; return; }
      var obj = { v: 0 };
      gsap.to(obj, {
        v: end, duration: 1.1, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(obj.v); },
        onComplete: function () { el.textContent = end; }
      });
    });
  }
  // if the visitor tabs away mid-intro, settle every counter on its real value
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) return;
    gsap.utils.toArray('.stats [data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  });

  /* ---------------- scroll-triggered reveals ---------------- */
  function batch(targets, vars, startPct) {
    if (!targets.length) return;
    ScrollTrigger.batch(targets, {
      start: 'top ' + (startPct || 88) + '%',
      once: true,
      onEnter: function (els) { gsap.to(els, vars); }
    });
  }

  // headings other than the hero
  gsap.utils.toArray('[data-a="lines"]').forEach(function (h) {
    if (h.closest('.hero')) return;
    var inners = h.querySelectorAll('.l > i');
    ScrollTrigger.create({
      trigger: h, start: 'top 86%', once: true,
      onEnter: function () {
        gsap.to(inners, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.085 });
      }
    });
  });

  batch(fades.filter(function (f) { return !f.closest('.hero'); }),
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 });
  batch(cards, { opacity: 1, y: 0, duration: 1.05, ease: 'expo.out', stagger: 0.09 }, 90);
  batch(rows,  { opacity: 1, y: 0, duration: 0.95, ease: 'expo.out', stagger: 0.1 });
  batch(steps, { opacity: 1, y: 0, duration: 0.85, ease: 'expo.out', stagger: 0.08 });
  batch(tierEls, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1 });

  // people — name wipes up, then the supporting text
  people.forEach(function (p) {
    var nm = p.querySelector('.person__name > span');
    var idx = p.querySelector('.person__i');
    var rest = [p.querySelector('.person__role'), p.querySelector('.person__line')];
    ScrollTrigger.create({
      trigger: p, start: 'top 84%', once: true,
      onEnter: function () {
        gsap.timeline({ defaults: { ease: 'expo.out' } })
          .to(idx, { opacity: 1, duration: 0.5 }, 0)
          .to(nm, { yPercent: 0, duration: 1.15 }, 0.05)
          .to(rest, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.34);
      }
    });
  });

  /* ---------------- parallax inside the card frames ---------------- */
  gsap.utils.toArray('.card__media').forEach(function (m) {
    var v = m.querySelector('video');
    if (!v) return;
    gsap.fromTo(v,
      { yPercent: -4, scale: 1.09 },
      {
        yPercent: 4, scale: 1.09, ease: 'none',
        scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: 1.1 }
      });
  });

  // hero player drifts slightly slower than the page
  if (player) {
    gsap.to(player, {
      yPercent: -7, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });
  }

  /* ---------------- marquee driven by scroll velocity ---------------- */
  (function marquee() {
    var track = document.getElementById('mq1');
    if (!track) return;
    var half = track.scrollWidth / 2;
    var x = 0, base = 0.55, dir = 1, boost = 0;

    var vel = ScrollTrigger.create({
      onUpdate: function (self) {
        dir = self.direction;                       // flip travel with scroll direction
        boost = Math.min(Math.abs(self.getVelocity()) / 260, 9);
      }
    });

    gsap.ticker.add(function () {
      x -= (base + boost) * dir;
      boost *= 0.93;                                 // ease back to the resting speed
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    });
    void vel;
  })();

  /* ---------------- scroll progress bar ---------------- */
  var bar = document.getElementById('progressbar');
  if (bar) {
    gsap.to(bar, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
  }

  /* ---------------- sticky nav ---------------- */
  ScrollTrigger.create({
    start: 26,
    onToggle: function (self) {
      document.getElementById('nav').classList.toggle('stuck', self.isActive);
    }
  });

  /* ---------------- magnetic buttons ---------------- */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    gsap.utils.toArray('.magnet').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' });
      var yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' });
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        xTo((e.clientX - (b.left + b.width / 2)) * 0.28);
        yTo((e.clientY - (b.top + b.height / 2)) * 0.4);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  initVideo();
  initLightbox();
  ScrollTrigger.refresh();

  /* ---------------- lazy video ---------------- */
  function initVideo() {
    var lazies = document.querySelectorAll('.lazyv');

    function attach(v) {
      if (v.dataset.loaded) return;
      var s = v.getAttribute('data-src');
      if (s) { v.src = s; v.dataset.loaded = '1'; }
    }

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < lazies.length; i++) { attach(lazies[i]); lazies[i].play().catch(noop); }
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { attach(v); v.play().catch(noop); }
        else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '250px 0px', threshold: 0.15 });
    for (var k = 0; k < lazies.length; k++) io.observe(lazies[k]);

    var hero = document.querySelector('.player__v');
    if (hero) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) hero.play().catch(noop); else hero.pause();
        });
      }, { threshold: 0.12 }).observe(hero);
    }
  }

  function noop() {}

  /* ---------------- lightbox ---------------- */
  function initLightbox() {
    var lb = document.getElementById('lb');
    var lbv = document.getElementById('lbv');
    var lbTitle = document.getElementById('lbtitle');
    var lbMeta = document.getElementById('lbmeta');
    var lbClose = document.getElementById('lbclose');
    if (!lb || !lbv) return;
    var lastFocus = null;

    lbv.addEventListener('loadedmetadata', function () {
      if (lbv.videoWidth && lbv.videoHeight) {
        lbv.style.aspectRatio = lbv.videoWidth + ' / ' + lbv.videoHeight;
      }
    });

    function open(src, title, meta) {
      lastFocus = document.activeElement;
      lbv.style.aspectRatio = '';
      lbv.src = src;
      lbTitle.textContent = title || '';
      lbMeta.textContent = meta || '';
      lb.hidden = false;
      body.classList.add('lock');

      if (hasGSAP && !reduced) {
        gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.fromTo(lb.querySelector('.lb__box'),
          { scale: 0.94, y: 18 },
          { scale: 1, y: 0, duration: 0.7, ease: 'expo.out' });
      } else {
        lb.style.opacity = '1';
      }
      lbv.play().catch(noop);
      if (lbClose) lbClose.focus();
    }

    function close() {
      if (lb.hidden) return;
      lbv.pause();
      var done = function () {
        lb.hidden = true;
        lbv.removeAttribute('src');
        lbv.load();
        body.classList.remove('lock');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      };
      if (hasGSAP && !reduced) {
        gsap.to(lb, { opacity: 0, duration: 0.32, ease: 'power2.in', onComplete: done });
      } else { done(); }
    }

    gsap.utils && gsap.utils.toArray ? null : null;
    var hits = document.querySelectorAll('.card__hit');
    for (var i = 0; i < hits.length; i++) {
      hits[i].addEventListener('click', function () {
        open(this.getAttribute('data-src'),
             this.getAttribute('data-title'),
             this.getAttribute('data-meta'));
      });
    }
    if (lbClose) lbClose.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && !lb.hidden) {
        var f = lb.querySelectorAll('button, video[controls]');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
})();
