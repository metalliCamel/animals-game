// Otwarta przygoda (Wulkan + Plaża): Jajko papugi.
// Dżungla: jajko papugi wtoczyło się w jedną z sześciu paproci. Gra w „ciepło–zimno”:
//   po każdej złej paproci papuga mówi zimno / ciepło / gorąco, zależnie od tego, jak blisko jest jajko.
// Gorące źródła: żółw mówi, że jajko trzeba ogrzać w ciepłym piasku, w gniazdku z liści i białego piórka.
//   Liście daje małpka w dżungli, białe piórko trzeba wybrać spośród trzech na molo (Plaża).
// Gniazdko buduje się po kolei: liście, piórko, jajko. Potem trzy razy ogrzewa się jajko i wykluwa się pisklę.

const SPOTS = ['j1', 'j2', 'j3', 'j4', 'j5', 'j6'];
const POS = { j1: [46, 30], j2: [62, 34], j3: [68, 14], j4: [44, 6], j5: [22, 3], j6: [80, 22] };

function initState(st) {
  if (!st.tried) st.tried = {};
  if (!st.nest) st.nest = 0;
  if (!st.taps) st.taps = 0;
  return st;
}

function checklist(st) {
  return [
    { art: 'parrotEgg', ok: !!st.eggGot, label: 'jajko w paprociach' },
    { art: 'leaves', ok: !!(st.leavesGot || st.nest >= 1), label: 'liście palmowe od małpki' },
    { art: 'featherWhite', ok: !!(st.featherGot || st.nest >= 2), label: 'białe piórko od mewy' },
    { art: 'chick', ok: !!st.finished, label: 'pisklę się wykluwa' },
  ];
}

function todo(placeId, st, bagCount) {
  if (st.finished) return false;
  if (placeId === 'dzungla') return !st.started || !st.eggGot || (!!st.nestTold && !st.leavesGot);
  if (!st.eggGot) return false;
  if (placeId === 'zrodla') {
    return !st.nestTold || st.nest === 3 || (st.nest === 0 && bagCount('leaves') > 0)
      || (st.nest === 1 && bagCount('featherWhite') > 0) || (st.nest === 2 && bagCount('parrotEgg') > 0);
  }
  if (placeId === 'molo') return !!st.nestTold && !st.featherGot;
  return false;
}

function warmth(spot, egg) {
  const [x1, y1] = POS[spot];
  const [x2, y2] = POS[egg];
  const d = Math.hypot(x1 - x2, (y1 - y2) * 1.4);
  if (d < 26) return ['hot', 'Gorąco!', 'Gorąco, gorąco! Jajko jest bardzo blisko!'];
  if (d < 42) return ['warm', 'Ciepło', 'Ciepło! Jesteś coraz bliżej.'];
  return ['cold', 'Zimno', 'Brrr, zimno! Jajko jest daleko stąd.'];
}

const quest = {
  id: 'egg',
  title: 'Jajko papugi',
  icon: 'parrotEgg',
  sticker: 'chick',
  winText: 'Z jajka wykluła się mała papużka! Dostajesz gwiazdkę opiekuna zwierząt!',
  todo, checklist, initState,
  parts: {},
};

