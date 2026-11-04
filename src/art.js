// Grafiki postaci i rekwizytów jako SVG. Każda grafika to funkcja lub string z własnym viewBox.

const yarn = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#E2525C"/><path d="M8 14 q12 6 24 -2 M6 22 q14 6 28 -4 M10 30 q10 2 22 -6 M16 5 q-6 14 4 30" stroke="#B8323C" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M33 28 q6 4 4 10" stroke="#E2525C" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

const bush = `<svg viewBox="0 0 120 80"><ellipse cx="60" cy="76" rx="50" ry="5" fill="#0002"/><circle cx="30" cy="52" r="24" fill="#4E9E3C"/><circle cx="60" cy="38" r="30" fill="#5DB048"/><circle cx="90" cy="52" r="24" fill="#4E9E3C"/><rect x="10" y="50" width="100" height="26" rx="13" fill="#5DB048"/><circle cx="48" cy="32" r="5" fill="#8ED16E"/><circle cx="80" cy="46" r="4" fill="#8ED16E"/></svg>`;

const tree = `<svg viewBox="0 0 120 150"><rect x="50" y="80" width="20" height="70" rx="6" fill="#9A6A3C"/><circle cx="60" cy="55" r="45" fill="#5EAA45"/><circle cx="30" cy="75" r="28" fill="#6DBB50"/><circle cx="90" cy="72" r="30" fill="#4F9A3B"/><circle cx="48" cy="40" r="6" fill="#E2525C"/><circle cx="78" cy="58" r="6" fill="#E2525C"/><circle cx="36" cy="70" r="6" fill="#E2525C"/></svg>`;

const cat = `<svg viewBox="0 0 100 110">
<path d="M78 95 C100 90 98 60 86 58" stroke="#E08A35" stroke-width="9" fill="none" stroke-linecap="round"/>
<ellipse cx="50" cy="80" rx="28" ry="26" fill="#F0A04B"/>
<path d="M36 70 q6 6 0 12 M50 66 q6 8 0 16 M64 70 q6 6 0 12" stroke="#D9802F" stroke-width="4" fill="none" stroke-linecap="round"/>
<ellipse cx="38" cy="104" rx="9" ry="5" fill="#F7B86A"/><ellipse cx="62" cy="104" rx="9" ry="5" fill="#F7B86A"/>
<path d="M24 36 L28 8 L44 26 Z M76 36 L72 8 L56 26 Z" fill="#F0A04B"/><path d="M29 28 L31 15 L39 25 Z M71 28 L69 15 L61 25 Z" fill="#F7C9C9"/>
<circle cx="50" cy="40" r="26" fill="#F0A04B"/>
<circle cx="40" cy="38" r="4.5" fill="#2E3A2A"/><circle cx="60" cy="38" r="4.5" fill="#2E3A2A"/>
<circle cx="41.5" cy="36.5" r="1.5" fill="#fff"/><circle cx="61.5" cy="36.5" r="1.5" fill="#fff"/>
<path d="M47 46 L53 46 L50 50 Z" fill="#E2525C"/><path d="M44 53 q6 5 12 0" stroke="#2E3A2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M30 48 L14 45 M30 52 L15 55 M70 48 L86 45 M70 52 L85 55" stroke="#7A5530" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const dog = `<svg viewBox="0 0 130 100">
<path d="M22 50 C8 40 10 22 18 18" stroke="#B87638" stroke-width="9" fill="none" stroke-linecap="round"/>
<rect x="30" y="62" width="11" height="30" rx="5" fill="#B87638"/><rect x="68" y="62" width="11" height="30" rx="5" fill="#B87638"/>
<ellipse cx="55" cy="58" rx="36" ry="22" fill="#D6964F"/>
<ellipse cx="42" cy="52" rx="12" ry="9" fill="#8A5528"/>
<rect x="40" y="66" width="11" height="28" rx="5" fill="#D6964F"/><rect x="78" y="66" width="11" height="28" rx="5" fill="#D6964F"/>
<path d="M80 52 q8 -4 14 4" stroke="#E2525C" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="96" cy="36" r="22" fill="#D6964F"/>
<ellipse cx="112" cy="44" rx="14" ry="10" fill="#F1C48E"/>
<circle cx="124" cy="40" r="5.5" fill="#2E3A2A"/>
<circle cx="100" cy="30" r="4.5" fill="#2E3A2A"/><circle cx="101.5" cy="28.5" r="1.5" fill="#fff"/>
<path d="M84 18 C70 18 70 46 80 50 C86 44 88 28 84 18 Z" fill="#8A5528"/>
<path d="M110 52 q5 4 10 0" stroke="#2E3A2A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

const pupFace = `<svg viewBox="0 0 130 100"><circle cx="65" cy="52" r="38" fill="#D6964F"/><path d="M38 22 C16 22 16 70 32 74 C42 64 44 38 38 22 Z M92 22 C114 22 114 70 98 74 C88 64 86 38 92 22 Z" fill="#8A5528"/><ellipse cx="65" cy="68" rx="20" ry="14" fill="#F1C48E"/><circle cx="65" cy="60" r="7" fill="#2E3A2A"/><circle cx="52" cy="44" r="5" fill="#2E3A2A"/><circle cx="78" cy="44" r="5" fill="#2E3A2A"/><path d="M58 74 q7 6 14 0" stroke="#2E3A2A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="65" cy="84" rx="6" ry="7" fill="#E2525C"/></svg>`;

// Mała kaczka do rysunku na paczce i ikon
const duckMini = `<g><circle cx="20" cy="22" r="10" fill="#FFD84A"/><circle cx="26" cy="14" r="6.5" fill="#FFD84A"/><path d="M31 13 L38 15 L31 17 Z" fill="#F08A24"/><circle cx="27.5" cy="12.5" r="1.6" fill="#2E3A2A"/></g>`;

const parcel = `<svg viewBox="0 0 44 44"><rect x="3" y="9" width="38" height="32" rx="4" fill="#C98E55"/><rect x="3" y="9" width="38" height="8" rx="3" fill="#B67B44"/><rect x="19" y="9" width="6" height="32" fill="#E2525C"/><rect x="7" y="20" width="18" height="17" rx="3" fill="#FFFBF0" transform="translate(-1 0)"/><g transform="translate(5 18) scale(.5)">${duckMini}</g><path d="M22 9 q-8 -9 -12 -3 q4 4 12 3 q8 1 12 -3 q-4 -6 -12 3" fill="#E2525C"/></svg>`;

