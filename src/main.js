import './style.css';
import { ART } from './art.js';
import { say, setSound, soundOn, stopSpeech } from './speech.js';
import { loadAll, newSave, storeSlot, deleteSlot, whenText } from './saves.js';
import { runScene } from './scene.js';
import { runMap } from './map.js';
import { ADVENTURES, FRIENDS } from './adventures/index.js';
import { REGIONS, ALL_PLACES, QUESTS, OPEN_QUESTS, placeRegion } from './world.js';
import { composeScene, ISLAND_PLACE_IDS } from './quests/islands.js';
import { idleScene } from './quests/mountains.js';
import { setReading } from './reading.js';
import { DEFAULT_OUTFIT, FURS, ITEMS, SLOTS, isUnlocked, unlockedBy, dogSvg, pupSvg } from './wardrobe.js';

const $ = (s) => document.querySelector(s);
const world = $('#world');
const startScreen = $('#startScreen');
const nameScreen = $('#nameScreen');
const endScreen = $('#endScreen');
const albumScreen = $('#albumScreen');
const nameInput = $('#nameInput');
const mapBtn = $('#mapBtn');
const albumBtn = $('#albumBtn');
const menuBtn = $('#menuBtn');
const renameBtn = $('#renameBtn');

// ---------- Zapis ----------
// `save` to aktualnie grany zapis. Gra zapisuje się sama przy każdej zmianie.
let slot = null;
let save = null;
function writeSave() { if (slot !== null && save) storeSlot(slot, save); }

// Plecak współdzielony przez wszystkie miejsca
const bag = {
  get items() { return save.bag; },
  set items(v) { save.bag = v; },
  save: writeSave,
};

let destroy = null;
let current = null; // { place, adventure, unlocked, questNew }
function clear() { if (destroy) destroy(); destroy = null; }

const taskScreen = $('#taskScreen');
let inScene = false; // czy gramy w scenie (a nie na mapie)

function hideOverlays() {
  for (const el of [startScreen, nameScreen, endScreen, albumScreen, taskScreen, $('#wardrobeScreen')]) el.hidden = true;
}
const wardrobeBtn = $('#wardrobeBtn');
const readBtn = $('#readBtn');
const outfit = () => ({ ...DEFAULT_OUTFIT, ...(save?.outfit || {}) });
// Nowe ubranka, których Hania jeszcze nie widziała w szafie
const unseenItems = () => ITEMS.filter((i) => i.unlock && isUnlocked(i, save.done) && !save.seenItems.includes(i.id));

function setTopBar(mode) {
  mapBtn.hidden = mode !== 'scene';
  albumBtn.hidden = mode !== 'map';
  wardrobeBtn.hidden = mode !== 'map';
  readBtn.hidden = mode === 'start' || mode === 'name';
  if (save) {
    wardrobeBtn.classList.toggle('pulse', mode === 'map' && unseenItems().length > 0);
    readBtn.textContent = 'Czytanie: ' + (save.reading ? 'włączone' : 'wyłączone');
    readBtn.setAttribute('aria-pressed', String(!!save.reading));
    setReading(!!save.reading);
  }
  menuBtn.hidden = mode === 'start' || mode === 'name';
  renameBtn.hidden = mode !== 'map';
  mapBtn.classList.remove('pulse');
}

