// Mapa świata: miejsca połączone ścieżką. Piesek idzie do wybranego miejsca i zaczyna się przygoda.
import { ART } from './art.js';
import { say, stopSpeech } from './speech.js';
import { PLACES } from './adventures/index.js';

export function placeState(place, save) {
  if (place.soon) return 'soon';
  if (save.done.includes(place.adventure)) return 'done';
  if (!place.after || save.done.includes(place.after)) return 'open';
  return 'locked';
}

export function runMap(root, ctx) {
  const { save } = ctx;
  let busy = false;
  const timers = [];

  const pts = PLACES.map((p) => `${p.x},${p.y}`).join(' ');
  root.innerHTML = `
    <div class="map">
      <div class="map-water"></div>
      <div class="map-blob" style="left:58%;top:8%;width:30%"></div>
      <div class="map-blob" style="left:4%;top:44%;width:26%"></div>
      <svg class="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points="${pts}" fill="none" stroke="#FFFBF0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" opacity=".9"/>
        <polyline points="${pts}" fill="none" stroke="#C9A06A" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="map-title">Dokąd idziemy?</div>
    </div>`;
  const quest = ctx.quest;
  const map = root.firstElementChild;

  const btns = {};
  for (const p of PLACES) {
    const st = placeState(p, save);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `place ${st}`;
    b.style.left = p.x + '%';
    b.style.top = p.y + '%';
    b.setAttribute('aria-label', p.label);
    b.innerHTML = `
      <span class="disc">${ART[p.icon]}${st === 'locked' || st === 'soon' ? `<span class="badge lock">${ART.lock}</span>` : ''}${st === 'done' ? `<span class="badge">${ART.star}</span>` : ''}${quest && quest.todo(p.id) ? `<span class="qbadge">${ART.balloons}</span>` : ''}</span>
      <span class="label">${p.label}</span>`;
    if (quest && quest.todo(p.id)) b.classList.add('quest');
    b.addEventListener('click', () => pick(p, st));
    map.appendChild(b);
    btns[p.id] = b;
  }

  // Piesek stoi przy ostatnio odwiedzonym miejscu
  const here = PLACES.find((p) => p.id === ctx.at) || PLACES[0];
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
    if (st === 'soon') { say(`${p.label}. Tu jeszcze budujemy. Wkrótce!`); bump(p); return; }
    if (st === 'locked') {
      const prev = PLACES.find((x) => x.adventure === p.after);
      say(`${p.label} jest jeszcze zamknięty. Najpierw pomóż zwierzątkom: ${prev ? prev.label : ''}!`);
      bump(p);
      return;
    }
    busy = true;
    say(p.label + '!');
    movePup(p);
    timers.push(setTimeout(() => ctx.onPick(p), 1100));
  }

  function bump(p) { const b = btns[p.id]; b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); }

  // Lista zadań przygody wieloetapowej
  if (quest && quest.started) {
    const chip = document.createElement('div');
    chip.className = 'chip map-chip';
    chip.innerHTML = `<span class="ic">${ART.cake}</span><span class="t">${quest.title}</span><span class="tray">${quest.list.map((c) => `<span class="clue${c.ok ? '' : ' dim'}">${ART[c.art]}</span>`).join('')}</span>`;
    map.appendChild(chip);
  }

  // Komunikat po powrocie z przygody
  if (ctx.questNew) {
    timers.push(setTimeout(() => say('Psst! Kotek cię woła! Ma dla ciebie ważną sprawę. Kliknij łąkę z balonikiem!'), 400));
  } else if (quest) {
    const places = PLACES.filter((p) => quest.todo(p.id)).map((p) => p.label);
    const hi = ctx.greet ? `Cześć, ${save.name}! ` : '';
    timers.push(setTimeout(() => say(quest.started
      ? `${hi}Baloniki pokazują, gdzie jest coś do zrobienia: ${places.join(', ')}.`
      : `${hi}Kotek cię woła! Kliknij łąkę z balonikiem.`), 300));
  } else if (ctx.unlocked) {
    const p = PLACES.find((x) => x.id === ctx.unlocked);
    btns[p.id].classList.add('fresh');
    timers.push(setTimeout(() => say(`Hura! Nowe miejsce na mapie: ${p.label}! Kliknij, żeby tam pójść.`), 400));
  } else if (ctx.greet) {
    timers.push(setTimeout(() => say(`Cześć, ${ctx.save.name}! Dokąd idziemy? Kliknij miejsce na mapie.`), 300));
  }

  return function destroy() { timers.forEach(clearTimeout); stopSpeech(); root.innerHTML = ''; };
}
