// Przygoda wieloetapowa w górach: Kto podkrada kanapki?
// Schronisko: świstakowi znikają kanapki, okruszki prowadzą nad jezioro. Świstak daje kanapkę na drogę.
// Jezioro: na kamieniu jest wskazówka (rude futerko albo czarne pióro), a kozica mówi, kto takie ma.
// Jaskinia (lis) i Szczyt (sroka): podejrzani. Sprawca jest losowany, więc trzeba dopasować wskazówkę.
// Sprawca przyznaje się, że był głodny. Hania dzieli się z nim kanapką, a on oddaje koszyk.
// Schronisko: koszyk wraca do świstaka i wszyscy jedzą razem.
import { place, common } from './mountains.js';

const SUSPECTS = {
  fox: { name: 'lis', home: 'jaskinia', clue: 'furRed', spot: 'clueSpotFur', has: 'rude futerko', voice: 'Ojej...' },
  magpie: { name: 'sroka', home: 'szczyt', clue: 'feather', spot: 'clueSpotFeather', has: 'czarno-białe pióra', voice: 'Ćwir...' },
};

function initState(st) { if (!st.cleared) st.cleared = []; return st; }

function checklist(st) {
  const c = st.culprit && SUSPECTS[st.culprit];
  return [
    { art: 'crumbs', ok: !!st.crumbs, label: 'okruszki przy stoliku' },
    { art: st.clue && c ? c.clue : 'magnifier', ok: !!st.clue, label: st.clue && c ? `wskazówka: ${c.has}` : 'wskazówka nad jeziorem' },
    { art: st.confessed && c ? st.culprit : 'question', ok: !!st.confessed, label: st.confessed && c ? `to ${c.name === 'sroka' ? 'była' : 'był'} ${c.name}` : 'kto to zrobił?' },
    { art: 'basket', ok: !!st.finished, label: 'koszyk kanapek dla świstaka' },
  ];
}

function todo(placeId, st, bagCount) {
  if (st.finished) return false;
  if (placeId === 'schronisko') return !st.started || !st.crumbs || bagCount('basket') > 0;
  if (!st.started || !st.crumbs) return false;
  if (placeId === 'jezioro') return !st.clue || !st.witness;
  const ready = st.clue && st.witness && !st.basketGot;
  if (placeId === 'jaskinia') return ready && !st.cleared.includes('fox');
  if (placeId === 'szczyt') return ready && !st.cleared.includes('magpie');
  return false;
}

const quest = {
  id: 'sandwich',
  title: 'Kto podkrada kanapki?',
  icon: 'sandwich',
  region: 'gory',
  after: 'bell',
  start: 'schronisko',
  sticker: 'sandwich',
  winText: 'Zagadka kanapek rozwiązana! Dostajesz gwiazdkę górskiego detektywa!',
  newText: 'Fiu fiu! Świstak w schronisku cię woła! Kliknij drogowskaz Góry.',
  callText: 'Świstak w schronisku potrzebuje pomocy! Kliknij schronisko z balonikiem.',
  todo, checklist, initState,
  scenes: {},
};

