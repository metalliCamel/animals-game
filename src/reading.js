// „Czytanie z pieskiem”: pomoc w nauce czytania.
// Słowa w dymkach są dzielone na sylaby (na zmianę dwoma kolorami), po chwili na samodzielną próbę
// piesek czyta je słowo po słowie z podświetleniem, a kliknięte słowo czyta powoli sylabami.

let on = false;
export const setReading = (v) => { on = !!v; };
export const isReading = () => on;

const VOWELS = 'aąeęioóuy';
const DIGRAPHS = ['ch', 'cz', 'dz', 'dź', 'dż', 'rz', 'sz'];

// Podział polskiego słowa na sylaby (prosta reguła wystarczająca dla dymków):
// samogłoska = jądro sylaby (oprócz „i” przed samogłoską, które tylko zmiękcza: „pies”, „dzię-ku-ję”);
// jedna spółgłoska między samogłoskami idzie do następnej sylaby, z kilku pierwsza zostaje w poprzedniej.
export function syllables(word) {
  const lower = word.toLowerCase();
  const units = [];
  for (let i = 0; i < lower.length;) {
    const two = lower.slice(i, i + 2);
    const len = DIGRAPHS.includes(two) ? 2 : 1;
    units.push({ s: word.slice(i, i + len), l: lower.slice(i, i + len) });
    i += len;
  }
  // „i” przed samogłoską tylko zmiękcza: dokleja się do spółgłoski przed nim (ni, si, wi...)
  for (let i = units.length - 2; i >= 0; i--) {
    const u = units[i];
    if (u.l === 'i' && VOWELS.includes(units[i + 1].l) && i > 0 && !VOWELS.includes(units[i - 1].l)) {
      units[i - 1] = { s: units[i - 1].s + u.s, l: units[i - 1].l + u.l };
      units.splice(i, 1);
    }
  }
  units.forEach((u, i) => {
    const prev = units[i - 1];
    u.v = VOWELS.includes(u.l.slice(-1)) && u.l.length === 1
      && !(u.l === 'i' && units[i + 1] && VOWELS.includes(units[i + 1].l))
      && !(u.l === 'u' && prev && (prev.l === 'a' || prev.l === 'e')); // au, eu = jedna sylaba
  });
  const nuclei = units.map((u, i) => (u.v ? i : -1)).filter((i) => i >= 0);
  if (nuclei.length < 2) return [word];
  const cuts = [];
  for (let k = 0; k < nuclei.length - 1; k++) {
    const a = nuclei[k];
    const b = nuclei[k + 1];
    const cons = b - a - 1;
    // kr, pl, bł... na początku sylaby zostają razem („o-krusz-ki”)
    const pair = cons === 2 && 'rlłj'.includes(units[b - 1].l) && !'rlłjmnw'.includes(units[a + 1].l);
    cuts.push(cons <= 1 || pair ? a + 1 : a + 2);
  }
  const out = [];
  let start = 0;
  for (const c of cuts) { out.push(units.slice(start, c).map((u) => u.s).join('')); start = c; }
  out.push(units.slice(start).map((u) => u.s).join(''));
  return out.filter(Boolean);
}

// Krótki tekst dymka na słowa (z interpunkcją przyklejoną do słowa)
export function words(text) {
  return text.split(/\s+/).filter(Boolean).map((w) => {
    const m = w.match(/^([^\p{L}]*)([\p{L}-]+)?([^\p{L}]*)$/u) || [];
    return { pre: m[1] || '', word: m[2] || '', post: m[3] || (m[2] ? '' : w) };
  });
}

// HTML dymka: każde słowo osobno, sylaby na zmianę w dwóch kolorach
export function wordsHtml(text) {
  return words(text).map((w, i) => {
    const syl = w.word ? syllables(w.word).map((s, j) => `<span class="syl s${j % 2}">${s}</span>`).join('') : '';
    return `<span class="rw" data-w="${i}">${w.pre}${syl}${w.post}</span>`;
  }).join(' ');
}
