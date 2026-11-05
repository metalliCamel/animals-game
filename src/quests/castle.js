// Otwarta przygoda (Plaża): Kto zburzył zamek z piasku?
// Trzech podejrzanych: foka (Latarnia), mewa (Molo), pingwin (Rafa). Sprawca jest losowany.
// Są trzy cechy, każdą mają dwa zwierzątka:
//   A – ma dziób: mewa, pingwin      (wyklucza fokę)
//   B – nie lata: foka, pingwin      (wyklucza mewę)
//   C – jest szary: foka, mewa       (wyklucza pingwina)
// Sprawca ma dwie z trzech cech. Te dwie prawdziwe wskazówki są ukryte w dwóch z trzech miejsc
// (zamek na plaży, pelikan na molo, ośmiornica na rafie), a trzecie miejsce nic nie wie.
// Dopiero dwie wskazówki razem wskazują sprawcę. Na końcu zamek buduje się od największej części.

const SUSPECTS = {
  seal: { place: 'latarnia', name: 'foka', has: ['B', 'C'] },
  gull: { place: 'molo', name: 'mewa', has: ['A', 'C'] },
  penguin: { place: 'rafa', name: 'pingwin', has: ['A', 'B'] },
};
const EXCLUDES = { A: 'seal', B: 'gull', C: 'penguin' };
const FACT = {
  A: { art: 'beakMarks', short: 'Ma dziób!', castle: 'W piasku są małe dziurki od dziobka! Ten, kto zburzył zamek, ma dziób. Foka nie ma dziobka, więc to nie foka!', witness: 'Widziałem go z daleka. Na pewno miał dziób!', out: 'foka nie ma dziobka' },
  B: { art: 'walkPrints', short: 'Nie lata!', castle: 'Od zamku idą ślady łapek. Ten ktoś przyszedł pieszo, bo nie umie latać! Mewa lata, więc to nie mewa!', witness: 'Patrzyłem w niebo i nikt nie przyleciał. Ten ktoś przyszedł pieszo, bo nie umie latać!', out: 'mewa umie latać' },
  C: { art: 'greyFluff', short: 'Jest szary!', castle: 'Na zamku zostało coś szarego! Ten ktoś jest szary. Pingwin jest czarno-biały, więc to nie pingwin!', witness: 'Widziałam coś szarego, jak uciekało od zamku. Ten ktoś jest szary!', out: 'pingwin jest czarno-biały' },
};
const NOT_ME = {
  seal: 'Arf! To nie ja! Ja nie mam dziobka.',
  gull: 'Kiaa! To nie ja! Ja umiem latać, a ten ktoś przyszedł pieszo.',
  penguin: 'To nie ja! Ja jestem czarno-biały, a nie szary.',
};
const CONFESS = {
  seal: 'Arf... To ja. Chciałam zrobić zjeżdżalnię z piasku i niechcący zjechałam prosto na zamek. Przepraszam! Pomogę go odbudować.',
  gull: 'Kiaa... To ja. Szukałam muszelek i tak dziobałam piasek, że zamek się rozsypał. Przepraszam! Pomogę go odbudować.',
  penguin: 'To ja... Chciałem zbudować sobie lodowy domek, ale z piasku nie wyszło i zburzyłem zamek. Przepraszam! Pomogę go odbudować.',
};
const ORDER = ['partBig', 'partMid', 'partSmall'];
const SOURCES = ['plaza', 'molo', 'rafa'];

function initState(st) {
  if (!st.seen) st.seen = {};
  if (!st.facts) st.facts = [];
  if (!st.built) st.built = 0;
  return st;
}
const determined = (st) => st.facts.length >= 2;
const excluded = (st, who) => st.facts.some((f) => EXCLUDES[f] === who);

function checklist(st) {
  return [
    { art: st.facts[0] ? FACT[st.facts[0]].art : 'magnifier', ok: !!st.facts[0] },
    { art: st.facts[1] ? FACT[st.facts[1]].art : 'magnifier', ok: !!st.facts[1] },
    ...Object.keys(SUSPECTS).map((s) => ({ art: s, ok: st.confessed && st.culprit === s, out: excluded(st, s) })),
    { art: 'castleIcon', ok: !!st.finished },
  ];
}

