// Przedmioty, które mogą trafić do plecaka. `art` to klucz z art.js.
// Formy: [1 orzech, 2–4 orzechy, 5+ orzechów] – do czytania na głos.
export const ITEMS = {
  nut: { art: 'nut', forms: ['orzech', 'orzechy', 'orzechów'] },
  invite: { art: 'invite', forms: ['zaproszenie', 'zaproszenia', 'zaproszeń'] },
  egg: { art: 'egg', forms: ['koszyk jajek', 'koszyki jajek', 'koszyków jajek'] },
  flower: { art: 'flower', forms: ['bukiet kwiatów', 'bukiety kwiatów', 'bukietów kwiatów'] },
  mushroom: { art: 'mushroom', forms: ['grzybek', 'grzybki', 'grzybków'] },
  wool: { art: 'wool', forms: ['kłębek wełny', 'kłębki wełny', 'kłębków wełny'] },
  lantern: { art: 'lantern', forms: ['latarka', 'latarki', 'latarek'] },
  crystal: { art: 'crystal', forms: ['kryształ', 'kryształy', 'kryształów'] },
  bell: { art: 'bell', forms: ['dzwonek', 'dzwonki', 'dzwonków'] },
  sandwich: { art: 'sandwich', forms: ['kanapka', 'kanapki', 'kanapek'] },
  basket: { art: 'basket', forms: ['koszyk kanapek', 'koszyki kanapek', 'koszyków kanapek'] },
  plank: { art: 'plankItem', forms: ['deska', 'deski', 'desek'] },
  rope: { art: 'rope', forms: ['lina', 'liny', 'lin'] },
  stone: { art: 'stoneIcon', forms: ['płaski kamień', 'płaskie kamienie', 'płaskich kamieni'] },
  note: { art: 'note', forms: ['nutka', 'nutki', 'nutek'] },
  whistle: { art: 'whistle', forms: ['gwizdek', 'gwizdki', 'gwizdków'] },
};

const NUM = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć', 'dziesięć'];

export function countWord(n) { return NUM[n] || String(n); }

export function itemPhrase(id, n) {
  const f = ITEMS[id]?.forms || [id, id, id];
  const form = n === 1 ? f[0] : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) ? f[1] : f[2];
  return `${countWord(n)} ${form}`;
}