const duckIcon = `<svg viewBox="0 0 44 40"><g transform="translate(-2 0) scale(1.1)">${duckMini}</g></svg>`;

function duck(hat) {
  return `<svg viewBox="0 0 120 100">
<ellipse cx="58" cy="88" rx="48" ry="7" fill="#7FC7E8"/>
<path d="M18 62 C18 92 98 92 98 62 C98 52 82 50 70 56 L30 56 C24 54 18 54 18 62 Z" fill="#FFD84A"/>
<path d="M14 58 L26 50 L28 64 Z" fill="#F7C43A"/>
<path d="M40 64 q14 10 30 0" stroke="#F0B42E" stroke-width="5" fill="none" stroke-linecap="round"/>
<circle cx="80" cy="38" r="20" fill="#FFD84A"/>
<path d="M96 38 L114 42 L96 48 Z" fill="#F08A24"/>
<circle cx="86" cy="33" r="4" fill="#2E3A2A"/><circle cx="87.3" cy="31.7" r="1.3" fill="#fff"/>
<ellipse cx="74" cy="44" rx="5" ry="3" fill="#F7A2A2" opacity=".7"/>
${hat ? `<ellipse cx="78" cy="20" rx="24" ry="6" fill="#E2525C"/><path d="M64 20 C64 2 92 2 92 20 Z" fill="#E2525C"/><rect x="64" y="12" width="28" height="5" fill="#FFD25A"/><circle cx="90" cy="12" r="5" fill="#FFFBF0"/><circle cx="90" cy="12" r="2" fill="#FFD25A"/>` : ''}
</svg>`;
}

