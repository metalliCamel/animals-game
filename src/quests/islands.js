// Otwarte krainy: Plaża i Wulkan. Tu kilka przygód dzieje się naraz i w dowolnej kolejności.
// Każde miejsce ma jedną planszę (postacie, rekwizyty). Przygody dokładają do niej swoje „części”:
// reakcje na rozmowę (talk), na podany przedmiot (item), powitanie (intro) i podpowiedź (hint).
// Scena pyta po kolei wszystkie przygody, która chce zareagować; gdy żadna, postać po prostu gada.

// ---------- Plansze ----------
const PLACES = {
  // PLAŻA
  plaza: {
    label: 'Plaża', bg: 'beach', walk: { maxB: 30, click: 40 }, dog: { x: 14, b: 8 },
    entities: [
      { id: 'umbrella', art: 'umbrella', x: 88, b: 30, w: 10, deco: true },
      { id: 'crab', art: 'crab', x: 36, b: 22, w: 9, label: 'Krab' },
      { id: 'castle', art: 'castleRuin', x: 60, b: 18, w: 18, label: 'Zamek z piasku' },
      { id: 'sand1', art: 'sandMound', x: 22, b: 4, w: 8, label: 'Kopczyk piasku' },
      { id: 'sand2', art: 'sandMound', x: 76, b: 8, w: 8, label: 'Kopczyk piasku' },
      { id: 'sand3', art: 'sandMound', x: 46, b: 3, w: 8, label: 'Kopczyk piasku' },
      { id: 'partBig', art: 'partBig', x: 24, b: 28, w: 10, label: 'Duża część zamku', hidden: true },
      { id: 'partMid', art: 'partMid', x: 82, b: 20, w: 6, label: 'Średnia część zamku', hidden: true },
      { id: 'partSmall', art: 'partSmall', x: 10, b: 22, w: 3.5, label: 'Mała część zamku', hidden: true },
    ],
  },
  molo: {
    label: 'Molo', bg: 'pier', walk: { maxB: 24, click: 34 }, dog: { x: 14, b: 8 },
    entities: [
      { id: 'boat', art: 'boat', x: 86, b: 36, w: 14, deco: true, hidden: true },
      { id: 'post', art: 'post', x: 40, b: 22, w: 3.5, deco: true },
      { id: 'gull', art: 'gull', x: 40, b: 42, w: 8, label: 'Mewa' },
      { id: 'pelican', art: 'pelican', x: 66, b: 18, w: 11, label: 'Pelikan' },
      { id: 'basket', art: 'fishBasket4', x: 80, b: 16, w: 9, label: 'Koszyk z rybami' },
      { id: 'ans3', art: 'dots3', x: 30, b: 3, w: 6, label: 'Trzy', hidden: true, stay: true },
      { id: 'ans4', art: 'dots4', x: 44, b: 3, w: 6, label: 'Cztery', hidden: true, stay: true },
      { id: 'ans5', art: 'dots5', x: 58, b: 3, w: 6, label: 'Pięć', hidden: true, stay: true },
      { id: 'fWhite', art: 'featherWhite', x: 24, b: 14, w: 4, label: 'Piórko', hidden: true },
      { id: 'fGrey', art: 'featherGrey', x: 54, b: 10, w: 4, label: 'Piórko', hidden: true },
      { id: 'fBlack', art: 'featherBlack', x: 76, b: 4, w: 4, label: 'Piórko', hidden: true },
    ],
  },
  rafa: {
    label: 'Rafa', bg: 'reef', walk: { maxB: 26, click: 36 }, dog: { x: 14, b: 8 },
    entities: [
      { id: 'seaweed', art: 'seaweed', x: 8, b: 26, w: 6, deco: true },
      { id: 'coral', art: 'coral', x: 86, b: 24, w: 11, deco: true },
      { id: 'rock', art: 'rockSea', x: 34, b: 22, w: 13, deco: true },
      { id: 'penguin', art: 'penguin', x: 34, b: 30, w: 6, label: 'Pingwin' },
      { id: 'octopus', art: 'octopus', x: 62, b: 16, w: 13, label: 'Ośmiornica' },
    ],
  },
  latarnia: {
    label: 'Latarnia', bg: 'lightsea', walk: { maxB: 26, click: 36 }, dog: { x: 14, b: 8 },
    entities: [
      { id: 'lighthouse', art: 'lighthouseDark', x: 78, b: 26, w: 15, label: 'Latarnia' },
      { id: 'seal', art: 'seal', x: 40, b: 12, w: 14, label: 'Foka' },
      { id: 'frame', art: 'lensFrame', x: 44, b: 40, w: 22, deco: true, hidden: true },
      { id: 'slotTri', art: 'slotTri', x: 37, b: 41.5, w: 5, label: 'Miejsce na trójkąt', hidden: true, stay: true, z: 80 },
      { id: 'slotSquare', art: 'slotSquare', x: 44, b: 41.5, w: 5, label: 'Miejsce na kwadrat', hidden: true, stay: true, z: 80 },
      { id: 'slotCircle', art: 'slotCircle', x: 51, b: 41.5, w: 5, label: 'Miejsce na koło', hidden: true, stay: true, z: 80 },
      { id: 'boatSea', art: 'boat', x: 20, b: 44, w: 9, deco: true, hidden: true },
    ],
  },
  // WULKAN
  dzungla: {
    label: 'Dżungla', bg: 'jungle', walk: { maxB: 32, click: 42 }, dog: { x: 50, b: 4 },
    entities: [
      { id: 'palm1', art: 'palm', x: 6, b: 30, w: 12, deco: true },
      { id: 'tree', art: 'bananaTree', x: 16, b: 24, w: 16, deco: true },
      { id: 'ban1', art: 'banana', x: 11, b: 47, w: 2.4, label: 'Banan', stay: true, z: 95 },
      { id: 'ban2', art: 'banana', x: 14, b: 44, w: 2.4, label: 'Banan', stay: true, z: 95 },
      { id: 'ban3', art: 'banana', x: 17, b: 47, w: 2.4, label: 'Banan', stay: true, z: 95 },
      { id: 'ban4', art: 'banana', x: 20, b: 44, w: 2.4, label: 'Banan', stay: true, z: 95 },
      { id: 'ban5', art: 'banana', x: 23, b: 47, w: 2.4, label: 'Banan', stay: true, z: 95 },
      { id: 'monkey', art: 'monkey', x: 32, b: 18, w: 9, label: 'Małpka' },
      { id: 'palm2', art: 'palm', x: 92, b: 34, w: 11, deco: true },
      { id: 'parrot', art: 'parrot', x: 82, b: 40, w: 6, label: 'Papuga' },
      { id: 'j1', art: 'fern0', x: 46, b: 30, w: 9, label: 'Paproć' },
      { id: 'j2', art: 'fern1', x: 62, b: 34, w: 9, label: 'Paproć' },
      { id: 'j3', art: 'fern2', x: 68, b: 14, w: 9, label: 'Paproć' },
      { id: 'j4', art: 'fern1', x: 44, b: 6, w: 9, label: 'Paproć' },
      { id: 'j5', art: 'fern0', x: 22, b: 3, w: 9, label: 'Paproć' },
      { id: 'j6', art: 'fern2', x: 80, b: 22, w: 9, label: 'Paproć' },
    ],
  },
  zrodla: {
    label: 'Gorące źródła', bg: 'springs', walk: { maxB: 30, click: 40 }, dog: { x: 14, b: 8 },
    entities: [
      { id: 'pool', art: 'hotPool', x: 64, b: 20, w: 30, deco: true },
      { id: 'tortoise', art: 'tortoise', x: 30, b: 18, w: 15, label: 'Żółw' },
      { id: 'sulfur', art: 'sulfur', x: 88, b: 30, w: 10, label: 'Żółte kamienie' },
      { id: 'nest', art: 'warmSand', x: 52, b: 4, w: 13, label: 'Ciepły piasek' },
      { id: 'chick', art: 'chick', x: 52, b: 9, w: 4.5, label: 'Pisklę', hidden: true },
      { id: 'parrotVisit', art: 'parrot', x: 64, b: 30, w: 6, label: 'Papuga', hidden: true },
    ],
  },
  lawa: {
    label: 'Jaskinia lawy', bg: 'lavacave', walk: { maxB: 30, click: 40 }, dog: { x: 14, b: 8 },
    entities: [
      { id: 'painting', art: 'paintingRYB', x: 34, b: 46, w: 16, label: 'Malowidło' },
      { id: 'salamander', art: 'salamander', x: 58, b: 16, w: 12, label: 'Salamandra' },
      { id: 'redRock', art: 'redCrystals', x: 80, b: 18, w: 12, label: 'Czerwone kryształy' },
    ],
  },
  krater: {
    label: 'Krater', bg: 'crater', walk: { maxB: 22, click: 28 }, dog: { x: 16, b: 6 },
    entities: [
      { id: 'rainbow', art: 'rainbow', x: 60, b: 56, w: 50, deco: true, hidden: true },
      { id: 'volcano', art: 'volcanoPlug', x: 60, b: 20, w: 44, label: 'Wulkan' },
      { id: 'boulder', art: 'boulder', x: 60, b: 64, w: 8, label: 'Głaz', z: 90 },
      { id: 'iguana', art: 'iguana', x: 22, b: 14, w: 13, label: 'Legwan' },
    ],
  },
};