function todo(placeId, st) {
  if (st.finished) return false;
  if (placeId === 'plaza') return !st.started || (!st.seen.plaza) || !!st.confessed;
  if (!st.started || st.confessed) return false;
  if (placeId === 'molo') return !st.seen.molo || (determined(st) && st.culprit === 'gull');
  if (placeId === 'rafa') return !st.seen.rafa || (determined(st) && st.culprit === 'penguin');
  if (placeId === 'latarnia') return determined(st) && st.culprit === 'seal';
  return false;
}

// Wskazówka w danym miejscu (albo null, gdy to miejsce nic nie wie)
function reveal(p, place, speaker) {
  const { st, api } = p;
  st.seen[place] = true;
  const f = st.sources[place];
  if (!f) {
    p.save();
    api.say(speaker, 'Nic nie wiem', place === 'plaza' ? 'Tylko rozsypany piasek. Nic tu nie widać. Popytajmy na molo i na rafie!' : 'Nic nie widziałem. Zapytaj kogoś innego!', 'noClue');
    return;
  }
  if (!st.facts.includes(f)) st.facts.push(f);
  p.save();
  api.say(speaker, FACT[f].short, place === 'plaza' ? FACT[f].castle : FACT[f].witness, FACT[f].art);
  if (place !== 'plaza') api.later(5600, () => api.say('dog', 'Kto odpada?', `To znaczy, że ${FACT[f].out}!`, FACT[f].art));
  if (determined(st)) {
    const who = SUSPECTS[st.culprit];
    api.later(place === 'plaza' ? 8000 : 9600, () => api.say('dog', 'Już wiem!', `Mamy dwie wskazówki! Zostało tylko jedno zwierzątko: ${who.name}. Chodźmy z nim porozmawiać!`, st.culprit));
  }
}

// Rozmowa z podejrzanym: przyznanie się jest ważne, reszta to tylko pogawędka (niski priorytet)
function suspect(p, who) {
  const { st, api } = p;
  p.talk(who, () => {
    if (!st.started || st.finished) return false;
    if (st.confessed) {
      if (st.culprit !== who) return false;
      api.say(who, 'Pomogę!', 'Pomogę odbudować zamek na plaży!', 'castleIcon');
      return true;
    }
    if (excluded(st, who)) return false;
    api.say(who, 'Zamek?', 'Zamek kraba? Ojej, szkoda go!');
    api.later(3200, () => api.say('dog', 'Za mało wskazówek', 'Jeszcze nie wiemy na pewno, kto to był. Zbierzmy więcej wskazówek!', 'magnifier'));
    return true;
  }, -6);
  // Wykluczony podejrzany tłumaczy się przed przypomnieniami innych przygód
  p.talk(who, () => {
    if (!st.started || st.finished || st.confessed || !excluded(st, who)) return false;
    api.say(who, 'To nie ja!', NOT_ME[who], 'castleIcon');
    return true;
  }, -4);
  p.talk(who, () => {
    if (!st.started || st.finished || st.confessed || !determined(st) || st.culprit !== who) return false;
    // Zostało tylko to jedno zwierzątko
    st.confessed = true;
    p.save();
    api.say('dog', 'Wszystko pasuje!', 'Wszystkie wskazówki pasują właśnie do ciebie!', 'magnifier');
    api.later(3600, () => api.say(who, 'To ja...', CONFESS[who], 'castleIcon'));
    return true;
  });
}

const quest = {
  id: 'castle',
  title: 'Kto zburzył zamek?',
  icon: 'castleIcon',
  sticker: 'castleIcon',
  winText: 'Zamek z piasku znowu stoi! Dostajesz gwiazdkę plażowego detektywa!',
  todo, checklist, initState,
  parts: {},
};

