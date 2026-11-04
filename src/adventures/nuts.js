// Przygoda 4: Orzechy na zimę (las). Typ: zbierz kilka rzeczy do plecaka i oddaj.
// Uczy plecaka: znalezione orzechy wpadają do plecaka, a żeby je oddać, trzeba je z niego wyjąć.
// Orzechy już leżące w plecaku (np. po wyjściu w połowie) się liczą.
import { countWord } from '../items.js';

const NEED = 3;

export default {
  id: 'nuts',
  title: 'Orzechy na zimę',
  bg: 'forest',
  walk: { maxB: 34, click: 46 },
  dog: { x: 50, b: 4 },
  sticker: 'nut',
  winText: 'Wiewiórka ma zapasy na zimę. Dostajesz gwiazdkę zbieracza!',
  entities: [
    { id: 'pine1', art: 'pine', x: 8, b: 40, w: 14, deco: true },
    { id: 'pine2', art: 'pine', x: 38, b: 44, w: 11, deco: true },
    { id: 'pine3', art: 'pine', x: 70, b: 42, w: 13, deco: true },
    { id: 'squirrel', art: 'squirrel', x: 88, b: 26, w: 10, label: 'Wiewiórka' },
    { id: 'leaves', art: 'leafPile', x: 20, b: 22, w: 16, label: 'Kupka liści' },
    { id: 'log', art: 'log', x: 52, b: 30, w: 17, label: 'Pień' },
    { id: 'mush', art: 'mushrooms', x: 70, b: 14, w: 13, label: 'Grzybki' },
    { id: 'stone', art: 'stone', x: 32, b: 6, w: 14, label: 'Kamień' },
    { id: 'pine4', art: 'pine', x: 94, b: 8, w: 9, deco: true },
  ],
  start(api) {
    const n = api.name;
    const spots = ['leaves', 'log', 'mush', 'stone'];
    const searched = new Set();
    let done = false;

    // Ile orzechów brakuje, biorąc pod uwagę te już w plecaku
    const inBag = () => api.bag.count('nut');
    const left = () => Math.max(0, NEED - inBag());
    const hidden = new Set();
    const shuffled = [...spots].sort(() => Math.random() - 0.5);
    shuffled.slice(0, left()).forEach((s) => hidden.add(s));

    function showTray() {
      const have = Math.min(inBag(), NEED);
      api.tray(Array.from({ length: NEED }, (_, i) => (i < have ? 'nut' : { art: 'nut', dim: true })));
    }
    function setHint() {
      if (done) { api.hint(null); return; }
      if (left() > 0) {
        const next = [...hidden].find((s) => !searched.has(s));
        if (next) api.hint(next, 'Coś tu jest!', 'Psst! Zajrzyj tutaj. Coś się tu chowa!', 'squirrel');
      } else if (api.held === 'nut') {
        api.hint('squirrel', 'Do wiewiórki!', 'Zanieś orzechy wiewiórce!', 'squirrel');
      } else {
        api.hint('bag', 'Plecak!', 'Orzechy są w plecaku. Kliknij plecak w rogu i wyjmij orzechy!', 'dog');
      }
    }

    api.chip('nut', left() > 0 ? 'Zbierz orzechy' : 'Oddaj wiewiórce');
    showTray();
    api.say('squirrel', 'Potrzebuję orzechów!', `Cześć, ${n}! Zbliża się zima, a ja nie mam zapasów. Znajdziesz dla mnie trzy orzechy?`, 'nut');
    api.later(5200, () => api.say('dog', 'Do plecaka!', 'Hau! Znalezione orzechy schowam do plecaka. Plecak jest w rogu!'));
    setHint();

    const empty = [
      ['Pusto', 'Tu nie ma orzechów. Szukaj dalej!'],
      ['Nic', 'Hmm, nic tu nie ma.'],
    ];

    for (const id of spots) {
      api.on(id, async () => {
        if (done) return;
        api.shake(id);
        if (searched.has(id)) { api.say('dog', 'Już tu byliśmy', 'Tu już szukaliśmy.'); return; }
        searched.add(id);
        if (!hidden.has(id)) {
          api.fade(id);
          api.say('dog', ...api.pick(empty));
          setHint();
          return;
        }
        api.sparkles(id, '#C98E55');
        await api.bag.add('nut', id);
        api.fade(id);
        showTray();
        const have = inBag();
        if (have >= NEED) {
          api.chip('nut', 'Oddaj wiewiórce');
          api.say('dog', 'Mamy trzy!', `Mamy już ${countWord(NEED)} orzechy! Są w plecaku. Zanieśmy je wiewiórce.`, 'nut');
        } else {
          api.say('dog', `Orzech! ${have}`, `Jest orzech! Mamy ${countWord(have)}. Szukajmy dalej!`, 'nut');
        }
        setHint();
      });
    }

    api.on('squirrel', async () => {
      if (done) { api.say('squirrel', 'Dziękuję!', 'Dziękuję! Teraz zima mi niestraszna!', 'nut'); return; }
      if (api.held === 'nut') {
        const have = inBag();
        if (have < NEED) {
          api.say('squirrel', `Potrzebuję ${NEED}`, `Dziękuję, ale potrzebuję ${countWord(NEED)} orzechy. Masz ${countWord(have)}. Poszukaj jeszcze!`, 'nut');
          return;
        }
        done = true;
        api.hint(null);
        api.bag.take('nut', NEED);
        api.carry(null);
        // Liczymy na głos, orzech po orzechu
        for (let i = 1; i <= NEED; i++) {
          api.tray(Array.from({ length: NEED }, (_, k) => (k < NEED - i ? 'nut' : { art: 'nut', dim: true })));
          api.sparkles('squirrel', '#C98E55');
          api.say('squirrel', countWord(i), countWord(i) + '!', 'nut');
          await api.wait(1100);
        }
        api.hop('squirrel');
        api.sparkles('squirrel');
        api.chip('nut', 'Gotowe!', true);
        api.tray(['nut', 'nut', 'nut']);
        api.say('squirrel', `Dziękuję, ${n}!`, `Trzy orzechy! Hura! Dziękuję, ${n}! Teraz mam zapasy na całą zimę!`, 'nut');
        api.win(3600);
        return;
      }
      if (inBag() > 0) {
        api.say('squirrel', 'Wyjmij z plecaka', 'Masz orzechy w plecaku? Kliknij plecak i wyjmij je!', 'backpack');
        api.hint('bag', 'Plecak!', 'Kliknij plecak w rogu i wyjmij orzechy!', 'dog');
        return;
      }
      api.say('squirrel', 'Szukaj orzechów', 'Orzechy chowają się w lesie. Pod liśćmi, w pniu, przy grzybkach albo pod kamieniem!', 'nut');
    });
  },
};
