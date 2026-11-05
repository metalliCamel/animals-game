// Mapa regionu: miejsca połączone ścieżką i drogowskaz do innego regionu.
// Piesek idzie do wybranego miejsca i zaczyna się przygoda.
import { ART } from './art.js';
import { say, stopSpeech } from './speech.js';

export function placeState(place, save) {
  if (place.soon) return 'soon';
  if (!place.adventure) return save.done.includes(place.questDone) ? 'done' : 'open';
  if (save.done.includes(place.adventure)) return 'done';
  if (!place.after || save.done.includes(place.after)) return 'open';
  return 'locked';
}

export function runMap(root, ctx) {
  const { save, region } = ctx;
  const places = region.places;
  const quest = ctx.quest; // przygoda wieloetapowa w tym regionie (albo null)
  let busy = false;
  const timers = [];
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));

  const pts = places.map((p) => `${p.x},${p.y}`).join(' ');
  const deco = region.theme === 'beach'
    ? `<div class="map-sea"></div><div class="map-blob" style="left:6%;top:56%;width:30%;background:#F7E2B4"></div>`
    : region.theme === 'volcano'
      ? `<div class="map-volcano"></div><div class="map-blob" style="left:4%;top:50%;width:30%;background:#7FC75A"></div><div class="map-lava"></div>`
      : region.theme === 'mountains'
    ? `<div class="map-peak" style="left:30%;top:6%;width:30%"></div><div class="map-peak" style="left:58%;top:2%;width:34%"></div><div class="map-lake"></div>`
    : `<div class="map-water"></div><div class="map-blob" style="left:58%;top:8%;width:30%"></div><div class="map-blob" style="left:4%;top:44%;width:26%"></div>`;
  root.innerHTML = `
    <div class="map theme-${region.theme}">
      ${deco}
      <svg class="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="${pts}" fill="none" stroke="#FFFBF0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".9"/>
        <polyline points="${pts}" fill="none" stroke="#C9A06A" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="map-region">${region.title}</div>
      <div class="map-title">Dokąd idziemy?</div>
    </div>`;
  const map = root.firstElementChild;

  const btns = {};
  for (const p of places) {
    const st = placeState(p, save);
    const todo = quest && quest.todo(p.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `place ${st}${todo ? ' quest' : ''}`;
    b.style.left = p.x + '%';
    b.style.top = p.y + '%';
    b.setAttribute('aria-label', p.label);
    b.innerHTML = `
      <span class="disc">${ART[p.icon]}${st === 'locked' || st === 'soon' ? `<span class="badge lock">${ART.lock}</span>` : ''}${st === 'done' ? `<span class="badge">${ART.star}</span>` : ''}${todo ? `<span class="qbadge">${ART.balloons}</span>` : ''}</span>
      <span class="label">${p.label}</span>`;
    b.addEventListener('click', () => pick(p, st));
    map.appendChild(b);
    btns[p.id] = b;
  }

  // Drogowskazy do sąsiednich regionów (albo „wkrótce”)
  const gates = region.gates || [];
  const gateBtns = [];
  for (const gate of gates) {
    const open = !gate.soon && (!gate.after || save.done.includes(gate.after));
    const calls = open && ctx.gateCalls(gate.to);
    const g = document.createElement('button');
    g.type = 'button';
    g.className = `gate${open ? '' : ' locked'}${calls ? ' quest' : ''}`;
    g.style.left = gate.x + '%';
    g.style.top = gate.y + '%';
    g.setAttribute('aria-label', `Drogowskaz: ${gate.label}`);
    g.innerHTML = `<span class="sign"><span class="sign-ic">${ART[gate.icon]}</span><span class="sign-t">${gate.label}</span></span><span class="post"></span>${open ? '' : `<span class="badge lock">${ART.lock}</span>`}${calls ? `<span class="qbadge">${ART.balloons}</span>` : ''}`;
    g.addEventListener('click', () => {
      if (busy) return;
      if (!open) { say(gate.lockedText || 'Ta droga jest jeszcze zamknięta.'); bump(g); return; }
      busy = true;
      say(`Idziemy: ${gate.label}!`);
      movePup(gate);
      later(1100, () => ctx.onTravel(gate.to));
    });
    map.appendChild(g);
    gateBtns.push({ gate, el: g, calls });
  }
  const calling = gateBtns.find((x) => x.calls);

  // Piesek stoi przy ostatnio odwiedzonym miejscu albo przy drogowskazie, jeśli właśnie przyszedł
  const back = ctx.fromGate && gates.find((g) => g.to === ctx.fromGate);
  const here = places.find((p) => p.id === ctx.at) || back || places[0];
  const pup = document.createElement('div');
  pup.className = 'map-pup';
  pup.innerHTML = ART.pupFace;
  map.appendChild(pup);
  movePup(here, true);

  function movePup(p, instant) {
    pup.style.transitionDuration = instant ? '0ms' : '900ms';
    pup.style.left = p.x + '%';
    pup.style.top = (p.y - 15) + '%';
  }

  function pick(p, st) {
    if (busy) return;
    if (st === 'soon') { say(`${p.label}. Tu jeszcze budujemy. Wkrótce!`); bump(btns[p.id]); return; }
    if (st === 'locked') {
      const prev = places.find((x) => x.adventure === p.after);
      say(`${p.label} jest jeszcze zamknięty. Najpierw pomóż zwierzątkom: ${prev ? prev.label : ''}!`);
      bump(btns[p.id]);
      return;
    }
    busy = true;
    say(p.label + '!');
    movePup(p);
    later(1100, () => ctx.onPick(p));
  }

  function bump(b) { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); }

  // Lista zadań przygody wieloetapowej
  if (quest && quest.started && !quest.open) {
    const chip = document.createElement('div');
    chip.className = 'chip map-chip';
    chip.innerHTML = `<span class="ic">${ART[quest.icon]}</span><span class="t">${quest.title}</span><span class="tray">${quest.list.map((c) => `<span class="clue${c.ok ? '' : ' dim'}">${ART[c.art]}</span>`).join('')}</span>`;
    map.appendChild(chip);
  }

  // Tablica zadań w otwartych krainach: wszystkie przygody naraz, z listą i miejscami
  if (ctx.board) {
    const left = ctx.board.filter((b) => !b.done).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'board-btn' + (left ? '' : ' all-done');
    btn.innerHTML = `<span class="board-ic">${ART.magnifier}</span><span>Zadania</span><b>${ctx.board.length - left}/${ctx.board.length}</b>`;
    map.appendChild(btn);
    const panel = document.createElement('div');
    panel.className = 'board';
    panel.hidden = true;
    panel.innerHTML = `<div class="board-head"><h2>Tablica zadań</h2><button type="button" class="btn ghost board-close">Zamknij</button></div>
      <div class="board-rows">${ctx.board.map((b, i) => `
        <button type="button" class="board-row${b.done ? ' done' : ''}" data-i="${i}">
          <span class="row-ic">${ART[b.icon]}</span>
          <span class="row-main"><span class="row-title">${b.title}</span>
            <span class="row-list">${b.list.map((c) => `<span class="clue${c.ok ? '' : ' dim'}${c.out ? ' out' : ''}">${ART[c.art]}</span>`).join('')}</span></span>
          <span class="row-where">${b.done ? `<span class="row-star">${ART.star}</span>` : b.where.map((w) => `<span class="where" title="${w.label}">${ART[w.icon]}</span>`).join('')}</span>
        </button>`).join('')}</div>`;
    map.appendChild(panel);
    const open = () => {
      panel.hidden = false;
      say(left ? `Tablica zadań. Do zrobienia: ${left}. Kliknij zadanie, a powiem ci, gdzie iść.` : 'Wszystkie zadania zrobione! Brawo!');
    };
    btn.addEventListener('click', open);
    panel.querySelector('.board-close').addEventListener('click', () => { panel.hidden = true; });
    panel.querySelectorAll('.board-row').forEach((row) => row.addEventListener('click', () => {
      const b = ctx.board[+row.dataset.i];
      if (b.done) { say(`${b.title}. Zrobione! Brawo!`); return; }
      const where = b.where.map((w) => w.label);
      say(`${b.title}. ${b.started ? 'Teraz idź' : 'Zacznij'} tutaj: ${where.join(', ') || 'rozejrzyj się po wyspie'}.`);
    }));
    if (ctx.fromGate && !ctx.save.flags.boardSeen) { ctx.save.flags.boardSeen = true; later(200, open); }
  }

  // Co powiedzieć po wejściu na mapę
  const hi = ctx.greet ? `Cześć, ${save.name}! ` : '';
  if (ctx.questNew) {
    if (calling) calling.el.classList.add('fresh');
    later(400, () => say(ctx.questNew));
  } else if (quest) {
    const todoPlaces = places.filter((p) => quest.todo(p.id)).map((p) => p.label);
    later(300, () => say(quest.started
      ? `${hi}Baloniki pokazują, gdzie jest coś do zrobienia: ${todoPlaces.join(', ') || 'zajrzyj na mapę'}.`
      : `${hi}${quest.callText}`));
  } else if (ctx.unlocked && btns[ctx.unlocked]) {
    btns[ctx.unlocked].classList.add('fresh');
    const p = places.find((x) => x.id === ctx.unlocked);
    later(400, () => say(`Hura! Nowe miejsce na mapie: ${p.label}! Kliknij, żeby tam pójść.`));
  } else if (calling) {
    later(300, () => say(`${hi}Ktoś cię woła! Kliknij drogowskaz: ${calling.gate.label}.`));
  } else if (ctx.greet || ctx.fromGate) {
    later(300, () => say(`${hi}${region.title}! Dokąd idziemy? Kliknij miejsce na mapie.`));
  }

  return function destroy() { timers.forEach(clearTimeout); stopSpeech(); root.innerHTML = ''; };
}
