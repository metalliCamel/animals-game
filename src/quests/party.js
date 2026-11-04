// Przygoda wieloetapowa: Urodziny kotka.
// Zaczyna się na łące, a zadania czekają w czterech miejscach. Postęp żyje w save.flags.party
// (api.state), a przedmioty w plecaku, więc można przerwać i wrócić w dowolnej chwili.
//
//   Łąka  – kotek daje 3 zaproszenia; potem przyjmuje jajka i kwiatki; na końcu przyjęcie
//   Farma – jajka z gniazdka kury, zaproszenie dla królika
//   Staw  – zaproszenie dla kaczki; żabka da kwiatki za grzybka z lasu
//   Las   – zaproszenie dla wiewiórki; czerwony grzybek (dopiero gdy żabka o niego poprosi)

const GUESTS = { duck: 'kaczka', rabbit: 'królik', squirrel: 'wiewiórka' };

export function initState(st) {
  if (!st.inv) st.inv = {};
  return st;
}

const allInvited = (st) => Object.keys(GUESTS).every((g) => st.inv[g]);

// Lista zadań pokazywana w scenie i na mapie
export function checklist(st) {
  const invited = Object.keys(GUESTS).filter((g) => st.inv[g]).length;
  return [
    { art: 'egg', ok: !!st.cake },
    { art: 'flower', ok: !!st.flowers },
    ...Object.keys(GUESTS).map((g, i) => ({ art: 'invite', ok: i < invited })),
  ];
}

// Czy w danym miejscu jest coś do zrobienia (znacznik na mapie)
export function todo(placeId, st, bagCount) {
  if (placeId === 'laka') {
    return !st.started || (!st.cake && bagCount('egg') > 0) || (!st.flowers && bagCount('flower') > 0) || (st.cake && st.flowers && allInvited(st));
  }
  if (!st.started) return false;
  if (placeId === 'farma') return !st.inv.rabbit || !st.eggsTaken;
  if (placeId === 'staw') return !st.inv.duck || (!st.flowersTaken && (!st.frogAsked || bagCount('mushroom') > 0));
  if (placeId === 'las') return !st.inv.squirrel || (st.frogAsked && !st.mushroomTaken);
  return false;
}

// ---------- wspólne kawałki scen ----------
function common(api, placeId) {
  const st = initState(api.state);
  const showList = () => {
    api.chip('cake', 'Urodziny kotka', false);
    api.tray(checklist(st).map((c) => (c.ok ? c.art : { art: c.art, dim: true })));
  };
  const save = () => { api.saveState(); showList(); };
  // Gdy w tym miejscu nie ma już nic do zrobienia, piesek zaprasza na mapę
  const maybeLeave = (delay = 3200) => {
    if (!todo(placeId, st, api.bag.count)) {
      api.hint(null);
      api.later(delay, () => api.toMap('Na mapę!', 'Tutaj wszystko zrobione! Kliknij przycisk Mapa i chodźmy dalej.'));
    }
  };
  // Zaproszenie dla gościa: trzeba je wyjąć z plecaka i dać
  function guest(id, voice, idle) {
    api.on(id, () => {
      if (st.inv[id]) { api.say(id, 'Do zobaczenia!', `${voice} Do zobaczenia na przyjęciu!`, 'cake'); return; }
      if (api.held === 'invite') {
        api.bag.take('invite', 1);
        api.carry(null);
        st.inv[id] = true;
        save();
        api.hop(id);
        api.sparkles(id, '#E2525C');
        api.say(id, 'Przyjdę!', `${voice} Zaproszenie na urodziny kotka? Hura! Na pewno przyjdę!`, 'invite');
        maybeLeave();
        return;
      }
      if (api.held) { api.say(id, 'Nie to', `${voice} Dziękuję, ale to nie dla mnie.`); return; }
      if (st.started && api.bag.has('invite')) {
        api.say(id, 'Masz coś?', `${voice} Masz coś dla mnie? Zajrzyj do plecaka!`, 'backpack');
        api.hint('bag', 'Plecak!', 'Kliknij plecak i wyjmij zaproszenie!', 'dog');
        return;
      }
      api.say(id, ...idle);
    });
  }
  showList();
  return { st, save, showList, maybeLeave, guest };
}

