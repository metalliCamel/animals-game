// Przygoda wieloetapowa w górach: Dzwonek owieczki.
// Hala → Schronisko → Jaskinia → Szczyt → Hala. Każdy krok daje przedmiot potrzebny w następnym miejscu:
//   owieczka daje wełnę → świstak za wełnę daje latarkę → latarka rozświetla jaskinię,
//   nietoperz zdradza, że dzwonek zabrał orzeł, a w jaskini jest kryształ →
//   orlica wymienia dzwonek na kryształ → dzwonek wraca do owieczki.
// Po ukończeniu miejsca w górach zostają otwarte, a zwierzątka po prostu się cieszą.

export function initState(st) { return st; }

export function checklist(st) {
  return [
    { art: 'wool', ok: !!st.woolGiven, label: 'wełna dla świstaka' },
    { art: 'lantern', ok: !!st.lit, label: 'latarka do jaskini' },
    { art: 'crystal', ok: !!st.bellGot, label: 'kryształ dla orlicy' },
    { art: 'bell', ok: !!st.finished, label: 'dzwonek dla owieczki' },
  ];
}

export function todo(placeId, st, bagCount) {
  if (st.finished) return false;
  if (placeId === 'hala') return !st.started || bagCount('bell') > 0;
  if (!st.started) return false;
  if (placeId === 'schronisko') return !st.woolGiven;
  if (placeId === 'jaskinia') return !!st.woolGiven && (!st.lit || !st.batTold || !st.crystal);
  if (placeId === 'szczyt') return (!!st.batTold || !!st.eagleAsked) && !st.bellGot;
  return false;
}

function common(api, placeId) {
  const st = api.state;
  const showList = () => {
    if (st.finished) { api.chip('sheepBell', 'Góry', true); api.tray([]); return; }
    api.chip('bell', 'Dzwonek owieczki');
    api.tray(checklist(st).map((c) => (c.ok ? c.art : { art: c.art, dim: true })));
  };
  const save = () => { api.saveState(); showList(); };
  const maybeLeave = (delay = 3200) => {
    if (st.finished || todo(placeId, st, api.bag.count)) return;
    api.hint(null);
    api.later(delay, () => api.toMap('Na mapę!', 'Tutaj wszystko zrobione! Kliknij przycisk Mapa i chodźmy dalej.'));
  };
  // Zwierzątko prosi o wyjęcie przedmiotu z plecaka
  const askBag = (id, item, text) => {
    api.say(id, 'Zajrzyj do plecaka', text, 'backpack');
    api.hint('bag', 'Plecak!', 'Kliknij plecak i wyjmij ' + item + '!', 'dog');
  };
  showList();
  return { st, save, maybeLeave, askBag };
}

