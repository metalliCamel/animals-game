// Przedmioty, które mogą trafić do plecaka. `art` to klucz z art.js.
// Formy: [1 orzech, 2–4 orzechy, 5+ orzechów] – do czytania na głos.
export const ITEMS = {
  nut: { art: 'nut', forms: ['orzech', 'orzechy', 'orzechów'] },
};

const NUM = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć', 'dziesięć'];

export function countWord(n) { return NUM[n] || String(n); }

export function itemPhrase(id, n) {
  const f = ITEMS[id]?.forms || [id, id, id];
  const form = n === 1 ? f[0] : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) ? f[1] : f[2];
  return `${countWord(n)} ${form}`;
}