// ---------- ŁĄKA ----------
const laka = {
  bg: 'meadow',
  walk: { maxB: 40, click: 48 },
  dog: { x: 22, b: 10 },
  entities: [
    { id: 'tree', art: 'tree', x: 11, b: 38, w: 22, deco: true },
    { id: 'table', art: 'table', x: 54, b: 22, w: 18, label: 'Stół' },
    { id: 'cat', art: 'cat', x: 80, b: 22, w: 11, label: 'Kotek' },
  ],
  start(api) {
    const n = api.name;
    const { st, save, maybeLeave } = common(api, 'laka');
    const tableArt = () => (st.cake && st.flowers ? 'tableFull' : st.cake ? 'tableCake' : st.flowers ? 'tableFlowers' : 'table');
    api.setArt('table', tableArt());

    function missing() {
      const m = [];
      if (!st.cake) m.push('jajek na tort');
      if (!st.flowers) m.push('kwiatków');
      const left = Object.keys(GUESTS).filter((g) => !st.inv[g]).map((g) => GUESTS[g]);
      return { m, left };
    }
    function remind() {
      const { m, left } = missing();
      const parts = [];
      if (m.length) parts.push('Potrzebuję jeszcze ' + m.join(' i ') + '.');
      if (left.length) parts.push('Zaproszenia czekają: ' + left.join(', ') + '.');
      api.say('cat', 'Jeszcze trochę!', 'Miau! ' + parts.join(' '), 'cake');
    }

    async function party() {
      st.party = true;
      api.saveState();
      api.hint(null);
      api.say('cat', 'Czas na przyjęcie!', 'Wszystko gotowe! Zaczynamy przyjęcie!', 'cake');
      await api.walk(68, 8);
      await api.wait(1600);
      const guests = [
        ['g-duck', 'duckHat', 30, 28, 10], ['g-rabbit', 'rabbit', 20, 12, 7],
        ['g-squirrel', 'squirrel', 44, 38, 7], ['g-owl', 'owl', 92, 30, 8], ['g-balloons', 'balloons', 64, 40, 7],
      ];
      for (const [id, art, x, b, w] of guests) {
        api.spawn(id, art, x, b, w);
        api.sparkles(id, api.pick(['#E2525C', '#FFD25A', '#7FC7E8']));
        await api.wait(500);
      }
      api.hop('cat');
      api.sparkles('table');
      api.chip('cake', 'Wszystkiego najlepszego!', true);
      api.say('cat', `Dziękuję, ${n}!`, `Hura! Wszyscy przyszli! Dziękuję, ${n}! To najlepsze urodziny na świecie!`, 'cake');
      await api.wait(4800);
      api.say('dog', 'Sto lat, kotku!', 'Wszystkiego najlepszego, kotku! Sto lat!', 'cake');
      api.win(3400);
    }

    if (st.party) { party(); return; }

    if (!st.started) {
      api.say('cat', 'Moje urodziny!', `Miau! Cześć, ${n}! Jutro są moje urodziny! Urządzam przyjęcie. Pomożesz mi?`, 'cake');
      api.hint('cat', 'Tutaj!', 'Miau! Kliknij mnie!', 'cat');
    } else {
      api.later(400, () => (allInvited(st) && st.cake && st.flowers ? party() : remind()));
    }

    api.on('table', () => {
      if (st.party) return;
      const { m } = missing();
      api.say('dog', m.length ? 'Jeszcze pusto' : 'Pięknie!', m.length ? `Na stole brakuje ${m.join(' i ')}.` : 'Stół jest gotowy na przyjęcie!', 'cake');
    });

    api.on('cat', async () => {
      if (st.party) return;
      if (!st.started) {
        st.started = true;
        save();
        api.hint(null);
        api.say('cat', 'Pomóż mi!', 'Potrzebuję jajek na tort i kwiatków na stół. I roznieś, proszę, zaproszenia do kaczki, królika i wiewiórki!', 'invite');
        await api.wait(3500);
        for (let i = 0; i < 3; i++) await api.bag.add('invite', 'cat');
        api.say('dog', 'Trzy zaproszenia!', 'Mam trzy zaproszenia w plecaku! Jajka są pewnie na farmie.', 'invite');
        api.later(4200, () => api.toMap('Na mapę!', 'Kliknij przycisk Mapa. Na mapie balonik pokazuje, gdzie jest coś do zrobienia!'));
        return;
      }
      if (api.held === 'egg') {
        api.bag.take('egg', 1); api.carry(null);
        st.cake = true; save();
        api.setArt('table', tableArt()); api.sparkles('table');
        api.say('cat', 'Jajka! Tort!', 'Jajka! Super! Upiekę z nich pyszny tort!', 'cake');
      } else if (api.held === 'flower') {
        api.bag.take('flower', 1); api.carry(null);
        st.flowers = true; save();
        api.setArt('table', tableArt()); api.sparkles('table', '#F7A2C0');
        api.say('cat', 'Kwiatki!', 'Jakie piękne kwiatki! Postawię je na stole.', 'flower');
      } else if (api.held) {
        api.say('cat', 'Nie to', 'To mi się nie przyda na przyjęcie.');
        return;
      } else if (api.bag.has('egg') || api.bag.has('flower')) {
        api.say('cat', 'Masz coś?', 'Masz coś w plecaku? Wyjmij i daj mi!', 'backpack');
        api.hint('bag', 'Plecak!', 'Kliknij plecak i wyjmij to, co przyniosłeś!', 'dog');
        return;
      } else {
        remind();
        return;
      }
      if (allInvited(st) && st.cake && st.flowers) { api.later(2600, party); return; }
      api.later(2800, remind);
      maybeLeave(6000);
    });
  },
};

