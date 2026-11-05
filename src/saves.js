// Zapisy gry: kilka slotów w localStorage. Każdy slot to osobny piesek z własnym postępem.
// Gra zapisuje się sama przy każdej zmianie (writeSave), więc można wyjść w dowolnej chwili.
const KEY = 'pies-na-tropie-saves-v2';
const OLD_KEY = 'pies-na-tropie-v1';
export const SLOTS = 3;

function blank() { return { slots: Array(SLOTS).fill(null), last: null }; }

function normalize(s) {
  if (!s || typeof s !== 'object' || !s.name) return null;
  return {
    name: s.name,
    done: Array.isArray(s.done) ? s.done : [],
    bag: Array.isArray(s.bag) ? s.bag : [],
    flags: s.flags && typeof s.flags === 'object' ? s.flags : {},
    region: s.region || 'dolina',
    resume: s.resume || null,
    outfit: s.outfit && typeof s.outfit === 'object' ? s.outfit : null,
    seenItems: Array.isArray(s.seenItems) ? s.seenItems : [],
    reading: !!s.reading,
    created: s.created || Date.now(),
    updated: s.updated || Date.now(),
  };
}

export function loadAll() {
  let all = blank();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      all.slots = Array.from({ length: SLOTS }, (_, i) => normalize(s.slots?.[i]));
      all.last = Number.isInteger(s.last) && all.slots[s.last] ? s.last : null;
    } else {
      // Przeniesienie zapisu z pierwszej wersji gry do slotu 1
      const old = normalize(JSON.parse(localStorage.getItem(OLD_KEY) || 'null'));
      if (old) { all.slots[0] = old; all.last = 0; storeAll(all); }
    }
  } catch (e) { all = blank(); }
  return all;
}

function storeAll(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* brak zapisu */ }
}

export function newSave(name) {
  return normalize({ name, created: Date.now() });
}

export function storeSlot(i, save) {
  const all = loadAll();
  save.updated = Date.now();
  all.slots[i] = save;
  all.last = i;
  storeAll(all);
}

export function deleteSlot(i) {
  const all = loadAll();
  all.slots[i] = null;
  if (all.last === i) all.last = all.slots.findIndex(Boolean) >= 0 ? all.slots.findIndex(Boolean) : null;
  storeAll(all);
}

// „dziś”, „wczoraj”, „3 dni temu” – do kart zapisów
export function whenText(ts) {
  const day = 86400000;
  const start = new Date(); start.setHours(0, 0, 0, 0);
  if (ts >= start.getTime()) return 'dziś';
  if (ts >= start.getTime() - day) return 'wczoraj';
  const n = Math.ceil((start.getTime() - ts) / day);
  return `${n} dni temu`;
}
