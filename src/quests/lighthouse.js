// Otwarta przygoda (Plaża + Wulkan): Latarnia nie świeci.
// Foka: burza zgasiła latarnię i rozbiła szybkę na trzy kawałki o różnych kształtach.
//   trójkąt  – zakopany w jednym z trzech kopczyków na plaży (losowo)
//   kwadrat  – pelikan złowił go w sieć; odda, gdy Hania policzy ryby w koszyku (3–5, losowo)
//   koło     – zabrała papuga w dżungli; odda za muszlę, w której szumi morze (od ośmiornicy z rafy)
// Ogień: salamandra w jaskini lawy da ognisty kamyk, ale jest gorący – trzeba go nieść w wiaderku kraba.
// Latarnia: każdy kawałek pasuje tylko do swojego kształtu w ramce, a potem ogień do lampy.
import { countWord } from '../items.js';

const PIECES = { tri: 'lensTri', square: 'lensSquare', circle: 'lensCircle' };
const SLOT = { tri: 'slotTri', square: 'slotSquare', circle: 'slotCircle' };
const NAME = { tri: 'trójkąt', square: 'kwadrat', circle: 'koło' };

function initState(st) {
  if (!st.got) st.got = {};
  if (!st.placed) st.placed = {};
  return st;
}
const allPlaced = (st) => Object.keys(PIECES).every((k) => st.placed[k]);

function checklist(st) {
  return [
    ...Object.keys(PIECES).map((k) => ({ art: PIECES[k], ok: !!(st.got[k] || st.placed[k]) })),
    { art: 'fireStone', ok: !!st.fireGot },
    { art: 'lighthouseIcon', ok: !!st.finished },
  ];
}

function todo(placeId, st, bagCount) {
  if (st.finished) return false;
  if (placeId === 'latarnia') {
    return !st.started || Object.values(PIECES).some((it) => bagCount(it) > 0) || (bagCount('fireBucket') > 0 && allPlaced(st));
  }
  if (!st.started) return false;
  if (placeId === 'plaza') return !st.got.tri || (!st.bucketGot && !st.fireGot);
  if (placeId === 'molo') return !st.got.square;
  if (placeId === 'dzungla') return !st.got.circle && (!st.shellAsked || bagCount('shell') > 0);
  if (placeId === 'rafa') return !!st.shellAsked && !st.shellGot;
  if (placeId === 'lawa') return !st.fireGot;
  return false;
}

const quest = {
  id: 'lighthouse',
  title: 'Latarnia nie świeci',
  icon: 'lighthouseIcon',
  sticker: 'lighthouseIcon',
  winText: 'Latarnia znowu świeci, a łódka pelikana wróciła do domu! Dostajesz gwiazdkę latarnika!',
  todo, checklist, initState,
  parts: {},
};