const owl = `<svg viewBox="0 0 100 140">
<rect x="18" y="98" width="64" height="40" rx="6" fill="#9A6A3C"/><ellipse cx="50" cy="98" rx="32" ry="8" fill="#C79A64"/><ellipse cx="50" cy="98" rx="20" ry="4" fill="none" stroke="#9A6A3C" stroke-width="2"/>
<ellipse cx="50" cy="66" rx="28" ry="32" fill="#9B7653"/>
<ellipse cx="50" cy="74" rx="17" ry="20" fill="#E9D3B0"/>
<path d="M42 70 q4 4 8 0 q4 4 8 0 M42 80 q4 4 8 0 q4 4 8 0" stroke="#C9A97E" stroke-width="2" fill="none"/>
<path d="M22 60 C12 74 16 90 26 94 C28 80 28 70 22 60 Z M78 60 C88 74 84 90 74 94 C72 80 72 70 78 60 Z" fill="#7E5D3F"/>
<path d="M26 30 L30 44 L40 38 Z M74 30 L70 44 L60 38 Z" fill="#7E5D3F"/>
<circle cx="39" cy="50" r="11" fill="#FFFBF0"/><circle cx="61" cy="50" r="11" fill="#FFFBF0"/>
<circle cx="40" cy="51" r="5.5" fill="#2E3A2A"/><circle cx="60" cy="51" r="5.5" fill="#2E3A2A"/>
<circle cx="41.5" cy="49" r="1.8" fill="#fff"/><circle cx="61.5" cy="49" r="1.8" fill="#fff"/>
<path d="M46 58 L54 58 L50 66 Z" fill="#F08A24"/>
<path d="M28 34 C30 18 70 18 72 34 Z" fill="#2B6CB0"/><rect x="24" y="32" width="52" height="6" rx="3" fill="#1F548C"/><circle cx="50" cy="26" r="4" fill="#FFD25A"/>
<path d="M38 96 l-4 6 M44 97 l0 6 M56 97 l0 6 M62 96 l4 6" stroke="#F08A24" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const frog = `<svg viewBox="0 0 110 80">
<path d="M8 66 C8 52 102 52 102 66 C102 80 8 80 8 66 Z" fill="#4E9E3C"/><path d="M55 60 L64 70 L46 70 Z" fill="#7FC7E8"/>
<ellipse cx="55" cy="50" rx="26" ry="16" fill="#6CC24A"/>
<circle cx="42" cy="32" r="10" fill="#6CC24A"/><circle cx="68" cy="32" r="10" fill="#6CC24A"/>
<circle cx="42" cy="31" r="5" fill="#2E3A2A"/><circle cx="68" cy="31" r="5" fill="#2E3A2A"/>
<circle cx="43.5" cy="29.5" r="1.6" fill="#fff"/><circle cx="69.5" cy="29.5" r="1.6" fill="#fff"/>
<path d="M44 50 q11 8 22 0" stroke="#2E7A2A" stroke-width="3" fill="none" stroke-linecap="round"/>
<ellipse cx="30" cy="62" rx="9" ry="4" fill="#5AAE3E"/><ellipse cx="80" cy="62" rx="9" ry="4" fill="#5AAE3E"/>
</svg>`;

const hedgehog = `<svg viewBox="0 0 120 80">
<path d="M14 66 L10 50 L22 52 L18 36 L32 42 L32 26 L44 36 L48 20 L58 34 L66 20 L72 36 L82 26 L84 42 L96 40 L90 56 L100 62 Z" fill="#7A5530"/>
<ellipse cx="54" cy="58" rx="40" ry="18" fill="#8F6740"/>
<path d="M84 46 C100 46 112 58 114 62 C106 70 92 72 82 70 Z" fill="#F1D3A8"/>
<circle cx="114" cy="61" r="4" fill="#2E3A2A"/>
<circle cx="96" cy="54" r="3.5" fill="#2E3A2A"/><circle cx="97" cy="53" r="1.1" fill="#fff"/>
<ellipse cx="90" cy="64" rx="4" ry="2.5" fill="#F7A2A2" opacity=".7"/>
<ellipse cx="40" cy="76" rx="7" ry="4" fill="#5E4227"/><ellipse cx="74" cy="76" rx="7" ry="4" fill="#5E4227"/>
</svg>`;

const reeds = `<svg viewBox="0 0 60 120"><path d="M14 120 C14 80 10 50 12 20 M30 120 C30 70 32 40 30 6 M46 120 C46 86 50 60 48 30" stroke="#4E9E3C" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="8" y="16" width="8" height="26" rx="4" fill="#8A5528"/><rect x="26" y="2" width="8" height="28" rx="4" fill="#8A5528"/><rect x="44" y="26" width="8" height="24" rx="4" fill="#8A5528"/></svg>`;

const barn = `<svg viewBox="0 0 80 70"><path d="M6 32 L40 6 L74 32 Z" fill="#B8323C"/><rect x="12" y="30" width="56" height="38" fill="#E2525C"/><rect x="30" y="40" width="20" height="28" fill="#FFFBF0"/><path d="M30 40 L50 68 M50 40 L30 68" stroke="#E2525C" stroke-width="3"/><circle cx="40" cy="22" r="5" fill="#FFFBF0"/></svg>`;

const lock = `<svg viewBox="0 0 40 40"><rect x="8" y="18" width="24" height="18" rx="4" fill="#9AA38E"/><path d="M13 18 V12 a7 7 0 0 1 14 0 V18" stroke="#9AA38E" stroke-width="4" fill="none"/></svg>`;

const star = `<svg viewBox="0 0 40 40"><path d="M20 2 L25 14 L38 15 L28 23 L31 37 L20 30 L9 37 L12 23 L2 15 L15 14 Z" fill="#FFD25A" stroke="#E0A92E" stroke-width="2" stroke-linejoin="round"/></svg>`;

// ---------- Farma ----------
const rabbit = `<svg viewBox="0 0 90 120">
<ellipse cx="33" cy="26" rx="9" ry="26" fill="#E9E4DC" transform="rotate(-8 33 26)"/><ellipse cx="33" cy="28" rx="4.5" ry="18" fill="#F7C9C9" transform="rotate(-8 33 28)"/>
<ellipse cx="57" cy="26" rx="9" ry="26" fill="#E9E4DC" transform="rotate(8 57 26)"/><ellipse cx="57" cy="28" rx="4.5" ry="18" fill="#F7C9C9" transform="rotate(8 57 28)"/>
<ellipse cx="45" cy="92" rx="28" ry="26" fill="#E9E4DC"/><ellipse cx="45" cy="98" rx="16" ry="16" fill="#FFFBF0"/>
<circle cx="72" cy="104" r="8" fill="#FFFBF0"/>
<circle cx="45" cy="60" r="22" fill="#E9E4DC"/>
<circle cx="37" cy="56" r="4" fill="#2E3A2A"/><circle cx="53" cy="56" r="4" fill="#2E3A2A"/><circle cx="38.3" cy="54.7" r="1.3" fill="#fff"/><circle cx="54.3" cy="54.7" r="1.3" fill="#fff"/>
<path d="M42 64 L48 64 L45 68 Z" fill="#F08CA0"/><rect x="42" y="69" width="6" height="6" rx="1.5" fill="#FFFBF0" stroke="#CFC7AE"/>
<ellipse cx="32" cy="66" rx="4" ry="2.5" fill="#F7A2A2" opacity=".7"/><ellipse cx="58" cy="66" rx="4" ry="2.5" fill="#F7A2A2" opacity=".7"/>
<ellipse cx="32" cy="116" rx="9" ry="4" fill="#D8D1C6"/><ellipse cx="58" cy="116" rx="9" ry="4" fill="#D8D1C6"/>
</svg>`;

const chicken = `<svg viewBox="0 0 80 84">
<path d="M34 64 L30 80 M30 80 l-6 3 M30 80 l6 3 M48 64 L50 80 M50 80 l-6 3 M50 80 l6 3" stroke="#F08A24" stroke-width="3" stroke-linecap="round"/>
<path d="M8 40 L2 26 L14 32 L10 18 L22 30 Z" fill="#B8642E"/>
<ellipse cx="38" cy="48" rx="26" ry="20" fill="#D9803F"/>
<path d="M26 46 q10 12 22 2" stroke="#B8642E" stroke-width="4" fill="none" stroke-linecap="round"/>
<circle cx="58" cy="28" r="14" fill="#D9803F"/>
<path d="M50 16 q2 -8 6 -2 q2 -8 6 0 q4 -6 5 2" fill="#E2525C"/>
<path d="M71 28 L80 31 L71 34 Z" fill="#F7C43A"/><path d="M68 36 q3 6 0 8 q-4 -2 -2 -8" fill="#E2525C"/>
<circle cx="62" cy="25" r="3" fill="#2E3A2A"/><circle cx="63" cy="24" r="1" fill="#fff"/>
</svg>`;

const pig = `<svg viewBox="0 0 120 84">
<path d="M14 40 q-10 -4 -6 -12 q6 -4 6 4" stroke="#F09AAE" stroke-width="4" fill="none" stroke-linecap="round"/>
<rect x="28" y="56" width="12" height="24" rx="5" fill="#F09AAE"/><rect x="66" y="56" width="12" height="24" rx="5" fill="#F09AAE"/>
<ellipse cx="54" cy="48" rx="40" ry="26" fill="#F7B6C4"/>
<rect x="40" y="60" width="12" height="22" rx="5" fill="#F7B6C4"/><rect x="78" y="58" width="12" height="24" rx="5" fill="#F7B6C4"/>
<rect x="40" y="72" width="12" height="10" rx="4" fill="#8A5528"/><rect x="78" y="72" width="12" height="10" rx="4" fill="#8A5528"/><rect x="28" y="70" width="12" height="10" rx="4" fill="#7A4A22"/>
<ellipse cx="34" cy="38" rx="8" ry="5" fill="#8A5528" opacity=".7"/><ellipse cx="60" cy="60" rx="7" ry="4" fill="#8A5528" opacity=".6"/>
<circle cx="94" cy="38" r="20" fill="#F7B6C4"/>
<path d="M82 22 L80 6 L94 18 Z M104 20 L110 6 L112 24 Z" fill="#F09AAE"/>
<ellipse cx="110" cy="44" rx="10" ry="8" fill="#F09AAE"/><circle cx="107" cy="44" r="2" fill="#B8566E"/><circle cx="113" cy="44" r="2" fill="#B8566E"/>
<circle cx="96" cy="32" r="3.5" fill="#2E3A2A"/><circle cx="97" cy="31" r="1.1" fill="#fff"/>
</svg>`;

const goat = `<svg viewBox="0 0 110 100">
<rect x="26" y="62" width="10" height="30" rx="4" fill="#E9E4DC"/><rect x="62" y="62" width="10" height="30" rx="4" fill="#E9E4DC"/>
<path d="M26 90 h10 v6 h-10 z M62 90 h10 v6 h-10 z" fill="#5E4227"/>
<path d="M14 46 L6 38 L16 40 Z" fill="#FFFFFF"/>
<ellipse cx="50" cy="56" rx="36" ry="20" fill="#FFFFFF" stroke="#E2DCD0" stroke-width="2"/>
<rect x="36" y="64" width="10" height="30" rx="4" fill="#FFFFFF"/><rect x="72" y="62" width="10" height="32" rx="4" fill="#FFFFFF"/>
<path d="M36 92 h10 v6 h-10 z M72 92 h10 v6 h-10 z" fill="#5E4227"/>
<path d="M78 22 C72 6 86 2 88 14 M92 20 C92 4 106 4 102 18" stroke="#B8A27E" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="90" cy="36" rx="16" ry="18" fill="#FFFFFF" stroke="#E2DCD0" stroke-width="2"/>
<path d="M74 30 L62 26 L72 36 Z M106 30 L110 24 L104 36 Z" fill="#F1E6D6"/>
<circle cx="86" cy="32" r="3.2" fill="#2E3A2A"/><circle cx="98" cy="32" r="3.2" fill="#2E3A2A"/>
<ellipse cx="92" cy="46" rx="6" ry="4" fill="#F7C9C9"/>
<path d="M88 52 L92 66 L96 52 Z" fill="#E2DCD0"/>
</svg>`;

const fence = (extra) => `<svg viewBox="0 0 120 70">
<rect x="10" y="10" width="10" height="60" rx="3" fill="#B8864E"/><rect x="55" y="10" width="10" height="60" rx="3" fill="#B8864E"/><rect x="100" y="10" width="10" height="60" rx="3" fill="#B8864E"/>
<rect x="2" y="22" width="116" height="10" rx="4" fill="#C99A5E"/><rect x="2" y="46" width="116" height="10" rx="4" fill="#C99A5E"/>
${extra || ''}
</svg>`;
const furTuft = `<g><path d="M70 20 q6 -10 12 -2 q8 -6 10 4 q8 2 2 10 q-6 6 -14 2 q-10 4 -12 -4 q-6 -6 2 -10 z" fill="#FFFFFF" stroke="#D8D1C6" stroke-width="2"/></g>`;
const mudSplat = `<g fill="#8A5528"><ellipse cx="80" cy="50" rx="12" ry="7"/><circle cx="66" cy="44" r="4"/><circle cx="96" cy="44" r="3.5"/><circle cx="74" cy="60" r="3"/><circle cx="90" cy="58" r="4"/></g>`;

const patch = (full) => `<svg viewBox="0 0 140 60">
<ellipse cx="70" cy="40" rx="66" ry="18" fill="#8A5528"/><ellipse cx="70" cy="36" rx="60" ry="13" fill="#9E6634"/>
${[24, 50, 76, 102, 120].map((x, i) => full
    ? `<path d="M${x} 32 q-6 -18 -2 -24 M${x} 32 q2 -20 6 -24 M${x} 32 q8 -14 12 -16" stroke="#4E9E3C" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${x - 6} 32 q6 14 12 0 z" fill="#F08A24"/>`
    : `<path d="M${x} 34 l-3 -6 M${x} 34 l1 -7 M${x} 34 l4 -5" stroke="#6C8F3A" stroke-width="3" stroke-linecap="round"/>${i % 2 ? `<circle cx="${x + 8}" cy="40" r="2.5" fill="#F08A24"/>` : ''}`).join('')}