// ---------- Przygody wieloetapowe ----------
const questActive = (q) => save.done.includes(q.after) && !save.done.includes(q.id);
function questState(q) {
  if (!save.flags[q.id]) save.flags[q.id] = {};
  return q.initState(save.flags[q.id]);
}
const bagCount = (id) => save.bag.filter((x) => x === id).length;
// Otwarte krainy (Plaża, Wulkan): wszystkie ich przygody są aktywne naraz
const openUnlocked = () => save.done.includes('concert');
const openActive = () => (openUnlocked() ? OPEN_QUESTS.filter((q) => !save.done.includes(q.id)) : []);
const openTodo = (placeId) => openActive().some((q) => q.todo(placeId, questState(q), bagCount));
function questBoard() {
  const places = [...REGIONS.plaza.places, ...REGIONS.wulkan.places];
  return OPEN_QUESTS.map((q) => {
    const st = questState(q);
    const done = save.done.includes(q.id);
    return {
      title: q.title, icon: q.icon, done, started: !!st.started, list: q.checklist(st),
      where: done ? [] : places.filter((pl) => q.todo(pl.id, st, bagCount)).map((pl) => ({ label: pl.label, icon: pl.icon })),
    };
  });
}
function questInfo(regionId) {
  if (REGIONS[regionId]?.open) {
    if (!openActive().length) return null;
    return { open: true, started: true, todo: openTodo, callText: 'Sprawdź tablicę zadań! Baloniki pokazują, gdzie ktoś potrzebuje pomocy.' };
  }
  const q = QUESTS.find((x) => x.region === regionId && questActive(x));
  if (!q) return null;
  const st = questState(q);
  return {
    title: q.title, icon: q.icon, callText: q.callText, started: !!st.started,
    list: q.checklist(st), todo: (placeId) => q.todo(placeId, st, bagCount),
  };
}
// Aktywna przygoda wieloetapowa, która ma scenę w tym miejscu
function questForPlace(place) {
  return QUESTS.find((q) => q.scenes[place.id] && questActive(q));
}

// ---------- Mapa i miejsca ----------
function showMap(extra = {}) {
  clear();
  hideOverlays();
  setTopBar('map');
  save.resume = null;
  writeSave();
  const region = REGIONS[save.region] || REGIONS.dolina;
  // Drogowskaz „woła”, gdy w regionie za nim czeka przygoda z czymś do zrobienia
  const gateCalls = (to) => {
    const tq = to && questInfo(to);
    return !!(tq && (!tq.started || REGIONS[to].places.some((p) => tq.todo(p.id))));
  };
  destroy = runMap(world, {
    save, region, at: current?.place.id, quest: questInfo(region.id), gateCalls,
    board: region.open ? questBoard() : null,
    onTasks: openTasks,
    pupArt: pupSvg(outfit()),
    onPick: startPlace, onTravel: travel, ...extra,
  });
  inScene = false;
  const finishedQ = openActive().find((q) => questState(q).finished);
  if (finishedQ) { current = current || { place: region.places[0] }; onWin(finishedQ); }
}

function travel(regionId) {
  const from = save.region;
  save.region = regionId;
  current = null;
  showMap({ fromGate: from });
}

function startPlace(place) {
  clear();
  hideOverlays();
  setTopBar('scene');
  save.region = placeRegion(place.id);
  save.resume = { place: place.id };
  writeSave();
  inScene = true;
  const common = {
    onTasks: openTasks,
    dogArt: dogSvg(outfit()),
    name: save.name, bag, onWin, saveState: writeSave, pulseMap: () => mapBtn.classList.add('pulse'),
    world: { done: save.done, flags: save.flags },
  };

  // Plaża i Wulkan: jedna scena złożona ze wszystkich aktywnych przygód
  if (ISLAND_PLACE_IDS.includes(place.id)) {
    const active = openActive();
    const scene = { ...composeScene(place.id, active, questState), id: 'island-' + place.id, sticker: 'star', winText: '' };
    current = { place, adventure: scene };
    destroy = runScene(world, scene, { ...common, state: {} });
    const finishedQ = active.find((x) => questState(x).finished);
    if (finishedQ) onWin(finishedQ);
    return;
  }
  const q = questForPlace(place);
  if (q) {
    const scene = { ...q.scenes[place.id], id: q.id, sticker: q.sticker, winText: q.winText };
    current = { place, adventure: scene };
    destroy = runScene(world, scene, { ...common, state: questState(q) });
    if (questState(q).finished) onWin(scene);
    return;
  }
  // Miejsce w górach bez aktualnego zadania: spokojna scena, w której można porozmawiać
  if (!place.adventure) {
    const scene = { ...idleScene(place.id), id: 'idle-' + place.id };
    current = { place, adventure: scene };
    destroy = runScene(world, scene, { ...common, state: {} });
    return;
  }
  // Zwykła przygoda: jej stan też jest zapisywany, żeby można było wrócić w połowie
  const adv = ADVENTURES[place.adventure];
  if (!save.flags.adv) save.flags.adv = {};
  if (!save.flags.adv[adv.id]) save.flags.adv[adv.id] = {};
  current = { place, adventure: adv };
  destroy = runScene(world, adv, { ...common, state: save.flags.adv[adv.id] });
}