// ---------- FARMA ----------
const farma = {
  bg: 'farm',
  walk: { maxB: 34, click: 46 },
  dog: { x: 40, b: 6 },
  entities: [
    { id: 'barn', art: 'barn', x: 84, b: 44, w: 20, deco: true },
    { id: 'patch', art: 'patchFull', x: 28, b: 12, w: 20, deco: true },
    { id: 'rabbit', art: 'rabbit', x: 13, b: 20, w: 9, label: 'Królik' },
    { id: 'nest', art: 'nestEggs', x: 70, b: 34, w: 12, label: 'Gniazdko' },
    { id: 'chicken', art: 'chicken', x: 56, b: 26, w: 8, label: 'Kura' },
    { id: 'pig', art: 'pig', x: 76, b: 10, w: 14, label: 'Świnka' },
  ],
  start(api) {
    const { st, save, maybeLeave, guest } = common(api, 'farma');
    if (st.eggsTaken) api.setArt('nest', 'nest');
    const nextHint = () => {
      if (!st.eggsTaken) api.hint('nest', 'Gniazdko!', 'Ko ko! Jajka są w gniazdku!', 'chicken');
      else if (!st.inv.rabbit) api.hint('rabbit', 'Zaproszenie!', 'Królik czeka na zaproszenie!', 'dog');
    };
    api.say('dog', 'Farma!', st.eggsTaken ? 'Hau! Jesteśmy na farmie.' : 'Hau! Jesteśmy na farmie. Poszukajmy jajek na tort!', 'egg');
    nextHint();
    maybeLeave(1500);

    guest('rabbit', 'Hop hop!', ['Hop hop!', 'Hop hop! Moje marchewki pięknie rosną!']);

    api.on('chicken', () => {
      if (api.held === 'invite') { api.say('chicken', 'Nie dla mnie', 'Ko ko! Zaproszenie? Ja zostaję pilnować jajek.'); return; }
      if (!st.eggsTaken) { api.say('chicken', 'Weź jajka!', 'Ko ko! Jajka na tort? Proszę bardzo, weź je z gniazdka!', 'egg'); api.hint('nest', 'Gniazdko!', 'Kliknij gniazdko!', 'chicken'); return; }
      api.say('chicken', 'Smacznego!', 'Ko ko! Smacznego tortu!', 'cake');
    });

    api.on('nest', async () => {
      if (st.eggsTaken) { api.say('dog', 'Puste', 'Gniazdko jest już puste.'); return; }
      st.eggsTaken = true;
      api.setArt('nest', 'nest');
      await api.bag.add('egg', 'nest');
      save();
      api.say('dog', 'Jajka!', 'Mam jajka w plecaku! Zaniesiemy je kotkowi.', 'egg');
      nextHint();
      maybeLeave();
    });

    api.on('pig', () => api.say('pig', 'Chrum!', 'Chrum chrum! Przyjęcie? Ja wolę błotko.'));
  },
};