</svg>`;

const carrot = `<svg viewBox="0 0 40 40"><path d="M22 10 q-4 -8 -10 -6 M22 10 q2 -9 8 -8 M22 10 q8 -4 12 0" stroke="#4E9E3C" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M14 12 Q8 30 4 38 Q14 32 30 16 Q22 8 14 12 Z" fill="#F08A24"/><path d="M12 20 l5 2 M9 27 l4 2" stroke="#C96A14" stroke-width="2" stroke-linecap="round"/></svg>`;

const hoofPrint = `<g fill="#5E4227"><path d="M0 10 C0 0 8 0 8 6 L8 18 C4 20 0 16 0 10 Z"/><path d="M18 10 C18 0 10 0 10 6 L10 18 C14 20 18 16 18 10 Z"/></g>`;
const hoof = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#F1E6D6"/><g transform="translate(11 9)">${hoofPrint}</g></svg>`;
const hoofTrail = `<svg viewBox="0 0 220 40">${[[0, 22, -10], [34, 10, 8], [68, 24, -6], [104, 8, 10], [140, 22, -4], [176, 6, 8]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${80 + r}) scale(.7)" opacity=".85">${hoofPrint}</g>`).join('')}</svg>`;
const fur = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#DDEFF7"/><g transform="translate(-58 2)">${furTuft}</g></svg>`;
const mud = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#F1E6D6"/><g transform="translate(-60 -30)">${mudSplat}</g></svg>`;
const magnifier = `<svg viewBox="0 0 40 40"><circle cx="17" cy="17" r="11" fill="#DDEFF7" stroke="#2E3A2A" stroke-width="4"/><path d="M25 25 L36 36" stroke="#2E3A2A" stroke-width="6" stroke-linecap="round"/></svg>`;
const question = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#E6E9DD"/><text x="20" y="28" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="24" fill="#9AA38E">?</text></svg>`;

// ---------- Las i plecak ----------
const backpack = `<svg viewBox="0 0 60 64">
<path d="M18 14 C18 2 42 2 42 14" stroke="#7A4A22" stroke-width="5" fill="none"/>
<rect x="8" y="12" width="44" height="48" rx="12" fill="#E2525C"/>
<rect x="8" y="12" width="44" height="18" rx="10" fill="#C83F4A"/>
<rect x="16" y="36" width="28" height="18" rx="6" fill="#F07A82"/>
<rect x="27" y="26" width="6" height="8" rx="2" fill="#FFD25A"/>
<path d="M8 24 h-2 a3 3 0 0 0 -3 3 v22 a3 3 0 0 0 3 3 h2 M52 24 h2 a3 3 0 0 1 3 3 v22 a3 3 0 0 1 -3 3 h-2" stroke="#C83F4A" stroke-width="3" fill="none"/>
</svg>`;

