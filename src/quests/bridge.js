// Przygoda wieloetapowa w górach: Mostek dla koziołka.
// Jezioro: burza zepsuła mostek, koziołek utknął po drugiej stronie strumienia.
// Trzy części mostku z trzech miejsc, każda z małym zadaniem:
//   Schronisko – deska: trzeba wybrać najdłuższą (porównywanie długości)
//   Hala       – lina: owieczki uplotą ją z wełny, ale najpierw trzeba znaleźć jagniątko
//   Jaskinia   – dwa płaskie kamienie: płaskie, a nie okrągłe (kształty)
// Części wkłada się do mostku w dowolnej kolejności; mostek rośnie na oczach.
import { place, common } from './mountains.js';

const STONES_NEEDED = 2;

function initState(st) { return st; }

function checklist(st) {
  return [
    { art: 'plankItem', ok: !!(st.plankGot || st.plankIn), label: 'najdłuższa deska' },
    { art: 'rope', ok: !!(st.ropeGot || st.ropeIn), label: 'lina od owieczek' },
    { art: 'stoneIcon', ok: !!(st.stonesGot || st.stonesIn), label: 'dwa płaskie kamienie' },
    { art: 'kid', ok: !!st.finished, label: 'koziołek wraca do mamy' },
  ];
}

function todo(placeId, st, bagCount) {
  if (st.finished) return false;
  if (placeId === 'jezioro') {
    return !st.started || (bagCount('plank') > 0 && !st.plankIn) || (bagCount('rope') > 0 && !st.ropeIn)
      || (bagCount('stone') >= STONES_NEEDED && !st.stonesIn);
  }
  if (!st.started) return false;
  if (placeId === 'schronisko') return !st.plankGot;
  if (placeId === 'hala') return !st.ropeGot;
  if (placeId === 'jaskinia') return !st.stonesGot;
  return false;
}

const quest = {
  id: 'bridge',
  title: 'Mostek dla koziołka',
  icon: 'kid',
  region: 'gory',
  after: 'sandwich',
  start: 'jezioro',
  sticker: 'kid',
  winText: 'Koziołek wrócił do mamy po nowym mostku. Dostajesz gwiazdkę budowniczego!',
  newText: 'Meee! Kozica nad jeziorem woła o pomoc! Kliknij jezioro z balonikiem.',
  callText: 'Kozica nad jeziorem potrzebuje pomocy! Kliknij jezioro z balonikiem.',
  todo, checklist, initState,
  scenes: {},
};

