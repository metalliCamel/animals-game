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
  lensTri: { art: 'lensTri', forms: ['szkiełko-trójkąt', 'szkiełka-trójkąty', 'szkiełek-trójkątów'] },
  lensSquare: { art: 'lensSquare', forms: ['szkiełko-kwadrat', 'szkiełka-kwadraty', 'szkiełek-kwadratów'] },
  lensCircle: { art: 'lensCircle', forms: ['szkiełko-koło', 'szkiełka-koła', 'szkiełek-kół'] },
  bucket: { art: 'bucket', forms: ['wiaderko', 'wiaderka', 'wiaderek'] },
  fireBucket: { art: 'fireBucket', forms: ['ognisty kamyk w wiaderku', 'ogniste kamyki', 'ognistych kamyków'] },
  shell: { art: 'shell', forms: ['muszla', 'muszle', 'muszli'] },
  banana: { art: 'banana', forms: ['banan', 'banany', 'bananów'] },
  bamboo: { art: 'bamboo', forms: ['bambus', 'bambusy', 'bambusów'] },
  red: { art: 'stoneRed', forms: ['czerwony kamień', 'czerwone kamienie', 'czerwonych kamieni'] },
  yellow: { art: 'stoneYellow', forms: ['żółty kamień', 'żółte kamienie', 'żółtych kamieni'] },
  blue: { art: 'stoneBlue', forms: ['niebieski kamień', 'niebieskie kamienie', 'niebieskich kamieni'] },
  parrotEgg: { art: 'parrotEgg', forms: ['jajko', 'jajka', 'jajek'] },
  leaves: { art: 'leaves', forms: ['liście', 'liście', 'liści'] },
  featherWhite: { art: 'featherWhite', forms: ['białe piórko', 'białe piórka', 'białych piórek'] },
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