// ---------- STAW ----------
const staw = {
  bg: 'pond',
  walk: { maxB: 25, click: 40 },
  dog: { x: 30, b: 8 },
  entities: [
    { id: 'reeds1', art: 'reeds', x: 34, b: 38, w: 6, deco: true },
    { id: 'lilies', art: 'lilies', x: 72, b: 40, w: 12, deco: true },
    { id: 'owl', art: 'owl', x: 12, b: 16, w: 12, label: 'Sowa listonoszka' },
    { id: 'duck', art: 'duckHat', x: 56, b: 34, w: 13, label: 'Kaczka' },
    { id: 'frog', art: 'frog', x: 82, b: 30, w: 12, label: 'Żabka' },
    { id: 'hedgehog', art: 'hedgehog', x: 46, b: 10, w: 13, label: 'Jeżyk' },
  ],
  start(api) {
    const { st, save, maybeLeave, guest } = common(api, 'staw');
    if (st.flowersTaken) api.setArt('lilies', 'reeds');
    const nextHint = () => {
      if (!st.inv.duck) api.hint('duck', 'Kwa kwa!', 'Kwa kwa! Czy masz coś dla mnie?', 'duck');
      else if (!st.frogAsked) api.hint('frog', 'Kwiatki!', 'Kum kum! Mam piękne kwiatki!', 'frog');
      else if (!st.flowersTaken && api.bag.has('mushroom')) api.hint('frog', 'Grzybek!', 'Daj żabce grzybka z plecaka!', 'dog');
    };
    api.say('dog', 'Staw!', 'Hau! Jesteśmy nad stawem.', 'cake');
    nextHint();
    maybeLeave(1500);

    guest('duck', 'Kwa kwa!', ['Kwa kwa!', 'Kwa kwa! Podoba ci się mój kapelusz?']);

    api.on('frog', async () => {
      if (st.flowersTaken) { api.say('frog', 'Kum kum!', 'Kum kum! Mój grzybek to najlepszy parasol!', 'mushroom'); return; }
      if (api.held === 'mushroom') {
        api.bag.take('mushroom', 1);
        api.carry(null);
        api.hop('frog');
        api.say('frog', 'Dziękuję!', 'Kum kum! Czerwony grzybek! Teraz mam parasol od słońca. Proszę, oto kwiatki dla kotka!', 'flower');
        await api.wait(2600);
        api.setArt('lilies', 'reeds');
        st.flowersTaken = true;
        await api.bag.add('flower', 'lilies');
        save();
        nextHint();
        maybeLeave();
        return;
      }
      if (api.held) { api.say('frog', 'Nie to', 'Kum kum! To nie to. Potrzebuję czerwonego grzybka.', 'mushroom'); return; }
      if (!st.frogAsked) {
        if (!st.started) { api.say('frog', 'Kum kum!', 'Kum kum! Ładny dzień, prawda?'); return; }
        st.frogAsked = true;
        save();
        api.say('frog', 'Przynieś grzybka', 'Kum kum! Kwiatki dla kotka? Dam ci moje lilie. Ale słonko mnie grzeje. Przynieś mi z lasu czerwonego grzybka, będzie moim parasolem!', 'mushroom');
        nextHint();
        maybeLeave(9000);
        return;
      }
      if (api.bag.has('mushroom')) {
        api.say('frog', 'Masz grzybka?', 'Masz grzybka w plecaku? Wyjmij go!', 'backpack');
        api.hint('bag', 'Plecak!', 'Kliknij plecak i wyjmij grzybka!', 'dog');
        return;
      }
      api.say('frog', 'Czekam', 'Kum kum! Czekam na czerwonego grzybka z lasu.', 'mushroom');
    });

    api.on('owl', () => {
      if (!st.inv.duck) api.say('owl', 'Huu huu!', 'Huu huu! Kaczka czeka na zaproszenie!', 'invite');
      else if (!st.flowersTaken) api.say('owl', 'Huu huu!', 'Huu huu! Żabka ma najładniejsze kwiatki nad stawem.', 'flower');
      else api.say('owl', 'Huu huu!', 'Huu huu! Do zobaczenia na przyjęciu!', 'cake');
    });
    api.on('hedgehog', () => api.say('hedgehog', 'Prych!', 'Prych prych! Lubię urodziny!'));
  },
};

