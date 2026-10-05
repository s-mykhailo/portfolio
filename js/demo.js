/* =============================================================================
   demo.js: the animated messenger window.
   Plays a scenario from scenarios.js. The visitor can tap a button at any moment
   to take over; the dialogue then waits for taps and follows the same script.
   No dependencies. Respects prefers-reduced-motion (starts in "your turn" mode,
   no typing delays, no looping).
   ============================================================================= */
(function () {
'use strict';

var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
function reduced() { return reduceQuery.matches; }

/* ---------- text helpers ---------- */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function inline(s) {
  return s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\/\/(.+?)\/\//g, '<i>$1</i>');
}
/* **bold**, //italic//, "> quote" lines, \n = line break */
function fmt(text) {
  var lines = esc(text).split('\n'), out = [], quote = [], plain = [];
  function flushPlain() { if (plain.length) { out.push(inline(plain.join('<br>'))); plain = []; } }
  function flushQuote() { if (quote.length) { out.push('<blockquote>' + inline(quote.join('<br>')) + '</blockquote>'); quote = []; } }
  lines.forEach(function (l) {
    if (l.indexOf('&gt; ') === 0) { flushPlain(); quote.push(l.slice(5)); }
    else { flushQuote(); plain.push(l); }
  });
  flushPlain(); flushQuote();
  return out.join('');
}
function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function match(when, ctx) {
  for (var k in when) {
    var want = when[k], have = ctx[k];
    if (Array.isArray(want) ? want.indexOf(have) < 0 : have !== want) return false;
  }
  return true;
}

/* ---------- dates: tomorrow onwards, in the site language ---------- */
var WD = { uk: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
var MO = {
  uk: ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};
function dateLabel(lang, d) {
  var wd = WD[lang][d.getDay()], m = MO[lang][d.getMonth()];
  return lang === 'uk' ? d.getDate() + ' ' + m + ' (' + wd + ')' : m + ' ' + d.getDate() + ' (' + wd + ')';
}
function baseCtx(lang) {
  var ctx = {}, now = new Date();
  for (var i = 0; i < 6; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1 + i);
    ctx['d' + i] = dateLabel(lang, d);
  }
  return ctx;
}
function addMinutes(hhmm, mins) {
  var p = hhmm.split(':'), t = (+p[0]) * 60 + (+p[1]) + mins;
  var h = Math.floor(t / 60) % 24, m = t % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

/* ============================================================== Player === */
function Player(root, opts) {
  this.root = root;
  this.opts = opts || {};
  this.lang = 'en';
  this.id = null;
  this.sc = null;
  this.ctx = {};
  this.mode = 'auto';
  this.tok = 0;
  this.timers = [];
  this.visible = false;
  this.started = false;
  this.gateWaiters = [];
  this.pending = null;
  this.lastBot = null;
  this.toastTimer = 0;
  this.build();
}

Player.prototype.ui = function () { return window.I18N[this.lang].demos; };

Player.prototype.build = function () {
  var self = this;
  this.frame = el('div', 'messenger');
  this.head = el('div', 'm-head');
  this.chat = el('div', 'm-chat');
  this.chat.setAttribute('role', 'log');
  this.chat.setAttribute('aria-live', 'off');
  this.foot = el('div', 'm-foot');
  this.composer = el('div', 'm-composer');
  this.input = el('span', 'm-input');
  this.inputTxt = el('span', 'm-input__txt');
  this.input.appendChild(this.inputTxt);
  this.send = el('span', 'm-send');
  this.send.setAttribute('aria-hidden', 'true');
  this.composer.appendChild(this.input);
  this.composer.appendChild(this.send);
  this.foot.appendChild(this.composer);
  this.toastEl = el('div', 'm-toast');
  this.toastEl.setAttribute('role', 'status');
  this.frame.appendChild(this.head);
  this.frame.appendChild(this.chat);
  this.frame.appendChild(this.foot);
  this.frame.appendChild(this.toastEl);

  this.ctl = el('div', 'player__ctl');
  this.status = el('span', 'player__status');
  this.replayBtn = el('button', 'link-btn');
  this.replayBtn.type = 'button';
  this.autoBtn = el('button', 'link-btn');
  this.autoBtn.type = 'button';
  this.autoBtn.hidden = true;
  this.ctl.appendChild(this.status);
  this.ctl.appendChild(this.replayBtn);
  this.ctl.appendChild(this.autoBtn);

  this.root.innerHTML = '';
  this.root.appendChild(this.frame);
  this.root.appendChild(this.ctl);

  this.frame.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.kbtn, .rbtn, .dbtn') : null;
    if (t && self.frame.contains(t)) self.press(t, false);
  });
  this.replayBtn.addEventListener('click', function () { self.restart(true); });
  this.autoBtn.addEventListener('click', function () { self.setMode('auto'); });
  document.addEventListener('visibilitychange', function () { self.updateGate(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      self.visible = entries[0].isIntersecting;
      self.updateGate();
    }, { threshold: 0.2 }).observe(this.root);
  } else {
    this.visible = true;
  }
};

/* ---------- timing / gate ---------- */
Player.prototype.sleep = function (ms) {
  var self = this;
  return new Promise(function (res) {
    if (!ms) { res(); return; }
    self.timers.push(setTimeout(res, ms));
  });
};
Player.prototype.clearTimers = function () {
  this.timers.forEach(clearTimeout);
  this.timers = [];
};
Player.prototype.isActive = function () { return this.visible && !document.hidden; };
Player.prototype.updateGate = function () {
  if (!this.isActive()) return;
  var w = this.gateWaiters; this.gateWaiters = [];
  w.forEach(function (f) { f(); });
  if (this.sc && !this.started) this.play();
};
Player.prototype.gate = function () {
  var self = this;
  return new Promise(function (res) {
    if (self.isActive()) res(); else self.gateWaiters.push(res);
  });
};

/* ---------- load / reset ---------- */
Player.prototype.load = function (id, lang) {
  if (lang) this.lang = lang;
  if (id) this.id = id;
  var sc = window.SCENARIOS[this.lang][this.id];
  if (!sc) return;
  this.sc = sc;
  this.frame.className = 'messenger ' + (sc.platform === 'dc' ? 'dc' : 'tg');
  this.chat.setAttribute('aria-label', this.ui().label || '');
  this.replayBtn.textContent = this.ui().replay;
  this.autoBtn.textContent = this.ui().auto;
  this.restart(false);
};
Player.prototype.setLang = function (lang) {
  this.lang = lang;
  if (this.id) this.load();
};
Player.prototype.reset = function () {
  this.clearTimers();
  this.tok++;
  this.gateWaiters = [];
  this.pending = null;
  this.lastBot = null;
  this.started = false;
  this.ctx = baseCtx(this.lang);
  this.chat.innerHTML = '';
  this.inputTxt.textContent = '';
  this.showComposer();
  this.channel = this.sc.bot.channel || '';
  this.renderHead(false);
};
Player.prototype.restart = function (userAsked) {
  this.reset();
  this.setMode(reduced() ? 'manual' : 'auto', true);
  this.setStatus(this.mode);
  if (this.isActive()) this.play();
};

/* ---------- header / composer / status ---------- */
Player.prototype.renderHead = function (typing) {
  var bot = this.sc.bot, ui = this.ui();
  if (this.sc.platform === 'dc') {
    this.head.innerHTML = '<span class="m-hash" aria-hidden="true">#</span><strong>' + esc(this.channel) + '</strong>';
    this.inputTxt.setAttribute('data-ph', ui.input + ' #' + this.channel);
  } else {
    this.head.innerHTML = '<span class="m-ava" aria-hidden="true">' + (bot.ava ? '<img src="' + esc(bot.ava) + '" alt="" width="38" height="38" decoding="async">' : esc(bot.initial)) + '</span>' +
      '<span class="m-title"><strong>' + esc(bot.name) + '</strong><span class="m-sub' + (typing ? ' is-typing' : '') + '">' + esc(typing ? ui.typing : 'bot') + '</span></span>' +
      '<span class="m-more" aria-hidden="true"><i></i><i></i><i></i></span>';
    this.inputTxt.setAttribute('data-ph', ui.input);
  }
};
Player.prototype.setTyping = function (on) {
  if (this.sc.platform === 'dc') return;
  var sub = this.head.querySelector('.m-sub');
  if (!sub) return;
  sub.textContent = on ? this.ui().typing : 'bot';
  sub.classList.toggle('is-typing', on);
};
Player.prototype.showComposer = function () {
  this.foot.innerHTML = '';
  this.foot.appendChild(this.composer);
};
Player.prototype.setMode = function (mode, silent) {
  this.mode = mode;
  if (mode === 'manual') this.clearTimers();
  if (!silent) {
    this.setStatus(mode);
    if (mode === 'auto' && this.pending) this.autoPress(this.pending);
  }
};
Player.prototype.setStatus = function (state) {
  var ui = this.ui();
  this.status.textContent = state === 'manual' ? ui.statusManual : state === 'done' ? ui.statusDone : ui.statusAuto;
  this.status.setAttribute('data-state', state);
  this.autoBtn.hidden = !(state === 'manual');
};
Player.prototype.toast = function (text) {
  var t = this.toastEl, self = this;
  t.textContent = text;
  t.classList.add('is-on');
  clearTimeout(this.toastTimer);
  this.toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 1700);
};
Player.prototype.scroll = function () {
  var c = this.chat;
  if (c.scrollTo && !reduced()) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
  else c.scrollTop = c.scrollHeight;
};