// ---------- LATARNIA ----------
quest.parts.latarnia = (p) => {
  const { st, api } = p;
  const showFrame = () => {
    api.show('frame');
    for (const k of Object.keys(PIECES)) {
      api.show(SLOT[k]);
      if (st.placed[k]) api.setArt(SLOT[k], PIECES[k]);
    }
  };
  if (st.started) showFrame();
  const missing = () => {
    const m = Object.keys(PIECES).filter((k) => !st.placed[k] && !st.got[k]).map((k) => NAME[k]);
    return m;
  };

  p.intro(() => {
    if (!st.started) { api.say('seal', 'Latarnia zgasła!', 'Arf arf! Pomocy! Burza zgasiła latarnię i rozbiła szybkę. Wieczorem łódka pelikana nie trafi do domu!', 'lighthouseIcon'); return true; }
    return false;
  });
  p.hint(() => {
    if (!st.started) return ['seal', 'Arf!', 'Arf arf! Kliknij mnie!', 'seal'];
    const inBag = Object.keys(PIECES).find((k) => api.bag.has(PIECES[k]));
    if (inBag) return ['bag', 'Kawałek szybki!', 'Wyjmij kawałek szybki z plecaka i włóż go do ramki!', 'seal'];
    if (allPlaced(st) && api.bag.has('fireBucket')) return ['lighthouse', 'Ogień!', 'Wyjmij ognisty kamyk i kliknij latarnię!', 'seal'];
    return null;
  });

  p.talk('seal', () => {
    if (st.finished || st.started) return false;
    {
      st.started = true;
      st.sandSpot = api.pick(['sand1', 'sand2', 'sand3']);
      st.fish = api.pick([3, 4, 5]);
      showFrame();
      p.save();
      api.say('seal', 'Trzy kawałki', 'Szybka rozbiła się na trzy kawałki: trójkąt, kwadrat i koło. Jeden zakopał się w piasku na plaży, drugi złapał w sieć pelikan na molo, a trzeci porwała papuga do dżungli. I potrzebujemy ognia! Salamandra w jaskini lawy ma ogniste kamyki.', 'lighthouseIcon');
      return true;
    }
  });
  p.talk('seal', () => {
    if (!st.started || st.finished) return false;
    const m = missing();
    if (m.length) api.say('seal', 'Szukaj dalej', `Arf! Brakuje jeszcze kawałków: ${m.join(', ')}.${st.fireGot ? '' : ' I ognistego kamyka.'}`, 'lighthouseIcon');
    else if (!allPlaced(st)) api.say('seal', 'Do ramki!', 'Włóż kawałki szybki do ramki!', 'lighthouseIcon');
    else api.say('seal', 'Ogień!', st.fireGot ? 'Szybka gotowa! Wyjmij ognisty kamyk i kliknij latarnię!' : 'Szybka gotowa! Teraz potrzebny jest ognisty kamyk od salamandry.', 'fireStone');
    return true;
  }, -5);

  p.item('seal', (held) => {
    if (!st.started || !Object.values(PIECES).includes(held)) return false;
    api.say('seal', 'Do ramki!', 'Arf! Włóż ten kawałek do ramki pod latarnią, tam gdzie pasuje kształt!', held);
    return true;
  });

  for (const k of Object.keys(PIECES)) {
    p.talk(SLOT[k], () => {
      if (!st.started) return false;
      api.say('dog', st.placed[k] ? 'Pasuje!' : NAME[k], st.placed[k] ? 'Ten kawałek jest już na miejscu.' : `Tu pasuje kawałek w kształcie: ${NAME[k]}.`, st.placed[k] ? PIECES[k] : SLOT[k]);
      return true;
    });
    p.item(SLOT[k], (held) => {
      if (!st.started) return false;
      const piece = Object.keys(PIECES).find((x) => PIECES[x] === held);
      if (!piece) return false;
      if (st.placed[k]) { api.say('dog', 'Zajęte', 'Tu już jest kawałek.'); return true; }
      if (piece !== k) {
        api.shake(SLOT[k]);
        api.say('dog', 'Nie pasuje!', `To jest ${NAME[piece]}, a tu pasuje ${NAME[k]}. Spróbuj w innym miejscu!`, held);
        return true;
      }
      api.bag.take(held, 1);
      api.carry(null);
      st.placed[k] = true;
      api.setArt(SLOT[k], PIECES[k]);
      api.sparkles(SLOT[k], '#BFE6F5');
      p.save();
      api.say('dog', 'Pasuje!', allPlaced(st) ? 'Cała szybka złożona! Teraz potrzebny jest ogień.' : `${NAME[k]} pasuje idealnie!`, PIECES[k]);
      return true;
    });
  }

  p.talk('lighthouse', () => {
    if (!st.started || st.finished) return false;
    api.say('dog', 'Ciemno', allPlaced(st) ? 'Latarnia czeka na ogień!' : 'Najpierw trzeba złożyć szybkę w ramce.', 'lighthouseIcon');
    return true;
  });
  p.item('lighthouse', async (held) => {
    if (!st.started || held !== 'fireBucket') return false;
    if (!allPlaced(st)) { api.say('dog', 'Jeszcze nie', 'Najpierw włóż wszystkie kawałki szybki do ramki!', 'lensTri'); return true; }
    api.bag.take('fireBucket', 1);
    api.carry(null);
    st.finished = true;
    p.save();
    api.sceneClass('night');
    api.setArt('lighthouse', 'lighthouseLit');
    api.sparkles('lighthouse', '#FFE79A');
    api.say('seal', 'Świeci!', 'Arf arf! Latarnia świeci! Patrz, tam płynie łódka!', 'lighthouseIcon');
    await api.wait(2600);
    api.show('boatSea');
    await api.move('boatSea', 54, 44, 2600);
    api.hop('seal');
    api.say('seal', 'Hura!', `Łódka pelikana trafiła do domu! Dziękuję, ${p.name}!`, 'boat');
    p.win(4000);
    return true;
  });
};

