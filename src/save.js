// Zapis postępu w przeglądarce. Jeśli localStorage nie działa, gra po prostu nie pamięta.
const KEY = 'pies-na-tropie-v1';

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return { name: s.name || '', done: Array.isArray(s.done) ? s.done : [] };
    }
  } catch (e) { /* brak zapisu */ }
  return { name: '', done: [] };
}

export function writeSave(save) {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* brak zapisu */ }
}