// ---------- SCHRONISKO ----------
quest.scenes.schronisko = {
  ...place('schronisko'),
  start(api) {
    const n = api.name;
    const { st, save, maybeLeave, askBag } = common(api, quest, 'schronisko');
    if (st.crumbs && !st.finished) api.spawn('trail', 'crumbTrail', 74, 10, 30);

    if (!st.started) {
      api.say('marmot', 'Gdzie kanapki?', `Fiu fiu! ${n}, dobrze, że jesteś! Ktoś codziennie podkrada moje kanapki!`, 'sandwich');
      api.hint('marmot', 'Tutaj!', 'Fiu fiu! Kliknij mnie!', 'marmot');
    } else if (api.bag.has('basket')) {
      api.later(400, () => askBag('marmot', 'koszyk', 'Fiu fiu! Masz moje kanapki? Wyjmij koszyk z plecaka!'));
    } else if (!st.crumbs) {
      api.hint('picnic', 'Stolik!', 'Obejrzyj stolik, z którego znikają kanapki!', 'marmot');
    } else {
      api.later(400, () => api.say('marmot', 'Szukaj dalej', 'Fiu fiu! Okruszki prowadziły nad jezioro. Powodzenia, detektywie!', 'crumbs'));
    }

    api.on('marmot', async () => {
      if (!st.started) {
        st.started = true;
        st.culprit = api.pick(['fox', 'magpie']);
        save();
        api.say('marmot', 'Obejrzyj stolik', 'Kładę kanapki na stoliku, odwracam się, a ich już nie ma! Obejrzyj stolik, detektywie!', 'sandwich');
        api.hint('picnic', 'Stolik!', 'Obejrzyj stolik!', 'marmot');
        return;
      }
      if (api.held === 'basket') {
        api.bag.take('basket', 1);
        api.carry(null);
        st.finished = true;
        save();
        api.hint(null);
        api.setArt('picnic', 'picnicFull');
        api.sparkles('picnic');
        api.say('marmot', 'Moje kanapki!', 'Fiu fiu! Moje kanapki wróciły! Dziękuję!', 'basket');
        await api.wait(2600);
        const guest = st.culprit === 'magpie' ? 'guestMagpie' : 'guestFox';
        api.show(guest);
        api.sparkles(guest);
        api.say(guest, 'Przepraszam!', 'Przepraszam, świstaku. Już nigdy nie wezmę nic bez pytania.', 'sandwich');
        await api.wait(3800);
        api.hop('marmot');
        api.say('marmot', 'Zjemy razem!', `Wystarczy zapytać! Zapraszam na kanapki. Ciebie też, ${n}!`, 'sandwich');
        api.win(4200);
        return;
      }
      if (api.held) { api.say('marmot', 'Nie to', 'Fiu fiu! To nie moje kanapki.'); return; }
      if (api.bag.has('basket')) { askBag('marmot', 'koszyk', 'Fiu fiu! Masz moje kanapki? Wyjmij koszyk z plecaka!'); return; }
      if (!st.crumbs) { api.say('marmot', 'Stolik!', 'Obejrzyj stolik!', 'sandwich'); return; }
      api.say('marmot', 'Jezioro!', 'Okruszki prowadziły nad jezioro. Tam szukaj dalej!', 'crumbs');
    });

    api.on('picnic', async () => {
      if (!st.started) { api.say('dog', 'Stolik', 'Pusty stolik. Zapytajmy świstaka, co się stało.'); return; }
      if (st.crumbs) { api.say('dog', 'Okruszki', 'Okruszki prowadzą w stronę jeziora!', 'crumbs'); return; }
      st.crumbs = true;
      api.shake('picnic');
      api.spawn('trail', 'crumbTrail', 74, 10, 30);
      api.sparkles('picnic', '#E8B866');
      save();
      api.say('dog', 'Okruszki!', 'Niuch niuch! Okruszki! Prowadzą w stronę jeziora!', 'crumbs');
      await api.bag.add('sandwich', 'marmot');
      await api.wait(3000);
      api.say('marmot', 'Na drogę', 'Fiu fiu! Weź kanapkę na drogę. Detektyw nie może być głodny!', 'sandwich');
      await api.wait(1200);
      api.later(2000, () => api.say('dog', 'Nad jezioro!', 'Mam kanapkę w plecaku. Idziemy nad jezioro!', 'crumbs'));
      maybeLeave(5000);
    });
    maybeLeave(1500);
  },
};

// ---------- JEZIORO ----------
quest.scenes.jezioro = {
  ...place('jezioro'),
  start(api) {
    const { st, save, maybeLeave, chatter } = common(api, quest, 'jezioro');
    const c = st.culprit && SUSPECTS[st.culprit];
    if (st.started && st.crumbs && c) api.setArt('clue', c.spot);
    chatter(['kid', 'bridge']);

    function nextHint() {
      if (!st.started || !st.crumbs) return;
      if (!st.clue) api.hint('clue', 'Coś tu jest!', 'Psst! Na kamieniu coś jest!', 'chamois');
      else if (!st.witness) api.hint('chamois', 'Meee!', 'Meee! Zapytaj mnie!', 'chamois');
    }
    if (st.started && st.crumbs) {
      api.say('dog', 'Jezioro', st.clue && st.witness ? 'Hau! Wiemy już, kogo szukać!' : 'Hau! Okruszki prowadziły tutaj. Rozejrzyjmy się!', 'magnifier');
    }
    nextHint();

    api.on('clue', () => {
      if (!st.started || !st.crumbs) { api.say('dog', 'Kamień', 'To zwykły kamień.'); return; }
      if (st.clue) { api.say('dog', c.has, `Na kamieniu jest ${c.has}.`, c.clue); return; }
      st.clue = true;
      save();
      api.shake('clue');
      api.sparkles('clue');
      api.say('dog', st.culprit === 'fox' ? 'Rude futerko!' : 'Czarne pióro!', st.culprit === 'fox'
        ? 'Niuch! Okruszki i rude futerko! Kto ma rude futerko? Zapytajmy kozicę!'
        : 'Niuch! Okruszki i czarno-białe pióro! Kto ma takie pióra? Zapytajmy kozicę!', c.clue);
      nextHint();
    });

    api.on('chamois', () => {
      if (!st.started || !st.crumbs) { api.say('chamois', 'Meee!', 'Meee! Woda w jeziorze jest bardzo zimna.'); return; }
      if (!st.clue) {
        api.say('chamois', 'Widziałam kogoś!', 'Meee! Widziałam, jak ktoś uciekał z kanapką, ale było daleko. Zobacz, co zostało na kamieniu!', 'sandwich');
        return;
      }
      st.witness = true;
      save();
      api.say('chamois', 'Kto to ma?', 'Meee! W górach rude futerko ma lis z jaskini. A czarno-białe pióra ma sroka ze szczytu. Ja mam brązową sierść, to nie ja!', c.clue);
      api.later(9000, () => api.say('dog', 'Kto pasuje?', `Na kamieniu było ${c.has}. Do kogo pasuje? Wybierz na mapie!`, c.clue));
      maybeLeave(13000);
    });
    maybeLeave(1500);
  },
};