// ---------- JEZIORO ----------
quest.scenes.jezioro = {
  ...place('jezioro'),
  start(api) {
    const n = api.name;
    const { st, save, maybeLeave, askBag, chatter } = common(api, quest, 'jezioro');
    const artNow = () => `bridge${st.plankIn ? 1 : 0}${st.ropeIn ? 1 : 0}${st.stonesIn ? 1 : 0}`;
    api.setArt('bridge', artNow());
    chatter(['clue']);

    const missing = () => [
      !st.plankIn && 'deski', !st.ropeIn && 'liny', !st.stonesIn && 'płaskich kamieni',
    ].filter(Boolean);
    const where = () => [
      !st.plankIn && !st.plankGot && 'deska jest przy schronisku',
      !st.ropeIn && !st.ropeGot && 'linę upleciesz z owieczkami na hali',
      !st.stonesIn && !st.stonesGot && 'płaskie kamienie są w jaskini',
    ].filter(Boolean);
    const canBuild = () => (api.bag.has('plank') && !st.plankIn) || (api.bag.has('rope') && !st.ropeIn)
      || (api.bag.has('stone', STONES_NEEDED) && !st.stonesIn);

    if (!st.started) {
      api.say('chamois', 'Pomocy!', `Meee! ${n}, pomocy! Burza zepsuła mostek. Mój koziołek jest po drugiej stronie strumienia i nie może wrócić!`, 'kid');
      api.later(6400, () => api.say('kid', 'Mamo!', 'Meee! Mamo! Chcę do domu!'));
      api.hint('chamois', 'Meee!', 'Meee! Kliknij mnie!', 'chamois');
    } else if (canBuild()) {
      api.later(400, () => askBag('bridge', 'części mostku', 'Masz części mostku w plecaku! Wyjmij je i kliknij mostek.'));
    } else {
      api.later(400, () => api.say('chamois', 'Jeszcze trochę', `Meee! Brakuje jeszcze ${missing().join(' i ')}.`, 'kid'));
    }

    api.on('chamois', () => {
      if (st.finished) { api.say('chamois', 'Dziękuję!', 'Dziękuję! Mój koziołek jest bezpieczny!', 'kid'); return; }
      if (!st.started) {
        st.started = true;
        save();
        api.hint(null);
        api.say('chamois', 'Naprawimy go!', 'Naprawmy mostek! Potrzebujemy deski, liny i dwóch płaskich kamieni. Deska jest przy schronisku, linę upleciesz z owieczkami na hali, a płaskie kamienie są w jaskini!', 'kid');
        api.later(12000, () => api.toMap('Na mapę!', 'Kliknij przycisk Mapa. Baloniki pokazują, gdzie szukać części mostku!'));
        return;
      }
      if (canBuild()) { askBag('chamois', 'części mostku', 'Meee! Masz części mostku w plecaku! Wyjmij je i kliknij mostek.'); return; }
      const w = where();
      api.say('chamois', 'Szukaj części', w.length ? 'Meee! Pamiętaj: ' + w.join(', ') + '.' : 'Meee! Włóż części do mostku!', 'kid');
    });

    api.on('kid', () => {
      if (st.finished) { api.hop('kid'); api.say('kid', 'Hura!', 'Meee! Dziękuję za mostek!'); return; }
      api.say('kid', 'Mamo!', 'Meee! Chcę do mamy! Pomóż mi!');
    });

    api.on('bridge', async () => {
      if (st.finished) { api.say('dog', 'Mocny mostek!', 'Ten mostek jest mocny i bezpieczny!'); return; }
      if (!st.started) { api.say('dog', 'Zepsuty', 'Mostek jest zepsuty! Zapytajmy kozicę, co się stało.'); return; }
      const h = api.held;
      if (h === 'plank' && !st.plankIn) {
        api.bag.take('plank', 1); api.carry(null); st.plankIn = true;
        api.say('dog', 'Deska!', 'Deska położona! Ładnie!', 'plankItem');
      } else if (h === 'rope' && !st.ropeIn) {
        api.bag.take('rope', 1); api.carry(null); st.ropeIn = true;
        api.say('dog', 'Lina!', 'Lina przywiązana! Teraz można się trzymać.', 'rope');
      } else if (h === 'stone' && !st.stonesIn) {
        if (!api.bag.has('stone', STONES_NEEDED)) {
          api.say('dog', 'Potrzeba dwóch', 'Potrzebujemy dwóch płaskich kamieni. Mamy jeden. Poszukajmy drugiego w jaskini!', 'stoneIcon');
          return;
        }
        api.bag.take('stone', STONES_NEEDED); api.carry(null); st.stonesIn = true;
        api.say('dog', 'Kamienie!', 'Płaskie kamienie podparły mostek! Jest mocny!', 'stoneIcon');
      } else if (h) {
        api.say('dog', 'Nie pasuje', 'To nie pasuje do mostku.');
        return;
      } else if (canBuild()) {
        askBag('dog', 'części mostku', 'Wyjmij część mostku z plecaka!');
        return;
      } else {
        api.say('dog', 'Brakuje', `Do mostku brakuje jeszcze ${missing().join(' i ')}.`);
        return;
      }
      save();
      api.setArt('bridge', artNow());
      api.shake('bridge');
      api.sparkles('bridge', '#C99A5E');
      if (!(st.plankIn && st.ropeIn && st.stonesIn)) {
        api.later(2800, () => api.say('chamois', 'Jeszcze trochę!', `Meee! Brakuje jeszcze ${missing().join(' i ')}.`, 'kid'));
        maybeLeave(5000);
        return;
      }
      // Mostek gotowy: koziołek przechodzi na drugą stronę
      st.finished = true;
      save();
      api.hint(null);
      await api.wait(1800);
      api.say('chamois', 'Gotowe!', 'Mostek jest gotowy! Chodź, koziołku!', 'kid');
      await api.wait(1800);
      await api.move('kid', 52, 28, 1200);
      await api.move('kid', 66, 12, 1200);
      api.hop('kid');
      api.hop('chamois');
      api.sparkles('kid');
      api.say('kid', 'Mamo!', `Meee! Mamo! Jestem! Dziękuję, ${n}!`, 'kid');
      api.win(4000);
    });
    maybeLeave(1500);
  },
};

