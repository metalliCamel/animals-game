// Szafa pieska: kolor sierści i ubranka. Ubranka odblokowują się za ukończone przygody.
// Piesek jest rysowany w dwóch widokach: z boku (w scenach) i od przodu (mapa, ekrany).

export const DEFAULT_OUTFIT = { fur: 'rudy', hat: null, eyes: null, neck: 'collar', back: null };

// main, dark (tylne łapy, ogon), spot (łatki, uszy), muzzle (pyszczek)
export const FURS = [
  { id: 'rudy', label: 'Rudy', c: ['#D6964F', '#B87638', '#8A5528', '#F1C48E'] },
  { id: 'biszkopt', label: 'Biszkoptowy', c: ['#E8C98A', '#D4AE6A', '#B8864E', '#FFF3DC'] },
  { id: 'czekolada', label: 'Czekoladowy', c: ['#8A5528', '#6E4220', '#4A2C14', '#D9B08A'] },
  { id: 'szary', label: 'Szary', c: ['#A9B0B8', '#8C939C', '#5E666E', '#E4E8EC'] },
  { id: 'czarny', label: 'Czarny', c: ['#4A4038', '#3A322C', '#2A2420', '#C9B49A'] },
  { id: 'laciaty', label: 'Łaciaty', c: ['#FFFBF0', '#E8E2D6', '#3A322C', '#FFFFFF'] },
];

