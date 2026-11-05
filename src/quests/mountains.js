// Wspólne rzeczy dla przygód w górach: jak wygląda każde miejsce, jak zmienia się po ukończonych
// przygodach (dzwonek u owieczki, mostek, piknik...), spokojne sceny bez zadania i pomocnik `common`.

// ---------- Plansze ----------
const PLACES = {
  hala: {
    bg: 'alp', walk: { maxB: 36, click: 46 }, dog: { x: 24, b: 8 },
    entities: [
      { id: 'flowers1', art: 'flowersAlp', x: 12, b: 30, w: 10, deco: true },
      { id: 'herd1', art: 'sheep', x: 40, b: 38, w: 10, label: 'Owieczka ze stada' },
      { id: 'herd2', art: 'sheep', x: 86, b: 36, w: 9, label: 'Owieczka ze stada' },
      { id: 'spotRock', art: 'rock', x: 30, b: 14, w: 11, label: 'Kamień' },
      { id: 'spotBush', art: 'bush', x: 10, b: 6, w: 12, label: 'Krzak' },
      { id: 'spotFlowers', art: 'flowersAlp', x: 86, b: 8, w: 12, label: 'Kwiatki' },
      { id: 'sheep', art: 'sheep', x: 62, b: 20, w: 15, label: 'Owieczka' },
      { id: 'lamb', art: 'lamb', x: 34, b: 12, w: 8, label: 'Jagniątko', hidden: true },
    ],
  },
  schronisko: {
    bg: 'alp', walk: { maxB: 32, click: 46 }, dog: { x: 20, b: 8 },
    entities: [
      { id: 'hut', art: 'hut', x: 72, b: 34, w: 24, deco: true },
      { id: 'rock', art: 'rock', x: 10, b: 30, w: 11, deco: true },
      { id: 'picnic', art: 'picnicFull', x: 52, b: 22, w: 17, label: 'Stolik' },
      { id: 'marmot', art: 'marmot', x: 34, b: 16, w: 9, label: 'Świstak' },
      { id: 'guestFox', art: 'fox', x: 68, b: 14, w: 12, label: 'Lis', hidden: true },
      { id: 'guestMagpie', art: 'magpie', x: 66, b: 20, w: 8, label: 'Sroka', hidden: true },
      { id: 'plankA', art: 'plankMid', x: 84, b: 8, w: 13, label: 'Deska', hidden: true },
      { id: 'plankB', art: 'plankLong', x: 60, b: 4, w: 18, label: 'Deska', hidden: true },
      { id: 'plankC', art: 'plankShort', x: 16, b: 4, w: 9, label: 'Deska', hidden: true },
    ],
  },
  jaskinia: {
    bg: 'cave', walk: { maxB: 34, click: 46 }, dog: { x: 16, b: 8 },
    entities: [
      { id: 'rock1', art: 'rock', x: 40, b: 36, w: 14, deco: true },
      { id: 'bat', art: 'bat', x: 58, b: 64, w: 11, label: 'Nietoperz' },
      { id: 'crystals', art: 'crystals', x: 78, b: 16, w: 15, label: 'Kryształy' },
      { id: 'fox', art: 'fox', x: 52, b: 20, w: 12, label: 'Lis' },
      { id: 'st1', art: 'stoneRound', x: 26, b: 4, w: 7, label: 'Kamień', hidden: true },
      { id: 'st2', art: 'stoneFlat', x: 40, b: 3, w: 9, label: 'Kamień', hidden: true },
      { id: 'st3', art: 'stoneRound', x: 56, b: 5, w: 7, label: 'Kamień', hidden: true },
      { id: 'st4', art: 'stoneFlat', x: 70, b: 2, w: 9, label: 'Kamień', hidden: true },
      { id: 'rock2', art: 'rock', x: 92, b: 34, w: 10, label: 'Skała' },
      { id: 'rock3', art: 'rock', x: 26, b: 30, w: 10, label: 'Skała' },
    ],
  },
  jezioro: {
    bg: 'mlake', walk: { maxB: 22, click: 26 }, dog: { x: 20, b: 6 },
    entities: [
      { id: 'flowers', art: 'flowersAlp', x: 10, b: 18, w: 10, deco: true },
      { id: 'reeds', art: 'reeds', x: 92, b: 38, w: 5, deco: true },
      { id: 'bridge', art: 'bridgeBroken', x: 52, b: 22, w: 10, label: 'Mostek' },
      { id: 'kid', art: 'kid', x: 60, b: 40, w: 7, label: 'Koziołek' },
      { id: 'chamois', art: 'chamois', x: 74, b: 10, w: 12, label: 'Kozica' },
      { id: 'clue', art: 'clueSpot', x: 30, b: 12, w: 11, label: 'Kamień przy brzegu' },
    ],
  },
  szczyt: {
    bg: 'peak', walk: { maxB: 34, click: 46 }, dog: { x: 26, b: 8 },
    entities: [
      { id: 'rock', art: 'rock', x: 14, b: 32, w: 12, deco: true },
      { id: 'flowers', art: 'flowersAlp', x: 36, b: 26, w: 9, deco: true },
      { id: 'nest', art: 'nestEmpty', x: 84, b: 22, w: 15, label: 'Gniazdo' },
      { id: 'eagle', art: 'eagle', x: 62, b: 26, w: 11, label: 'Orlica' },
      { id: 'magpie', art: 'magpie', x: 44, b: 36, w: 8, label: 'Sroka' },
      { id: 'mSheep', art: 'sheepBell', x: 20, b: 12, w: 13, label: 'Owieczka', hidden: true, stay: true },
      { id: 'mMarmot', art: 'marmot', x: 42, b: 8, w: 8, label: 'Świstak', hidden: true, stay: true },
      { id: 'mChamois', art: 'chamois', x: 72, b: 6, w: 12, label: 'Kozica', hidden: true, stay: true },
    ],
  },
};