/* ---------- token resolving ---------- */
Player.prototype.res = function (s) {
  var ctx = this.ctx;
  return String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) { return ctx[k] != null ? ctx[k] : ''; });
};
Player.prototype.applyV = function (v) {
  if (!v) return;
  for (var k in v) this.ctx[k] = this.res(v[k]);
  if (this.ctx.time && this.ctx.dur) this.ctx.end = addMinutes(this.ctx.time, +this.ctx.dur);
};

/* ============================================================== the loop == */
Player.prototype.play = function () {
  var self = this, tok = this.tok, steps = this.sc.steps;
  this.started = true;
  (async function () {
    for (var i = 0; i < steps.length; i++) {
      var st = steps[i];
      if (st.when && !match(st.when, self.ctx)) continue;
      await self.gate();
      if (self.tok !== tok) return;
      if (st.k === 'user') await self.stepUser(st);
      else if (st.k === 'chan') await self.stepChan(st);
      else await self.stepBot(st);
      if (self.tok !== tok) return;
    }
    self.finish(tok);
  })();
};
Player.prototype.finish = async function (tok) {
  this.setStatus('done');
  this.root.dispatchEvent(new CustomEvent('demo:done', { bubbles: true, detail: { mode: this.mode } }));
  if (this.opts.loop === false || reduced() || this.mode !== 'auto') return;
  await this.sleep(this.opts.loopDelay || 5500);
  if (this.tok !== tok) return;
  await this.gate();
  if (this.tok !== tok) return;
  this.restart(false);
};

