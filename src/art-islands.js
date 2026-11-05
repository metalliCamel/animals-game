// Grafiki Plaży i Wulkanu. Dołączane do ART w art.js.
const inner = (svg) => svg.replace(/<\/?svg[^>]*>/g, '');
const eye = (x, y, r = 3.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#2E3A2A"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`;

// ---------- Zwierzątka ----------
const crab = `<svg viewBox="0 0 110 80">
<path d="M30 50 l-14 14 M34 56 l-10 18 M80 50 l14 14 M76 56 l10 18" stroke="#C83F4A" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="55" cy="48" rx="28" ry="18" fill="#E2525C"/><ellipse cx="55" cy="42" rx="20" ry="9" fill="#F07A82"/>
<path d="M40 34 v-14 M70 34 v-14" stroke="#E2525C" stroke-width="4"/><circle cx="40" cy="18" r="6" fill="#FFFBF0"/><circle cx="70" cy="18" r="6" fill="#FFFBF0"/>${eye(41, 18, 3)}${eye(71, 18, 3)}
<path d="M28 44 C12 40 6 26 14 18 C18 26 24 28 28 26 C24 22 24 14 30 12 C34 20 34 32 30 40 Z" fill="#E2525C"/>
<path d="M82 44 C98 40 104 26 96 18 C92 26 86 28 82 26 C86 22 86 14 80 12 C76 20 76 32 80 40 Z" fill="#E2525C"/>
<path d="M48 54 q7 5 14 0" stroke="#8A2A32" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const pelican = `<svg viewBox="0 0 120 120">
<path d="M42 104 l-4 12 M58 104 l4 12" stroke="#F08A24" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="50" cy="80" rx="28" ry="26" fill="#FFFBF0" stroke="#E2DCD0" stroke-width="2"/>
<path d="M24 74 C30 62 48 62 56 80 C44 92 30 90 24 74 Z" fill="#C9CED3"/>
<path d="M56 58 C54 40 58 30 64 26" stroke="#FFFBF0" stroke-width="16" fill="none" stroke-linecap="round"/>
<circle cx="66" cy="24" r="14" fill="#FFFBF0" stroke="#E2DCD0" stroke-width="2"/>
<path d="M72 22 L118 34 L74 32 Z" fill="#F7A24A"/><path d="M74 32 C88 34 104 36 116 36 C104 50 84 52 76 40 Z" fill="#F7C46A"/>
${eye(66, 20, 3.2)}<path d="M58 12 q6 -8 12 -2" stroke="#E2DCD0" stroke-width="3" fill="none"/>
</svg>`;

const gull = `<svg viewBox="0 0 100 90">
<path d="M44 74 l-2 14 M56 74 l2 14" stroke="#F0B42E" stroke-width="3.5" stroke-linecap="round"/>
<ellipse cx="48" cy="56" rx="28" ry="20" fill="#FFFBF0" stroke="#E2DCD0" stroke-width="2"/>
<path d="M22 50 C32 36 58 38 66 52 C50 62 32 62 22 50 Z" fill="#9AA6B2"/><path d="M22 50 L6 58 L24 58 Z" fill="#2E3A2A"/>
<circle cx="72" cy="36" r="14" fill="#FFFBF0" stroke="#E2DCD0" stroke-width="2"/>
<path d="M84 36 L100 40 L84 44 Z" fill="#F0B42E"/><circle cx="92" cy="41" r="1.8" fill="#E2525C"/>${eye(76, 33, 3)}
</svg>`;

const octopus = `<svg viewBox="0 0 120 110">
${[18, 32, 46, 60, 74, 88, 102].map((x, i) => `<path d="M${50 + (x - 60) * 0.3} 64 C${x - 6} 80 ${x + 8} 92 ${x} 104" stroke="#9B6BC9" stroke-width="9" fill="none" stroke-linecap="round"/>${i % 2 ? `<circle cx="${x}" cy="94" r="2" fill="#E6D3F5"/>` : ''}`).join('')}
<ellipse cx="60" cy="44" rx="34" ry="32" fill="#B48FD8"/><ellipse cx="50" cy="28" rx="10" ry="7" fill="#C9AEE6"/>
<circle cx="48" cy="48" r="7" fill="#FFFBF0"/><circle cx="72" cy="48" r="7" fill="#FFFBF0"/>${eye(49, 49, 4)}${eye(73, 49, 4)}
<path d="M54 62 q6 5 12 0" stroke="#5B3A80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<ellipse cx="40" cy="58" rx="5" ry="3" fill="#F7A2C0" opacity=".7"/><ellipse cx="80" cy="58" rx="5" ry="3" fill="#F7A2C0" opacity=".7"/>
</svg>`;

const penguin = `<svg viewBox="0 0 80 110">
<ellipse cx="30" cy="104" rx="10" ry="4" fill="#F08A24"/><ellipse cx="50" cy="104" rx="10" ry="4" fill="#F08A24"/>
<ellipse cx="40" cy="66" rx="28" ry="38" fill="#26303A"/><ellipse cx="40" cy="72" rx="18" ry="28" fill="#FFFBF0"/>
<path d="M12 56 C2 68 4 84 12 88 C14 76 16 66 12 56 Z M68 56 C78 68 76 84 68 88 C66 76 64 66 68 56 Z" fill="#26303A"/>
<circle cx="32" cy="34" r="6" fill="#FFFBF0"/><circle cx="48" cy="34" r="6" fill="#FFFBF0"/>${eye(33, 35, 3)}${eye(49, 35, 3)}
<path d="M34 44 L46 44 L40 52 Z" fill="#F08A24"/>
</svg>`;

const seal = `<svg viewBox="0 0 130 90">
<path d="M10 70 C2 62 4 52 12 54 L22 62 Z M6 80 C0 76 2 68 10 68 L22 70 Z" fill="#6E7C88"/>
<path d="M18 68 C30 40 70 34 92 44 C104 52 104 76 92 82 C70 90 30 88 18 68 Z" fill="#8A98A6"/>
<ellipse cx="66" cy="72" rx="20" ry="9" fill="#B9C4CE"/>
<path d="M60 80 C56 88 68 90 74 84 Z" fill="#6E7C88"/>
<circle cx="104" cy="40" r="20" fill="#8A98A6"/>
${eye(100, 34, 4)}${eye(114, 34, 4)}<ellipse cx="116" cy="46" rx="6" ry="4" fill="#3A444E"/>
<path d="M110 50 l-16 -2 M110 52 l-16 4 M120 50 l10 -4 M120 52 l10 2" stroke="#3A444E" stroke-width="1.5"/>
</svg>`;

const iguana = `<svg viewBox="0 0 140 80">
<path d="M10 62 C20 70 40 68 50 60" stroke="#3F8F3A" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M42 58 C48 40 92 36 106 48 C110 60 96 70 70 70 C56 70 46 66 42 58 Z" fill="#5DB048"/>
${[54, 64, 74, 84, 94].map((x) => `<path d="M${x - 4} ${46 - (x > 80 ? 2 : 0)} L${x} ${34 - (x > 80 ? 2 : 0)} L${x + 4} ${46 - (x > 80 ? 2 : 0)} Z" fill="#F0B42E"/>`).join('')}
<path d="M60 66 l-6 12 M90 66 l6 12 M70 68 l-2 10 M82 68 l2 10" stroke="#3F8F3A" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="118" cy="46" rx="20" ry="13" fill="#6CC24A"/><ellipse cx="108" cy="58" rx="8" ry="6" fill="#F7A24A"/>
${eye(124, 42, 3.4)}<path d="M128 52 q6 2 10 -2" stroke="#2E6A2A" stroke-width="2" fill="none"/>
</svg>`;

const parrot = `<svg viewBox="0 0 80 120">
<path d="M34 86 L22 118 L40 92 Z" fill="#2B6CB0"/><path d="M42 88 L44 120 L50 90 Z" fill="#E2525C"/>
<ellipse cx="40" cy="62" rx="20" ry="28" fill="#E2525C"/>
<path d="M22 52 C10 66 14 86 26 90 C28 74 28 62 22 52 Z" fill="#2B6CB0"/><path d="M24 72 C20 78 22 86 26 88" stroke="#FFD25A" stroke-width="4" fill="none"/>
<circle cx="44" cy="30" r="16" fill="#E2525C"/>
<path d="M54 26 C66 26 66 42 56 44 C58 38 56 32 52 32 Z" fill="#3A3A3A"/>
<ellipse cx="44" cy="28" rx="8" ry="6" fill="#FFFBF0"/>${eye(46, 28, 3)}
<path d="M34 92 l-4 8 M46 92 l4 8" stroke="#3A3A3A" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const monkey = `<svg viewBox="0 0 100 110">
<path d="M74 86 C96 84 96 56 82 54" stroke="#8A5528" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse cx="50" cy="78" rx="24" ry="26" fill="#8A5528"/><ellipse cx="50" cy="84" rx="14" ry="16" fill="#E2B47C"/>
<circle cx="24" cy="38" r="10" fill="#8A5528"/><circle cx="76" cy="38" r="10" fill="#8A5528"/><circle cx="24" cy="38" r="5" fill="#E2B47C"/><circle cx="76" cy="38" r="5" fill="#E2B47C"/>
<circle cx="50" cy="40" r="24" fill="#8A5528"/>
<path d="M32 40 C32 28 46 26 50 34 C54 26 68 28 68 40 C68 56 32 56 32 40 Z" fill="#E2B47C"/>
${eye(42, 38, 3.5)}${eye(58, 38, 3.5)}<path d="M42 50 q8 6 16 0" stroke="#5E3A1A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M28 74 q-10 -6 -4 -16 M72 74 q10 -6 4 -16" stroke="#8A5528" stroke-width="8" fill="none" stroke-linecap="round"/>
</svg>`;

const salamander = `<svg viewBox="0 0 130 70">
<path d="M6 46 C20 56 34 52 42 44" stroke="#2E2A26" stroke-width="9" fill="none" stroke-linecap="round"/>
<ellipse cx="68" cy="42" rx="32" ry="13" fill="#2E2A26"/>
<path d="M48 50 l-8 14 M84 50 l8 14 M56 52 l-2 12 M78 52 l2 12" stroke="#2E2A26" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="108" cy="36" rx="18" ry="12" fill="#2E2A26"/>
${[[50, 36], [64, 46], [76, 34], [88, 44], [24, 50], [104, 28], [112, 42]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.5" fill="#FFD25A"/>`).join('')}
<circle cx="112" cy="30" r="5" fill="#FFFBF0"/>${eye(113, 30, 3)}<path d="M112 44 q6 2 12 -2" stroke="#FFD25A" stroke-width="2" fill="none"/>
</svg>`;

const tortoise = `<svg viewBox="0 0 150 100">
<path d="M34 84 v12 M60 88 v10 M94 88 v10 M118 84 v12" stroke="#8C9389" stroke-width="12" stroke-linecap="round"/>
<path d="M18 76 C18 26 128 26 128 76 Z" fill="#7A6A4E"/>
${[[46, 52], [72, 44], [98, 52], [60, 66], [86, 66]].map(([x, y]) => `<path d="M${x - 12} ${y} l6 -10 h12 l6 10 l-6 10 h-12 z" fill="#9A8A64" stroke="#5E5038" stroke-width="2"/>`).join('')}
<rect x="14" y="72" width="118" height="10" rx="5" fill="#5E5038"/>
<path d="M126 66 C140 60 148 66 146 76 C140 82 130 80 124 76 Z" fill="#A3AAA0"/>
<circle cx="138" cy="66" r="3.5" fill="#2E3A2A"/><circle cx="138" cy="66" r="7" fill="none" stroke="#5E5038" stroke-width="2"/><circle cx="128" cy="66" r="6" fill="none" stroke="#5E5038" stroke-width="2"/><path d="M132 66 h0" stroke="#5E5038"/>
<path d="M134 76 q6 2 10 -2" stroke="#4A4038" stroke-width="2" fill="none"/>
</svg>`;

const chick = `<svg viewBox="0 0 60 60"><ellipse cx="30" cy="38" rx="18" ry="16" fill="#7FD06A"/><circle cx="32" cy="20" r="12" fill="#7FD06A"/><path d="M40 18 C48 18 48 28 42 30 C42 26 40 24 38 24 Z" fill="#3A3A3A"/>${eye(34, 18, 2.6)}<path d="M26 8 q2 -6 6 -2 q2 -6 6 0" stroke="#E2525C" stroke-width="3" fill="none"/><path d="M14 36 q-8 4 -2 10" stroke="#5DB048" stroke-width="4" fill="none"/></svg>`;

// ---------- Plaża: rekwizyty ----------
const umbrella = `<svg viewBox="0 0 100 120"><path d="M50 30 V118" stroke="#9A6A3C" stroke-width="4"/><path d="M6 40 C10 10 90 10 94 40 Z" fill="#E2525C"/><path d="M28 40 C30 18 50 12 50 12 C50 12 70 18 72 40 Z" fill="#FFFBF0"/><path d="M6 40 q11 -6 22 0 q11 -6 22 0 q11 -6 22 0 q11 -6 22 0" fill="#E2525C"/></svg>`;
const sandMound = `<svg viewBox="0 0 80 36"><ellipse cx="40" cy="32" rx="36" ry="4" fill="#0001"/><path d="M4 32 C10 10 70 10 76 32 Z" fill="#D9B070" stroke="#B8904E" stroke-width="2"/><path d="M20 22 q8 -6 16 0" stroke="#F0D59C" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
const castleSvg = (stage) => `<svg viewBox="0 0 120 110">
<ellipse cx="60" cy="104" rx="56" ry="6" fill="#0001"/>
${stage === 0 ? '<path d="M10 104 C14 82 30 76 44 84 C50 70 66 70 74 84 C88 76 106 84 110 104 Z" fill="#E8C98A"/><path d="M30 90 l10 -8 M70 88 l12 4 M50 96 l6 -6" stroke="#C9A96A" stroke-width="3" stroke-linecap="round"/>' : ''}
${stage >= 1 ? '<rect x="14" y="70" width="92" height="34" rx="3" fill="#E8C98A"/><path d="M14 70 v-8 h12 v8 h10 v-8 h12 v8 h10 v-8 h12 v8 h10 v-8 h12 v8" fill="#E8C98A"/><rect x="50" y="84" width="20" height="20" rx="10" fill="#C9A96A"/>' : ''}
${stage >= 2 ? '<rect x="38" y="34" width="44" height="36" rx="3" fill="#F0D59C"/><path d="M38 34 v-8 h10 v8 h8 v-8 h8 v8 h8 v-8 h10 v8" fill="#F0D59C"/><rect x="54" y="44" width="12" height="12" rx="6" fill="#C9A96A"/>' : ''}
${stage >= 3 ? '<path d="M60 26 V4" stroke="#9A6A3C" stroke-width="3"/><path d="M60 4 L80 10 L60 16 Z" fill="#E2525C"/>' : ''}
</svg>`;
const castleIcon = castleSvg(3);
const partBig = `<svg viewBox="0 0 100 50"><rect x="4" y="16" width="92" height="30" rx="3" fill="#E8C98A"/><path d="M4 16 v-8 h12 v8 h10 v-8 h12 v8 h10 v-8 h12 v8 h10 v-8 h12 v8" fill="#E8C98A"/></svg>`;
const partMid = `<svg viewBox="0 0 60 50"><rect x="8" y="14" width="44" height="34" rx="3" fill="#F0D59C"/><path d="M8 14 v-8 h10 v8 h8 v-8 h8 v8 h8 v-8 h10 v8" fill="#F0D59C"/></svg>`;
const partSmall = `<svg viewBox="0 0 30 40"><path d="M10 38 V6" stroke="#9A6A3C" stroke-width="3"/><path d="M10 6 L28 12 L10 18 Z" fill="#E2525C"/></svg>`;
const bucket = `<svg viewBox="0 0 44 44"><path d="M10 14 C10 2 34 2 34 14" stroke="#2B6CB0" stroke-width="3" fill="none"/><path d="M6 14 h32 l-4 26 h-24 z" fill="#7FC7E8"/><rect x="6" y="12" width="32" height="5" rx="2" fill="#2B6CB0"/></svg>`;
const fireBucket = bucket.replace('</svg>', '<circle cx="22" cy="12" r="7" fill="#F7A24A"/><circle cx="22" cy="12" r="4" fill="#FFE79A"/><path d="M14 6 l-3 -4 M30 6 l3 -4 M22 3 v-3" stroke="#F7A24A" stroke-width="2" stroke-linecap="round"/></svg>');
const shell = `<svg viewBox="0 0 44 40"><path d="M22 36 C6 34 2 18 10 10 C16 4 28 4 34 10 C42 18 38 34 22 36 Z" fill="#F7C9C9" stroke="#E09AA6" stroke-width="2"/>${[12, 17, 22, 27, 32].map((x) => `<path d="M22 34 L${x} 8" stroke="#E09AA6" stroke-width="1.5"/>`).join('')}<rect x="16" y="32" width="12" height="6" rx="3" fill="#E09AA6"/></svg>`;
const boat = `<svg viewBox="0 0 120 90"><path d="M56 6 V62" stroke="#7A5530" stroke-width="4"/><path d="M60 10 L100 54 L60 54 Z" fill="#FFFBF0" stroke="#E2DCD0" stroke-width="2"/><path d="M52 16 L24 54 L52 54 Z" fill="#E2525C"/><path d="M6 62 h108 l-14 22 h-80 z" fill="#C99A5E"/><path d="M10 68 h100" stroke="#9A6A3C" stroke-width="3"/></svg>`;
const post = `<svg viewBox="0 0 30 80"><rect x="6" y="4" width="18" height="76" rx="4" fill="#9A6A3C"/><path d="M6 20 h18 M6 50 h18" stroke="#7A5530" stroke-width="3"/></svg>`;
const fishArt = (c = '#F7A24A') => `<g><ellipse cx="0" cy="0" rx="11" ry="6" fill="${c}"/><path d="M10 0 L18 -6 L18 6 Z" fill="${c}"/><circle cx="-6" cy="-1.5" r="1.6" fill="#2E3A2A"/></g>`;
const fishBasket = (n) => `<svg viewBox="0 0 100 70"><path d="M8 30 h84 l-8 36 h-68 z" fill="#7FB8D8" stroke="#2B6CB0" stroke-width="3"/><path d="M14 40 h72 M16 52 h68" stroke="#2B6CB0" stroke-width="2.5"/>${Array.from({ length: n }, (_, i) => `<g transform="translate(${18 + i * 16} ${22 - (i % 2) * 6}) rotate(${i % 2 ? 20 : -15})">${fishArt(['#F7A24A', '#7FC7E8', '#F7A2C0', '#FFD25A', '#9BD06A'][i])}</g>`).join('')}</svg>`;
const dotCard = (n) => `<svg viewBox="0 0 60 70"><rect x="3" y="3" width="54" height="64" rx="10" fill="#FFFBF0" stroke="#2B6CB0" stroke-width="3"/><text x="30" y="30" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#2B6CB0">${n}</text>${Array.from({ length: n }, (_, i) => `<circle cx="${12 + (i % 3) * 18}" cy="${44 + Math.floor(i / 3) * 12}" r="4.5" fill="#F7A24A"/>`).join('')}</svg>`;
const featherC = (c, stroke) => `<svg viewBox="0 0 40 50"><path d="M10 46 C6 30 14 10 32 4 C34 22 26 38 10 46 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/><path d="M12 44 C18 32 24 20 30 8" stroke="${stroke}" stroke-width="2" fill="none"/></svg>`;
const featherWhite = featherC('#FFFFFF', '#D8D1C6');
const featherGrey = featherC('#9AA6B2', '#6E7C88');
const featherBlack = featherC('#2E3A2A', '#1A221A');
const lighthouse = (lit) => `<svg viewBox="0 0 100 170">
${lit ? '<path d="M56 30 L200 0 L200 60 Z" fill="#FFF2B0" opacity=".8"/><path d="M44 30 L-100 0 L-100 60 Z" fill="#FFF2B0" opacity=".6"/>' : ''}
<path d="M30 166 L38 56 H62 L70 166 Z" fill="#FFFBF0"/><path d="M33 130 H67 L68 150 H32 Z M36 90 H64 L65 108 H35 Z" fill="#E2525C"/>
<rect x="34" y="44" width="32" height="12" rx="2" fill="#3A444E"/><rect x="38" y="20" width="24" height="24" rx="3" fill="${lit ? '#FFE79A' : '#5E6A74'}" stroke="#3A444E" stroke-width="4"/>
<path d="M34 20 L50 4 L66 20 Z" fill="#E2525C"/><rect x="44" y="140" width="12" height="26" rx="5" fill="#3A444E"/>
</svg>`;
const lensFrame = `<svg viewBox="0 0 160 70"><rect x="4" y="4" width="152" height="62" rx="14" fill="#5E6A74"/><rect x="10" y="10" width="140" height="50" rx="10" fill="#3A444E"/></svg>`;
const lensShape = (shape, filled) => {
  const fill = filled ? '#BFE6F5' : 'none';
  const st = filled ? '#7FC7E8' : '#9AA6B2';
  const dash = filled ? '' : 'stroke-dasharray="5 4"';
  const p = shape === 'tri' ? `<path d="M30 6 L54 52 L6 52 Z" fill="${fill}" stroke="${st}" stroke-width="4" ${dash} stroke-linejoin="round"/>`
    : shape === 'square' ? `<rect x="8" y="8" width="44" height="44" rx="4" fill="${fill}" stroke="${st}" stroke-width="4" ${dash}/>`
      : `<circle cx="30" cy="30" r="23" fill="${fill}" stroke="${st}" stroke-width="4" ${dash}/>`;
  return `<svg viewBox="0 0 60 60">${p}${filled ? '<path d="M18 18 l10 -6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' : ''}</svg>`;
};
const fireStone = `<svg viewBox="0 0 40 40"><circle cx="20" cy="22" r="14" fill="#F7A24A"/><circle cx="20" cy="22" r="8" fill="#FFE79A"/><path d="M10 10 l-4 -4 M30 10 l4 -4 M20 6 v-5" stroke="#F7A24A" stroke-width="3" stroke-linecap="round"/></svg>`;
const coral = `<svg viewBox="0 0 100 100"><path d="M50 98 V60 M50 70 C34 60 30 44 32 30 M50 64 C64 56 70 40 66 24 M32 40 C22 36 18 26 20 16 M66 34 C78 30 82 20 80 10" stroke="#F7A2C0" stroke-width="10" fill="none" stroke-linecap="round"/></svg>`;
const seaweed = `<svg viewBox="0 0 60 120"><path d="M20 120 C6 90 34 70 18 40 C10 26 20 12 24 4 M40 120 C30 96 50 80 40 56" stroke="#4E9E3C" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
const rockSea = `<svg viewBox="0 0 110 50"><path d="M6 48 C2 26 26 10 54 10 C84 10 108 26 104 48 Z" fill="#7A8794"/><path d="M28 24 q14 -10 34 -6" stroke="#9AA6B2" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
const beakMarks = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#F7E2B4"/>${[[12, 14], [24, 12], [18, 24], [28, 26], [10, 28]].map(([x, y]) => `<path d="M${x} ${y} l3 5 l-6 0 z" fill="#C9A96A"/>`).join('')}</svg>`;
const walkPrints = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#F7E2B4"/>${[[10, 30], [18, 22], [26, 14]].map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse rx="3.5" ry="4.5" fill="#9A6A3C"/><circle cx="-3" cy="-6" r="1.5" fill="#9A6A3C"/><circle cx="0" cy="-7" r="1.5" fill="#9A6A3C"/><circle cx="3" cy="-6" r="1.5" fill="#9A6A3C"/></g>`).join('')}</svg>`;
const greyFluff = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#E4ECF4"/>${[[14, 20], [20, 15], [26, 20], [20, 25]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#9AA6B2"/>`).join('')}</svg>`;
const noClue = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#E6E9DD"/><path d="M12 12 l16 16 M28 12 l-16 16" stroke="#9AA38E" stroke-width="4" stroke-linecap="round"/></svg>`;