function onWin(adv) {
  const first = !save.done.includes(adv.id);
  if (first) save.done.push(adv.id);
  if (save.flags.adv) delete save.flags.adv[adv.id]; // następnym razem przygoda zaczyna się od nowa
  save.resume = null;
  writeSave();
  const unlocked = first ? ALL_PLACES.find((p) => p.after === adv.id && !p.soon) : null;
  current.unlocked = unlocked ? unlocked.id : null;
  const nq = first ? QUESTS.find((q) => q.after === adv.id) : null;
  current.questNew = nq ? nq.newText : null;

  $('#sticker').innerHTML = `${ART.star}<span class="sticker-pic">${ART[adv.sticker]}</span>`;
  $('#endTitle').textContent = `Brawo, ${save.name}!`;
  // Nowe ubranko w szafie za tę przygodę
  const gifts = first ? unlockedBy(adv.id) : [];
  $('#endText').textContent = adv.winText + (gifts.length ? ` W szafie czeka nowe ubranko: ${gifts.map((g) => g.label.toLowerCase()).join(' i ')}!` : '');
  // Przygód wieloetapowych nie powtarza się od razu, więc tylko „Na mapę”
  $('#againBtn').hidden = [...QUESTS, ...OPEN_QUESTS].some((q) => q.id === adv.id);
  endScreen.hidden = false;
  say(`Brawo! ${$('#endText').textContent}`);
}

$('#toMapBtn').addEventListener('click', () => showMap({ unlocked: current?.unlocked, questNew: current?.questNew }));
$('#againBtn').addEventListener('click', () => { endScreen.hidden = true; startPlace(current.place); });
mapBtn.addEventListener('click', () => showMap());
readBtn.addEventListener('click', () => {
  if (!save) return;
  save.reading = !save.reading;
  writeSave();
  setReading(save.reading);
  readBtn.textContent = 'Czytanie: ' + (save.reading ? 'włączone' : 'wyłączone');
  readBtn.setAttribute('aria-pressed', String(save.reading));
  say(save.reading ? 'Czytamy razem! Najpierw spróbuj przeczytać sama, potem przeczytam ja. Kliknij słowo w dymku, a przeczytam je po sylabach.' : 'Czytanie wyłączone.', { interrupt: true });
});
$('#soundBtn').addEventListener('click', (e) => {
  setSound(!soundOn());
  e.currentTarget.textContent = 'Głos: ' + (soundOn() ? 'włączony' : 'wyłączony');
  e.currentTarget.setAttribute('aria-pressed', String(soundOn()));
});

// ---------- Szafa pieska ----------
const wardrobeScreen = $('#wardrobeScreen');
let wrSlot = 'fur';
const ADV_TITLE = (id) => ADVENTURES[id]?.title || [...QUESTS, ...OPEN_QUESTS].find((q) => q.id === id)?.title || id;

