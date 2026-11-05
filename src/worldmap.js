// Mapa świata: wszystkie krainy naraz. Widać, co jest otwarte, ile gwiazdek zdobyto,
// gdzie ktoś czeka na pomoc, i można od razu przejść do dowolnej otwartej krainy.
import { ART } from './art.js';
import { say } from './speech.js';

// Wygląd i układ krain na mapie świata (x, y w procentach planszy)
export const WORLD = [
  { id: 'dolina', label: 'Dolina', icon: 'tree', x: 20, y: 72, after: null, lockedText: '' },
  { id: 'gory', label: 'Góry', icon: 'peak', x: 34, y: 38, after: 'party', lockedText: 'Góry otworzą się po urodzinach kotka w Dolinie.' },
  { id: 'plaza', label: 'Plaża', icon: 'castleIcon', x: 62, y: 70, after: 'concert', lockedText: 'Plaża otworzy się po koncercie na szczycie w Górach.' },
  { id: 'wulkan', label: 'Wulkan', icon: 'volcanoIcon', x: 84, y: 38, after: 'concert', lockedText: 'Wulkan otworzy się po koncercie na szczycie w Górach.' },
];
const ROUTES = [['dolina', 'gory'], ['gory', 'plaza'], ['plaza', 'wulkan']];

// ctx: { status(id) -> { open, done, total, todo }, here, pupArt, onGo(id) }
export function runWorld(root, ctx) {
  const timers = [];
  let busy = false;
  const pos = Object.fromEntries(WORLD.map((r) => [r.id, r]));
  const routes = ROUTES.map(([a, b]) => {
    const open = ctx.status(b).open;
    return `<line x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}" stroke="${open ? '#FFFBF0' : '#FFFBF088'}" stroke-width="12" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      <line x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}" stroke="${open ? '#C9A06A' : '#C9A06A66'}" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
  }).join('');

  root.innerHTML = `
    <div class="map world-map">
      <div class="wm-sea"></div>
      <div class="wm-land"></div>
      <div class="wm-peaks"></div>
      <div class="wm-island"></div>
      <svg class="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${routes}</svg>
      <div class="map-region">Świat</div>
      <div class="map-title">Mapa świata</div>
    </div>`;
  const map = root.firstElementChild;

  const btns = {};
  for (const r of WORLD) {
    const st = ctx.status(r.id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `place wm-region${st.open ? '' : ' locked'}${st.todo ? ' quest' : ''}${r.id === ctx.here ? ' here' : ''}`;
    b.style.left = r.x + '%';
    b.style.top = r.y + '%';
    b.setAttribute('aria-label', r.label);
    b.innerHTML = `
      <span class="disc">${ART[r.icon]}${st.open ? '' : `<span class="badge lock">${ART.lock}</span>`}${st.todo ? `<span class="qbadge">${ART.balloons}</span>` : ''}</span>
      <span class="label">${r.label}</span>
      ${st.open ? `<span class="wm-stars${st.done === st.total ? ' full' : ''}"><span class="wm-star">${ART.star}</span>${st.done}/${st.total}</span>` : ''}`;
    b.addEventListener('click', () => pick(r, st));
    map.appendChild(b);
    btns[r.id] = b;
  }

  const pup = document.createElement('div');
  pup.className = 'map-pup';
  pup.innerHTML = ctx.pupArt || ART.pupFace;
  map.appendChild(pup);
  const movePup = (r, instant) => {
    pup.style.transitionDuration = instant ? '0ms' : '1000ms';
    pup.style.left = r.x + '%';
    pup.style.top = (r.y - 17) + '%';
  };
  movePup(pos[ctx.here] || WORLD[0], true);

  function pick(r, st) {
    if (busy) return;
    if (!st.open) {
      say(`${r.label}. ${r.lockedText}`, { interrupt: true });
      btns[r.id].classList.remove('nope'); void btns[r.id].offsetWidth; btns[r.id].classList.add('nope');
      return;
    }
    busy = true;
    say(r.id === ctx.here ? `Wracamy: ${r.label}!` : `Idziemy: ${r.label}!`, { interrupt: true });
    movePup(r);
    timers.push(setTimeout(() => ctx.onGo(r.id), 1150));
  }

  // Powitanie: gdzie ktoś czeka na pomoc
  const waiting = WORLD.filter((r) => ctx.status(r.id).open && ctx.status(r.id).todo).map((r) => r.label);
  timers.push(setTimeout(() => say(waiting.length
    ? `Mapa świata! Baloniki pokazują, gdzie ktoś czeka na pomoc: ${waiting.join(', ')}.`
    : 'Mapa świata! Kliknij krainę, do której chcesz pójść.'), 300));

  return function destroy() { timers.forEach(clearTimeout); root.innerHTML = ''; };
}