const nut = `<svg viewBox="0 0 40 40"><path d="M8 16 C8 8 32 8 32 16 C30 18 10 18 8 16 Z" fill="#8A5528"/><path d="M14 10 l2 -6 M20 9 l0 -6 M26 10 l-2 -6" stroke="#6E4220" stroke-width="2.5" stroke-linecap="round"/><path d="M10 17 C10 30 16 37 20 37 C24 37 30 30 30 17 Z" fill="#C98E55"/><path d="M15 22 q2 8 5 11" stroke="#E2B47C" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;

const squirrel = `<svg viewBox="0 0 100 110">
<path d="M70 100 C100 96 104 60 90 40 C80 26 64 30 70 46 C76 60 92 66 76 86" fill="#E07A2E"/>
<path d="M80 52 C88 60 90 72 82 84" stroke="#F0A04B" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse cx="46" cy="80" rx="22" ry="24" fill="#E07A2E"/>
<ellipse cx="44" cy="84" rx="13" ry="16" fill="#F7D3A8"/>
<path d="M30 30 L28 14 L40 24 Z M58 30 L62 14 L50 24 Z" fill="#E07A2E"/><path d="M29 18 l-2 -6 M61 18 l2 -6" stroke="#B85A1E" stroke-width="3" stroke-linecap="round"/>
<circle cx="45" cy="42" r="19" fill="#E07A2E"/>
<ellipse cx="50" cy="50" rx="10" ry="8" fill="#F7D3A8"/>
<circle cx="38" cy="38" r="3.8" fill="#2E3A2A"/><circle cx="54" cy="38" r="3.8" fill="#2E3A2A"/><circle cx="39.2" cy="36.8" r="1.2" fill="#fff"/><circle cx="55.2" cy="36.8" r="1.2" fill="#fff"/>
<circle cx="47" cy="47" r="2.6" fill="#2E3A2A"/>
<path d="M30 76 q-6 -6 0 -12 M60 76 q6 -6 0 -12" stroke="#B85A1E" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="36" cy="104" rx="8" ry="4" fill="#B85A1E"/><ellipse cx="56" cy="104" rx="8" ry="4" fill="#B85A1E"/>
</svg>`;

const pine = `<svg viewBox="0 0 100 170"><rect x="44" y="130" width="12" height="40" rx="4" fill="#7A5530"/><path d="M50 4 L82 54 L66 54 L90 94 L70 94 L96 136 L4 136 L30 94 L10 94 L34 54 L18 54 Z" fill="#2F7A3A"/><path d="M50 4 L66 54 L50 46 Z M50 54 L70 94 L50 86 Z M50 94 L76 136 L50 128 Z" fill="#3C9446"/></svg>`;

const leafPile = `<svg viewBox="0 0 120 60"><ellipse cx="60" cy="54" rx="54" ry="6" fill="#0002"/><path d="M8 54 C10 30 40 18 60 20 C84 18 112 30 112 54 Z" fill="#D9803F"/><path d="M22 46 q10 -14 22 -4 M52 36 q10 -14 22 -2 M78 46 q12 -10 22 0" stroke="#B8642E" stroke-width="3" fill="none"/><ellipse cx="34" cy="30" rx="10" ry="5" fill="#E8A341" transform="rotate(-20 34 30)"/><ellipse cx="86" cy="32" rx="10" ry="5" fill="#C9502E" transform="rotate(25 86 32)"/><ellipse cx="60" cy="22" rx="9" ry="4" fill="#F0C048"/></svg>`;

const log = `<svg viewBox="0 0 130 60"><ellipse cx="66" cy="56" rx="58" ry="5" fill="#0002"/><rect x="14" y="14" width="100" height="40" rx="20" fill="#9A6A3C"/><path d="M30 24 h50 M40 34 h60 M26 44 h40" stroke="#7A5530" stroke-width="3" stroke-linecap="round"/><ellipse cx="112" cy="34" rx="14" ry="20" fill="#C79A64"/><ellipse cx="112" cy="34" rx="8" ry="12" fill="#3A2614"/><path d="M40 14 q4 -10 10 -2 q4 -8 8 2" fill="#5DB048"/></svg>`;

const mushrooms = `<svg viewBox="0 0 100 70"><ellipse cx="50" cy="66" rx="44" ry="4" fill="#0002"/><rect x="24" y="34" width="12" height="30" rx="5" fill="#FFFBF0"/><path d="M8 38 C8 14 52 14 52 38 Z" fill="#E2525C"/><circle cx="20" cy="28" r="4" fill="#FFFBF0"/><circle cx="34" cy="22" r="3.5" fill="#FFFBF0"/><circle cx="42" cy="32" r="3" fill="#FFFBF0"/><rect x="66" y="44" width="9" height="20" rx="4" fill="#FFFBF0"/><path d="M54 48 C54 30 88 30 88 48 Z" fill="#B8864E"/><circle cx="66" cy="40" r="2.5" fill="#E9D3B0"/></svg>`;

const stone = `<svg viewBox="0 0 110 60"><ellipse cx="56" cy="56" rx="50" ry="5" fill="#0002"/><path d="M10 54 C6 30 30 10 56 12 C84 12 106 32 100 54 Z" fill="#A3AAA0"/><path d="M28 30 q14 -12 34 -8" stroke="#C3C9C0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M70 48 q10 -6 20 0" stroke="#8C9389" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M14 52 q4 -8 10 -2 q4 -8 8 2" fill="#5DB048"/></svg>`;

// ---------- Urodziny kotka ----------
const invite = `<svg viewBox="0 0 44 36"><rect x="2" y="4" width="40" height="28" rx="4" fill="#FFFBF0" stroke="#E6DCC0" stroke-width="2"/><path d="M3 6 L22 20 L41 6" stroke="#E6DCC0" stroke-width="2.5" fill="none"/><path d="M22 28 C14 22 15 16 19 16 C21 16 22 18 22 18 C22 18 23 16 25 16 C29 16 30 22 22 28 Z" fill="#E2525C"/></svg>`;

const egg = `<svg viewBox="0 0 44 40"><ellipse cx="14" cy="18" rx="7" ry="9" fill="#FFFBF0" stroke="#E6DCC0" stroke-width="1.5"/><ellipse cx="30" cy="17" rx="7" ry="9" fill="#F3E2C8" stroke="#E0CBA8" stroke-width="1.5"/><ellipse cx="22" cy="15" rx="7" ry="9" fill="#FFFBF0" stroke="#E6DCC0" stroke-width="1.5"/><path d="M4 22 h36 l-4 14 a3 3 0 0 1 -3 2 h-22 a3 3 0 0 1 -3 -2 z" fill="#C98E55"/><path d="M8 27 h28 M10 32 h24" stroke="#A8743E" stroke-width="2"/></svg>`;

