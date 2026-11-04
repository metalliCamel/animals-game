// Silnik przygody: rysuje scenę z danych przygody i daje jej proste API
// (mów, idź, nieś, potrząśnij, wygraj). Każda przygoda to osobny plik w src/adventures.
import { ART } from './art.js';
import { say, stopSpeech } from './speech.js';
import { ITEMS, itemPhrase } from './items.js';

const BACKGROUNDS = {
  meadow: `
    <div class="sunball"></div>
    <div class="cloud" style="top:10%;animation-delay:-8s"></div>
    <div class="cloud" style="top:22%;height:7%;animation-delay:-26s;animation-duration:55s"></div>
    <div class="ground"></div>`,
  pond: `
    <div class="sunball" style="right:22%;top:6%;width:9%"></div>
    <div class="cloud" style="top:14%;animation-delay:-18s"></div>
    <div class="ground"></div>
    <div class="water"></div>`,
  farm: `
    <div class="sunball"></div>
    <div class="cloud" style="top:12%;animation-delay:-30s"></div>
    <div class="hill"></div>
    <div class="ground farm-ground"></div>`,
  forest: `
    <div class="beam" style="left:20%"></div>
    <div class="beam" style="left:58%;animation-delay:-3s"></div>
    <div class="ground forest-ground"></div>`,
};

const HINT_AFTER_MS = 18000;

