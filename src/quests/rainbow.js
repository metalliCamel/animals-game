// Otwarta przygoda (Wulkan + Plaża): Tęczowy wybuch wulkanu.
// Legwan w kraterze: na Święto Wyspy wulkan zawsze wybucha tęczą, ale zatkał go głaz.
//   Dżungla  – kij bambusowy od małpki: trzeba dać jej DOKŁADNIE tyle bananów, ile pokazuje (2–5).
//              Banany zrywa się do plecaka, a potem oddaje wszystkie naraz; za dużo albo za mało = od nowa.
//   Krater   – kijem podważa się głaz.
//   Kamienie – czerwony (jaskinia lawy), żółty (gorące źródła), niebieski (ośmiornica na rafie, na Plaży).
//   Kolejność – malowidło w jaskini lawy pokazuje, w jakiej kolejności dać kamienie wulkanowi (losowo).
import { countWord } from '../items.js';

const STONES = { R: 'red', Y: 'yellow', B: 'blue' };
const ART_OF = { R: 'stoneRed', Y: 'stoneYellow', B: 'stoneBlue' };
const NAME = { R: 'czerwony', Y: 'żółty', B: 'niebieski' };
const COLOR = { R: '#F06A5A', Y: '#FFD84A', B: '#7FB8F0' };
const BANANAS = ['ban1', 'ban2', 'ban3', 'ban4', 'ban5'];

function initState(st) {
  if (!st.got) st.got = {};
  if (!st.placed) st.placed = 0;
  if (!st.picked) st.picked = [];
  return st;
}
const keyOf = (item) => Object.keys(STONES).find((k) => STONES[k] === item);

function checklist(st) {
  return [
    { art: 'bamboo', ok: !!st.bambooGot },
    { art: st.orderSeen ? `painting${st.order}` : 'question', ok: !!st.orderSeen },
    ...['R', 'Y', 'B'].map((k) => ({ art: ART_OF[k], ok: !!st.got[k] })),
    { art: 'volcanoIcon', ok: !!st.finished },
  ];
}

function todo(placeId, st, bagCount) {
  if (st.finished) return false;
  if (placeId === 'krater') {
    return !st.started || (bagCount('bamboo') > 0 && !st.boulderOut)
      || (st.boulderOut && Object.values(STONES).some((it) => bagCount(it) > 0));
  }
  if (!st.started) return false;
  if (placeId === 'dzungla') return !st.bambooGot;
  if (placeId === 'lawa') return !st.orderSeen || !st.got.R;
  if (placeId === 'zrodla') return !st.got.Y;
  if (placeId === 'rafa') return !st.got.B;
  return false;
}

const quest = {
  id: 'rainbow',
  title: 'Tęczowy wybuch',
  icon: 'volcanoIcon',
  sticker: 'volcanoIcon',
  winText: 'Wulkan wybuchł piękną tęczą na Święto Wyspy! Dostajesz gwiazdkę ognistego odkrywcy!',
  todo, checklist, initState,
  parts: {},
};