// ---------- Wulkan: rekwizyty ----------
const palm = `<svg viewBox="0 0 100 170"><path d="M50 168 C46 120 54 80 50 50" stroke="#9A6A3C" stroke-width="10" fill="none"/><path d="M50 54 C30 30 10 34 2 46 C18 40 34 44 50 54 Z M50 54 C70 30 90 34 98 46 C82 40 66 44 50 54 Z M50 52 C40 24 20 14 8 18 C24 24 40 36 50 52 Z M50 52 C60 24 80 14 92 18 C76 24 60 36 50 52 Z M50 50 C50 26 56 10 62 4 C58 20 54 36 50 50 Z" fill="#3F8F3A"/><circle cx="46" cy="58" r="6" fill="#8A5528"/><circle cx="56" cy="60" r="6" fill="#8A5528"/></svg>`;
const bananaTree = `<svg viewBox="0 0 120 160"><path d="M60 158 C56 120 62 80 60 60" stroke="#9A6A3C" stroke-width="12" fill="none"/><path d="M60 64 C30 40 6 48 0 66 C24 56 42 58 60 64 Z M60 64 C90 40 114 48 120 66 C96 56 78 58 60 64 Z M60 60 C50 26 28 14 12 20 C32 28 48 42 60 60 Z M60 60 C70 26 92 14 108 20 C88 28 72 42 60 60 Z" fill="#5DB048"/></svg>`;
const banana = `<svg viewBox="0 0 30 40"><path d="M14 4 C4 14 6 30 22 36 C14 28 12 16 18 6 Z" fill="#FFD25A" stroke="#D9A62E" stroke-width="2"/><rect x="13" y="1" width="5" height="6" rx="2" fill="#7A5530"/></svg>`;
const bamboo = `<svg viewBox="0 0 70 20"><rect x="2" y="6" width="66" height="9" rx="4" fill="#9BD06A" stroke="#5DB048" stroke-width="2"/><path d="M20 6 v9 M40 6 v9 M58 6 v9" stroke="#5DB048" stroke-width="2.5"/><path d="M44 6 q6 -6 12 -4" stroke="#5DB048" stroke-width="2" fill="none"/></svg>`;
const leaves = `<svg viewBox="0 0 44 40"><path d="M6 34 C6 14 20 4 38 6 C36 24 24 34 6 34 Z" fill="#5DB048"/><path d="M8 32 C16 22 26 14 36 8" stroke="#3F8F3A" stroke-width="2.5" fill="none"/><path d="M16 36 C20 22 30 18 42 20 C36 32 26 38 16 36 Z" fill="#7FC75A"/></svg>`;
const fern = (v) => `<svg viewBox="0 0 90 60"><ellipse cx="45" cy="56" rx="40" ry="4" fill="#0002"/>${[-50, -25, 0, 25, 50].map((a, i) => `<path d="M45 56 C${45 + a * 0.4} 40 ${45 + a * 0.8} 24 ${45 + a} ${10 + Math.abs(a) * 0.3}" stroke="${['#3F8F3A', '#4E9E3C', '#5DB048'][(i + v) % 3]}" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}</svg>`;
const parrotEgg = `<svg viewBox="0 0 40 46"><ellipse cx="20" cy="26" rx="15" ry="19" fill="#FFFBF0" stroke="#E6DCC0" stroke-width="2"/><circle cx="14" cy="20" r="2.5" fill="#7FC7E8"/><circle cx="24" cy="30" r="3" fill="#7FC7E8"/><circle cx="26" cy="16" r="2" fill="#F7A2C0"/><circle cx="14" cy="34" r="2" fill="#F7A2C0"/></svg>`;
const eggCracked = parrotEgg.replace('</svg>', '<path d="M6 24 l6 -4 l5 5 l6 -6 l5 5 l6 -4" stroke="#5E5038" stroke-width="2" fill="none"/></svg>');
const nestStage = (st) => `<svg viewBox="0 0 120 60"><ellipse cx="60" cy="54" rx="56" ry="6" fill="#0001"/><path d="M8 50 C10 30 110 30 112 50 Z" fill="#E8C98A"/>
${st >= 1 ? '<path d="M18 44 C20 28 100 28 102 44 C80 52 40 52 18 44 Z" fill="#5DB048"/><path d="M24 40 l12 -8 M50 36 l6 -10 M78 38 l10 -8" stroke="#3F8F3A" stroke-width="3"/>' : ''}
${st >= 2 ? '<ellipse cx="60" cy="38" rx="30" ry="8" fill="#FFFFFF" stroke="#E6DCC0" stroke-width="2"/>' : ''}
${st >= 3 ? `<g transform="translate(46 4) scale(.7)">${inner(parrotEgg)}</g>` : ''}
</svg>`;
const hotPool = `<svg viewBox="0 0 200 80"><ellipse cx="100" cy="56" rx="96" ry="22" fill="#8C7A64"/><ellipse cx="100" cy="52" rx="84" ry="16" fill="#7FD3D6"/><ellipse cx="80" cy="48" rx="30" ry="5" fill="#B9ECEE"/>
${[60, 100, 140].map((x, i) => `<path d="M${x} 40 C${x - 10} 28 ${x + 10} 20 ${x} 6" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"><animate attributeName="opacity" values=".7;.2;.7" dur="${2.5 + i * 0.6}s" repeatCount="indefinite"/></path>`).join('')}</svg>`;
const sulfur = `<svg viewBox="0 0 100 70"><path d="M6 66 C2 40 30 18 52 22 C80 18 100 40 94 66 Z" fill="#6E5E4A"/>${[[30, 34], [52, 28], [70, 40], [42, 50]].map(([x, y]) => `<path d="M${x} ${y} l8 -12 l8 12 l-8 10 z" fill="#FFD84A" stroke="#D9A62E" stroke-width="2"/>`).join('')}</svg>`;
const warmSand = `<svg viewBox="0 0 120 40"><ellipse cx="60" cy="24" rx="56" ry="14" fill="#E8C98A"/><path d="M30 18 q6 -8 12 0 M70 16 q6 -8 12 0" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".7"/></svg>`;
const gem = (c, s) => `<svg viewBox="0 0 40 40"><path d="M20 4 L34 16 L20 36 L6 16 Z" fill="${c}" stroke="${s}" stroke-width="2.5" stroke-linejoin="round"/><path d="M6 16 H34 M20 4 L14 16 L20 36 L26 16 Z" stroke="${s}" stroke-width="1.5" fill="none"/></svg>`;
const stoneRed = gem('#F06A5A', '#B8323C');
const stoneYellow = gem('#FFD84A', '#D9A62E');
const stoneBlue = gem('#7FB8F0', '#2B6CB0');
const redCrystals = `<svg viewBox="0 0 110 70"><ellipse cx="55" cy="66" rx="50" ry="4" fill="#0004"/><path d="M12 66 C8 50 30 40 56 42 C84 40 104 52 98 66 Z" fill="#4A3A30"/>${[[30, 10, 12, 40], [52, 0, 14, 50], [74, 16, 12, 36]].map(([x, y, w, h]) => `<path d="M${x} ${y + 10} L${x + w / 2} ${y} L${x + w} ${y + 10} L${x + w * 0.8} ${y + h + 10} L${x + w * 0.2} ${y + h + 10} Z" fill="#F06A5A" stroke="#B8323C" stroke-width="1.5"/>`).join('')}</svg>`;
const COLORS = { R: ['#F06A5A', '#B8323C'], Y: ['#FFD84A', '#D9A62E'], B: ['#7FB8F0', '#2B6CB0'] };
const painting = (order) => `<svg viewBox="0 0 140 90"><rect x="3" y="3" width="134" height="84" rx="8" fill="#6B5444" stroke="#4A3A30" stroke-width="4"/>
<path d="M20 78 L70 22 L120 78 Z" fill="#8A6A54"/><path d="M60 34 L70 22 L80 34 Z" fill="#F7A24A"/>
${order.split('').map((c, i) => `<circle cx="${40 + i * 30}" cy="18" r="10" fill="${COLORS[c][0]}" stroke="${COLORS[c][1]}" stroke-width="2.5"/><text x="${40 + i * 30}" y="23" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="13" fill="#FFFBF0">${i + 1}</text>`).join('')}
</svg>`;
const volcano = (mood) => `<svg viewBox="0 0 200 140">
${mood === 'erupt' ? '<path d="M100 20 C80 -10 60 -10 50 4 M100 20 C120 -10 140 -10 150 4 M100 18 V-20" stroke="#F7A24A" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/>' : ''}
<path d="M4 138 L72 26 H128 L196 138 Z" fill="#6B5B52"/><path d="M72 26 H128 L120 40 C110 34 90 34 80 40 Z" fill="${mood === 'plug' ? '#4A3E36' : '#F7A24A'}"/>
<path d="M78 60 C70 90 64 110 56 138 M126 66 C134 96 140 116 148 138" stroke="#8A7A70" stroke-width="5" fill="none" opacity=".6"/>
${mood === 'plug' ? '' : '<path d="M96 36 C92 60 84 80 80 100" stroke="#F7A24A" stroke-width="6" fill="none" stroke-linecap="round"/>'}
<circle cx="80" cy="84" r="8" fill="#FFFBF0"/><circle cx="120" cy="84" r="8" fill="#FFFBF0"/>
${mood === 'plug' ? '<path d="M72 78 l14 4 M128 78 l-14 4" stroke="#2E2A26" stroke-width="3"/><circle cx="80" cy="86" r="4" fill="#2E2A26"/><circle cx="120" cy="86" r="4" fill="#2E2A26"/><path d="M88 110 q12 -8 24 0" stroke="#2E2A26" stroke-width="4" fill="none" stroke-linecap="round"/>'
    : '<circle cx="80" cy="84" r="4" fill="#2E2A26"/><circle cx="120" cy="84" r="4" fill="#2E2A26"/><path d="M86 102 q14 14 28 0" stroke="#2E2A26" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="66" cy="98" rx="8" ry="4" fill="#F7A2A2" opacity=".6"/><ellipse cx="134" cy="98" rx="8" ry="4" fill="#F7A2A2" opacity=".6"/>'}