/* ============================================================= user side == */
Player.prototype.typeText = async function (text) {
  var tok = this.tok, node = this.inputTxt;
  if (reduced()) { node.textContent = text; return; }
  var speed = text.length > 30 ? 14 : 48;
  for (var i = 1; i <= text.length; i++) {
    node.textContent = text.slice(0, i);
    await this.sleep(speed);
    if (this.tok !== tok) return;
  }
  await this.sleep(260);
};
Player.prototype.addUser = function (text, st) {
  var node;
  if (this.sc.platform === 'dc') {
    node = this.dcMessage({ who: (st && st.who) || 'you', human: true, text: esc(text) });
  } else {
    node = el('div', 'row user pop');
    var b = el('div', 'bubble');
    if (st && st.photo) b.appendChild(el('div', 'm-photo ' + st.photo));
    if (text) b.appendChild(el('div', 'm-text', esc(text)));
    node.appendChild(b);
  }
  this.chat.appendChild(node);
  this.scroll();
};
Player.prototype.stepUser = async function (st) {
  var tok = this.tok, text = this.res(st.t);
  if (text) await this.typeText(text); else await this.sleep(reduced() ? 0 : 700);
  if (this.tok !== tok) return;
  this.inputTxt.textContent = '';
  this.addUser(text, st);
  this.applyV(st.v);
  await this.sleep(reduced() ? 0 : 380);
};
Player.prototype.stepChan = async function (st) {
  this.channel = this.res(st.name);
  this.renderHead(false);
  this.chat.innerHTML = '';
  this.lastBot = null;
  await this.sleep(reduced() ? 0 : 700);
};