// ---------- SCHRONISKO: wybór najdłuższej deski ----------
quest.scenes.schronisko = {
  ...place('schronisko'),
  start(api) {
    const { st, save, maybeLeave, chatter } = common(api, quest, 'schronisko');
    chatter(['picnic', 'guestFox', 'guestMagpie']);
    const planks = { plankA: 'mid', plankB: 'long', plankC: 'short' };
    if (st.started && !st.plankGot) {
      Object.keys(planks).forEach((id) => api.show(id));
      api.say('marmot', 'Deski!', 'Fiu fiu! Deski leżą przy schronisku. Weź najdłuższą, żeby sięgnęła na drugi brzeg strumienia!', 'plankItem');
      api.hint('plankB', 'Najdłuższa!', 'Która deska jest najdłuższa?', 'marmot');
    }

    api.on('marmot', () => {
      if (!st.started) { api.say('marmot', 'Fiu fiu!', 'Fiu fiu! Witaj w schronisku!'); return; }
      if (st.plankGot) { api.say('marmot', 'Powodzenia!', 'Fiu fiu! Powodzenia przy budowie mostku!', 'plankItem'); return; }
      api.say('marmot', 'Najdłuższa!', 'Weź najdłuższą deskę!', 'plankItem');
    });

    for (const [id, len] of Object.entries(planks)) {
      api.on(id, async () => {
        if (st.plankGot) return;
        api.shake(id);
        if (len === 'short') { api.say('dog', 'Za krótka!', 'Ta deska jest za krótka! Nie sięgnie na drugi brzeg.', 'plankItem'); return; }
        if (len === 'mid') { api.say('dog', 'Prawie!', 'Ta jest dłuższa, ale jest jeszcze dłuższa deska!', 'plankItem'); return; }
        st.plankGot = true;
        api.sparkles(id, '#C99A5E');
        await api.bag.add('plank', id);
        Object.keys(planks).forEach((p) => api.show(p, false));
        save();
        api.say('dog', 'Najdłuższa!', 'To najdłuższa deska! Mam ją w plecaku.', 'plankItem');
        maybeLeave();
      });
    }
    maybeLeave(1500);
  },
};