// ---------- KRATER ----------
quest.parts.krater = (p) => {
  const { st, api } = p;
  if (st.boulderOut) { api.show('boulder', false); api.setArt('volcano', 'volcanoOpen'); }
  const missing = () => ['R', 'Y', 'B'].filter((k) => !st.got[k]).map((k) => NAME[k]);

  p.intro(() => {
    if (!st.started) { api.say('iguana', 'Święto Wyspy!', 'Hej! Dziś Święto Wyspy! Wulkan zawsze wybucha wtedy kolorową tęczą, ale w tym roku coś go zatkało!', 'volcanoIcon'); return true; }
    return false;
  });
  p.hint(() => {
    if (!st.started) return ['iguana', 'Hej!', 'Hej! Kliknij mnie!', 'iguana'];
    if (!st.boulderOut && api.bag.has('bamboo')) return ['bag', 'Bambus!', 'Wyjmij bambus z plecaka i kliknij głaz!', 'iguana'];
    if (st.boulderOut && Object.values(STONES).some((it) => api.bag.has(it))) return ['bag', 'Kamienie!', 'Wyjmij kolorowy kamień i daj go wulkanowi!', 'iguana'];
    return null;
  });

  p.talk('iguana', () => {
    if (st.finished || st.started) return false;
    {
      st.started = true;
      st.order = api.pick(['RYB', 'RBY', 'YRB', 'YBR', 'BRY', 'BYR']);
      st.bananas = api.pick([2, 3, 4, 5]);
      p.save();
      api.say('iguana', 'Zatkany wulkan', 'Wulkan zatkał wielki głaz! Małpka w dżungli ma długi bambus, nim podważymy głaz. Potem wulkan potrzebuje trzech kamieni: czerwonego, żółtego i niebieskiego. W jakiej kolejności? To pokazuje stare malowidło w jaskini lawy!', 'volcanoIcon');
      return true;
    }
  });
  p.talk('iguana', () => {
    if (!st.started || st.finished) return false;
    if (!st.boulderOut) api.say('iguana', 'Głaz', st.bambooGot ? 'Podważ głaz bambusem!' : 'Najpierw zdobądź bambus od małpki w dżungli.', 'bamboo');
    else if (missing().length) api.say('iguana', 'Kamienie', `Brakuje jeszcze kamieni: ${missing().join(', ')}.${st.orderSeen ? '' : ' Pamiętaj o malowidle w jaskini lawy!'}`, 'volcanoIcon');
    else api.say('iguana', 'Kolejność!', 'Masz wszystkie kamienie! Dawaj je wulkanowi w kolejności z malowidła.', st.orderSeen ? `painting${st.order}` : 'question');
    return true;
  }, -5);

  const unplug = async () => {
    api.bag.take('bamboo', 1);
    api.carry(null);
    st.boulderOut = true;
    p.save();
    api.shake('boulder');
    await api.wait(700);
    await api.move('boulder', 92, 30, 900);
    api.show('boulder', false);
    api.setArt('volcano', 'volcanoOpen');
    api.sparkles('volcano', '#F7A24A');
    api.say('volcano', 'Uff!', 'Uff! Dziękuję! Teraz mogę oddychać. Daj mi trzy kolorowe kamienie w dobrej kolejności, a zrobię tęczę!', 'volcanoIcon');
  };
  p.item('boulder', async (held) => {
    if (held !== 'bamboo' || st.boulderOut) return false;
    await unplug();
    return true;
  });
  p.talk('boulder', () => {
    if (!st.started || st.boulderOut) return false;
    api.say('dog', 'Za ciężki', 'Ten głaz jest za ciężki! Potrzebujemy długiego kija, żeby go podważyć.', 'bamboo');
    return true;
  });
  p.talk('volcano', () => {
    if (!st.started || st.finished) return false;
    api.say('volcano', st.boulderOut ? 'Kamienie!' : 'Mmmf!', st.boulderOut ? 'Daj mi kolorowe kamienie w kolejności z malowidła!' : 'Mmmf! Głaz mnie zatkał!', 'volcanoIcon');
    return true;
  });
  p.item('volcano', async (held) => {
    if (held === 'bamboo' && !st.boulderOut) { await unplug(); return true; }
    const k = keyOf(held);
    if (!k || !st.started) return false;
    if (!st.boulderOut) { api.say('volcano', 'Mmmf!', 'Mmmf! Najpierw zdejmij ze mnie głaz!'); return true; }
    const expected = st.order[st.placed];
    if (k !== expected) {
      api.shake('volcano');
      api.say('volcano', 'Apsik!', `Apsik! To nie ten kolor! ${st.orderSeen ? 'Przypomnij sobie malowidło z jaskini lawy.' : 'Kolejność pokazuje malowidło w jaskini lawy.'}`, st.orderSeen ? `painting${st.order}` : 'question');
      return true;
    }
    api.bag.take(held, 1);
    api.carry(null);
    st.placed++;
    p.save();
    api.sparkles('volcano', COLOR[k]);
    if (st.placed < 3) { api.say('volcano', 'Mniam!', `${NAME[k][0].toUpperCase() + NAME[k].slice(1)}! Pyszny! Teraz następny kolor.`, ART_OF[k]); return true; }
    // Wielki finał
    st.finished = true;
    p.save();
    api.say('volcano', 'Bum!', 'Brrr... BUM!', 'volcanoIcon');
    api.sceneClass('erupt');
    api.setArt('volcano', 'volcanoErupt');
    for (let i = 0; i < 6; i++) {
      api.sparkles('volcano', ['#F06A5A', '#F7A24A', '#FFD84A', '#7FD06A', '#7FB8F0', '#B48FD8'][i]);
      await api.wait(260);
    }
    api.show('rainbow');
    api.sparkles('rainbow'); api.sparkles('rainbow', '#7FB8F0');
    api.hop('iguana');
    api.say('iguana', 'Tęcza!', `Tęczowy wybuch! Najpiękniejszy w historii wyspy! Dziękuję, ${p.name}!`, 'rainbow');
    api.later(2400, () => { api.setArt('volcano', 'volcanoOpen'); api.sparkles('volcano', '#FFD84A'); });
    p.win(5000);
    return true;
  });
};