function renderWardrobe() {
  const o = outfit();
  $('#wrFace').innerHTML = pupSvg(o);
  $('#wrSide').innerHTML = dogSvg(o);
  $('#wrTabs').innerHTML = SLOTS.map((s) => {
    const fresh = s.id !== 'fur' && unseenItems().some((i) => i.slot === s.id);
    return `<button type="button" class="wr-tab${s.id === wrSlot ? ' on' : ''}${fresh ? ' fresh' : ''}" data-slot="${s.id}">${s.label}</button>`;
  }).join('');
  let cards;
  if (wrSlot === 'fur') {
    cards = FURS.map((f) => `<button type="button" class="wr-item${o.fur === f.id ? ' on' : ''}" data-fur="${f.id}"><span class="wr-pic">${pupSvg({ ...DEFAULT_OUTFIT, fur: f.id, neck: null })}</span><span class="wr-label">${f.label}</span></button>`);
  } else {
    const items = ITEMS.filter((i) => i.slot === wrSlot);
    cards = [`<button type="button" class="wr-item${!o[wrSlot] ? ' on' : ''}" data-none="1"><span class="wr-pic wr-none">✕</span><span class="wr-label">Nic</span></button>`,
      ...items.map((i) => {
        const open = isUnlocked(i, save.done);
        const fresh = open && i.unlock && !save.seenItems.includes(i.id);
        const pic = pupSvg({ ...DEFAULT_OUTFIT, fur: o.fur, neck: null, [i.slot]: i.id });
        return `<button type="button" class="wr-item${o[wrSlot] === i.id ? ' on' : ''}${open ? '' : ' locked'}" data-item="${i.id}"><span class="wr-pic">${pic}${open ? '' : `<span class="wr-lock">${ART.lock}</span>`}${fresh ? '<span class="wr-new">Nowe!</span>' : ''}</span><span class="wr-label">${i.label}</span></button>`;
      })];
  }
  $('#wrItems').innerHTML = cards.join('');
  // Obejrzane nowe ubranka w tej zakładce przestają być „nowe”
  if (wrSlot !== 'fur') {
    const seen = ITEMS.filter((i) => i.slot === wrSlot && i.unlock && isUnlocked(i, save.done)).map((i) => i.id);
    const add = seen.filter((id) => !save.seenItems.includes(id));
    if (add.length) { save.seenItems.push(...add); writeSave(); }
  }
}
function wear(changes, text) {
  save.outfit = { ...outfit(), ...changes };
  writeSave();
  renderWardrobe();
  say(text, { interrupt: true });
}
$('#wrTabs').addEventListener('click', (e) => {
  const b = e.target.closest('.wr-tab');
  if (!b) return;
  wrSlot = b.dataset.slot;
  renderWardrobe();
  say(SLOTS.find((s) => s.id === wrSlot).label, { interrupt: true });
});
$('#wrItems').addEventListener('click', (e) => {
  const b = e.target.closest('.wr-item');
  if (!b) return;
  if (b.dataset.fur) { const f = FURS.find((x) => x.id === b.dataset.fur); wear({ fur: f.id }, `${f.label} piesek!`); return; }
  if (b.dataset.none) { wear({ [wrSlot]: null }, 'Bez niczego.'); return; }
  const i = ITEMS.find((x) => x.id === b.dataset.item);
  if (!isUnlocked(i, save.done)) { say(`${i.label}. To ubranko dostaniesz za przygodę: ${ADV_TITLE(i.unlock)}.`, { interrupt: true }); return; }
  wear({ [i.slot]: outfit()[i.slot] === i.id ? null : i.id }, outfit()[i.slot] === i.id ? 'Zdjęte!' : `${i.label}! Pięknie!`);
});
// intro: krok nowej gry zaraz po nadaniu imienia (żeby od początku było wiadomo, że pieska można przebierać)
let wardrobeIntro = false;
function openWardrobe(intro = false) {
  wardrobeIntro = intro === true;
  wrSlot = wardrobeIntro ? 'fur' : unseenItems()[0]?.slot || 'fur';
  $('#wardrobeTitle').textContent = wardrobeIntro ? `Jak wygląda ${save.name}?` : 'Szafa pieska';
  $('#wardrobeClose').textContent = wardrobeIntro ? 'Gotowe! Gramy' : 'Gotowe!';
  renderWardrobe();
  wardrobeScreen.hidden = false;
  setTopBar('name');
  say(wardrobeIntro
    ? `Jak wygląda ${save.name}? Wybierz kolor futerka i coś do ubrania. Za każdą przygodę dostaniesz nowe ubranka. Szafę znajdziesz potem na mapie.`
    : `Szafa pieska! Wybierz, w co ubrać ${save.name}.`, { interrupt: true });
}
wardrobeBtn.addEventListener('click', () => openWardrobe());
$('#wardrobeClose').addEventListener('click', () => {
  wardrobeScreen.hidden = true;
  say('Hau! Ale ładnie wyglądam!');
  showMap(wardrobeIntro ? { greet: true } : {}); // piesek na mapie od razu w nowym stroju
  wardrobeIntro = false;
});