const flower = `<svg viewBox="0 0 44 44"><path d="M22 40 L14 22 M22 40 L22 18 M22 40 L30 22" stroke="#4E9E3C" stroke-width="3" stroke-linecap="round"/>${[[14, 18, '#F7A2C0'], [22, 12, '#FFD25A'], [30, 18, '#F7A2C0']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-5" rx="3.6" ry="5" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="2.8" fill="#F08A24"/></g>`).join('')}<path d="M14 34 L30 34 L26 40 L18 40 Z" fill="#7FC7E8"/></svg>`;

const mushroom = `<svg viewBox="0 0 40 40"><rect x="15" y="20" width="10" height="16" rx="4" fill="#FFFBF0"/><path d="M3 23 C3 6 37 6 37 23 Z" fill="#E2525C"/><circle cx="13" cy="15" r="3" fill="#FFFBF0"/><circle cx="24" cy="11" r="2.6" fill="#FFFBF0"/><circle cx="29" cy="18" r="2.4" fill="#FFFBF0"/></svg>`;

const nest = `<svg viewBox="0 0 110 60"><ellipse cx="55" cy="54" rx="50" ry="5" fill="#0002"/><path d="M6 36 C10 60 100 60 104 36 Z" fill="#D9B24E"/><path d="M10 38 q20 8 40 0 q20 8 50 0 M14 46 q20 6 40 0 q20 6 40 0" stroke="#B8902E" stroke-width="3" fill="none"/><path d="M6 36 q6 -8 14 -2 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -6 14 2" stroke="#E8C75E" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
const nestEggs = nest.replace('</svg>', `<ellipse cx="40" cy="30" rx="9" ry="11" fill="#FFFBF0" stroke="#E6DCC0" stroke-width="2"/><ellipse cx="58" cy="28" rx="9" ry="11" fill="#F3E2C8" stroke="#E0CBA8" stroke-width="2"/><ellipse cx="74" cy="31" rx="9" ry="11" fill="#FFFBF0" stroke="#E6DCC0" stroke-width="2"/></svg>`);

const lilies = `<svg viewBox="0 0 100 50"><ellipse cx="30" cy="38" rx="26" ry="9" fill="#4E9E3C"/><ellipse cx="72" cy="40" rx="22" ry="8" fill="#5DB048"/>${[[30, 28, '#F7A2C0'], [72, 32, '#FFFBF0']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="-7" rx="4" ry="8" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="4" fill="#FFD25A"/></g>`).join('')}</svg>`;

const table = (stuff) => `<svg viewBox="0 0 140 100">
<rect x="18" y="58" width="8" height="40" rx="3" fill="#B8864E"/><rect x="114" y="58" width="8" height="40" rx="3" fill="#B8864E"/>
<path d="M4 50 h132 v10 a4 4 0 0 1 -4 4 h-124 a4 4 0 0 1 -4 -4 z" fill="#FFFBF0"/>
<path d="M4 60 q11 10 22 0 q11 10 22 0 q11 10 22 0 q11 10 22 0 q11 10 22 0 q11 10 22 0" fill="#F7A2C0"/>
${stuff.cake ? `<rect x="34" y="20" width="42" height="30" rx="5" fill="#F7D3A8"/><rect x="34" y="20" width="42" height="9" rx="4" fill="#FFFBF0"/><path d="M34 29 q5 6 10 0 q5 6 11 0 q5 6 10 0 q5 6 11 0" fill="#FFFBF0"/><circle cx="44" cy="38" r="3" fill="#E2525C"/><circle cx="56" cy="40" r="3" fill="#E2525C"/><circle cx="67" cy="38" r="3" fill="#E2525C"/><rect x="53" y="6" width="4" height="14" rx="2" fill="#7FC7E8"/><path d="M55 0 q4 4 0 7 q-4 -3 0 -7" fill="#FFD25A"/>` : ''}
${stuff.flowers ? `<path d="M94 50 L90 24 M100 50 L100 18 M106 50 L110 24" stroke="#4E9E3C" stroke-width="3"/>${[[90, 22, '#F7A2C0'], [100, 16, '#FFD25A'], [110, 22, '#F7A2C0']].map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-5" rx="4" ry="5.5" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#F08A24"/></g>`).join('')}<path d="M90 36 h20 l-3 14 h-14 z" fill="#7FC7E8"/>` : ''}
</svg>`;

const balloons = `<svg viewBox="0 0 80 130"><path d="M20 50 q6 30 18 78 M40 40 q2 40 0 88 M60 52 q-6 30 -20 76" stroke="#9AA38E" stroke-width="1.5" fill="none"/><ellipse cx="20" cy="30" rx="16" ry="20" fill="#E2525C"/><ellipse cx="40" cy="20" rx="16" ry="20" fill="#FFD25A"/><ellipse cx="60" cy="32" rx="16" ry="20" fill="#7FC7E8"/><ellipse cx="14" cy="22" rx="4" ry="6" fill="#fff" opacity=".5"/><ellipse cx="34" cy="12" rx="4" ry="6" fill="#fff" opacity=".5"/><ellipse cx="54" cy="24" rx="4" ry="6" fill="#fff" opacity=".5"/></svg>`;

const cake = `<svg viewBox="0 0 44 44"><rect x="6" y="18" width="32" height="22" rx="4" fill="#F7D3A8"/><rect x="6" y="18" width="32" height="7" rx="3" fill="#FFFBF0"/><path d="M6 25 q4 5 8 0 q4 5 8 0 q4 5 8 0 q4 5 8 0" fill="#FFFBF0"/><circle cx="14" cy="32" r="2.5" fill="#E2525C"/><circle cx="22" cy="33" r="2.5" fill="#E2525C"/><circle cx="30" cy="32" r="2.5" fill="#E2525C"/><rect x="20" y="6" width="4" height="12" rx="2" fill="#7FC7E8"/><path d="M22 0 q4 3 0 6 q-4 -3 0 -6" fill="#FFD25A"/></svg>`;

