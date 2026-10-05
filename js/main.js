/* =============================================================================
   main.js: language, theme, rendering of lists from content.js, small effects.
   ============================================================================= */
(function () {
'use strict';

var D = document, root = D.documentElement;
var I18N = window.I18N, CONTACTS = window.CONTACTS || {};
var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function $(sel, ctx) { return (ctx || D).querySelector(sel); }
function $$(sel, ctx) { return [].slice.call((ctx || D).querySelectorAll(sel)); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function get(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

/* ------------------------------------------------------------------ language */
function detectLang() {
  var q = /[?&]lang=(en|uk|ua)\b/.exec(location.search);
  if (q) return q[1] === 'ua' ? 'uk' : q[1];
  var saved = store('lang');
  if (saved === 'en' || saved === 'uk') return saved;
  var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
  return /^uk/i.test(nav) ? 'uk' : 'en';
}
var lang = detectLang();

/* ------------------------------------------------------------------ icons */
var ICONS = {
  calendar: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
  form: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3.5" width="14" height="17" rx="3"/><path d="M9 9h6M9 13h6M9 17h3"/></svg>',
  bag: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>',
  send: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></svg>'
};

/* ------------------------------------------------------------------ renderers */
function renderServices(t) {
  $('#svc-tg').innerHTML = t.services.tg.items.map(function (it) {
    return '<li class="chat-row"><span class="chat-row__ava" aria-hidden="true">' + (ICONS[it.icon] || '') + '</span>' +
      '<div><strong>' + esc(it.name) + '</strong><p>' + esc(it.text) + '</p></div></li>';
  }).join('');
  $('#svc-dc').innerHTML = t.services.dc.items.map(function (it) {
    return '<li class="chan"><strong><span aria-hidden="true">#</span>' + esc(it.name) + '</strong><p>' + esc(it.text) + '</p></li>';
  }).join('');
}

var selectedBot = 'fixit';
function renderBots(t) {
  var d = t.demos;
  $('#botlist').innerHTML = d.list.map(function (b) {
    var url = (CONTACTS.demos || {})[b.link];
    var tryTxt = b.platform === 'discord' ? d.tryDiscord : d.tryTelegram;
    var active = b.id === selectedBot;
    return '<li class="bot spot' + (active ? ' is-active' : '') + '" data-id="' + esc(b.id) + '">' +
      '<button type="button" class="bot__pick" aria-pressed="' + active + '">' +
        '<span class="bot__ava' + (b.platform === 'discord' ? ' bot__ava--dc' : '') + '" aria-hidden="true">' + (b.ava ? '<img src="' + esc(b.ava) + '" alt="" width="42" height="42" loading="lazy" decoding="async">' : esc(b.initial)) + '</span>' +
        '<span class="bot__name"><strong>' + esc(b.name) + '</strong><span class="bot__handle">' + esc(b.handle) + '</span></span>' +
      '</button>' +
      '<p class="bot__text">' + esc(b.text) + '</p>' +
      '<div class="bot__foot"><span class="tag">' + esc(b.tags[0]) + '</span>' +
        (url ? '<a class="try" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(tryTxt) + '</a>' : '') +
      '</div></li>';
  }).join('');
}

function renderProcess(t) {
  var steps = t.process.steps, html = '';
  steps.forEach(function (s, i) {
    html += '<li class="step rv"><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></li>';
    if (i === 1) html += '<li class="steps__pay rv" aria-hidden="false"><span>' + esc(t.process.payMarker) + '</span></li>';
  });
  $('#steps').innerHTML = html;
}

function renderPricing(t) {
  $('#prices').innerHTML = t.pricing.cards.map(function (c) {
    return '<div class="price spot rv"><h3>' + esc(c.name) + '</h3><p class="price__v">' + esc(c.price) + '</p><p>' + esc(c.text) + '</p></div>';
  }).join('');
}

function renderContact(t) {
  var tg = CONTACTS.telegram || {};
  var main = $('#contact-main');
  main.innerHTML = tg.url
    ? '<a class="compose" href="' + esc(tg.url) + '" target="_blank" rel="noopener"><span class="compose__txt"><small>' + esc(t.contact.write) + '</small><strong>' + esc(tg.label || 'Telegram') + '</strong></span><span class="compose__send">' + ICONS.send + '</span></a>'
    : '';
  var names = { instagram: 'Instagram', builtbybit: 'BuiltByBit', discord: 'Discord' };
  var links = Object.keys(names).filter(function (k) { return CONTACTS[k] && CONTACTS[k].url; }).map(function (k) {
    var c = CONTACTS[k];
    return '<a class="chip" href="' + esc(c.url) + '" target="_blank" rel="noopener"><b>' + names[k] + '</b>' + (c.label ? '<span>' + esc(c.label) + '</span>' : '') + '</a>';
  });
  $('#contact-more').innerHTML = links.length ? '<p class="contact__alt">' + esc(t.contact.more) + '</p><div class="chips">' + links.join('') + '</div>' : '';
}

function render() {
  var t = I18N[lang];
  root.lang = lang;
  D.title = t.meta.title;
  var md = $('meta[name="description"]'); if (md) md.setAttribute('content', t.meta.description);
  var og1 = $('meta[property="og:title"]'); if (og1) og1.setAttribute('content', t.meta.title);
  var og2 = $('meta[property="og:description"]'); if (og2) og2.setAttribute('content', t.meta.description);

  $$('[data-i18n]').forEach(function (n) { var v = get(t, n.getAttribute('data-i18n')); if (v != null) n.textContent = v; });
  $$('[data-i18n-attr]').forEach(function (n) {
    n.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var p = pair.split(':'), v = get(t, p[1]);
      if (v != null) n.setAttribute(p[0], v);
    });
  });
  $$('.seg [data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
  $('#foot-copy').textContent = t.footer.copy.replace('{year}', new Date().getFullYear());

  renderServices(t); renderBots(t); renderProcess(t); renderPricing(t); renderContact(t);
  observeReveals();
  if (window.FX) FX.refresh(t);
}

/* ------------------------------------------------------------------ theme */
function applyTheme(theme, save) {
  root.setAttribute('data-theme', theme);
  var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', theme === 'light' ? '#f5f5fb' : '#0d0e17');
  if (save) store('theme', theme);
}

/* ------------------------------------------------------------------ reveal on scroll */
var io = null;
function observeReveals() {
  var items = $$('.rv:not(.in)');
  if (!('IntersectionObserver' in window) || reduceQuery.matches) { items.forEach(function (n) { n.classList.add('in'); }); return; }
  root.classList.add('rv-on');
  if (!io) {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  }
  items.forEach(function (n) { io.observe(n); });
}

/* ------------------------------------------------------------------ demo players */
var heroPlayer, demoPlayer;
function initPlayers() {
  if (!window.Demo) return;
  var heroEl = $('#hero-player'), demoEl = $('#demo-player');
  if (heroEl) { heroPlayer = new Demo.Player(heroEl, { loop: true }); heroPlayer.load('blade', lang); }
  if (demoEl) { demoPlayer = new Demo.Player(demoEl, { loop: true }); demoPlayer.load(selectedBot, lang); }
}
function selectBot(id) {
  if (id === selectedBot) return;
  selectedBot = id;
  $$('#botlist .bot').forEach(function (li) {
    var on = li.getAttribute('data-id') === id;
    li.classList.toggle('is-active', on);
    $('.bot__pick', li).setAttribute('aria-pressed', String(on));
  });
  if (demoPlayer) demoPlayer.load(id, lang);
}

/* ------------------------------------------------------------------ events */
function bind() {
  $$('.seg [data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      if (l === lang) return;
      lang = l; store('lang', l);
      render();
      if (heroPlayer) heroPlayer.setLang(l);
      if (demoPlayer) demoPlayer.setLang(l);
    });
  });
  $('#theme-btn').addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
  });

  var nav = $('#nav'), tog = $('#nav-toggle');
  function closeNav() { nav.classList.remove('is-open'); tog.setAttribute('aria-expanded', 'false'); }
  tog.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    tog.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  $('#botlist').addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    var li = e.target.closest('.bot');
    if (li) selectBot(li.getAttribute('data-id'));
  });

  /* card spotlight + cursor glow: only with a real mouse, never with reduced motion */
  var glow = $('.glow'), raf = 0, px = 0, py = 0, tgt = null;
  if (finePointer && !reduceQuery.matches) {
    D.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX; py = e.clientY; tgt = e.target;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        if (glow) glow.style.transform = 'translate3d(' + (px - 350) + 'px,' + (py - 350) + 'px,0)';
        var card = tgt && tgt.closest ? tgt.closest('.spot') : null;
        if (card) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--sx', (px - r.left) + 'px');
          card.style.setProperty('--sy', (py - r.top) + 'px');
        }
      });
    }, { passive: true });
    if (glow) glow.classList.add('is-follow');
  }
}

/* ------------------------------------------------------------------ boot */
applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);
render();
bind();
initPlayers();
root.classList.add('ready');

})();