// ---------- Okienko „Co trzeba zrobić?” ----------
// Lista przedmiotów i kroków aktualnych przygód, z miejscami, do których trzeba iść.
function questRow(q, regionIds) {
  const st = questState(q);
  const done = save.done.includes(q.id);
  const places = regionIds.flatMap((r) => REGIONS[r].places);
  return {
    title: q.title, icon: q.icon, done, started: !!st.started, items: q.checklist(st),
    where: done ? [] : places.filter((pl) => q.todo(pl.id, st, bagCount)).map((pl) => ({ label: pl.label, icon: pl.icon })),
  };
}
function taskRows() {
  const region = REGIONS[save.region] || REGIONS.dolina;
  // Zwykła przygoda w scenie (np. kłębek, orzechy)
  const adv = inScene && current && ADVENTURES[current.adventure?.id];
  if (adv && adv.checklist && current.adventure === adv) {
    const st = save.flags.adv?.[adv.id] || {};
    return [{ title: adv.title, icon: adv.sticker, done: false, started: true, items: adv.checklist(st, bagCount), hint: adv.where(st, bagCount), where: [] }];
  }
  if (region.open) return OPEN_QUESTS.filter((q) => openUnlocked()).map((q) => questRow(q, ['plaza', 'wulkan']));
  const q = QUESTS.find((x) => x.region === region.id && questActive(x));
  return q ? [questRow(q, [region.id])] : [];
}
const ITEM_STATE = (c) => (c.out ? 'out' : c.ok ? 'ok' : 'todo');
function rowSpeech(r) {
  if (r.done) return `${r.title}. Zrobione! Brawo!`;
  const have = r.items.filter((c) => c.ok).map((c) => c.label);
  const need = r.items.filter((c) => !c.ok && !c.out).map((c) => c.label);
  const where = r.hint || (r.where.length ? `Idź tutaj: ${r.where.map((w) => w.label).join(', ')}.` : '');
  return `${r.title}. ${have.length ? `Masz już: ${have.join(', ')}. ` : ''}${need.length ? `Jeszcze trzeba: ${need.join(', ')}. ` : ''}${where}`;
}
function openTasks() {
  const rows = taskRows();
  const box = $('#taskRows');
  if (!rows.length) {
    box.innerHTML = '<p class="task-empty">Tutaj teraz nie ma zadań. Rozejrzyj się i porozmawiaj ze zwierzątkami!</p>';
  } else {
    box.innerHTML = rows.map((r, i) => `
      <div class="task-row${r.done ? ' done' : ''}">
        <button type="button" class="task-title" data-row="${i}"><span class="task-ic">${ART[r.icon]}</span><span>${r.title}</span>${r.done ? `<span class="task-star">${ART.star}</span>` : ''}</button>
        <div class="task-items">${r.items.map((c, j) => `
          <button type="button" class="task-item ${ITEM_STATE(c)}" data-row="${i}" data-item="${j}">
            <span class="ti-pic">${ART[c.art]}<span class="ti-mark">${c.out ? '✕' : c.ok ? '✓' : ''}</span></span>
            <span class="ti-label">${c.label || ''}</span>
          </button>`).join('')}</div>
        ${!r.done && (r.where.length || r.hint) ? `<div class="task-where"><span class="tw-label">Gdzie iść?</span>${r.hint ? `<span class="tw-hint">${r.hint}</span>` : ''}${r.where.map((w) => `<span class="tw-place"><span class="tw-ic">${ART[w.icon]}</span>${w.label}</span>`).join('')}</div>` : ''}
      </div>`).join('');
  }
  box.querySelectorAll('.task-title').forEach((b) => b.addEventListener('click', () => say(rowSpeech(rows[+b.dataset.row]), { interrupt: true })));
  box.querySelectorAll('.task-item').forEach((b) => b.addEventListener('click', () => {
    const c = rows[+b.dataset.row].items[+b.dataset.item];
    say(`${c.label}. ${c.out ? 'To odpada.' : c.ok ? 'Masz to!' : 'Jeszcze nie.'}`, { interrupt: true });
  }));
  taskScreen.hidden = false;
  const active = rows.filter((r) => !r.done);
  say(!rows.length ? 'Tutaj teraz nie ma zadań.'
    : active.length === 1 ? rowSpeech(active[0])
      : active.length ? `Masz ${active.length === 2 ? 'dwa' : active.length === 3 ? 'trzy' : 'cztery'} zadania. Kliknij nazwę zadania, a powiem ci więcej.`
        : 'Wszystkie zadania zrobione! Brawo!', { interrupt: true });
}
$('#taskClose').addEventListener('click', () => { taskScreen.hidden = true; });