// ---------- DŻUNGLA ----------
quest.parts.dzungla = (p) => {
  const { st, api } = p;
  for (const [id, cls] of Object.entries(st.tried)) api.cls(id, cls);

  p.intro(() => {
    if (!st.started) { api.say('parrot', 'Moje jajko!', 'Skrrr! Pomocy! Moje jajko wypadło z gniazda i wtoczyło się w paprocie!', 'parrotEgg'); return true; }
    if (!st.eggGot) { api.say('parrot', 'Szukaj!', 'Skrrr! Szukaj jajka w paprociach! Powiem ci, czy ciepło, czy zimno.', 'parrotEgg'); return true; }
    return false;
  });
  p.hint(() => {
    if (!st.started) return ['parrot', 'Skrrr!', 'Skrrr! Kliknij mnie!', 'parrot'];
    if (!st.eggGot) return null; // tu podpowiedzią jest ciepło–zimno
    if (st.nestTold && !st.leavesGot) return ['monkey', 'Liście!', 'Poproś małpkę o liście palmowe!', 'dog'];
    return null;
  });

  p.talk('parrot', () => {
    if (st.finished || st.started) return false;
    {
      st.started = true;
      st.eggSpot = api.pick(SPOTS);
      p.save();
      api.say('parrot', 'Ciepło–zimno!', 'Zagrajmy w ciepło–zimno! Klikaj paprocie, a ja ci powiem: zimno, ciepło albo gorąco!', 'parrotEgg');
      return true;
    }
  }, 5);
  p.talk('parrot', () => {
    if (!st.started || st.finished) return false;
    if (!st.eggGot) { api.say('parrot', 'Szukaj!', 'Klikaj paprocie! Gdy jest gorąco, jajko jest blisko!', 'parrotEgg'); return true; }
    api.say('parrot', 'Ogrzej je!', 'Skrrr! Moje jajko musi być ciepłe. Mądry żółw przy gorących źródłach wie, co robić!', 'parrotEgg');
    return true;
  }, -5);

  for (const id of SPOTS) {
    p.talk(id, async () => {
      if (!st.started || st.eggGot) return false;
      api.shake(id);
      if (id !== st.eggSpot) {
        const [cls, short, full] = warmth(id, st.eggSpot);
        st.tried[id] = cls;
        p.save();
        api.cls(id, 'cold', false); api.cls(id, 'warm', false); api.cls(id, 'hot', false);
        api.cls(id, cls);
        api.say('parrot', short, full);
        return true;
      }
      st.eggGot = true;
      p.save();
      api.sparkles(id, '#FFFBF0');
      api.say('parrot', 'Moje jajko!', 'Skrrr! Moje jajko! Ale jest zimne... Mądry żółw przy gorących źródłach wie, jak je ogrzać!', 'parrotEgg');
      await api.bag.add('parrotEgg', id);
      return true;
    });
  }

  p.talk('monkey', async () => {
    if (!st.nestTold || st.leavesGot) return false;
    st.leavesGot = true;
    p.save();
    api.say('monkey', 'Liście!', 'U u a a! Liście palmowe na gniazdko? Proszę, są miękkie i duże!', 'leaves');
    await api.bag.add('leaves', 'monkey');
    return true;
  }, 5);
};

// ---------- GORĄCE ŹRÓDŁA: gniazdko i wyklucie ----------
quest.parts.zrodla = (p) => {
  const { st, api } = p;
  if (st.eggGot) api.setArt('nest', st.nest ? `nest${st.nest}` : 'warmSand');
  const needs = () => [!(st.leavesGot || st.nest >= 1) && 'liści palmowych od małpki', !(st.featherGot || st.nest >= 2) && 'białego piórka od mewy na molo'].filter(Boolean);

  p.intro(() => {
    if (st.eggGot && !st.nestTold) { api.say('tortoise', 'Jajko?', 'Dzień dobry. Widzę, że masz w plecaku jajko. Chodź, powiem ci, co robić.', 'parrotEgg'); return true; }
    if (st.nest === 3) { api.say('tortoise', 'Ogrzej je!', 'Jajko leży w gniazdku. Kliknij je trzy razy, żeby je ogrzać!', 'parrotEgg'); return true; }
    return false;
  });
  p.hint(() => {
    if (!st.eggGot || st.finished) return null;
    if (!st.nestTold) return ['tortoise', 'Dzień dobry', 'Zapytaj żółwia o jajko!', 'dog'];
    if (st.nest === 3) return ['nest', 'Ogrzej!', 'Kliknij jajko w gniazdku!', 'tortoise'];
    const next = st.nest === 0 ? 'leaves' : st.nest === 1 ? 'featherWhite' : 'parrotEgg';
    if (api.bag.has(next)) return ['bag', 'Do gniazdka!', 'Wyjmij to z plecaka i kliknij ciepły piasek!', 'tortoise'];
    return null;
  });

  p.talk('tortoise', () => {
    if (!st.eggGot || st.finished) return false;
    if (!st.nestTold) {
      st.nestTold = true;
      p.save();
      api.say('tortoise', 'Gniazdko', 'Jajko trzeba ogrzać w ciepłym piasku przy źródle. Ale najpierw zrób miękkie gniazdko: na spód liście palmowe od małpki, a na wierzch białe, miękkie piórko od mewy z molo.', 'leaves');
      return true;
    }
    return false;
  }, 5);
  p.talk('tortoise', () => {
    if (!st.eggGot || st.finished || !st.nestTold) return false;
    const n = needs();
    if (n.length) api.say('tortoise', 'Jeszcze trochę', `Do gniazdka potrzebujesz jeszcze ${n.join(' i ')}.`, 'leaves');
    else if (st.nest < 3) api.say('tortoise', 'Buduj!', 'Masz wszystko! Kładź w ciepłym piasku po kolei: liście, piórko, a na końcu jajko.', 'parrotEgg');
    else api.say('tortoise', 'Ogrzej je!', 'Kliknij jajko trzy razy, żeby je ogrzać!', 'parrotEgg');
    return true;
  }, -5);

  p.item('tortoise', (held) => {
    if (!st.eggGot || !['parrotEgg', 'leaves', 'featherWhite'].includes(held)) return false;
    api.say('tortoise', 'Do piasku', 'Połóż to w ciepłym piasku przy źródle, nie u mnie!', held);
    return true;
  });

  const ORDER = ['leaves', 'featherWhite', 'parrotEgg'];
  const NAMES = ['liście', 'piórko', 'jajko'];
  p.item('nest', (held) => {
    if (!st.eggGot || !ORDER.includes(held) || st.finished) return false;
    if (!st.nestTold) { api.say('tortoise', 'Poczekaj', 'Poczekaj, najpierw cię wszystkiego nauczę!', 'parrotEgg'); return true; }
    const want = ORDER[st.nest];
    if (held !== want) {
      api.say('tortoise', 'Inna kolejność', `Najpierw ${NAMES[st.nest]}! Po kolei: liście, piórko, jajko.`, want);
      return true;
    }
    api.bag.take(held, 1);
    api.carry(null);
    st.nest++;
    api.setArt('nest', `nest${st.nest}`);
    api.sparkles('nest', '#FFFBF0');
    p.save();
    api.say('tortoise', 'Dobrze!', st.nest === 1 ? 'Liście na spód. Teraz miękkie piórko!' : st.nest === 2 ? 'Mięciutko! Teraz połóż jajko.' : 'Jajko w ciepłym gniazdku! Teraz kliknij je trzy razy, żeby je ogrzać.', st.nest === 3 ? 'parrotEgg' : ORDER[st.nest]);
    return true;
  });

  p.talk('nest', async () => {
    if (!st.eggGot || st.finished) return false;
    if (st.nest < 3) {
      api.say('dog', 'Ciepły piasek', st.nestTold ? `Tu robimy gniazdko. Teraz potrzebne: ${NAMES[st.nest]}.` : 'Ciepły piasek przy źródle. Zapytajmy żółwia, co robić.');
      return true;
    }
    st.taps++;
    api.shake('nest');
    api.sparkles('nest', '#F7A24A');
    if (st.taps < 3) { p.save(); api.say('dog', st.taps === 1 ? 'Raz!' : 'Dwa!', st.taps === 1 ? 'Raz! Jajko robi się cieplejsze.' : 'Dwa! Coś się w nim rusza!', 'parrotEgg'); return true; }
    st.finished = true;
    p.save();
    api.say('dog', 'Trzy!', 'Trzy! Puk puk! Jajko pęka!', 'eggCracked');
    await api.wait(1800);
    api.setArt('nest', 'nest2');
    api.show('chick');
    api.hop('chick');
    api.sparkles('chick', '#7FD06A');
    api.say('chick', 'Pi pi!', 'Pi pi! Pi pi!', 'chick');
    await api.wait(2400);
    api.show('parrotVisit');
    api.sparkles('parrotVisit', '#E2525C');
    api.say('parrotVisit', 'Moje pisklątko!', `Skrrr! Moje pisklątko! Dziękuję, ${p.name}! Będę mu opowiadać o tobie!`, 'chick');
    p.win(4400);
    return true;
  });
};