// ---------- PLAŻA: trójkąt w piasku i wiaderko kraba ----------
quest.parts.plaza = (p) => {
  const { st, api } = p;
  for (const id of ['sand1', 'sand2', 'sand3']) if ((st.dug || []).includes(id)) api.fade(id);
  p.hint(() => (st.started && !st.got.tri ? [st.sandSpot, 'Coś błyszczy!', 'W jednym kopczyku coś błyszczy!', 'crab'] : null));
  for (const id of ['sand1', 'sand2', 'sand3']) {
    p.talk(id, async () => {
      if (!st.started || st.got.tri) return false;
      api.shake(id);
      if (id !== st.sandSpot) {
        st.dug = [...new Set([...(st.dug || []), id])];
        api.fade(id);
        p.save();
        api.say('dog', 'Tylko piasek', 'Kop kop! Tylko piasek. Spróbujmy w innym kopczyku!');
        return true;
      }
      st.got.tri = true;
      api.sparkles(id, '#BFE6F5');
      p.save();
      api.say('dog', 'Trójkąt!', 'Kop kop! Jest kawałek szybki w kształcie trójkąta!', 'lensTri');
      await api.bag.add('lensTri', id);
      return true;
    });
  }
  p.talk('crab', async () => {
    if (!st.started || st.bucketGot || st.fireGot) return false;
    st.bucketGot = true;
    p.save();
    api.say('crab', 'Wiaderko!', 'Klik klik! Potrzebujesz ognia do latarni? Ogień parzy! Weź moje wiaderko, w nim bezpiecznie go zaniesiesz.', 'bucket');
    await api.bag.add('bucket', 'crab');
    return true;
  });
};

// ---------- MOLO: liczenie ryb ----------
quest.parts.molo = (p) => {
  const { st, api } = p;
  const cards = { ans3: 3, ans4: 4, ans5: 5 };
  if (st.started) api.setArt('basket', `fishBasket${st.fish}`);
  const showCards = (on) => Object.keys(cards).forEach((id) => api.show(id, on));
  if (st.counting && !st.got.square) showCards(true);
  p.hint(() => {
    if (!st.started || st.got.square) return null;
    return st.counting ? ['basket', 'Policz!', 'Policz ryby w koszyku i kliknij kartkę z dobrą liczbą!', 'pelican'] : ['pelican', 'Kwadrat!', 'Pelikan ma kawałek szybki!', 'dog'];
  });
  p.talk('pelican', () => {
    if (!st.started || st.got.square) return false;
    st.counting = true;
    p.save();
    showCards(true);
    api.say('pelican', 'Policz ryby!', 'Złowiłem w sieć szklany kwadrat! Oddam go, jeśli pomożesz mi policzyć ryby w koszyku. Ile jest ryb? Kliknij kartkę z dobrą liczbą!', 'lensSquare');
    return true;
  });
  p.talk('basket', () => {
    if (!st.started || st.got.square || !st.counting) return false;
    api.say('pelican', 'Policz!', 'Policz rybki, pokazując każdą paluszkiem. Potem kliknij kartkę z tą liczbą.', 'lensSquare');
    return true;
  });
  for (const [id, n] of Object.entries(cards)) {
    p.talk(id, async () => {
      if (!st.counting || st.got.square) return false;
      api.hop(id);
      if (n !== st.fish) {
        api.say('pelican', 'Policz jeszcze raz', `${countWord(n)}? Hmm, policzmy jeszcze raz, rybka po rybce.`);
        return true;
      }
      st.got.square = true;
      st.counting = false;
      showCards(false);
      api.sparkles('basket', '#BFE6F5');
      p.save();
      api.say('pelican', `Tak, ${n}!`, `Tak! ${countWord(n)} ryb! Dziękuję! Proszę, oto szklany kwadrat.`, 'lensSquare');
      await api.bag.add('lensSquare', 'pelican');
      return true;
    });
  }
};