// ---------- HALA: znajdź jagniątko, a owieczki uplotą linę ----------
quest.scenes.hala = {
  ...place('hala'),
  start(api) {
    const { st, save, maybeLeave, chatter } = common(api, quest, 'hala');
    chatter(['herd1', 'herd2']);
    const spots = ['spotRock', 'spotBush', 'spotFlowers'];
    if (st.started && !st.lambSpot) { st.lambSpot = api.pick(spots); save(); }
    const searched = new Set(st.lambSearched || []);
    searched.forEach((id) => api.fade(id));

    if (st.started && !st.ropeGot) {
      api.say('sheep', 'Gdzie jagniątko?', 'Beee! Upleciemy linę z naszej wełny! Ale najpierw znajdź jagniątko. Schowało się i nie chce wyjść!', 'rope');
      api.hint(st.lambSpot, 'Beee!', 'Ciche beee... skąd to?', 'sheep');
    }

    api.on('sheep', () => {
      if (!st.started) { api.say('sheep', 'Dzyń dzyń!', 'Dzyń dzyń! Ładny dzień na hali!', 'bell'); return; }
      if (st.ropeGot) { api.say('sheep', 'Powodzenia!', 'Beee! Lina jest mocna, wytrzyma!', 'rope'); return; }
      api.say('sheep', 'Szukaj!', 'Beee! Jagniątko schowało się za kamieniem, w krzaku albo w kwiatkach. Poszukaj!', 'lamb');
    });

    for (const id of spots) {
      api.on(id, async () => {
        if (!st.started || st.ropeGot) { api.say('dog', 'Ładnie tu', 'Ładnie tu na hali.'); return; }
        api.shake(id);
        if (id !== st.lambSpot) {
          api.tone('knock');
          api.fade(id);
          searched.add(id); st.lambSearched = [...searched]; save();
          api.say('dog', 'Nie ma', 'Tu nie ma jagniątka. Szukaj dalej!');
          return;
        }
        api.hint(null);
        const e = { spotRock: [36, 12], spotBush: [18, 6], spotFlowers: [78, 8] }[id];
        api.move('lamb', e[0], e[1], 0);
        api.show('lamb');
        api.hop('lamb');
        api.sparkles('lamb');
        api.say('lamb', 'Znalazłeś mnie!', 'Beee! Znalazłeś mnie! Bawiliśmy się w chowanego!');
        await api.wait(3200);
        api.hop('sheep'); api.hop('herd1'); api.hop('herd2');
        api.say('sheep', 'Pleciemy!', 'Dziękujemy! Teraz uplatamy linę z naszej wełny. Gotowe!', 'rope');
        await api.wait(2800);
        st.ropeGot = true;
        await api.bag.add('rope', 'sheep');
        save();
        api.say('dog', 'Lina!', 'Mam linę w plecaku!', 'rope');
        maybeLeave();
      });
    }
    maybeLeave(1500);
  },
};

// ---------- JASKINIA: płaskie kamienie, nie okrągłe ----------
quest.scenes.jaskinia = {
  ...place('jaskinia'),
  start(api) {
    const { st, save, maybeLeave, chatter } = common(api, quest, 'jaskinia');
    chatter(['crystals', 'fox']);
    const stones = { st1: 'round', st2: 'flat', st3: 'round', st4: 'flat' };
    const taken = new Set(st.stonesTaken || []);
    if (st.started && !st.stonesGot) {
      Object.keys(stones).forEach((id) => api.show(id, !taken.has(id)));
      api.say('bat', 'Płaskie kamienie', 'Pi pi! Kamienie leżą na dole. Do mostku potrzebne są płaskie, płaskie jak naleśnik!', 'stoneIcon');
      const next = Object.keys(stones).find((id) => stones[id] === 'flat' && !taken.has(id));
      if (next) api.hint(next, 'Płaski!', 'Ten kamień jest płaski!', 'bat');
    }

    api.on('bat', () => {
      if (!st.started || st.stonesGot) { api.say('bat', 'Pi pi!', 'Pi pi! W jaskini jest przyjemny chłodek.'); return; }
      api.say('bat', 'Płaskie!', 'Szukaj płaskich kamieni, a nie okrągłych!', 'stoneIcon');
    });

    for (const [id, shape] of Object.entries(stones)) {
      api.on(id, async () => {
        if (st.stonesGot || taken.has(id)) return;
        api.shake(id);
        if (shape === 'round') { api.tone('knock'); api.say('dog', 'Okrągły', 'Ten kamień jest okrągły. Spadłby z mostku! Potrzebujemy płaskich.'); return; }
        taken.add(id);
        st.stonesTaken = [...taken];
        await api.bag.add('stone', id);
        api.show(id, false);
        const got = api.bag.count('stone');
        if (got >= STONES_NEEDED) {
          st.stonesGot = true;
          save();
          api.say('dog', 'Dwa kamienie!', 'Mamy dwa płaskie kamienie w plecaku!', 'stoneIcon');
          maybeLeave();
        } else {
          save();
          api.say('dog', 'Jeden!', 'Jeden płaski kamień! Potrzebujemy jeszcze jednego.', 'stoneIcon');
          const next = Object.keys(stones).find((s) => stones[s] === 'flat' && !taken.has(s));
          if (next) api.hint(next, 'Płaski!', 'Tam jest drugi płaski kamień!', 'bat');
        }
      });
    }
    maybeLeave(1500);
  },
};

export default quest;