// ---------- Góry ----------
const sheepSvg = (bell, w = 120) => `<svg viewBox="0 0 ${w} 100">
<rect x="34" y="62" width="9" height="32" rx="4" fill="#4A4038"/><rect x="74" y="62" width="9" height="32" rx="4" fill="#4A4038"/>
${[[30, 50], [44, 38], [62, 34], [80, 40], [92, 54], [78, 66], [56, 70], [36, 66], [58, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#FFFBF0" stroke="#E2DCD0" stroke-width="2"/>`).join('')}
<rect x="44" y="66" width="9" height="30" rx="4" fill="#5A4F45"/><rect x="84" y="64" width="9" height="30" rx="4" fill="#5A4F45"/>
<ellipse cx="102" cy="44" rx="13" ry="17" fill="#5A4F45"/>
<ellipse cx="92" cy="32" rx="9" ry="5" fill="#4A4038" transform="rotate(-25 92 32)"/><ellipse cx="114" cy="34" rx="9" ry="5" fill="#4A4038" transform="rotate(25 114 34)"/>
<circle cx="97" cy="42" r="3" fill="#FFFBF0"/><circle cx="108" cy="42" r="3" fill="#FFFBF0"/><circle cx="97.5" cy="42.5" r="1.8" fill="#2E3A2A"/><circle cx="108.5" cy="42.5" r="1.8" fill="#2E3A2A"/>
<circle cx="96" cy="28" r="7" fill="#FFFBF0"/><circle cx="106" cy="26" r="7" fill="#FFFBF0"/>
${bell ? `<path d="M94 60 q8 6 16 0" stroke="#E2525C" stroke-width="4" fill="none"/><path d="M96 64 h12 l-2 12 h-8 z" fill="#FFD25A" stroke="#D9A62E" stroke-width="2"/><circle cx="102" cy="78" r="2.5" fill="#D9A62E"/>` : ''}
</svg>`;
const sheep = sheepSvg(false);
const sheepBell = sheepSvg(true);

const marmot = `<svg viewBox="0 0 90 110">
<ellipse cx="45" cy="80" rx="26" ry="28" fill="#B08A5E"/><ellipse cx="45" cy="86" rx="15" ry="18" fill="#E2CBA4"/>
<circle cx="45" cy="42" r="22" fill="#B08A5E"/><circle cx="27" cy="26" r="6" fill="#8F6B45"/><circle cx="63" cy="26" r="6" fill="#8F6B45"/>
<ellipse cx="45" cy="52" rx="12" ry="9" fill="#E2CBA4"/>
<circle cx="37" cy="38" r="3.8" fill="#2E3A2A"/><circle cx="53" cy="38" r="3.8" fill="#2E3A2A"/><circle cx="38" cy="37" r="1.2" fill="#fff"/><circle cx="54" cy="37" r="1.2" fill="#fff"/>
<ellipse cx="45" cy="47" rx="4" ry="3" fill="#4A4038"/><rect x="41" y="54" width="8" height="7" rx="2" fill="#FFFBF0" stroke="#CFC7AE"/>
<path d="M24 74 q-6 -8 2 -14 M66 74 q6 -8 -2 -14" stroke="#8F6B45" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M22 20 C24 6 66 6 68 20 L64 24 C56 16 34 16 26 24 Z" fill="#3F8F3A"/><circle cx="45" cy="8" r="5" fill="#E2525C"/>
<ellipse cx="32" cy="106" rx="9" ry="4" fill="#8F6B45"/><ellipse cx="58" cy="106" rx="9" ry="4" fill="#8F6B45"/>
</svg>`;

const hut = `<svg viewBox="0 0 160 130"><path d="M8 62 L80 8 L152 62 Z" fill="#7A4A22"/><path d="M20 62 L80 18 L140 62 Z" fill="#9A6A3C"/><rect x="26" y="60" width="108" height="68" fill="#C99A5E"/>${[70, 84, 98, 112].map((y) => `<rect x="26" y="${y}" width="108" height="3" fill="#A87A44"/>`).join('')}<rect x="66" y="84" width="28" height="44" rx="3" fill="#7A4A22"/><circle cx="88" cy="108" r="2.5" fill="#FFD25A"/><rect x="36" y="74" width="20" height="18" rx="2" fill="#FFE79A" stroke="#7A4A22" stroke-width="3"/><rect x="104" y="74" width="20" height="18" rx="2" fill="#FFE79A" stroke="#7A4A22" stroke-width="3"/><rect x="108" y="20" width="12" height="28" fill="#8C9389"/><path d="M114 14 q6 -6 0 -12" stroke="#E6E9DD" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;

const wool = `<svg viewBox="0 0 44 40">${[[14, 22], [22, 14], [30, 22], [22, 28], [14, 30], [32, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#FFFBF0" stroke="#E6DCC0" stroke-width="1.5"/>`).join('')}</svg>`;

const lantern = `<svg viewBox="0 0 40 48"><path d="M12 10 C12 0 28 0 28 10" stroke="#5A4F45" stroke-width="3" fill="none"/><rect x="10" y="8" width="20" height="6" rx="2" fill="#5A4F45"/><rect x="11" y="14" width="18" height="24" rx="4" fill="#FFE79A" stroke="#5A4F45" stroke-width="3"/><path d="M20 30 q-5 -6 0 -12 q5 6 0 12" fill="#F08A24"/><rect x="9" y="38" width="22" height="6" rx="2" fill="#5A4F45"/></svg>`;

const bat = `<svg viewBox="0 0 110 70"><path d="M55 8 v8" stroke="#5A4F45" stroke-width="3"/><path d="M55 22 C40 10 18 14 6 24 C16 26 18 34 14 42 C26 36 34 40 40 48 C44 40 50 38 55 40 C60 38 66 40 70 48 C76 40 84 36 96 42 C92 34 94 26 104 24 C92 14 70 10 55 22 Z" fill="#6B5B7A"/><circle cx="55" cy="34" r="13" fill="#7E6C8E"/><path d="M45 24 L46 14 L51 22 Z M65 24 L64 14 L59 22 Z" fill="#7E6C8E"/><circle cx="50" cy="32" r="3" fill="#FFFBF0"/><circle cx="60" cy="32" r="3" fill="#FFFBF0"/><circle cx="50" cy="33" r="1.6" fill="#2E3A2A"/><circle cx="60" cy="33" r="1.6" fill="#2E3A2A"/><path d="M51 40 l2 3 l2 -3 M55 40 l2 3 l2 -3" stroke="#FFFBF0" stroke-width="1.5" fill="none"/></svg>`;

const crystal = `<svg viewBox="0 0 40 44"><path d="M20 2 L32 14 L26 40 L14 40 L8 14 Z" fill="#9FD8F2"/><path d="M20 2 L26 40 L14 40 Z" fill="#C6EAF8"/><path d="M8 14 L32 14" stroke="#7FC7E8" stroke-width="2"/><path d="M14 8 l-4 -4 M28 8 l4 -4 M34 22 l5 0" stroke="#FFD25A" stroke-width="2.5" stroke-linecap="round"/></svg>`;

const crystalSet = (big) => `<svg viewBox="0 0 120 80"><ellipse cx="60" cy="74" rx="54" ry="6" fill="#0003"/><path d="M14 74 C10 56 30 44 60 46 C92 44 112 58 106 74 Z" fill="#5A4F45"/>${[[34, 12, 12, 40], ...(big ? [[56, 0, 16, 50]] : []), [80, 16, 12, 36], [46, 24, 10, 28], [70, 28, 9, 24]].map(([x, y, w, h]) => `<path d="M${x} ${y + 10} L${x + w / 2} ${y} L${x + w} ${y + 10} L${x + w * 0.8} ${y + h + 10} L${x + w * 0.2} ${y + h + 10} Z" fill="#9FD8F2" stroke="#7FC7E8" stroke-width="1.5"/>`).join('')}</svg>`;
const crystals = crystalSet(true);
const crystalsTaken = crystalSet(false);

const bellItem = `<svg viewBox="0 0 40 44"><path d="M10 6 q10 -6 20 0" stroke="#E2525C" stroke-width="4" fill="none"/><path d="M8 34 C8 18 12 8 20 8 C28 8 32 18 32 34 Z" fill="#FFD25A" stroke="#D9A62E" stroke-width="2.5"/><rect x="6" y="32" width="28" height="5" rx="2.5" fill="#D9A62E"/><circle cx="20" cy="40" r="3.5" fill="#D9A62E"/><path d="M14 16 q-2 8 -1 14" stroke="#FFF2B0" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