// ---------- HALA ----------
const hala = {
  bg: 'alp',
  walk: { maxB: 36, click: 46 },
  dog: { x: 24, b: 8 },
  entities: [
    { id: 'flowers1', art: 'flowersAlp', x: 12, b: 30, w: 10, deco: true },
    { id: 'herd1', art: 'sheep', x: 40, b: 38, w: 10, label: 'Owieczka ze stada' },
    { id: 'herd2', art: 'sheep', x: 86, b: 36, w: 9, label: 'Owieczka ze stada' },
    { id: 'rock', art: 'rock', x: 30, b: 14, w: 11, deco: true },
    { id: 'sheep', art: 'sheep', x: 64, b: 20, w: 15, label: 'Owieczka' },
    { id: 'flowers2', art: 'flowersAlp', x: 84, b: 8, w: 10, deco: true },
  ],
  start(api) {
    const n = api.name;
    const { st, save, maybeLeave, askBag } = common(api, 'hala');
    if (st.finished) api.setArt('sheep', 'sheepBell');

    for (const id of ['herd1', 'herd2']) {
      api.on(id, () => { api.shake(id); api.say(id, 'Beee!', st.finished ? 'Beee! Słyszymy dzwonek! Hura!' : 'Beee! Pomóż naszej owieczce!'); });
    }

    if (st.finished) {
      api.say('sheep', 'Dzyń dzyń!', `Dzyń dzyń! Cześć, ${n}! Mój dzwonek pięknie dzwoni!`, 'bell');
      api.on('sheep', () => { api.hop('sheep'); api.say('sheep', 'Dziękuję!', 'Dzyń dzyń! Dziękuję za pomoc!', 'bell'); });
      return;
    }

    if (!st.started) {
      api.say('sheep', 'Zgubiłam dzwonek!', `Beee! Cześć, ${n}! Zgubiłam mój dzwonek! Gdy przyjdzie mgła, stado mnie bez niego nie znajdzie.`, 'bell');
      api.hint('sheep', 'Tutaj!', 'Beee! Kliknij mnie!', 'sheep');
    } else if (api.bag.has('bell')) {
      api.later(400, () => askBag('sheep', 'dzwonek', 'Beee! Czy to mój dzwonek? Wyjmij go z plecaka!'));
    } else {
      api.later(400, () => api.say('sheep', 'Szukasz?', 'Beee! Szukasz mojego dzwonka? Dziękuję!', 'bell'));
    }

    api.on('sheep', async () => {
      if (st.finished) return;
      if (!st.started) {
        st.started = true;
        save();
        api.hint(null);
        api.say('sheep', 'Idź do świstaka', 'Świstak ze schroniska słyszy wszystko w górach. Zanieś mu kłębek mojej wełny w prezencie, a na pewno pomoże!', 'wool');
        await api.bag.add('wool', 'sheep');
        await api.wait(3400);
        api.say('dog', 'Wełna w plecaku!', 'Mam wełnę w plecaku! Idziemy do schroniska.', 'wool');
        api.later(3600, () => api.toMap('Na mapę!', 'Kliknij przycisk Mapa. Balonik pokazuje, gdzie iść!'));
        return;
      }
      if (api.held === 'bell') {
        api.bag.take('bell', 1);
        api.carry(null);
        st.finished = true;
        save();
        api.hint(null);
        api.setArt('sheep', 'sheepBell');
        api.hop('sheep'); api.hop('herd1'); api.hop('herd2');
        api.sparkles('sheep'); api.sparkles('sheep', '#FFFBF0');
        api.say('sheep', 'Mój dzwonek!', `Dzyń dzyń! Mój dzwonek! Dziękuję, ${n}! Teraz stado zawsze mnie znajdzie!`, 'bell');
        api.win(4200);
        return;
      }
      if (api.held) { api.say('sheep', 'Nie to', 'Beee! To nie mój dzwonek.'); return; }
      if (api.bag.has('bell')) { askBag('sheep', 'dzwonek', 'Beee! Masz mój dzwonek? Wyjmij go z plecaka!'); return; }
      if (api.bag.has('wool')) { api.say('sheep', 'Do świstaka', 'Beee! Zanieś wełnę świstakowi do schroniska!', 'wool'); return; }
      api.say('sheep', 'Dziękuję!', 'Beee! Dziękuję, że szukasz mojego dzwonka!', 'bell');
    });
    maybeLeave(6000);
  },
};

// ---------- SCHRONISKO ----------
const schronisko = {
  bg: 'alp',
  walk: { maxB: 32, click: 46 },
  dog: { x: 20, b: 8 },
  entities: [
    { id: 'hut', art: 'hut', x: 68, b: 32, w: 26, deco: true },
    { id: 'flowers', art: 'flowersAlp', x: 88, b: 14, w: 10, deco: true },
    { id: 'rock', art: 'rock', x: 12, b: 30, w: 11, deco: true },
    { id: 'marmot', art: 'marmot', x: 46, b: 18, w: 9, label: 'Świstak' },
  ],
  start(api) {
    const { st, save, maybeLeave, askBag } = common(api, 'schronisko');
    if (st.finished) {
      api.say('marmot', 'Fiu fiu!', 'Fiu fiu! Słyszę dzwonek owieczki aż tutaj! Brawo!', 'bell');
      api.on('marmot', () => api.say('marmot', 'Fiu fiu!', 'Fiu fiu! Mój sweterek z wełny jest cieplutki!', 'wool'));
      return;
    }
    api.say('dog', 'Schronisko!', 'Hau! To schronisko w górach.');
    if (st.started && !st.woolGiven) api.hint('marmot', 'Fiu fiu!', 'Fiu fiu! Kto tam idzie?', 'marmot');

    api.on('marmot', async () => {
      if (api.held === 'wool') {
        api.bag.take('wool', 1);
        api.carry(null);
        st.woolGiven = true;
        save();
        api.hint(null);
        api.hop('marmot');
        api.say('marmot', 'Dziękuję!', 'Fiu fiu! Ciepła wełna na sweterek! Dziękuję! Słyszałem dzwonienie w jaskini. Ale tam jest bardzo ciemno. Weź moją latarkę!', 'lantern');
        await api.bag.add('lantern', 'marmot');
        await api.wait(4400);
        api.say('dog', 'Latarka!', 'Mam latarkę w plecaku! Idziemy do jaskini.', 'lantern');
        maybeLeave();
        return;
      }
      if (api.held) { api.say('marmot', 'Nie to', 'Fiu fiu! Dziękuję, ale to nie dla mnie.'); return; }
      if (!st.started) { api.say('marmot', 'Fiu fiu!', 'Fiu fiu! Witaj w schronisku! Ja słyszę wszystko, co się dzieje w górach.'); return; }
      if (!st.woolGiven && api.bag.has('wool')) { askBag('marmot', 'wełnę', 'Fiu fiu! Masz coś dla mnie? Zajrzyj do plecaka!'); return; }
      if (st.woolGiven && !st.lit) { api.say('marmot', 'Do jaskini!', 'Latarka jest w plecaku. W jaskini wyjmij ją z plecaka, a zrobi się jasno!', 'lantern'); return; }
      api.say('marmot', 'Fiu fiu!', 'Fiu fiu! Powodzenia w szukaniu dzwonka!', 'bell');
    });
    maybeLeave(1500);
  },
};