quest.parts.plaza = (p) => {
  const { st, api } = p;
  const stage = () => ['castleRuin', 'castle1', 'castle2', 'castle3'][st.built];
  const showParts = () => ORDER.forEach((id, i) => api.show(id, i >= st.built));
  if (st.started) api.setArt('castle', stage());
  if (st.confessed && !st.finished) {
    showParts();
    api.spawn('helper', st.culprit, 80, 30, st.culprit === 'seal' ? 11 : 6);
  }

  p.intro(() => {
    if (!st.started) { api.say('crab', 'Mój zamek!', 'Klik klik! Ojej! Ktoś zburzył mój piękny zamek z piasku!', 'castleIcon'); return true; }
    if (st.confessed && !st.finished) { api.say('crab', 'Budujemy!', 'Zbudujmy zamek od nowa! Najpierw największa część.', 'castleIcon'); return true; }
    return false;
  });
  p.hint(() => {
    if (!st.started) return ['crab', 'Klik klik!', 'Klik klik! Kliknij mnie!', 'crab'];
    if (!st.seen.plaza) return ['castle', 'Zbadaj zamek', 'Zbadaj zburzony zamek!', 'crab'];
    if (st.confessed && !st.finished) return [ORDER[st.built], 'Ta część!', 'Teraz ta część!', 'crab'];
    return null;
  });

  p.talk('crab', () => {
    if (st.finished || st.started) return false;
    {
      st.started = true;
      st.culprit = api.pick(Object.keys(SUSPECTS));
      // Dwie prawdziwe cechy sprawcy trafiają do dwóch losowych miejsc z trzech
      const facts = [...SUSPECTS[st.culprit].has].sort(() => Math.random() - 0.5);
      const places = [...SOURCES].sort(() => Math.random() - 0.5);
      st.sources = { [places[0]]: facts[0], [places[1]]: facts[1], [places[2]]: null };
      p.save();
      api.say('crab', 'Pomóż mi!', 'Kto to zrobił? Zbadaj zamek! Popytaj też pelikana na molo i ośmiornicę na rafie, może coś widzieli. Podejrzani to foka, mewa i pingwin.', 'magnifier');
      return true;
    }
  });
  p.talk('crab', () => {
    if (!st.started || st.finished) return false;
    if (st.confessed) { api.say('crab', 'Budujemy!', 'Zbudujmy zamek! Najpierw największa część, potem średnia, na końcu najmniejsza.', 'castleIcon'); return true; }
    api.say('crab', 'Szukaj dalej', determined(st) ? 'Wiesz już, kto to był? Idź z nim porozmawiać!' : 'Zbieraj wskazówki! Pytaj na molo i na rafie.', 'magnifier');
    return true;
  }, -5);

  p.talk('castle', () => {
    if (!st.started || st.finished) return false;
    if (!st.seen.plaza) { api.shake('castle'); reveal(p, 'plaza', 'dog'); return true; }
    if (st.confessed) { api.say('dog', 'Budujemy', 'Kliknij części zamku od największej do najmniejszej!', 'castleIcon'); return true; }
    const f = st.sources.plaza;
    api.say('dog', f ? FACT[f].short : 'Nic', f ? FACT[f].castle : 'Tu nic nie znaleźliśmy.', f ? FACT[f].art : 'noClue');
    return true;
  });

  for (const id of ORDER) {
    p.talk(id, () => {
      if (!st.confessed || st.finished) return false;
      const expected = ORDER[st.built];
      if (id !== expected) {
        api.shake(id);
        api.say('crab', 'Jeszcze nie!', id === 'partSmall' || (id === 'partMid' && st.built === 0)
          ? 'Najpierw większa część! Inaczej zamek się przewróci.' : 'Ta część jest już na miejscu.', 'castleIcon');
        return true;
      }
      api.show(id, false);
      st.built++;
      api.setArt('castle', stage());
      api.sparkles('castle', '#F0D59C');
      if (st.built < 3) { p.save(); api.say('crab', 'Pięknie!', st.built === 1 ? 'Podstawa stoi! Teraz średnia część.' : 'Wieża stoi! Teraz najmniejsza część.', 'castleIcon'); return true; }
      st.finished = true;
      p.save();
      api.hop('crab'); api.hop('helper');
      api.sparkles('castle'); api.sparkles('crab', '#E2525C');
      api.say('crab', 'Mój zamek!', `Klik klik! Mój zamek jest jeszcze piękniejszy niż przedtem! Dziękuję, ${p.name}!`, 'castleIcon');
      p.win(4200);
      return true;
    });
  }
};

quest.parts.molo = (p) => {
  const { st, api } = p;
  p.hint(() => (st.started && !st.seen.molo ? ['pelican', 'Świadek?', 'Może pelikan coś widział?', 'dog'] : null));
  p.talk('pelican', () => {
    if (!st.started || st.seen.molo) return false;
    reveal(p, 'molo', 'pelican');
    return true;
  });
  suspect(p, 'gull');
};

quest.parts.rafa = (p) => {
  const { st, api } = p;
  p.hint(() => (st.started && !st.seen.rafa ? ['octopus', 'Świadek?', 'Może ośmiornica coś widziała?', 'dog'] : null));
  p.talk('octopus', () => {
    if (!st.started || st.seen.rafa) return false;
    reveal(p, 'rafa', 'octopus');
    return true;
  });
  suspect(p, 'penguin');
};

quest.parts.latarnia = (p) => {
  suspect(p, 'seal');
};

export default quest;