const eagle = `<svg viewBox="0 0 110 110">
<path d="M24 60 C6 54 2 34 10 22 C20 34 30 40 40 44 Z M86 60 C104 54 108 34 100 22 C90 34 80 40 70 44 Z" fill="#6E4A2E"/>
<ellipse cx="55" cy="70" rx="24" ry="30" fill="#7A5232"/>
<path d="M40 96 l-4 10 M48 98 l-2 10 M62 98 l2 10 M70 96 l4 10" stroke="#F0B42E" stroke-width="4" stroke-linecap="round"/>
<circle cx="55" cy="34" r="19" fill="#FFFBF0"/>
<path d="M60 38 C74 36 78 44 70 50 C68 46 64 44 60 44 Z" fill="#F0B42E"/>
<circle cx="50" cy="30" r="4" fill="#2E3A2A"/><circle cx="62" cy="30" r="4" fill="#2E3A2A"/><circle cx="51" cy="29" r="1.3" fill="#fff"/><circle cx="63" cy="29" r="1.3" fill="#fff"/>
<path d="M44 24 l10 3 M66 24 l-8 3" stroke="#2E3A2A" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

const nestRock = (withBell) => `<svg viewBox="0 0 120 70"><path d="M4 68 C0 44 24 30 60 32 C96 30 118 46 116 68 Z" fill="#8C9389"/><path d="M20 40 q20 -10 40 -6" stroke="#A3AAA0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M26 34 C28 50 92 50 94 34 Z" fill="#9A6A3C"/><path d="M26 34 q10 -6 18 0 q10 -6 18 0 q10 -6 18 0 q8 -6 14 0" stroke="#B8864E" stroke-width="5" fill="none" stroke-linecap="round"/>${withBell ? `<g transform="translate(46 4) scale(.8)"><path d="M8 34 C8 18 12 8 20 8 C28 8 32 18 32 34 Z" fill="#FFD25A" stroke="#D9A62E" stroke-width="2.5"/><rect x="6" y="32" width="28" height="5" rx="2.5" fill="#D9A62E"/></g><path d="M40 10 l-6 -6 M76 10 l6 -6 M58 0 l0 -6" stroke="#FFD25A" stroke-width="3" stroke-linecap="round"/>` : ''}</svg>`;

const peak = `<svg viewBox="0 0 60 50"><path d="M2 48 L22 12 L32 26 L40 16 L58 48 Z" fill="#8C9389"/><path d="M22 12 L28 22 L24 20 L19 24 L16 22 Z M40 16 L45 24 L41 23 L37 26 Z" fill="#FFFBF0"/></svg>`;
const cave = `<svg viewBox="0 0 60 50"><path d="M2 48 C2 18 18 4 30 4 C42 4 58 18 58 48 Z" fill="#8C9389"/><path d="M16 48 C16 30 22 20 30 20 C38 20 44 30 44 48 Z" fill="#3A2E28"/></svg>`;
const rock = `<svg viewBox="0 0 110 60"><path d="M6 58 C2 34 26 14 54 14 C84 14 108 34 104 58 Z" fill="#8C9389"/><path d="M28 30 q14 -12 34 -8" stroke="#A3AAA0" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
const flowersAlp = `<svg viewBox="0 0 80 40">${[[12, 22, '#B48FD8'], [30, 14, '#FFFBF0'], [48, 24, '#B48FD8'], [66, 16, '#FFD25A']].map(([x, y, c]) => `<path d="M${x} 40 V${y + 4}" stroke="#4E9E3C" stroke-width="2.5"/><g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-4" rx="3" ry="4.5" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="2.2" fill="#F08A24"/></g>`).join('')}</svg>`;

export const ART = {
  sheep, sheepBell, marmot, hut, wool, lantern, bat, crystal, crystals, crystalsTaken, bell: bellItem, eagle,
  nestBell: nestRock(true), nestEmpty: nestRock(false), peak, cave, rock, flowersAlp,
  invite, egg, flower, mushroom, nest, nestEggs, lilies, balloons, cake,
  table: table({}), tableCake: table({ cake: true }), tableFlowers: table({ flowers: true }), tableFull: table({ cake: true, flowers: true }),
  backpack, nut, squirrel, pine, leafPile, log, mushrooms, stone,
  yarn, bush, tree, cat, dog, pupFace, parcel, duckIcon,
  duck: duck(false), duckHat: duck(true), owl, frog, hedgehog, reeds, barn, lock, star,
  rabbit, chicken, pig, goat, fence: fence(), fenceFur: fence(furTuft), fenceMud: fence(mudSplat),
  patchEmpty: patch(false), patchFull: patch(true), carrot, hoof, hoofTrail, fur, mud, magnifier, question,
};