// ---------- JASKINIA ----------
const jaskinia = {
  bg: 'cave',
  walk: { maxB: 34, click: 46 },
  dog: { x: 16, b: 8 },
  entities: [
    { id: 'rock1', art: 'rock', x: 40, b: 36, w: 14, deco: true },
    { id: 'bat', art: 'bat', x: 58, b: 64, w: 11, label: 'Nietoperz' },
    { id: 'crystals', art: 'crystals', x: 78, b: 16, w: 15, label: 'Kryształy' },
    { id: 'rock2', art: 'rock', x: 92, b: 34, w: 10, deco: true },
  ],
  start(api) {
    const { st, save, maybeLeave, askBag } = common(api, 'jaskinia');
    api.cls('bat', 'in-dark');
    api.cls('crystals', 'in-dark');
    if (st.crystal) api.setArt('crystals', 'crystalsTaken');

    function light() {
      st.lit = true;
      save();
      api.sceneClass('lit');
      api.hint(null);
      api.say('dog', 'Jasno!', 'Latarka świeci! Teraz wszystko widać. Kto tam wisi pod sufitem?', 'lantern');
      nextHint();
    }
    function nextHint() {
      if (st.finished) return;
      if (!st.batTold) api.hint('bat', 'Pi pi!', 'Pi pi! Chrrr...', 'bat');
      else if (!st.crystal) api.hint('crystals', 'Błyszczy!', 'Coś tam pięknie błyszczy!', 'dog');
    }

    if (st.lit || st.finished) {
      api.sceneClass('lit');
      api.say('dog', 'Jaskinia', 'Hau! Jesteśmy w jaskini.');
      nextHint();
    } else if (api.bag.has('lantern')) {
      api.say('dog', 'Ciemno!', 'Ale ciemno! Nic nie widać. Wyjmij latarkę z plecaka!', 'lantern');
      api.hint('bag', 'Latarka!', 'Kliknij plecak i wyjmij latarkę!', 'dog');
    } else {
      api.say('dog', 'Ciemno!', 'Ale tu ciemno! Bez latarki nic nie znajdziemy. Może ktoś w schronisku ma latarkę?');
    }

    api.onHold((id) => {
      if (id === 'lantern' && !st.lit) { light(); return true; }
      return false;
    });

    api.on('bat', () => {
      if (st.finished) { api.say('bat', 'Pi pi!', 'Pi pi! Dzwonek wrócił do owieczki? Super!'); return; }
      api.shake('bat');
      st.batTold = true;
      save();
      api.say('bat', 'Orzeł go zabrał!', 'Pi pi! Kto mnie obudził? Dzwonek? Widziałem orlicę! Leciała z czymś błyszczącym na szczyt. Ona uwielbia błyszczące rzeczy!', 'eagle');
      nextHint();
      maybeLeave(7000);
    });

    api.on('crystals', async () => {
      if (st.crystal) { api.say('dog', 'Małe kryształki', 'Zostały tylko małe kryształki. Duży jest w plecaku.', 'crystal'); return; }
      st.crystal = true;
      api.setArt('crystals', 'crystalsTaken');
      api.sparkles('crystals', '#9FD8F2');
      await api.bag.add('crystal', 'crystals');
      save();
      api.say('dog', 'Kryształ!', st.batTold ? 'Jaki błyszczący kryształ! Może spodoba się orlicy?' : 'Jaki błyszczący kryształ! Schowam go do plecaka.', 'crystal');
      nextHint();
      maybeLeave(4500);
    });
  },
};