// ---------- DŻUNGLA: papuga zamieni koło na muszlę ----------
quest.parts.dzungla = (p) => {
  const { st, api } = p;
  p.hint(() => (st.started && !st.got.circle && api.bag.has('shell') ? ['bag', 'Muszla!', 'Wyjmij muszlę z plecaka i daj ją papudze!', 'dog'] : null));
  p.talk('parrot', () => {
    if (!st.started || st.got.circle) return false;
    if (api.bag.has('shell')) { p.ask('parrot', 'muszlę', 'Skrrr! Masz muszlę? Wyjmij ją z plecaka!'); return true; }
    st.shellAsked = true;
    p.save();
    api.say('parrot', 'Moje koło!', 'Skrrr! To błyszczące szkiełko w kształcie koła jest teraz moje! Ale oddam je za muszlę, w której szumi morze.', 'shell');
    api.later(7000, () => api.say('dog', 'Muszla', 'Muszle są na rafie. Zapytajmy ośmiornicę!', 'shell'));
    return true;
  }, 1);
  p.item('parrot', async (held) => {
    if (held !== 'shell' || !st.started || st.got.circle) return false;
    api.bag.take('shell', 1);
    api.carry(null);
    st.got.circle = true;
    p.save();
    api.hop('parrot');
    api.say('parrot', 'Szumi morze!', 'Skrrr! Szszsz... słychać morze! Dziękuję! Proszę, oto szkiełko w kształcie koła.', 'lensCircle');
    await api.bag.add('lensCircle', 'parrot');
    return true;
  });
};

// ---------- RAFA: muszla od ośmiornicy ----------
quest.parts.rafa = (p) => {
  const { st, api } = p;
  p.talk('octopus', async () => {
    if (!st.started || !st.shellAsked || st.shellGot) return false;
    st.shellGot = true;
    p.save();
    api.say('octopus', 'Muszla!', 'Bul bul! Muszla, w której szumi morze? Mam ich mnóstwo! Proszę!', 'shell');
    await api.bag.add('shell', 'octopus');
    return true;
  });
};

// ---------- JASKINIA LAWY: ognisty kamyk ----------
quest.parts.lawa = (p) => {
  const { st, api } = p;
  p.hint(() => (st.started && !st.fireGot && api.bag.has('bucket') ? ['bag', 'Wiaderko!', 'Wyjmij wiaderko z plecaka i daj je salamandrze!', 'salamander'] : null));
  const give = async () => {
    api.bag.take('bucket', 1);
    api.carry(null);
    st.fireGot = true;
    p.save();
    api.say('salamander', 'Ognisty kamyk!', 'Sss! Masz wiaderko, świetnie! Wkładam do niego ognisty kamyk. Nie dotykaj, jest gorący!', 'fireStone');
    await api.bag.add('fireBucket', 'salamander');
  };
  p.talk('salamander', async () => {
    if (!st.started || st.fireGot) return false;
    if (api.bag.has('bucket')) { await give(); return true; }
    if (st.fireAsked) return false;
    st.fireAsked = true;
    p.save();
    api.say('salamander', 'Gorący!', 'Sss! Ognisty kamyk do latarni? Proszę bardzo, ale jest bardzo gorący! Przynieś coś, w czym go zaniesiesz.', 'fireStone');
    api.later(7000, () => api.say('dog', 'Wiaderko?', 'Może krab na plaży pożyczy nam wiaderko?', 'bucket'));
    return true;
  });
  p.talk('salamander', () => {
    if (!st.started || st.fireGot) return false;
    api.say('salamander', 'Wiaderko', 'Sss! Przynieś wiaderko, a dam ci ognisty kamyk.', 'bucket');
    return true;
  }, -5);
  p.item('salamander', async (held) => {
    if (held !== 'bucket' || !st.started || st.fireGot) return false;
    await give();
    return true;
  });
};

export default quest;