// ---------- MOLO: białe piórko od mewy ----------
quest.parts.molo = (p) => {
  const { st, api } = p;
  const feathers = { fWhite: 'white', fGrey: 'grey', fBlack: 'black' };
  const show = (on) => Object.keys(feathers).forEach((id) => api.show(id, on));
  if (st.featherGame && !st.featherGot) show(true);
  p.hint(() => {
    if (!st.nestTold || st.featherGot) return null;
    return st.featherGame ? ['fWhite', 'Białe!', 'Które piórko jest białe?', 'gull'] : ['gull', 'Piórko', 'Mewa ma białe piórka!', 'dog'];
  });
  p.talk('gull', () => {
    if (!st.nestTold || st.featherGot) return false;
    st.featherGame = true;
    p.save();
    show(true);
    api.say('gull', 'Białe piórko', 'Kiaa! Piórko na gniazdko? Zgubiłam kilka na molo. Weź białe, najbardziej miękkie! Nie szare i nie czarne.', 'featherWhite');
    return true;
  }, 5);
  for (const [id, color] of Object.entries(feathers)) {
    p.talk(id, async () => {
      if (!st.featherGame || st.featherGot) return false;
      if (color !== 'white') {
        api.shake(id);
        api.say('gull', color === 'grey' ? 'Szare' : 'Czarne', color === 'grey' ? 'To piórko jest szare. Potrzebujemy białego!' : 'To piórko jest czarne. Potrzebujemy białego!');
        return true;
      }
      st.featherGot = true;
      p.save();
      api.say('gull', 'Białe!', 'Kiaa! Tak, to białe! Najbardziej miękkie!', 'featherWhite');
      await api.bag.add('featherWhite', id);
      show(false);
      return true;
    });
  }
};

export default quest;