export const ISLAND_PLACE_IDS = Object.keys(PLACES);

// Pogawędki, gdy żadna przygoda nie potrzebuje danej postaci
const CHATTER = {
  crab: ['Klik klik!', 'Klik klik! Uwielbiam budować zamki z piasku.'],
  castle: ['Zamek', 'To zamek z piasku kraba.', 'castleIcon'],
  sand1: ['Piasek', 'Tylko piasek.'], sand2: ['Piasek', 'Tylko piasek.'], sand3: ['Piasek', 'Tylko piasek.'],
  gull: ['Kiaa!', 'Kiaa kiaa! Z góry widać całe morze!'],
  pelican: ['Cześć!', 'Cześć! Jestem pelikan rybak.'],
  basket: ['Ryby', 'Koszyk pełen ryb pelikana.'],
  penguin: ['Cześć!', 'Cześć! Lubię pływać w chłodnej wodzie.'],
  octopus: ['Bul bul!', 'Bul bul! Mam osiem rączek do pomagania!'],
  seal: ['Arf arf!', 'Arf arf! Lubię wygrzewać się na kamieniach.'],
  lighthouse: ['Latarnia', 'Latarnia pokazuje łódkom drogę w nocy.', 'lighthouseIcon'],
  monkey: ['U u a a!', 'U u a a! Lubię banany!', 'banana'],
  parrot: ['Skrrr!', 'Skrrr! Witaj w dżungli!'],
  tortoise: ['Dzień dobry', 'Dzień dobry. Jestem bardzo starym żółwiem. Mam sto lat!'],
  sulfur: ['Żółte kamienie', 'Żółte kamienie przy gorącym źródle.'],
  nest: ['Ciepło', 'Piasek przy źródle jest ciepły.'],
  chick: ['Pi pi!', 'Pi pi! Jestem malutką papużką!'],
  parrotVisit: ['Skrrr!', 'Skrrr! Moje pisklątko!'],
  painting: ['Malowidło', 'Stare malowidło na ścianie jaskini.'],
  salamander: ['Sss!', 'Sss! W jaskini lawy jest cieplutko.'],
  redRock: ['Czerwone!', 'Czerwone kryształy świecą jak ogień.'],
  volcano: ['Wulkan', 'Wielki, śpiący wulkan.'],
  boulder: ['Głaz', 'Wielki głaz.'],
  iguana: ['Hej!', 'Hej! Jestem legwan, strażnik wulkanu.'],
};
for (let i = 1; i <= 6; i++) CHATTER['j' + i] = ['Paproć', 'Tylko liście paproci.'];
for (let i = 1; i <= 5; i++) CHATTER['ban' + i] = ['Banan', 'Pyszny banan na drzewie.', 'banana'];