// ---------- LAS ----------
const las = {
  bg: 'forest',
  walk: { maxB: 34, click: 46 },
  dog: { x: 50, b: 4 },
  entities: [
    { id: 'pine1', art: 'pine', x: 8, b: 40, w: 14, deco: true },
    { id: 'pine2', art: 'pine', x: 38, b: 44, w: 11, deco: true },
    { id: 'pine3', art: 'pine', x: 70, b: 42, w: 13, deco: true },
    { id: 'leaves', art: 'leafPile', x: 20, b: 22, w: 16, deco: true },
    { id: 'log', art: 'log', x: 52, b: 30, w: 17, deco: true },
    { id: 'squirrel', art: 'squirrel', x: 88, b: 26, w: 10, label: 'Wiewiórka' },
    { id: 'mush', art: 'mushrooms', x: 68, b: 14, w: 13, label: 'Grzybki' },
    { id: 'pine4', art: 'pine', x: 94, b: 8, w: 9, deco: true },
  ],
  start(api) {
    const { st, save, maybeLeave, guest } = common(api, 'las');
    const nextHint = () => {
      if (!st.inv.squirrel) api.hint('squirrel', 'Tutaj!', 'Wiewiórka czeka na zaproszenie!', 'dog');
      else if (st.frogAsked && !st.mushroomTaken) api.hint('mush', 'Grzybek!', 'Tam rośnie czerwony grzybek dla żabki!', 'squirrel');
    };
    api.say('dog', 'Las!', 'Hau! Jesteśmy w lesie.', 'cake');
    nextHint();
    maybeLeave(1500);

    guest('squirrel', 'Cyk cyk!', ['Cyk cyk!', 'Cyk cyk! Moja spiżarnia jest pełna orzechów!']);

    api.on('mush', async () => {
      if (st.mushroomTaken) { api.say('dog', 'Już mamy', 'Grzybek dla żabki już jest w plecaku.', 'mushroom'); return; }
      if (!st.frogAsked) { api.say('dog', 'Ładne grzybki', 'Ładne grzybki! Ale nikt ich teraz nie potrzebuje.', 'mushroom'); return; }
      st.mushroomTaken = true;
      api.sparkles('mush', '#E2525C');
      await api.bag.add('mushroom', 'mush');
      save();
      api.say('dog', 'Grzybek!', 'Mam czerwonego grzybka dla żabki! Jest w plecaku.', 'mushroom');
      nextHint();
      maybeLeave();
    });
  },
};

export default {
  id: 'party',
  title: 'Urodziny kotka',
  after: 'nuts', // dostępna po ukończeniu lasu
  start: 'laka',
  sticker: 'cake',
  winText: 'Kotek miał najlepsze urodziny. Dostajesz wielką gwiazdkę przyjaciela!',
  scenes: { laka, farma, staw, las },
  todo,
  checklist,
  initState,
};
