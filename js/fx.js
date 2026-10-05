/* Extra effects layer. Pure decoration: if this file fails, the site still works. */
(function () {
  'use strict';
  var D = document, root = D.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || D).querySelectorAll(s)); }

  /* ---- headline: split into words, brand words get a shimmer ---- */
  function splitTitle() {
    var h = $('.hero h1'); if (!h) return;
    var txt = h.textContent, i = 0;
    h.setAttribute('aria-label', txt);
    h.innerHTML = '';
    txt.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) { h.appendChild(D.createTextNode(' ')); return; }
      var s = D.createElement('span');
      s.className = 'w' + (/telegram|discord/i.test(part) ? ' hl' : '');
      s.style.setProperty('--i', i++);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = part;
      h.appendChild(s);
    });
  }

  /* ---- ticker: two copies so the loop is seamless ---- */
  function buildTicker(t) {
    var tr = $('#ticker .ticker__track'); if (!tr || !t || !t.ticker) return;
    var one = t.ticker.map(function (w) { var s = D.createElement('span'); s.textContent = w; return s.outerHTML; }).join('');
    tr.innerHTML = one + one;
  }

  /* ---- count-up for prices ("from $10" -> 0..10) ---- */
  var countIO = null;
  function countUps() {
    if (reduce.matches || !('IntersectionObserver' in window)) return;
    if (!countIO) countIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        countIO.unobserve(e.target); run(e.target);
      });
    }, { threshold: 0.6 });
    $$('.price__v').forEach(function (n) { if (/\d/.test(n.textContent)) countIO.observe(n); });
  }
  function run(n) {
    var src = n.textContent, m = src.match(/\d+/); if (!m) return;
    var to = +m[0], t0 = 0, dur = 900;
    function f(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      n.textContent = src.replace(m[0], String(Math.round(to * e)));
      if (k < 1) requestAnimationFrame(f); else n.textContent = src;
    }
    requestAnimationFrame(f);
  }

  /* ---- scroll: progress bar, process line, hero parallax ---- */
  var bar = $('.progress'), steps = null, orbs = $$('.orb'), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, h = root.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
      if (!reduce.matches && y < 1400) orbs.forEach(function (o, i) { o.style.translate = '0 ' + (y * (i ? -0.12 : 0.18)).toFixed(1) + 'px'; });
      steps = steps || $('.steps');
      if (steps) {
        var r = steps.getBoundingClientRect(), vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh * 0.62 - r.top) / r.height));
        steps.style.setProperty('--p', p.toFixed(3));
        $$('.step', steps).forEach(function (s) { s.classList.toggle('on', s.getBoundingClientRect().top < vh * 0.62); });
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---- ripple on buttons (all pointers) ---- */
  D.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.btn'); if (!b || reduce.matches) return;
    var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, s = D.createElement('span');
    s.className = 'ripple';
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    b.appendChild(s);
    setTimeout(function () { s.remove(); }, 700);
  });

  /* ---- mouse-only: magnetic buttons and 3D tilt ---- */
  if (fine && !reduce.matches) {
    $$('.btn--primary, .btn--ghost, .icon-btn').forEach(function (b) { b.classList.add('mag'); });
    D.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var m = e.target.closest && e.target.closest('.mag');
      $$('.mag.is-mag').forEach(function (n) { if (n !== m) { n.style.transform = ''; n.classList.remove('is-mag'); } });
      if (m) {
        var r = m.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        m.style.transform = 'translate(' + (dx * 10).toFixed(1) + 'px,' + (dy * 8).toFixed(1) + 'px)';
        m.classList.add('is-mag');
      }
    }, { passive: true });

    var tiltEls = $$('.hero__demo .player, #demo-player');
    tiltEls.forEach(function (el) {
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add('is-live');
        el.style.transform = 'perspective(1100px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('is-live'); el.style.transform = ''; });
    });
  }

  /* ---- confetti when a visitor finishes a scenario on their own ---- */
  var COLORS = ['#5b5bf5', '#a78bfa', '#38bdf8', '#f472b6', '#fbbf24', '#34d399'];
  function confetti(el) {
    if (reduce.matches) return;
    var r = el.getBoundingClientRect(), box = D.createElement('div');
    box.className = 'confetti';
    box.style.left = (r.left + r.width / 2) + 'px'; box.style.top = (r.top + r.height * 0.55) + 'px';
    for (var i = 0; i < 38; i++) {
      var p = D.createElement('i'), a = Math.random() * Math.PI * 2, v = 90 + Math.random() * 190;
      p.style.background = COLORS[i % COLORS.length];
      p.style.setProperty('--x', (Math.cos(a) * v).toFixed(0) + 'px');
      p.style.setProperty('--y', (Math.sin(a) * v + 140).toFixed(0) + 'px');
      p.style.setProperty('--r', ((Math.random() - 0.5) * 900).toFixed(0) + 'deg');
      p.style.setProperty('--d', (1.1 + Math.random() * 0.9).toFixed(2) + 's');
      box.appendChild(p);
    }
    D.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 2300);
  }
  D.addEventListener('demo:done', function (e) {
    if (e.detail && e.detail.mode === 'manual') confetti(e.target);
  });

  /* ---- called by main.js after every (re)render ---- */
  window.FX = {
    refresh: function (t) {
      splitTitle(); buildTicker(t); countUps(); onScroll();
    }
  };
  var t0 = window.I18N && window.I18N[root.lang];
  if (t0) window.FX.refresh(t0);
})();