// Kształty ubranek. Czapki: (0,0) to środek dolnej krawędzi. Szyja: (0,0) to środek obroży.
const HAT = {
  bow: '<path d="M0 -4 C-10 -16 -20 -6 -14 2 C-8 6 -4 2 0 -2 Z M0 -4 C10 -16 20 -6 14 2 C8 6 4 2 0 -2 Z" fill="#F7A2C0" stroke="#E07A9A" stroke-width="1.5"/><circle cx="0" cy="-3" r="4" fill="#E07A9A"/>',
  sunhat: '<ellipse cx="0" cy="0" rx="26" ry="6" fill="#E2525C"/><path d="M-15 0 C-15 -20 15 -20 15 0 Z" fill="#E2525C"/><rect x="-15" y="-7" width="30" height="5" fill="#FFD25A"/><circle cx="12" cy="-8" r="5" fill="#FFFBF0"/><circle cx="12" cy="-8" r="2" fill="#FFD25A"/>',
  detective: '<path d="M-18 0 C-18 -22 18 -22 18 0 Z" fill="#9A7A52"/><path d="M-18 -6 h36 M-14 -14 h28 M-6 -20 v20 M6 -20 v20" stroke="#7A5A36" stroke-width="2"/><path d="M14 -2 L30 2 L16 4 Z" fill="#7A5A36"/><circle cx="0" cy="-21" r="3" fill="#7A5A36"/>',
  wreath: ['#F7A2C0', '#FFD25A', '#FFFBF0', '#B48FD8', '#F7A2C0', '#FFD25A'].map((c, i) => { const a = Math.PI * (0.1 + i * 0.16); const x = -Math.cos(a) * 20; const y = -Math.sin(a) * 8 - 2; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${c}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#F08A24"/>`; }).join('') + '<path d="M-21 -2 q21 -14 42 0" stroke="#5DB048" stroke-width="3" fill="none"/>',
  helmet: '<path d="M-19 0 C-19 -24 19 -24 19 0 Z" fill="#FFD25A" stroke="#D9A62E" stroke-width="2"/><rect x="-21" y="-3" width="42" height="5" rx="2" fill="#D9A62E"/><rect x="-5" y="-17" width="10" height="8" rx="2" fill="#FFFBF0" stroke="#3A444E" stroke-width="1.5"/><path d="M5 -13 L18 -18 L18 -8 Z" fill="#FFF2B0" opacity=".8"/>',
  chef: '<rect x="-13" y="-10" width="26" height="10" rx="2" fill="#FFFFFF" stroke="#D8D1C6" stroke-width="1.5"/><circle cx="-9" cy="-16" r="8" fill="#FFFFFF" stroke="#D8D1C6" stroke-width="1.5"/><circle cx="9" cy="-16" r="8" fill="#FFFFFF" stroke="#D8D1C6" stroke-width="1.5"/><circle cx="0" cy="-22" r="9" fill="#FFFFFF" stroke="#D8D1C6" stroke-width="1.5"/>',
  pirate: '<path d="M-26 0 C-18 -6 -12 -22 0 -22 C12 -22 18 -6 26 0 C12 -4 -12 -4 -26 0 Z" fill="#26303A"/><path d="M-22 -1 C-10 -5 10 -5 22 -1" stroke="#FFD25A" stroke-width="2" fill="none"/><circle cx="0" cy="-12" r="4" fill="#FFFBF0"/><path d="M-3 -8 l6 0" stroke="#FFFBF0" stroke-width="2"/>',
};
const NECK = {
  collar: '<path d="M-8 -2 q8 -4 16 4" stroke="#E2525C" stroke-width="7" fill="none" stroke-linecap="round"/>',
  bandana: '<path d="M-10 -4 L10 -4 L0 12 Z" fill="#2B6CB0"/><circle cx="-3" cy="0" r="1.5" fill="#FFFBF0"/><circle cx="3" cy="3" r="1.5" fill="#FFFBF0"/><path d="M-10 -4 L10 -4" stroke="#1F548C" stroke-width="4" stroke-linecap="round"/>',
  bowtie: '<path d="M0 0 L-12 -7 L-12 7 Z M0 0 L12 -7 L12 7 Z" fill="#E2525C"/><circle cx="0" cy="0" r="3.5" fill="#B8323C"/>',
  scarf: '<path d="M-11 -4 C-4 2 4 2 11 -4 L11 3 C4 9 -4 9 -11 3 Z" fill="#E2525C"/><path d="M-6 0 v6 M0 1 v7 M6 0 v6" stroke="#FFFBF0" stroke-width="2.5"/><path d="M5 5 L9 18 L14 16 L10 4 Z" fill="#E2525C"/><path d="M9 18 l5 -2" stroke="#FFFBF0" stroke-width="2"/>',
  medal: '<path d="M-6 -4 L0 8 L6 -4" stroke="#2B6CB0" stroke-width="4" fill="none"/><circle cx="0" cy="12" r="6" fill="#FFD25A" stroke="#D9A62E" stroke-width="2"/><path d="M0 9 l1 2 l2 0 l-1.5 1.5 l0.5 2 l-2 -1 l-2 1 l0.5 -2 l-1.5 -1.5 l2 0 z" fill="#FFFBF0"/>',
};

export const ITEMS = [
  // Na głowę
  { id: 'bow', slot: 'hat', label: 'Kokardka', unlock: null },
  { id: 'sunhat', slot: 'hat', label: 'Kapelusz kaczki', unlock: 'parcel' },
  { id: 'detective', slot: 'hat', label: 'Czapka detektywa', unlock: 'carrots' },
  { id: 'wreath', slot: 'hat', label: 'Wianek z kwiatków', unlock: 'party' },
  { id: 'helmet', slot: 'hat', label: 'Kask górski', unlock: 'bell' },
  { id: 'chef', slot: 'hat', label: 'Czapka kucharza', unlock: 'sandwich' },
  { id: 'pirate', slot: 'hat', label: 'Kapelusz pirata', unlock: 'castle' },
  // Okulary
  { id: 'round', slot: 'eyes', label: 'Okrągłe okulary', unlock: null },
  { id: 'sun', slot: 'eyes', label: 'Okulary od słońca', unlock: 'lighthouse' },
  { id: 'stars', slot: 'eyes', label: 'Okulary gwiazdki', unlock: 'concert' },
  // Na szyję
  { id: 'collar', slot: 'neck', label: 'Czerwona obroża', unlock: null },
  { id: 'bandana', slot: 'neck', label: 'Niebieska chustka', unlock: 'yarn' },
  { id: 'scarf', slot: 'neck', label: 'Ciepły szalik', unlock: 'nuts' },
  { id: 'bowtie', slot: 'neck', label: 'Muszka', unlock: 'party' },
  { id: 'medal', slot: 'neck', label: 'Medal budowniczego', unlock: 'bridge' },
  // Na plecy
  { id: 'cape', slot: 'back', label: 'Ognista peleryna', unlock: 'rainbow' },
  { id: 'wings', slot: 'back', label: 'Skrzydełka papużki', unlock: 'egg' },
];
export const SLOTS = [
  { id: 'fur', label: 'Futerko' },
  { id: 'hat', label: 'Na głowę' },
  { id: 'eyes', label: 'Okulary' },
  { id: 'neck', label: 'Na szyję' },
  { id: 'back', label: 'Na plecy' },
];

export const isUnlocked = (item, done) => !item.unlock || done.includes(item.unlock);
export const unlockedBy = (advId) => ITEMS.filter((i) => i.unlock === advId);
const furOf = (o) => (FURS.find((f) => f.id === o.fur) || FURS[0]).c;

// ---------- Piesek z boku (sceny) ----------
export function dogSvg(outfit = DEFAULT_OUTFIT) {
  const o = { ...DEFAULT_OUTFIT, ...outfit };
  const [main, dark, spot, muzzle] = furOf(o);
  const back = o.back === 'cape'
    ? '<path d="M84 46 C70 40 40 40 26 52 C30 66 24 76 34 80 C44 70 54 78 62 70 C70 78 78 66 84 60 Z" fill="#F06A5A"/><path d="M80 50 C66 46 44 46 32 56 C36 64 34 70 40 72 C48 64 56 70 62 64 C70 70 76 62 80 58 Z" fill="#F7A24A"/>'
    : o.back === 'wings'
      ? '<path d="M60 44 C50 20 30 18 26 30 C24 40 40 46 60 46 Z" fill="#7FB8F0" stroke="#2B6CB0" stroke-width="2"/><path d="M58 46 C46 30 34 30 32 38 C32 44 44 48 58 48 Z" fill="#F06A5A" stroke="#B8323C" stroke-width="1.5"/>'
      : '';
  const eyes = o.eyes === 'round'
    ? '<circle cx="100" cy="30" r="8" fill="#FFFFFF" fill-opacity=".25" stroke="#3A444E" stroke-width="2.5"/><path d="M92 29 L84 26" stroke="#3A444E" stroke-width="2.5"/>'
    : o.eyes === 'sun'
      ? '<circle cx="100" cy="30" r="8.5" fill="#26303A" stroke="#3A444E" stroke-width="2.5"/><path d="M96 26 l3 -2" stroke="#7FB8F0" stroke-width="2"/><path d="M91 29 L84 26" stroke="#3A444E" stroke-width="2.5"/>'
      : o.eyes === 'stars'
        ? '<path d="M100 20 l3 7 l7 1 l-5 5 l1.5 7 l-6.5 -3.5 l-6.5 3.5 l1.5 -7 l-5 -5 l7 -1 z" fill="#FFD25A" fill-opacity=".8" stroke="#E0A92E" stroke-width="2"/><path d="M91 29 L84 26" stroke="#E0A92E" stroke-width="2.5"/>'
        : '';
  const hat = o.hat && HAT[o.hat] ? `<g transform="translate(97 16) rotate(8)">${HAT[o.hat]}</g>` : '';
  const neck = NECK[o.neck] ? `<g transform="translate(87 53) rotate(-20) scale(.85)">${NECK[o.neck]}</g>` : '';
  return `<svg viewBox="0 0 130 100">
<path d="M22 50 C8 40 10 22 18 18" stroke="${dark}" stroke-width="9" fill="none" stroke-linecap="round"/>
<rect x="30" y="62" width="11" height="30" rx="5" fill="${dark}"/><rect x="68" y="62" width="11" height="30" rx="5" fill="${dark}"/>
<ellipse cx="55" cy="58" rx="36" ry="22" fill="${main}"/>
<ellipse cx="42" cy="52" rx="12" ry="9" fill="${spot}"/>
<rect x="40" y="66" width="11" height="28" rx="5" fill="${main}"/><rect x="78" y="66" width="11" height="28" rx="5" fill="${main}"/>
${back}${neck}
<circle cx="96" cy="36" r="22" fill="${main}"/>
<ellipse cx="112" cy="44" rx="14" ry="10" fill="${muzzle}"/>
<circle cx="124" cy="40" r="5.5" fill="#2E3A2A"/>
<circle cx="100" cy="30" r="4.5" fill="#2E3A2A"/><circle cx="101.5" cy="28.5" r="1.5" fill="#fff"/>
${eyes}
<path d="M84 18 C70 18 70 46 80 50 C86 44 88 28 84 18 Z" fill="${spot}"/>
<path d="M110 52 q5 4 10 0" stroke="#2E3A2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
${hat}
</svg>`;
}

// ---------- Piesek od przodu (mapa, karty, szafa) ----------
export function pupSvg(outfit = DEFAULT_OUTFIT) {
  const o = { ...DEFAULT_OUTFIT, ...outfit };
  const [main, , spot, muzzle] = furOf(o);
  const back = o.back === 'cape'
    ? '<path d="M30 70 C14 90 16 104 30 100 C40 108 52 100 65 104 C78 100 90 108 100 100 C114 104 116 90 100 70 Z" fill="#F06A5A"/>'
    : o.back === 'wings'
      ? '<path d="M30 60 C6 40 -4 60 6 74 C14 84 26 76 34 70 Z M100 60 C124 40 134 60 124 74 C116 84 104 76 96 70 Z" fill="#7FB8F0" stroke="#2B6CB0" stroke-width="2"/>'
      : '';
  const lens = (x) => (o.eyes === 'round'
    ? `<circle cx="${x}" cy="44" r="10" fill="#FFFFFF" fill-opacity=".25" stroke="#3A444E" stroke-width="3"/>`
    : o.eyes === 'sun'
      ? `<circle cx="${x}" cy="44" r="10.5" fill="#26303A" stroke="#3A444E" stroke-width="3"/><path d="M${x - 5} 39 l4 -2" stroke="#7FB8F0" stroke-width="2.5"/>`
      : `<path d="M${x} 32 l3.5 8 l8.5 1 l-6.5 6 l2 8.5 l-7.5 -4.5 l-7.5 4.5 l2 -8.5 l-6.5 -6 l8.5 -1 z" fill="#FFD25A" fill-opacity=".85" stroke="#E0A92E" stroke-width="2"/>`);
  const eyes = o.eyes ? `${lens(52)}${lens(78)}<path d="M62 44 h6" stroke="${o.eyes === 'stars' ? '#E0A92E' : '#3A444E'}" stroke-width="3"/>` : '';
  const hat = o.hat && HAT[o.hat] ? `<g transform="translate(65 18) scale(1.5)">${HAT[o.hat]}</g>` : '';
  const neck = NECK[o.neck] && o.neck !== 'collar' ? `<g transform="translate(65 88) scale(1.3)">${NECK[o.neck]}</g>` : '';
  return `<svg viewBox="0 0 130 100" style="overflow:visible">${back}<circle cx="65" cy="52" r="38" fill="${main}"/><path d="M38 22 C16 22 16 70 32 74 C42 64 44 38 38 22 Z M92 22 C114 22 114 70 98 74 C88 64 86 38 92 22 Z" fill="${spot}"/><ellipse cx="65" cy="68" rx="20" ry="14" fill="${muzzle}"/><circle cx="65" cy="60" r="7" fill="#2E3A2A"/><circle cx="52" cy="44" r="5" fill="#2E3A2A"/><circle cx="78" cy="44" r="5" fill="#2E3A2A"/>${eyes}<path d="M58 74 q7 6 14 0" stroke="#2E3A2A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="65" cy="84" rx="6" ry="7" fill="#E2525C"/>${neck}${hat}</svg>`;
}
