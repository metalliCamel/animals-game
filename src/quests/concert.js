// Przygoda wieloetapowa w górach: Koncert na szczycie. Zamyka góry.
// Szczyt: orlica chce koncertu o zachodzie słońca i daje trzy nutki-zaproszenia.
// Hala: owieczka z dzwonkiem. Jezioro: kozica z bębenkiem. Schronisko: świstak zgubił gwizdek.
// Jaskinia: gwizdek szuka się słuchem – każda skała po kliknięciu brzmi inaczej.
// Szczyt: koncert jako gra pamięciowa – muzycy grają melodię, a Hania ją powtarza (2, 3, potem 4 dźwięki).
import { place, common } from './mountains.js';

const MUSICIANS = {
  mSheep: { key: 'sheep', voice: 'bell', name: 'owieczka', sound: 'Dzyń!' },
  mChamois: { key: 'chamois', voice: 'drum', name: 'kozica', sound: 'Bum!' },
  mMarmot: { key: 'marmot', voice: 'whistle', name: 'świstak', sound: 'Fiu!' },
};
const ROUNDS = [2, 3, 4];

function initState(st) { if (!st.inv) st.inv = {}; return st; }
const allIn = (st) => st.inv.sheep === true && st.inv.chamois === true && st.inv.marmot === true;

function checklist(st) {
  return [
    { art: 'bell', ok: st.inv.sheep === true, label: 'owieczka z dzwonkiem' },
    { art: 'drum', ok: st.inv.chamois === true, label: 'kozica z bębenkiem' },
    { art: 'whistle', ok: st.inv.marmot === true, label: st.inv.marmot === 'lost' ? 'gwizdek świstaka (zgubiony w jaskini)' : 'świstak z gwizdkiem' },
    { art: 'note', ok: !!st.finished, label: 'koncert na szczycie' },
  ];
}

function todo(placeId, st, bagCount) {
  if (st.finished) return false;
  if (placeId === 'szczyt') return !st.started || allIn(st);
  if (!st.started) return false;
  if (placeId === 'hala') return st.inv.sheep !== true;
  if (placeId === 'jezioro') return st.inv.chamois !== true;
  if (placeId === 'schronisko') return st.inv.marmot !== true && (!st.inv.marmot || bagCount('whistle') > 0);
  if (placeId === 'jaskinia') return st.inv.marmot === 'lost' && !st.whistleFound;
  return false;
}

const quest = {
  id: 'concert',
  title: 'Koncert na szczycie',
  icon: 'note',
  region: 'gory',
  after: 'bridge',
  start: 'szczyt',
  sticker: 'note',
  winText: 'Wspaniały koncert! Pomogłeś wszystkim zwierzątkom w górach. Dostajesz złotą gwiazdkę górskiego muzyka!',
  newText: 'Kiii! Orlica woła ze szczytu! Kliknij szczyt z balonikiem.',
  callText: 'Orlica na szczycie ma pomysł! Kliknij szczyt z balonikiem.',
  todo, checklist, initState,
  scenes: {},
};

// Zaproszenie muzyka nutką z plecaka
function invite(api, ctx, id, key, lines) {
  const { st, save, maybeLeave, askBag } = ctx;
  api.on(id, () => {
    if (!st.started) { api.say(id, ...lines.idle); return; }
    if (st.inv[key] === true) { api.tone(lines.voice); api.hop(id); api.say(id, ...lines.yes); return; }
    if (api.held === 'note') {
      api.bag.take('note', 1);
      api.carry(null);
      st.inv[key] = true;
      save();
      api.hint(null);
      api.tone(lines.voice);
      api.hop(id);
      api.sparkles(id, '#7FC7E8');
      api.say(id, ...lines.accept);
      maybeLeave(4500);
      return;
    }
    if (api.held) { api.say(id, 'Nie to', 'To nie jest nutka.'); return; }
    if (api.bag.has('note')) { askBag(id, 'nutkę', lines.ask); return; }
    api.say(id, ...lines.idle);
  });
  if (st.started && st.inv[key] !== true && api.bag.has('note')) {
    api.later(400, () => api.say(id, 'Koncert?', lines.ask, 'note'));
    api.hint(id, 'Nutka!', 'Daj mi nutkę z plecaka!', id);
  }
}