// ---------- Ekran startowy ----------
const startBody = $('#startBody');
let pendingSlot = null; // slot, w którym powstaje nowa gra

function stars(s) { return s.done.length; }

function showStart() {
  clear();
  stopSpeech();
  hideOverlays();
  setTopBar('start');
  startScreen.hidden = false;
  const all = loadAll();
  const last = all.last !== null ? all.slots[all.last] : null;
  const any = all.slots.some(Boolean);
  startBody.innerHTML = `
    <div class="start-hero">${pupSvg(last?.outfit || DEFAULT_OUTFIT)}</div>
    <h1 class="start-title">Pies na Tropie</h1>
    <div class="start-btns">
      ${last ? `<button class="btn big" type="button" data-act="continue">Graj dalej<span class="who">${last.name}</span></button>` : ''}
      <button class="btn ${last ? 'ghost' : 'big'}" type="button" data-act="new">Nowa gra</button>
      ${any ? '<button class="btn ghost" type="button" data-act="load">Wczytaj grę</button>' : ''}
    </div>`;
  startBody.querySelector('[data-act="continue"]')?.addEventListener('click', () => { say(`Hau! Wracamy, ${last.name}!`); loadSlot(all.last); });
  startBody.querySelector('[data-act="new"]').addEventListener('click', () => {
    const free = loadAll().slots.findIndex((x) => !x);
    if (free >= 0) { askName(free); return; }
    showSlots('overwrite');
  });
  startBody.querySelector('[data-act="load"]')?.addEventListener('click', () => showSlots('load'));
}

// Karty zapisów. Tryb 'load' wczytuje, 'overwrite' wybiera zapis do zastąpienia nową grą.
function showSlots(mode) {
  const all = loadAll();
  startBody.innerHTML = `
    <h1>${mode === 'overwrite' ? 'Wybierz zapis do zastąpienia' : 'Wczytaj grę'}</h1>
    ${mode === 'overwrite' ? '<p>Wszystkie miejsca są zajęte.</p>' : ''}
    <div class="slots"></div>
    <button class="btn ghost" type="button" data-act="back">Wróć</button>`;
  const box = startBody.querySelector('.slots');
  all.slots.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'slot-card' + (s ? '' : ' empty');
    box.appendChild(card);
    const render = (confirm) => {
      if (!s) {
        card.innerHTML = `<button class="slot-main" type="button"><span class="slot-pic plus">+</span><span class="slot-name">Wolne miejsce</span><span class="slot-meta">Nowa gra</span></button>`;
        card.querySelector('.slot-main').addEventListener('click', () => askName(i));
        return;
      }
      if (confirm) {
        const replace = mode === 'overwrite';
        card.innerHTML = `<div class="slot-confirm"><span class="slot-name">${s.name}</span><span class="slot-q">${replace ? 'Zastąpić nową grą?' : 'Usunąć ten zapis?'}</span><div class="slot-confirm-btns"><button class="btn danger" type="button" data-c="yes">${replace ? 'Tak, zastąp' : 'Tak, usuń'}</button><button class="btn ghost" type="button" data-c="no">Nie</button></div></div>`;
        card.querySelector('[data-c="yes"]').addEventListener('click', () => {
          if (replace) { askName(i); return; }
          deleteSlot(i);
          if (slot === i) { slot = null; save = null; }
          if (loadAll().slots.some(Boolean)) showSlots('load'); else showStart();
        });
        card.querySelector('[data-c="no"]').addEventListener('click', () => render(false));
        return;
      }
      card.innerHTML = `<button class="slot-main" type="button"><span class="slot-pic">${pupSvg(s.outfit || DEFAULT_OUTFIT)}</span><span class="slot-name">${s.name}</span><span class="slot-meta"><span class="slot-stars">${ART.star}<b>${stars(s)}</b></span> · ${whenText(s.updated)}</span></button>${mode === 'load' ? '<button class="slot-del" type="button" aria-label="Usuń zapis">Usuń</button>' : ''}`;
      card.querySelector('.slot-main').addEventListener('click', () => {
        if (mode === 'overwrite') { render(true); return; }
        say(`Hau! Wracamy, ${s.name}!`);
        loadSlot(i);
      });
      card.querySelector('.slot-del')?.addEventListener('click', () => render(true));
    };
    render(false);
  });
  startBody.querySelector('[data-act="back"]').addEventListener('click', showStart);
}