export function place(placeId) {
  const p = PLACES[placeId];
  return { bg: p.bg, walk: p.walk, dog: p.dog, entities: p.entities.map((e) => ({ ...e })) };
}

// ---------- Jak wygląda świat po wcześniejszych przygodach ----------
export function decorate(api, placeId) {
  const { done, flags } = api.world;
  const bell = flags.bell || {};
  const sw = flags.sandwich || {};
  const br = flags.bridge || {};
  const swDone = done.includes('sandwich');
  if (placeId === 'hala' && done.includes('bell')) api.setArt('sheep', 'sheepBell');
  if (placeId === 'schronisko') {
    api.setArt('picnic', !sw.started || swDone ? 'picnicFull' : 'picnicEmpty');
    if (swDone) api.show(sw.culprit === 'magpie' ? 'guestMagpie' : 'guestFox');
  }
  if (placeId === 'jaskinia') {
    api.sceneClass('lit', !!bell.lit || done.includes('bell'));
    if (bell.crystal) api.setArt('crystals', 'crystalsTaken');
    if (swDone && sw.culprit === 'fox') api.show('fox', false);
  }
  if (placeId === 'jezioro') {
    const built = done.includes('bridge');
    api.setArt('bridge', built ? 'bridge111' : `bridge${br.plankIn ? 1 : 0}${br.ropeIn ? 1 : 0}${br.stonesIn ? 1 : 0}`);
    if (built) api.move('kid', 66, 12, 0);
  }
  if (placeId === 'szczyt') {
    if (swDone && sw.culprit === 'magpie') api.show('magpie', false);
  }
}