</svg>`;
const boulder = `<svg viewBox="0 0 70 50"><path d="M6 46 C0 26 18 6 36 6 C56 6 72 24 64 46 Z" fill="#8C8389"/><path d="M20 20 q10 -8 22 -4" stroke="#A9A0A6" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
const rainbow = `<svg viewBox="0 0 200 100">${['#F06A5A', '#F7A24A', '#FFD84A', '#7FD06A', '#7FB8F0', '#B48FD8'].map((c, i) => `<path d="M${10 + i * 8} 100 A${90 - i * 8} ${90 - i * 8} 0 0 1 ${190 - i * 8} 100" stroke="${c}" stroke-width="8" fill="none"/>`).join('')}</svg>`;
const volcanoIcon = `<svg viewBox="0 0 44 40"><path d="M2 38 L16 12 H28 L42 38 Z" fill="#6B5B52"/><path d="M16 12 H28 L26 16 C24 14 20 14 18 16 Z" fill="#F7A24A"/><path d="M22 10 C18 4 14 4 12 6 M22 10 C26 4 30 4 32 6" stroke="#F06A5A" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
const lighthouseIcon = `<svg viewBox="0 0 40 44"><path d="M12 42 L15 14 H25 L28 42 Z" fill="#FFFBF0" stroke="#3A444E" stroke-width="1.5"/><path d="M13 30 H27 L27.5 36 H12.5 Z" fill="#E2525C"/><rect x="14" y="6" width="12" height="8" rx="2" fill="#FFE79A" stroke="#3A444E" stroke-width="2"/><path d="M26 10 L40 4 V16 Z" fill="#FFE79A" opacity=".7"/></svg>`;

const listIcon = `<svg viewBox="0 0 40 44"><rect x="5" y="6" width="30" height="36" rx="5" fill="#FFFBF0" stroke="#2B6CB0" stroke-width="3"/><rect x="13" y="2" width="14" height="8" rx="3" fill="#2B6CB0"/><path d="M11 20 l3 3 l5 -6 M11 32 l3 3 l5 -6" stroke="#3F8F3A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 20 h7 M23 32 h7" stroke="#9AA6B2" stroke-width="3" stroke-linecap="round"/></svg>`;

export const ISLAND_ART = {
  listIcon,
  crab, pelican, gull, octopus, penguin, seal, iguana, parrot, monkey, salamander, tortoise, chick,
  umbrella, sandMound, castleRuin: castleSvg(0), castle1: castleSvg(1), castle2: castleSvg(2), castle3: castleSvg(3), castleIcon,
  partBig, partMid, partSmall, bucket, fireBucket, shell, boat, post,
  fishBasket3: fishBasket(3), fishBasket4: fishBasket(4), fishBasket5: fishBasket(5),
  dots3: dotCard(3), dots4: dotCard(4), dots5: dotCard(5),
  featherWhite, featherGrey, featherBlack,
  lighthouseDark: lighthouse(false), lighthouseLit: lighthouse(true), lensFrame,
  lensTri: lensShape('tri', true), lensSquare: lensShape('square', true), lensCircle: lensShape('circle', true),
  slotTri: lensShape('tri', false), slotSquare: lensShape('square', false), slotCircle: lensShape('circle', false),
  fireStone, coral, seaweed, rockSea, beakMarks, walkPrints, greyFluff, noClue,
  palm, bananaTree, banana, bamboo, leaves, fern0: fern(0), fern1: fern(1), fern2: fern(2),
  parrotEgg, eggCracked, nest0: nestStage(0), nest1: nestStage(1), nest2: nestStage(2), nest3: nestStage(3),
  hotPool, sulfur, warmSand, stoneRed, stoneYellow, stoneBlue, redCrystals,
  volcanoPlug: volcano('plug'), volcanoOpen: volcano('open'), volcanoErupt: volcano('erupt'), boulder, rainbow, volcanoIcon, lighthouseIcon,
};
for (const o of ['RYB', 'RBY', 'YRB', 'YBR', 'BRY', 'BYR']) ISLAND_ART['painting' + o] = painting(o);