/* ============================================================== bot side == */
Player.prototype.buildKb = function (rows, box, dc) {
  var self = this;
  rows.forEach(function (r) {
    var line = el('div', dc ? 'dbtns' : 'kb__row');
    r.forEach(function (b) {
      if (b.when && !match(b.when, self.ctx)) return;
      var cls = dc ? 'dbtn' + (b.s === 'p' ? ' dbtn--p' : '') : 'kbtn';
      if (b.off) cls += ' is-off';
      var be = el('button', cls);
      be.type = 'button';
      be.textContent = self.res(b.t);
      if (b.dis) { be.disabled = true; be.classList.add('is-dis'); }
      be._b = b;
      line.appendChild(be);
    });
    if (line.children.length) box.appendChild(line);
  });
};
Player.prototype.dcMessage = function (o) {
  var m = el('div', 'dmsg pop' + (o.eph ? ' is-eph' : ''));
  var now = new Date(), hh = now.getHours(), mm = now.getMinutes();
  var time = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
  var initial = (o.who || '?').charAt(0).toUpperCase();
  m.innerHTML = '<span class="dava' + (o.human ? '' : ' dava--bot') + '" aria-hidden="true">' + esc(initial) + '</span>' +
    '<div class="dbody"><div class="dname"><b>' + esc(o.who) + '</b>' + (o.human ? '' : '<span class="dtag">BOT</span>') + '<time>' + time + '</time></div>' +
    '<div class="dtxt">' + (o.html || o.text || '') + '</div></div>';
  return m;
};
Player.prototype.renderDc = function (st) {
  var text = fmt(this.res(st.t)), who = st.who || this.sc.bot.name, html;
  if (st.embed) html = '<div class="dembed"><div class="dembed__t">' + esc(this.res(st.embed.title)) + '</div><div>' + text + '</div></div>';
  else html = text;
  var m = this.dcMessage({ who: who, human: !!st.human, html: html, eph: st.eph });
  if (st.eph) {
    var note = el('div', 'deph', '👁 ' + esc(this.ui().eph));
    m.querySelector('.dbody').appendChild(note);
  }
  if (st.kb) {
    var box = el('div', 'dkb');
    this.buildKb(st.kb, box, true);
    m.querySelector('.dbody').appendChild(box);
  }
  this.chat.appendChild(m);
  return m;
};
Player.prototype.renderTg = function (st, edit) {
  var row = edit ? this.lastBot.row : el('div', 'row bot pop');
  row.innerHTML = '';
  row.classList.remove('is-locked');
  row.classList.toggle('has-kb', !!st.kb);
  var bubble = el('div', 'bubble');
  if (st.photo) bubble.appendChild(el('div', 'm-photo ' + st.photo));
  bubble.appendChild(el('div', 'm-text', fmt(this.res(st.t))));
  row.appendChild(bubble);
  if (st.kb) {
    var kb = el('div', 'kb');
    this.buildKb(st.kb, kb, false);
    row.appendChild(kb);
  }
  if (edit) { row.classList.remove('swap'); void row.offsetWidth; row.classList.add('swap'); }
  else this.chat.appendChild(row);
  this.lastBot = { row: row };
  return row;
};
Player.prototype.typingNode = function () {
  var n;
  if (this.sc.platform === 'dc') {
    n = el('div', 'dtyping', '<span class="dots"><i></i><i></i><i></i></span><b>' + esc(this.sc.bot.name) + '</b> ' + esc(this.ui().typingDc));
  } else {
    n = el('div', 'row bot typing', '<div class="bubble"><span class="dots"><i></i><i></i><i></i></span></div>');
  }
  this.chat.appendChild(n);
  this.scroll();
  return n;
};