// ---------- PODEJRZANI: wspólna logika dla jaskini i szczytu ----------
function suspectScene(placeId, who, others) {
  return {
    ...place(placeId),
    start(api) {
      const n = api.name;
      const { st, save, maybeLeave, askBag, chatter } = common(api, quest, placeId);
      const me = SUSPECTS[who];
      const c = st.culprit && SUSPECTS[st.culprit];
      chatter(others);
      if (st.cleared.includes(who)) api.fade(who);
      const ready = () => st.clue && st.witness;

      if (st.confessed && st.culprit === who && !st.basketGot) {
        api.later(400, () => askBag(who, 'kanapkę', `${me.voice} Jestem taki głodny... Masz może coś do jedzenia w plecaku?`));
      } else if (ready() && !st.basketGot && !st.cleared.includes(who)) {
        api.say('dog', 'Podejrzany!', `Hau! Czy to ${me.name} zabiera kanapki? Kliknij i sprawdź!`, 'magnifier');
        api.hint(who, 'Kto to?', 'Porozmawiaj ze mną!', who);
      }

      api.on(who, async () => {
        if (!ready() || st.finished) {
          api.hop(who);
          api.say(who, 'Cześć!', who === 'fox' ? 'Cześć! Ja mieszkam w tej jaskini.' : 'Ćwir ćwir! Lubię błyszczące rzeczy!');
          return;
        }
        if (st.basketGot) { api.say(who, 'Dziękuję!', 'Dziękuję za kanapkę!', 'sandwich'); return; }
        if (st.culprit !== who) {
          if (!st.cleared.includes(who)) { st.cleared.push(who); save(); }
          api.fade(who);
          api.say(who, 'To nie ja!', `To nie ja! Ja mam ${me.has}. A na kamieniu było ${c.has}!`, c.clue);
          api.later(5200, () => api.say('dog', 'Szukamy dalej', `To nie ${me.name}! Kto ma ${c.has}?`, c.clue));
          maybeLeave(9000);
          return;
        }
        if (!st.confessed) {
          st.confessed = true;
          save();
          api.say('dog', 'To ty!', `Masz ${me.has}, takie samo jak na kamieniu przy jeziorze!`, c.clue);
          await api.wait(3800);
          api.say(who, 'To ja...', `${me.voice} To ja. Byłem taki głodny, że brałem kanapki bez pytania. Przepraszam!`, 'sandwich');
          await api.wait(4800);
          api.say('dog', 'Jest głodny', 'Biedny, jest głodny. Może podzielisz się kanapką z plecaka?', 'sandwich');
          api.hint('bag', 'Kanapka!', 'Kliknij plecak i wyjmij kanapkę!', 'dog');
          return;
        }
        if (api.held === 'sandwich' || !api.bag.has('sandwich')) {
          if (api.held === 'sandwich') { api.bag.take('sandwich', 1); api.carry(null); }
          api.hop(who);
          api.sparkles(who);
          st.basketGot = true;
          save();
          api.say(who, 'Dziękuję!', `Mniam! Dziękuję, ${n}! Oddam świstakowi wszystkie kanapki i go przeproszę.`, 'basket');
          await api.bag.add('basket', who);
          await api.wait(3000);
          api.hint(null);
          api.say('dog', 'Do schroniska!', 'Mamy koszyk z kanapkami! Zanieśmy go świstakowi.', 'basket');
          maybeLeave(4000);
          return;
        }
        if (api.held) { api.say(who, 'Nie to', 'To nie jest do jedzenia...'); return; }
        askBag(who, 'kanapkę', 'Masz coś do jedzenia w plecaku?');
      });
      maybeLeave(1500);
    },
  };
}
quest.scenes.jaskinia = suspectScene('jaskinia', 'fox', ['bat', 'crystals']);
quest.scenes.szczyt = suspectScene('szczyt', 'magpie', ['eagle', 'nest']);

export default quest;