// ---------- DŻUNGLA: dokładnie tyle bananów ----------
quest.parts.dzungla = (p) => {
  const { st, api } = p;
  // Zerwane banany znikają z drzewa (także po powrocie do gry)
  st.picked.forEach((id) => api.show(id, false));
  const reset = () => { st.picked = []; BANANAS.forEach((id) => api.show(id)); };

  p.hint(() => {
    if (!st.started || st.bambooGot) return null;
    if (!st.bananaGame) return ['monkey', 'Bambus!', 'Małpka ma bambus!', 'dog'];
    if (api.bag.count('banana') > 0) return ['bag', 'Banany!', 'Wyjmij banany z plecaka i daj je małpce!', 'monkey'];
    return [BANANAS.find((b) => !st.picked.includes(b)) || 'monkey', 'Banany!', `Zerwij ${countWord(st.bananas)} banany z drzewa!`, 'monkey'];
  });

  p.talk('monkey', () => {
    if (!st.started || st.bambooGot) return false;
    if (api.bag.count('banana') > 0) { p.ask('monkey', 'banany', 'U u a a! Masz banany w plecaku? Wyjmij je i daj mi!'); return true; }
    if (st.bananaGame) return false;
    st.bananaGame = true;
    p.save();
    api.say('monkey', `${st.bananas} banany!`, `U u a a! Bambus? Dam ci go, jeśli zerwiesz mi z drzewa dokładnie ${countWord(st.bananas)} ${st.bananas === 5 ? 'bananów' : 'banany'}. Ani jednego więcej, ani mniej!`, 'banana');
    return true;
  });
  p.talk('monkey', () => {
    if (!st.started || st.bambooGot || !st.bananaGame) return false;
    api.say('monkey', `${st.bananas}!`, `Zerwij z drzewa ${countWord(st.bananas)} ${st.bananas === 5 ? 'bananów' : 'banany'}, a potem daj mi je z plecaka!`, 'banana');
    return true;
  }, -5);
  for (const id of BANANAS) {
    p.talk(id, async () => {
      if (!st.bananaGame || st.bambooGot || st.picked.includes(id)) return false;
      st.picked.push(id);
      p.save();
      await api.bag.add('banana', id);
      api.show(id, false);
      const n = api.bag.count('banana');
      api.say('dog', countWord(n), `Mam ${countWord(n)}!`, 'banana');
      return true;
    });
  }
  p.item('monkey', async (held) => {
    if (held !== 'banana' || !st.started || st.bambooGot) return false;
    const n = api.bag.take('banana');
    api.carry(null);
    if (n !== st.bananas) {
      reset();
      p.save();
      api.shake('monkey');
      api.say('monkey', n > st.bananas ? 'Za dużo!' : 'Za mało!', `U u! Dałeś mi ${countWord(n)}, a prosiłam o ${countWord(st.bananas)}! Odkładam je z powrotem na drzewo. Spróbuj jeszcze raz!`, 'banana');
      return true;
    }
    st.bambooGot = true;
    p.save();
    api.hop('monkey');
    api.say('monkey', `Dokładnie ${n}!`, `U u a a! Dokładnie ${countWord(n)}! Dziękuję! Proszę, oto długi bambus.`, 'bamboo');
    await api.bag.add('bamboo', 'monkey');
    return true;
  });
};

// ---------- JASKINIA LAWY: malowidło i czerwony kamień ----------
quest.parts.lawa = (p) => {
  const { st, api } = p;
  if (st.started) api.setArt('painting', `painting${st.order}`);
  p.hint(() => {
    if (!st.started) return null;
    if (!st.orderSeen) return ['painting', 'Malowidło!', 'Obejrzyj stare malowidło na ścianie!', 'salamander'];
    if (!st.got.R) return ['redRock', 'Czerwony!', 'Weź czerwony kamień!', 'salamander'];
    return null;
  });
  p.talk('painting', () => {
    if (!st.started) return false;
    st.orderSeen = true;
    p.save();
    const names = st.order.split('').map((k) => NAME[k]);
    api.say('dog', 'Kolejność!', `Malowidło pokazuje wulkan i trzy kolory. Najpierw ${names[0]}, potem ${names[1]}, a na końcu ${names[2]}!`, `painting${st.order}`);
    return true;
  });
  p.talk('redRock', async () => {
    if (!st.started || st.got.R) return false;
    st.got.R = true;
    p.save();
    api.sparkles('redRock', COLOR.R);
    api.say('dog', 'Czerwony!', 'Mam czerwony kamień!', 'stoneRed');
    await api.bag.add('red', 'redRock');
    return true;
  });
  p.talk('salamander', () => {
    if (!st.started || st.orderSeen) return false;
    api.say('salamander', 'Malowidło', 'Sss! Na ścianie jest stare malowidło. Pokazuje, jak wulkan robi tęczę. Przyjrzyj mu się!', `painting${st.order}`);
    return true;
  }, -4);
};

// ---------- GORĄCE ŹRÓDŁA: żółty kamień ----------
quest.parts.zrodla = (p) => {
  const { st, api } = p;
  p.hint(() => (st.started && !st.got.Y ? ['sulfur', 'Żółty!', 'Przy źródle leżą żółte kamienie!', 'tortoise'] : null));
  p.talk('sulfur', async () => {
    if (!st.started || st.got.Y) return false;
    st.got.Y = true;
    p.save();
    api.sparkles('sulfur', COLOR.Y);
    api.say('dog', 'Żółty!', 'Mam żółty kamień! Trochę pachnie jak zgniłe jajko!', 'stoneYellow');
    await api.bag.add('yellow', 'sulfur');
    return true;
  });
};

// ---------- RAFA: niebieski kamień od ośmiornicy ----------
quest.parts.rafa = (p) => {
  const { st, api } = p;
  p.talk('octopus', async () => {
    if (!st.started || st.got.B) return false;
    st.got.B = true;
    p.save();
    api.say('octopus', 'Niebieski!', 'Bul bul! Niebieski kamień dla wulkanu? Mam taki na dnie! Proszę!', 'stoneBlue');
    await api.bag.add('blue', 'octopus');
    return true;
  });
};

export default quest;