export function runScene(root, adv, ctx) {
  const timers = [];
  let busy = false;
  let carrying = null;
  let finished = false;
  let lastAct = Date.now();
  let hint = null;
  let bubbleTimer;
  const handlers = {};
  const els = {};
  const data = {};
  const walk = { maxB: 40, click: 48, ...(adv.walk || {}) };
  let dogPos = { ...(adv.dog || { x: 20, b: 10 }) };

  root.innerHTML = `<div class="scene bg-${adv.bg}">${BACKGROUNDS[adv.bg] || ''}</div>`;
  const scene = root.firstElementChild;

  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.innerHTML = '<span class="ic"></span><span class="t"></span><span class="tray"></span>';
  scene.appendChild(chip);

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.hidden = true;
  scene.appendChild(bubble);

  const z = (el, b) => { el.style.zIndex = String(Math.round(100 - b)); };

  function place(el, x, b, w) {
    el.style.left = x + '%';
    el.style.bottom = b + '%';
    if (w) el.style.width = w + '%';
    z(el, b);
  }

  // Postacie i rekwizyty
  for (const e of adv.entities) {
    const el = document.createElement(e.deco ? 'div' : 'button');
    el.className = 'ent' + (e.deco ? '' : ' hit');
    if (!e.deco) { el.type = 'button'; el.setAttribute('aria-label', e.label || e.id); }
    el.dataset.id = e.id;
    el.innerHTML = `<div class="art">${ART[e.art]}</div>`;
    place(el, e.x, e.b, e.w);
    scene.appendChild(el);
    els[e.id] = el;
    data[e.id] = e;
  }

  // Piesek
  const dog = document.createElement('div');
  dog.className = 'ent dog';
  dog.innerHTML = `<div class="flip"><div class="bob">${ART.dog}<div class="carry"></div></div></div>`;
  place(dog, dogPos.x, dogPos.b, 15);
  scene.appendChild(dog);
  els.dog = dog;
  const flip = dog.querySelector('.flip');
  const carrySlot = dog.querySelector('.carry');

  function face(left) { flip.style.transform = left ? 'scaleX(-1)' : 'none'; }

  // ---------- Plecak ----------
  // Zawartość plecaka żyje w zapisie gry (ctx.bag), więc przechodzi między miejscami.
  const bag = ctx.bag;
  let held = null; // przedmiot wyjęty z plecaka, który piesek trzyma w pysku
  const bagBtn = document.createElement('button');
  bagBtn.type = 'button';
  bagBtn.className = 'bagbtn';
  bagBtn.setAttribute('aria-label', 'Plecak');
  bagBtn.innerHTML = `<span class="bagart">${ART.backpack}</span><span class="bagcount" hidden></span>`;
  scene.appendChild(bagBtn);
  els.bag = bagBtn;
  const panel = document.createElement('div');
  panel.className = 'bagpanel';
  panel.hidden = true;
  scene.appendChild(panel);

  function bagCounts() {
    const c = {};
    for (const it of bag.items) c[it] = (c[it] || 0) + 1;
    return c;
  }
  function renderBag() {
    const n = bag.items.length;
    const badge = bagBtn.querySelector('.bagcount');
    badge.hidden = n === 0;
    badge.textContent = String(n);
    bagBtn.classList.toggle('holding', !!held);
  }
  function openBag() {
    const counts = bagCounts();
    const ids = Object.keys(counts);
    panel.innerHTML = ids.length
      ? ids.map((id) => `<button type="button" class="slot" data-item="${id}">${ART[ITEMS[id]?.art || id]}<span class="slotn">${counts[id] > 1 ? '×' + counts[id] : ''}</span></button>`).join('')
      : '<span class="empty">Pusto</span>';
    panel.hidden = false;
    say(ids.length ? 'W plecaku: ' + ids.map((id) => itemPhrase(id, counts[id])).join(', ') + '. Kliknij, żeby wyjąć.' : 'Plecak jest pusty.');
  }
  function holdFromBag(id) {
    held = id;
    carrying = id;
    carrySlot.innerHTML = ART[ITEMS[id]?.art || id];
    dog.classList.add('has');
    panel.hidden = true;
    renderBag();
  }
  function putBack() {
    if (!held) return;
    held = null;
    carrying = null;
    carrySlot.innerHTML = '';
    dog.classList.remove('has');
    renderBag();
  }
  bagBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (busy || finished) return;
    lastAct = Date.now();
    if (held) { putBack(); say('Schowane do plecaka.'); return; }
    if (!panel.hidden) { panel.hidden = true; return; }
    openBag();
  });
  panel.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const slot = ev.target.closest('.slot');
    if (!slot) { panel.hidden = true; return; }
    const id = slot.dataset.item;
    holdFromBag(id);
    const n = bagCounts()[id] || 0;
    say(n > 1 ? `Wyjmuję: ${itemPhrase(id, n)}. Komu je dać?` : 'Wyjęte! Komu to dać?');
  });

  // Przedmiot leci z miejsca na planszy do plecaka
  function flyToBag(fromId, art) {
    const sr = scene.getBoundingClientRect();
    const from = (els[fromId] || dog).getBoundingClientRect();
    const to = bagBtn.getBoundingClientRect();
    const it = document.createElement('div');
    it.className = 'flyitem';
    it.innerHTML = ART[art];
    const x0 = from.left + from.width / 2 - sr.left;
    const y0 = from.top + from.height / 3 - sr.top;
    it.style.left = x0 + 'px';
    it.style.top = y0 + 'px';
    scene.appendChild(it);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      it.style.transform = `translate(${to.left + to.width / 2 - sr.left - x0}px, ${to.top + to.height / 2 - sr.top - y0}px) scale(.5)`;
    }));
    return new Promise((res) => setTimeout(() => {
      it.remove();
      replay(bagBtn, 'gulp');
      res();
    }, 750));
  }
  renderBag();

  function walkTo(x, b) {
    x = Math.min(Math.max(x, 7), 93);
    b = Math.min(Math.max(b, 2), walk.maxB);
    const dx = x - dogPos.x;
    const dist = Math.hypot(dx, (b - dogPos.b) * 1.6);
    if (Math.abs(dx) > 0.5) face(dx < 0);
    const ms = Math.max(150, dist * 38);
    dog.style.transitionDuration = ms + 'ms';
    dog.classList.add('walk');
    place(dog, x, b);
    dog.style.zIndex = String(Math.round(100 - b) + 1);
    dogPos = { x, b };
    busy = true;
    return new Promise((res) => later(ms + 30, () => { dog.classList.remove('walk'); busy = false; res(); }));
  }

  // Podejście do postaci: staje obok, z tej strony, z której przyszedł
  async function approach(id) {
    const e = data[id];
    const w = e.w || 12;
    const fromLeft = dogPos.x <= e.x;
    const x = fromLeft ? e.x - (w / 2 + 6) : e.x + (w / 2 + 6);
    await walkTo(x, e.b - 2);
    face(!fromLeft);
  }

  function later(ms, fn) { const t = setTimeout(() => { if (!finished) fn(); }, ms); timers.push(t); return t; }

  function showBubble(id, short, full, icon) {
    const el = els[id];
    const r = el.getBoundingClientRect();
    const sr = scene.getBoundingClientRect();
    const cx = ((r.left + r.width / 2) - sr.left) / sr.width * 100;
    const top = (r.top - sr.top) / sr.height * 100;
    bubble.innerHTML = (icon ? `<span class="ic">${ART[icon]}</span>` : '') + '<span class="t"></span>';
    bubble.querySelector('.t').textContent = short;
    bubble.style.left = Math.min(Math.max(cx, 18), 82) + '%';
    bubble.style.top = Math.max(top, 14) + '%';
    bubble.hidden = false;
    say(full || short);
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 5500);
  }

  function sparkles(id, color) {
    const el = els[id];
    const sr = scene.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = ((r.left + r.width / 2) - sr.left) / sr.width * 100;
    const b = (sr.bottom - (r.top + r.height / 2)) / sr.height * 100;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('div');
      s.className = 'spark';
      s.innerHTML = `<svg viewBox="0 0 20 20"><path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" fill="${color || '#FFD25A'}"/></svg>`;
      s.style.left = x + '%';
      s.style.bottom = b + '%';
      const a = Math.random() * 6.28;
      const rad = 60 + Math.random() * 80;
      s.style.setProperty('--dx', Math.cos(a) * rad + 'px');
      s.style.setProperty('--dy', (-Math.abs(Math.sin(a)) * rad - 20) + 'px');
      scene.appendChild(s);
      setTimeout(() => s.remove(), 1200);
    }
  }

  function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  const api = {
    name: ctx.name,
    get carrying() { return carrying; },
    random: (n) => Math.floor(Math.random() * n),
    pick: (list) => list[Math.floor(Math.random() * list.length)],
    on(id, fn) { handlers[id] = fn; },
    say(id, short, full, icon) { showBubble(id, short, full, icon); },
    chip(icon, text, done) {
      chip.querySelector('.ic').innerHTML = icon ? ART[icon] : '';
      chip.querySelector('.t').textContent = text;
      chip.classList.toggle('done', !!done);
    },
    carry(art) { held = null; carrying = art; carrySlot.innerHTML = art ? ART[art] : ''; dog.classList.toggle('has', !!art); renderBag(); },
    // Plecak: add wkłada (z animacją z miejsca `fromId`), take wyjmuje na stałe
    bag: {
      async add(item, fromId) {
        await flyToBag(fromId, ITEMS[item]?.art || item);
        bag.items.push(item);
        bag.save();
        renderBag();
      },
      count: (item) => bag.items.filter((x) => x === item).length,
      has: (item, n = 1) => bag.items.filter((x) => x === item).length >= n,
      take(item, n = Infinity) {
        let taken = 0;
        bag.items = bag.items.filter((x) => { if (x === item && taken < n) { taken++; return false; } return true; });
        bag.save();
        if (held === item && !bag.items.includes(item)) putBack();
        renderBag();
        return taken;
      },
    },
    // Czy piesek trzyma przedmiot wyjęty z plecaka
    get held() { return held; },
    // Rząd ikon w zadaniu u góry (np. 3 orzechy do zebrania)
    tray(arts) {
      chip.querySelector('.tray').innerHTML = arts.map((a) => `<span class="clue${a.dim ? ' dim' : ''}">${ART[a.art || a]}</span>`).join('');
    },
    shake(id) { replay(els[id], 'shake'); },
    hop(id) { replay(els[id], 'happy'); },
    fade(id) { els[id].classList.add('searched'); },
    setArt(id, art) { els[id].querySelector('.art').innerHTML = ART[art]; },
    // Znaleziona wskazówka trafia do zadania u góry
    clue(art) {
      const c = document.createElement('span');
      c.className = 'clue';
      c.innerHTML = ART[art];
      chip.querySelector('.tray').appendChild(c);
    },
    // Dekoracja pojawiająca się w trakcie (np. ślady na trawie)
    spawn(id, art, x, b, w) {
      const el = document.createElement('div');
      el.className = 'ent appear';
      el.innerHTML = `<div class="art">${ART[art]}</div>`;
      place(el, x, b, w);
      scene.appendChild(el);
      els[id] = el;
      data[id] = { id, art, x, b, w, deco: true };
    },
    sparkles,
    later,
    wait: (ms) => new Promise((res) => later(ms, res)),
    // Przedmiot wyskakuje z kryjówki i ląduje obok, potem znika (piesek go bierze)
    popOut(id, art) {
      const e = data[id];
      const it = document.createElement('div');
      it.className = 'ent popitem';
      it.innerHTML = ART[art];
      place(it, e.x, e.b + 4, 6);
      it.style.zIndex = '150';
      scene.appendChild(it);
      requestAnimationFrame(() => requestAnimationFrame(() => { it.style.left = (e.x - 4) + '%'; it.style.bottom = (e.b - 1) + '%'; }));
      return new Promise((res) => later(700, () => { it.remove(); res(); }));
    },
    // Co pokazać, gdy dziecko utknie: postać się rusza, a ktoś podpowiada
    hint(id, short, full, speaker) { hint = id ? { id, short, full, speaker: speaker || id } : null; lastAct = Date.now(); },
    win(delay = 3000) {
      chip.classList.add('done');
      hint = null;
      later(delay, () => { finished = true; ctx.onWin(adv); });
    },
  };

  // Kliknięcia
  scene.addEventListener('click', async (ev) => {
    if (busy || finished) return;
    lastAct = Date.now();
    panel.hidden = true;
    const hit = ev.target.closest('.hit');
    if (hit) {
      const id = hit.dataset.id;
      if (handlers[id]) { await approach(id); handlers[id](id); }
      return;
    }
    const r = scene.getBoundingClientRect();
    const x = (ev.clientX - r.left) / r.width * 100;
    const b = (r.bottom - ev.clientY) / r.height * 100;
    if (b > walk.click) return; // niebo albo woda
    walkTo(x, b);
  });

  const hintLoop = setInterval(() => {
    if (finished || busy || !hint) return;
    if (Date.now() - lastAct > HINT_AFTER_MS) {
      lastAct = Date.now();
      replay(els[hint.id], 'hint');
      showBubble(hint.speaker, hint.short, hint.full);
    }
  }, 2000);

  adv.start(api);

  return function destroy() {
    finished = true;
    timers.forEach(clearTimeout);
    clearInterval(hintLoop);
    clearTimeout(bubbleTimer);
    stopSpeech();
    root.innerHTML = '';
  };
}