// ---------- SZCZYT: start i koncert ----------
quest.scenes.szczyt = {
  ...place('szczyt'),
  start(api) {
    const n = api.name;
    const ctx = common(api, quest, 'szczyt');
    const { st, save } = ctx;
    ctx.chatter(['magpie', 'nest']);
    let playing = false;
    let concertOn = false;
    let expect = [];
    let pos = 0;

    api.on('eagle', async () => {
      if (st.finished) { api.say('eagle', 'Kiii!', 'Kiii! To był najpiękniejszy koncert w górach!', 'note'); return; }
      if (!st.started) {
        st.started = true;
        save();
        api.hint(null);
        api.say('eagle', 'Koncert!', `Kiii! ${n}, mam pomysł! Zróbmy koncert na szczycie o zachodzie słońca! Zaproś muzyków: owieczkę z dzwonkiem, kozicę z bębenkiem i świstaka z gwizdkiem.`, 'note');
        for (let i = 0; i < 3; i++) await api.bag.add('note', 'eagle');
        await api.wait(5600);
        api.say('eagle', 'Trzy nutki', 'Daj każdemu muzykowi nutkę. To zaproszenie na koncert!', 'note');
        api.later(5200, () => api.toMap('Na mapę!', 'Kliknij przycisk Mapa. Baloniki pokazują, gdzie są muzycy!'));
        return;
      }
      if (allIn(st)) { if (!concertOn) startConcert(); return; }
      const left = Object.values(MUSICIANS).filter((m) => st.inv[m.key] !== true).map((m) => m.name);
      api.say('eagle', 'Czekam', `Kiii! Czekam jeszcze na: ${left.join(', ')}.`, 'note');
    });

    if (!st.started) {
      api.say('eagle', 'Kiii!', `Kiii! Cześć, ${n}! Mam wspaniały pomysł!`, 'note');
      api.hint('eagle', 'Kiii!', 'Kiii! Kliknij mnie!', 'eagle');
    } else if (allIn(st)) {
      api.later(500, startConcert);
    } else {
      const left = Object.values(MUSICIANS).filter((m) => st.inv[m.key] !== true).map((m) => m.name);
      api.later(400, () => api.say('eagle', 'Czekam', `Kiii! Czekam jeszcze na: ${left.join(', ')}.`, 'note'));
    }

    // ---------- Koncert: gra pamięciowa ----------
    async function startConcert() {
      if (concertOn) return;
      concertOn = true;
      api.hint(null);
      api.sceneClass('sunset');
      for (const id of Object.keys(MUSICIANS)) { api.show(id); api.sparkles(id, '#FFD25A'); }
      api.walk(30, 30);
      api.say('eagle', 'Zaczynamy!', 'Muzycy są gotowi! Posłuchaj melodii, a potem zagraj ją tak samo. Klikaj muzyków po kolei!', 'note');
      await api.wait(6200);
      playRound();
    }

    function melody(len) {
      // Melodia jest ta sama po powrocie, bo zapisujemy ją w stanie przygody
      if (!st.melody || st.melody.length < ROUNDS[ROUNDS.length - 1]) {
        const ids = Object.keys(MUSICIANS);
        st.melody = Array.from({ length: ROUNDS[ROUNDS.length - 1] }, () => api.pick(ids));
        save();
      }
      return st.melody.slice(0, len);
    }

    async function playRound() {
      const round = st.round || 0;
      expect = melody(ROUNDS[round]);
      pos = 0;
      playing = true;
      api.say('eagle', 'Słuchaj!', round === 0 ? 'Słuchaj uważnie!' : 'Teraz dłuższa melodia. Słuchaj!', 'note');
      await api.wait(1600);
      for (const id of expect) {
        api.tone(MUSICIANS[id].voice);
        api.hop(id);
        await api.wait(900);
      }
      playing = false;
      api.say('eagle', 'Twoja kolej!', 'Twoja kolej! Zagraj tak samo.', 'note');
    }

    for (const [id, m] of Object.entries(MUSICIANS)) {
      api.on(id, async () => {
        api.tone(m.voice);
        api.hop(id);
        if (playing || st.finished || !expect.length) return;
        if (id !== expect[pos]) {
          playing = true;
          api.say('eagle', 'Jeszcze raz!', 'Ups! To nie ten dźwięk. Nic nie szkodzi, posłuchaj jeszcze raz!', 'note');
          await api.wait(3000);
          playRound();
          return;
        }
        pos++;
        if (pos < expect.length) return;
        // Runda zaliczona
        playing = true;
        st.round = (st.round || 0) + 1;
        save();
        api.sparkles('eagle', '#FFD25A');
        if (st.round < ROUNDS.length) {
          api.say('eagle', 'Brawo!', 'Brawo! Pięknie zagrane!', 'note');
          await api.wait(2600);
          playRound();
          return;
        }
        st.finished = true;
        save();
        api.say('eagle', 'Wspaniale!', `Kiii! Wspaniały koncert! Dziękujemy, ${n}!`, 'note');
        for (let i = 0; i < 3; i++) {
          for (const mid of Object.keys(MUSICIANS)) { api.tone(MUSICIANS[mid].voice); api.hop(mid); await api.wait(380); }
        }
        api.hop('eagle');
        api.sparkles('eagle'); api.sparkles('mSheep', '#E2525C'); api.sparkles('mChamois', '#7FC7E8');
        api.win(3600);
      });
    }
  },
};