// ---------- SZCZYT ----------
const szczyt = {
  bg: 'peak',
  walk: { maxB: 34, click: 46 },
  dog: { x: 26, b: 8 },
  entities: [
    { id: 'rock', art: 'rock', x: 14, b: 32, w: 12, deco: true },
    { id: 'flowers', art: 'flowersAlp', x: 36, b: 26, w: 9, deco: true },
    { id: 'nest', art: 'nestBell', x: 84, b: 22, w: 15, label: 'Gniazdo' },
    { id: 'eagle', art: 'eagle', x: 62, b: 26, w: 11, label: 'Orlica' },
  ],
  start(api) {
    const { st, save, maybeLeave, askBag } = common(api, 'szczyt');
    if (st.bellGot) api.setArt('nest', 'nestEmpty');
    if (st.finished) {
      api.say('eagle', 'Kiii!', 'Kiii! Mój kryształ błyszczy w słońcu!', 'crystal');
      api.on('eagle', () => api.say('eagle', 'Kiii!', 'Kiii! Ale stąd pięknie widać całe góry!'));
      api.on('nest', () => api.say('dog', 'Gniazdo', 'W gniazdku błyszczy kryształ.', 'crystal'));
      return;
    }
    api.say('dog', 'Szczyt!', 'Hau! Jesteśmy na samym szczycie! Ale wysoko!');
    if (!st.bellGot) api.hint('nest', 'Coś błyszczy!', 'W gniazdku coś błyszczy!', 'dog');

    api.on('nest', () => {
      if (st.bellGot) { api.say('dog', 'Puste', 'Gniazdko jest puste. Dzwonek mamy w plecaku!', 'bell'); return; }
      api.shake('nest');
      api.say('dog', 'Dzwonek!', 'W gniazdku jest dzwonek owieczki! Ale to gniazdo orlicy. Zapytajmy ją!', 'bell');
      api.hint('eagle', 'Kiii!', 'Kiii! Kto tu przyszedł?', 'eagle');
    });

    api.on('eagle', async () => {
      if (st.bellGot) { api.say('eagle', 'Kiii!', 'Kiii! Mój kryształ jest najpiękniejszy!', 'crystal'); return; }
      if (api.held === 'crystal') {
        api.bag.take('crystal', 1);
        api.carry(null);
        api.hop('eagle');
        api.sparkles('eagle', '#9FD8F2');
        api.setArt('nest', 'nestEmpty');
        st.bellGot = true;
        save();
        api.say('eagle', 'Wymienimy się!', 'Kiii! Ojej, jaki piękny kryształ! Błyszczy jeszcze bardziej niż dzwonek! Wymienimy się?', 'crystal');
        await api.bag.add('bell', 'nest');
        await api.wait(3400);
        api.hint(null);
        api.say('dog', 'Mamy dzwonek!', 'Hura! Dzwonek jest w plecaku! Zanieśmy go owieczce na halę!', 'bell');
        maybeLeave(4000);
        return;
      }
      if (api.held) { api.say('eagle', 'Nie błyszczy', 'Kiii! To wcale nie błyszczy.'); return; }
      if (api.bag.has('crystal')) {
        st.eagleAsked = true;
        save();
        askBag('eagle', 'kryształ', 'Kiii! Dzwonek to mój skarb. Ale czuję, że masz coś błyszczącego w plecaku!');
        return;
      }
      st.eagleAsked = true;
      save();
      api.say('eagle', 'To mój skarb!', 'Kiii! Ten dzwonek znalazłam na hali. To mój skarb! Oddam go tylko za coś, co błyszczy jeszcze bardziej!', 'crystal');
      maybeLeave(7000);
    });
  },
};

export default {
  id: 'bell',
  title: 'Dzwonek owieczki',
  region: 'gory',
  icon: 'bell',
  after: 'party',
  start: 'hala',
  sticker: 'bell',
  winText: 'Owieczka ma swój dzwonek. Dostajesz gwiazdkę górskiego przewodnika!',
  newText: 'Hura! Droga w góry jest otwarta! Kliknij drogowskaz z napisem Góry.',
  callText: 'Owieczka na hali potrzebuje pomocy! Kliknij halę z balonikiem.',
  scenes: { hala, schronisko, jaskinia, szczyt },
  todo,
  checklist,
  initState,
};