Player.prototype.stepBot = async function (st) {
  var tok = this.tok, dc = this.sc.platform === 'dc';
  var edit = !!st.edit && !dc && this.lastBot && this.lastBot.row.isConnected;
  var wait = reduced() ? 0 : (edit ? 520 : Math.min(1500, 520 + this.res(st.t).length * 7));
  var typing = null;
  if (wait) {
    this.setTyping(true);
    if (!edit) typing = this.typingNode();
  }
  await this.sleep(wait);
  if (this.tok !== tok) return;
  if (typing) typing.remove();
  this.setTyping(false);

  var node = dc ? this.renderDc(st) : this.renderTg(st, edit);
  this.scroll();

  if (st.kb) {
    await this.awaitPick(node, st);
  } else if (st.reply) {
    var panel = el('div', 'm-reply');
    this.buildKb(st.reply, panel, false);
    [].forEach.call(panel.querySelectorAll('.kbtn'), function (b) { b.className = b.className.replace('kbtn', 'rbtn'); });
    this.foot.innerHTML = '';
    this.foot.appendChild(panel);
    var picked = await this.awaitPick(panel, st);
    if (this.tok !== tok) return;
    this.showComposer();
    this.addUser(this.res((picked && (picked.echo || picked.t)) || ''), null);
  }
  if (this.tok !== tok) return;
  await this.sleep(reduced() ? 0 : (st.after || (st.kb || st.reply ? 380 : 650)));
};

/* ---------- waiting for a button: the auto-player or the visitor ---------- */
Player.prototype.awaitPick = function (node, st) {
  var self = this;
  return new Promise(function (resolve) {
    /* nothing scripted to press (e.g. only "not in this preview" buttons): move on */
    var scripted = [].some.call(node.querySelectorAll('.kbtn, .rbtn, .dbtn'), function (e) { return e._b && e._b.def; });
    if (!scripted) { resolve(null); return; }
    var p = self.pending = { el: node, st: st, resolve: function (b) { self.pending = null; resolve(b); } };
    if (self.mode === 'manual') self.setStatus('manual');
    else self.autoPress(p);
  });
};
Player.prototype.autoPress = function (p) {
  var self = this;
  (async function () {
    var all = [].slice.call(p.el.querySelectorAll('.kbtn, .rbtn, .dbtn')).filter(function (e) {
      return e._b && e._b.def && !e.classList.contains('is-done');
    });
    var queue = all.filter(function (e) { return e._b.keep; }).concat(all.filter(function (e) { return !e._b.keep; }).slice(0, 1));
    for (var i = 0; i < queue.length; i++) {
      await self.sleep(i === 0 ? 1300 : 800);
      if (self.mode !== 'auto' || self.pending !== p) return;
      queue[i].classList.add('is-press');
      await self.sleep(230);
      if (self.mode !== 'auto' || self.pending !== p) return;
      self.press(queue[i], true);
    }
  })();
};
Player.prototype.press = function (btnEl, auto) {
  var p = this.pending, b = btnEl._b;
  if (!p || !b || !p.el.contains(btnEl) || b.dis || btnEl.classList.contains('is-done')) return;
  if (b.off) { this.toast(this.ui().notScripted); return; }
  if (!auto && this.mode === 'auto') this.setMode('manual');
  btnEl.classList.add('is-press');
  setTimeout(function () { btnEl.classList.remove('is-press'); }, 260);
  this.applyV(b.v);
  if (b.toast) this.toast(b.toast);
  if (b.keep) { btnEl.classList.add('is-done'); return; }
  btnEl.classList.add('is-picked');
  p.el.classList.add('is-locked');
  p.resolve(b);
};

window.Demo = { Player: Player };
})();