// ---------- Spokojne sceny: miejsce bez aktualnego zadania ----------
const CHATTER = {
  hala: {
    sheep: (w) => (w.done.includes('bell') ? ['Dzyń dzyń!', 'Dzyń dzyń! Mój dzwonek pięknie dzwoni!', 'bell'] : ['Beee!', 'Beee! Ładny dzień na hali!']),
    herd1: () => ['Beee!', 'Beee! Trawka na hali jest najlepsza!'],
    herd2: () => ['Beee!', 'Beee! Lubię się wygrzewać w słonku.'],
  },
  schronisko: {
    marmot: () => ['Fiu fiu!', 'Fiu fiu! Witaj w schronisku!'],
    picnic: () => ['Mniam!', 'Na stoliku są pyszne kanapki.', 'sandwich'],
    guestFox: () => ['Mniam!', 'Teraz zawsze pytam, zanim wezmę kanapkę!', 'sandwich'],
    guestMagpie: () => ['Ćwir!', 'Ćwir! Teraz zawsze pytam, zanim wezmę kanapkę!', 'sandwich'],
  },
  jaskinia: {
    bat: () => ['Pi pi!', 'Pi pi! W jaskini jest przyjemny chłodek.'],
    crystals: () => ['Błyszczy!', 'Kryształy pięknie błyszczą w świetle latarki.', 'crystal'],
    fox: () => ['Cześć!', 'Cześć! Ja mieszkam w tej jaskini.'],
  },
  jezioro: {
    chamois: (w) => (w.done.includes('bridge') ? ['Dziękuję!', 'Dzięki mostkowi koziołek zawsze może wrócić do domu!'] : ['Meee!', 'Meee! Woda w jeziorze jest bardzo zimna.']),
    kid: () => ['Meee!', 'Meee! Lubię skakać po kamieniach!'],
    bridge: (w) => (w.done.includes('bridge') ? ['Mocny mostek!', 'Ten mostek jest mocny i bezpieczny!'] : ['Zepsuty', 'Mostek jest zepsuty.']),
    clue: () => ['Kamień', 'To zwykły kamień.'],
  },
  szczyt: {
    eagle: () => ['Kiii!', 'Kiii! Stąd widać całe góry!'],
    nest: () => ['Gniazdo', 'To gniazdo orlicy.'],
    magpie: () => ['Ćwir!', 'Ćwir ćwir! Lubię błyszczące rzeczy!'],
  },
};

export function idleScene(placeId) {
  return {
    ...place(placeId),
    start(api) {
      decorate(api, placeId);
      api.chip('peak', 'Góry', true);
      const chat = CHATTER[placeId];
      for (const id of Object.keys(chat)) {
        api.on(id, () => { api.hop(id); api.say(id, ...chat[id](api.world)); });
      }
      const first = Object.keys(chat)[0];
      api.later(500, () => api.say(first, ...chat[first](api.world)));
    },
  };
}

// ---------- Pomocnik wspólny dla scen przygód ----------
export function common(api, quest, placeId) {
  const st = api.state;
  const showList = () => {
    api.chip(quest.icon, quest.title, !!st.finished);
    api.tray(quest.checklist(st).map((c) => (c.ok ? c.art : { art: c.art, dim: true })));
  };
  const save = () => { api.saveState(); showList(); };
  // Gdy w tym miejscu nic już nie ma do zrobienia, piesek zaprasza na mapę
  const maybeLeave = (delay = 3200) => {
    if (st.finished || quest.todo(placeId, st, api.bag.count)) return;
    api.hint(null);
    api.later(delay, () => api.toMap('Na mapę!', 'Tutaj wszystko zrobione! Kliknij przycisk Mapa i chodźmy dalej.'));
  };
  const askBag = (id, item, text) => {
    api.say(id, 'Zajrzyj do plecaka', text, 'backpack');
    api.hint('bag', 'Plecak!', `Kliknij plecak i wyjmij ${item}!`, 'dog');
  };
  // Postacie, z którymi ta przygoda nic nie robi, po prostu rozmawiają
  const chatter = (ids) => {
    for (const id of ids) {
      const line = CHATTER[placeId][id];
      if (line) api.on(id, () => { api.hop(id); api.say(id, ...line(api.world)); });
    }
  };
  decorate(api, placeId);
  showList();
  return { st, save, showList, maybeLeave, askBag, chatter };
}