// ---------- HALA: owieczka ----------
quest.scenes.hala = {
  ...place('hala'),
  start(api) {
    const ctx = common(api, quest, 'hala');
    ctx.chatter(['herd1', 'herd2']);
    invite(api, ctx, 'sheep', 'sheep', {
      voice: 'bell',
      idle: ['Dzyń dzyń!', 'Dzyń dzyń! Ładny dzień na hali!', 'bell'],
      ask: 'Dzyń dzyń! Koncert? Czy masz dla mnie nutkę w plecaku?',
      accept: ['Przyjdę!', 'Dzyń dzyń! Nutka! Przyjdę zagrać na moim dzwonku!', 'bell'],
      yes: ['Dzyń dzyń!', 'Dzyń dzyń! Ćwiczę na koncert!', 'bell'],
    });
    ctx.maybeLeave(1500);
  },
};

// ---------- JEZIORO: kozica ----------
quest.scenes.jezioro = {
  ...place('jezioro'),
  start(api) {
    const ctx = common(api, quest, 'jezioro');
    ctx.chatter(['kid', 'bridge', 'clue']);
    invite(api, ctx, 'chamois', 'chamois', {
      voice: 'drum',
      idle: ['Meee!', 'Meee! Dzięki mostkowi koziołek zawsze może wrócić do domu!'],
      ask: 'Meee! Koncert? Czy masz dla mnie nutkę w plecaku?',
      accept: ['Przyjdę!', 'Bum bum! Nutka! Przyjdę zagrać na moim bębenku!', 'drum'],
      yes: ['Bum bum!', 'Bum bum! Ćwiczę na koncert!', 'drum'],
    });
    ctx.maybeLeave(1500);
  },
};