// Jak wyglądają miejsca po ukończonych przygodach
function decorate(api, placeId) {
  const { done } = api.world;
  if (placeId === 'plaza' && done.includes('castle')) api.setArt('castle', 'castle3');
  if (placeId === 'molo' && done.includes('lighthouse')) api.show('boat');
  if (placeId === 'latarnia' && done.includes('lighthouse')) api.setArt('lighthouse', 'lighthouseLit');
  if (placeId === 'krater' && done.includes('rainbow')) {
    api.setArt('volcano', 'volcanoOpen'); api.show('boulder', false); api.show('rainbow');
  }
  if (placeId === 'zrodla' && done.includes('egg')) { api.setArt('nest', 'nest2'); api.show('chick'); }
}

// ---------- Składanie sceny z części przygód ----------
// quests: aktywne przygody; stateOf(q): stan przygody z zapisu
export function composeScene(placeId, quests, stateOf) {
  const P = PLACES[placeId];
  return {
    label: P.label, bg: P.bg, walk: P.walk, dog: P.dog,
    entities: P.entities.map((e) => ({ ...e })),
    start(api) {
      const talk = {}; const item = {}; const intros = []; const hints = []; const holds = [];
      const parts = [];
      let leaveSaid = false;
      let winning = false;

      const refresh = () => {
        const here = parts.filter((p) => p.q.todo(placeId, p.st, api.bag.count));
        api.chip(here[0]?.q.icon || 'star', P.label, here.length === 0);
        api.tray(parts.map((p) => (here.includes(p) ? p.q.icon : { art: p.q.icon, dim: true })));
        let h = null;
        for (const fn of hints) { h = fn(); if (h) break; }
        if (h) api.hint(...h); else api.hint(null);
        return here.length;
      };
      const maybeLeave = (delay = 3600) => {
        if (leaveSaid || winning || api.finished || parts.some((x) => x.st.finished)) return;
        if (parts.some((p) => p.q.todo(placeId, p.st, api.bag.count))) return;
        leaveSaid = true;
        api.later(delay, () => {
          if (winning || parts.some((x) => x.st.finished)) return;
          api.toMap('Na mapę!', 'Tutaj na razie wszystko zrobione! Kliknij Mapa i sprawdź tablicę zadań.');
        });
      };

      for (const q of quests) {
        const setup = q.parts[placeId];
        if (!setup) continue;
        const st = stateOf(q);
        const part = { q, st };
        parts.push(part);
        setup({
          api, st, name: api.name,
          // prio: wyższa liczba = ta przygoda pierwsza pyta postać (np. płacząca papuga przed handlem)
          talk(id, fn, prio = 0) { (talk[id] ||= []).push({ fn, prio }); talk[id].sort((a, b) => b.prio - a.prio); },
          item(id, fn, prio = 0) { (item[id] ||= []).push({ fn, prio }); item[id].sort((a, b) => b.prio - a.prio); },
          intro(fn) { intros.push(fn); },
          hint(fn) { hints.push(fn); },
          hold(fn) { holds.push(fn); },
          save() { api.saveState(); refresh(); maybeLeave(); },
          win(delay = 3600) { winning = true; api.hint(null); api.win(delay, q); },
          ask(id, what, text) {
            api.say(id, 'Zajrzyj do plecaka', text, 'backpack');
            api.hint('bag', 'Plecak!', `Kliknij plecak i wyjmij ${what}!`, 'dog');
          },
        });
      }

      decorate(api, placeId);
      api.onHold((id) => holds.some((fn) => fn(id)));

      for (const e of P.entities) {
        if (e.deco) continue;
        api.on(e.id, async () => {
          const held = api.held;
          if (held) {
            for (const { fn } of item[e.id] || []) {
              if ((await fn(held)) !== false) { refresh(); return; }
            }
            api.say('dog', 'Nie tutaj', 'Hmm, to się tu nie przyda. Schowaj to do plecaka, klikając plecak.');
            return;
          }
          for (const { fn } of talk[e.id] || []) {
            if ((await fn()) !== false) { refresh(); return; }
          }
          const c = CHATTER[e.id];
          if (c) { api.hop(e.id); api.say(e.id, ...c); }
        });
      }

      // Kto się przywita: pierwsza przygoda, która ma coś do powiedzenia
      let spoke = false;
      for (const fn of intros) { if (fn()) { spoke = true; break; } }
      if (!spoke) api.later(500, () => api.say('dog', P.label, `Hau! ${P.label}!`));
      refresh();
      maybeLeave(6000);
    },
  };
}