function loadSlot(i) {
  const all = loadAll();
  if (!all.slots[i]) { showStart(); return; }
  slot = i;
  save = all.slots[i];
  writeSave(); // zapamiętuje ten zapis jako ostatnio grany
  const resume = save.resume && ALL_PLACES.find((p) => p.id === save.resume.place);
  current = null;
  if (resume) { startPlace(resume); return; }
  showMap({ greet: true });
}

menuBtn.addEventListener('click', () => { writeSave(); showStart(); });

// ---------- Imię pieska ----------
$('#namePup').innerHTML = pupSvg(DEFAULT_OUTFIT);
function askName(newSlot) {
  clear();
  hideOverlays();
  setTopBar('name');
  pendingSlot = Number.isInteger(newSlot) ? newSlot : null;
  nameScreen.hidden = false;
  nameInput.value = pendingSlot === null && save ? save.name : '';
  setTimeout(() => { try { nameInput.focus({ preventScroll: true }); } catch (e) { /* ok */ } }, 200);
}
function confirmName() {
  let n = nameInput.value.trim() || 'Burek';
  n = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
  const isNew = pendingSlot !== null;
  if (isNew) {
    slot = pendingSlot;
    save = newSave(n);
    pendingSlot = null;
  } else {
    save.name = n;
  }
  writeSave();
  nameScreen.hidden = true;
  current = null;
  // Nowa gra: drugi krok to wygląd pieska. Zmiana imienia w trakcie gry wraca od razu na mapę.
  if (isNew) { say(`Hau hau! Mam na imię ${n}!`); setTimeout(() => openWardrobe(true), 1200); return; }
  say(`Hau hau! Mam na imię ${n}!`);
  setTimeout(() => showMap({ greet: true }), 1800);
}
nameInput.addEventListener('input', () => {
  nameInput.value = nameInput.value.replace(/[^a-ząćęłńóśźżA-ZĄĆĘŁŃÓŚŹŻ ]/g, '');
});
nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmName(); });
document.querySelectorAll('#sugg button').forEach((b) => {
  b.addEventListener('click', () => { nameInput.value = b.textContent; say(b.textContent); });
});
$('#startBtn').addEventListener('click', confirmName);
$('#nameBack').addEventListener('click', () => { pendingSlot = null; if (save) showMap(); else showStart(); });
renameBtn.addEventListener('click', () => askName());

// ---------- Album przyjaciół ----------
function showAlbum() {
  const cards = $('#cards');
  cards.innerHTML = '';
  let count = 0;
  for (const f of FRIENDS) {
    const met = !f.soon && save.done.includes(f.adventure);
    if (met) count++;
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'card' + (met ? ' met' : '');
    c.innerHTML = met
      ? `<span class="card-pic">${ART[f.art]}</span><span class="card-star">${ART.star}</span><span class="card-name">${f.name}</span>`
      : `<span class="card-pic">${ART.question}</span><span class="card-name">${f.place}</span>`;
    c.addEventListener('click', () => {
      if (met) say(`${f.name}. ${f.line}`);
      else say(`${f.place}. Pomóż tam zwierzątku, a pojawi się w albumie!`);
    });
    cards.appendChild(c);
  }
  albumScreen.hidden = false;
  const words = ['', 'jednego przyjaciela', 'dwóch przyjaciół', 'trzech przyjaciół', 'czterech przyjaciół', 'pięciu przyjaciół', 'sześciu przyjaciół', 'siedmiu przyjaciół'];
  say(count ? `Twój album! Masz już ${words[count] || count + ' przyjaciół'}. Kliknij obrazek.` : 'Twój album jest pusty. Pomóż zwierzątkom, a pojawią się tutaj!');
}
albumBtn.addEventListener('click', showAlbum);
$('#albumClose').addEventListener('click', () => { albumScreen.hidden = true; });

// Gra zawsze zaczyna od ekranu startowego
showStart();