// ---------- SCHRONISKO: świstak zgubił gwizdek ----------
quest.scenes.schronisko = {
  ...place('schronisko'),
  start(api) {
    const { st, save, maybeLeave, askBag, chatter } = common(api, quest, 'schronisko');
    chatter(['picnic', 'guestFox', 'guestMagpie']);

    if (st.started && st.inv.marmot !== true) {
      if (api.bag.has('whistle')) {
        api.later(400, () => askBag('marmot', 'gwizdek', 'Fiu? Znalazłeś mój gwizdek? Wyjmij go z plecaka!'));
      } else if (!st.inv.marmot && api.bag.has('note')) {
        api.later(400, () => api.say('marmot', 'Koncert?', 'Fiu fiu! Koncert? Czy masz dla mnie nutkę?', 'note'));
        api.hint('marmot', 'Nutka!', 'Daj mi nutkę z plecaka!', 'marmot');
      }
    }

    api.on('marmot', async () => {
      if (!st.started) { api.say('marmot', 'Fiu fiu!', 'Fiu fiu! Witaj w schronisku!'); return; }
      if (st.inv.marmot === true) { api.tone('whistle'); api.hop('marmot'); api.say('marmot', 'Fiu fiu!', 'Fiu fiu! Ćwiczę na koncert!', 'whistle'); return; }
      if (api.held === 'note' && !st.inv.marmot) {
        api.bag.take('note', 1);
        api.carry(null);
        st.inv.marmot = 'lost';
        save();
        api.say('marmot', 'Mój gwizdek!', 'Fiu! Nutka na koncert! Chętnie zagram... Ojej! Zgubiłem gwizdek! Chyba w jaskini, kiedy oddawałem ci latarkę.', 'whistle');
        api.later(7800, () => api.say('dog', 'Do jaskini!', 'Poszukajmy gwizdka w jaskini!', 'whistle'));
        maybeLeave(10000);
        return;
      }
      if (api.held === 'whistle') {
        api.bag.take('whistle', 1);
        api.carry(null);
        st.inv.marmot = true;
        save();
        api.hint(null);
        api.tone('whistle');
        api.hop('marmot');
        api.sparkles('marmot', '#7FC7E8');
        api.say('marmot', 'Mój gwizdek!', 'Fiu fiu! Mój gwizdek! Teraz mogę zagrać na koncercie!', 'whistle');
        maybeLeave(4500);
        return;
      }
      if (api.held) { api.say('marmot', 'Nie to', 'Fiu? To nie to.'); return; }
      if (api.bag.has('whistle')) { askBag('marmot', 'gwizdek', 'Fiu? Znalazłeś mój gwizdek? Wyjmij go z plecaka!'); return; }
      if (!st.inv.marmot && api.bag.has('note')) { askBag('marmot', 'nutkę', 'Fiu fiu! Koncert? Czy masz dla mnie nutkę?'); return; }
      api.say('marmot', 'Gwizdek', 'Fiu... Bez gwizdka nie zagram. Poszukaj go w jaskini!', 'whistle');
    });
    maybeLeave(1500);
  },
};

// ---------- JASKINIA: gwizdek szukany słuchem ----------
quest.scenes.jaskinia = {
  ...place('jaskinia'),
  start(api) {
    const { st, save, maybeLeave, chatter } = common(api, quest, 'jaskinia');
    chatter(['fox']);
    const spots = ['rock2', 'rock3', 'crystals'];
    const active = st.inv.marmot === 'lost' && !st.whistleFound;
    if (active && !st.whistleSpot) { st.whistleSpot = api.pick(spots); save(); }

    if (active) {
      api.say('bat', 'Słuchaj!', 'Pi pi! Słyszałem ciche gwizdanie pod jedną ze skał. Klikaj skały i słuchaj, która gwiżdże!', 'whistle');
      api.hint(st.whistleSpot, 'Fiu...', 'Ciche fiu... skąd to?', 'bat');
    }

    api.on('bat', () => {
      if (active && !st.whistleFound) { api.say('bat', 'Słuchaj!', 'Pi pi! Klikaj skały i słuchaj, która gwiżdże!', 'whistle'); return; }
      api.say('bat', 'Pi pi!', 'Pi pi! W jaskini jest przyjemny chłodek.');
    });

    for (const id of spots) {
      api.on(id, async () => {
        if (!(st.inv.marmot === 'lost') || st.whistleFound) {
          if (id === 'crystals') api.say('dog', 'Błyszczy!', 'Kryształy pięknie błyszczą.', 'crystal');
          return;
        }
        api.shake(id);
        if (id !== st.whistleSpot) {
          api.tone('knock');
          api.say('dog', 'Puk puk', 'Puk puk. Tu cicho. Słuchajmy dalej!');
          return;
        }
        api.tone('whistle');
        api.say('dog', 'Fiu!', 'Fiu! Słyszysz? Gwizdek jest tutaj!', 'whistle');
        await api.wait(1600);
        st.whistleFound = true;
        api.sparkles(id, '#FFD25A');
        await api.bag.add('whistle', id);
        save();
        api.hint(null);
        api.say('dog', 'Mamy gwizdek!', 'Mamy gwizdek świstaka w plecaku! Zanieśmy mu go.', 'whistle');
        maybeLeave(4000);
      });
    }
    maybeLeave(1500);
  },
};

export default quest;
