import './style.css';

(function(){
const $=s=>document.querySelector(s);
const stage=$('#stage'),dog=$('#dog'),flip=dog.querySelector('.flip'),cat=$('#cat'),yarn=$('#yarn'),bubble=$('#bubble');
const bushes=[...document.querySelectorAll('.bush')];
const nameInput=$('#nameInput');
let S={name:'',busy:false,hasYarn:false,found:false,yarnBush:0,sound:true,lastAct:Date.now(),hinted:0,done:false};
let dogPos={x:22,b:10},bubbleTimer;

/* ---------- głos ---------- */
let plVoice=null;
function pickVoice(){try{const v=speechSynthesis.getVoices();plVoice=v.find(x=>/^pl/i.test(x.lang))||null}catch(e){}}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
function say(t){if(!S.sound)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pl-PL';if(plVoice)u.voice=plVoice;u.rate=.9;u.pitch=1.15;speechSynthesis.speak(u)}catch(e){}}
$('#soundBtn').onclick=e=>{S.sound=!S.sound;e.target.textContent='Głos: '+(S.sound?'włączony':'wyłączony');e.target.setAttribute('aria-pressed',S.sound);if(!S.sound)try{speechSynthesis.cancel()}catch(_){}};

/* ---------- dymek: krótki tekst do czytania + pełne zdanie czytane na głos ---------- */
function speak(who,short,full,icon){
  const el=who==='cat'?cat:dog;
  const x=parseFloat(el.style.left),b=parseFloat(el.style.bottom);
  const h=who==='cat'?24:20;
  bubble.innerHTML=(icon?'<svg class="ic" viewBox="0 0 40 40"><use href="#'+icon+'"/></svg>':'')+'<span></span>';
  bubble.querySelector('span').textContent=short;
  bubble.style.left=Math.min(Math.max(x,18),82)+'%';
  bubble.style.top=(100-b-h)+'%';
  bubble.hidden=false;
  say(full||short);
  clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>bubble.hidden=true,5500);
}

/* ---------- ruch pieska ---------- */
function z(el,b){el.style.zIndex=Math.round(100-b)}
function walkTo(x,b,then){
  x=Math.min(Math.max(x,7),93);b=Math.min(Math.max(b,2),40);
  const dx=x-dogPos.x,dist=Math.hypot(dx,(b-dogPos.b)*1.6);
  if(Math.abs(dx)>0.5){const left=dx<0;flip.style.transform=left?'scaleX(-1)':'none';dog.classList.toggle('left',left)}
  const ms=Math.max(150,dist*38);
  dog.style.transitionDuration=ms+'ms';
  dog.classList.add('walk');
  dog.style.left=x+'%';dog.style.bottom=b+'%';z(dog,b+.5);
  dogPos={x,b};S.busy=true;
  setTimeout(()=>{dog.classList.remove('walk');S.busy=false;then&&then()},ms+30);
}
function sparkles(x,b,color){
  for(let i=0;i<10;i++){const s=document.createElement('div');s.className='spark';
    s.innerHTML='<svg viewBox="0 0 20 20"><path d="M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z" fill="'+(color||'#FFD25A')+'"/></svg>';
    s.style.left=x+'%';s.style.bottom=b+'%';const a=Math.random()*6.28,r=60+Math.random()*80;
    s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',(-Math.abs(Math.sin(a))*r-20)+'px');
    stage.appendChild(s);setTimeout(()=>s.remove(),1200)}
}

/* ---------- kliknięcia ---------- */
stage.addEventListener('click',e=>{
  if(S.busy||S.done||!$('#nameScreen').hidden)return;
  const t=e.target.closest('.bush,#cat');
  S.lastAct=Date.now();
  if(t&&t.classList.contains('bush'))return clickBush(t);
  if(t===cat)return clickCat();
  if(e.target.closest('.overlay,.top,.chip'))return;
  const r=stage.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width*100,b=(r.bottom-e.clientY)/r.height*100;
  if(b>48)return; // niebo
  walkTo(x,b);
});

const nope=[['Tu nic nie ma','Hmm, tu nic nie ma. Szukaj dalej!'],['Pusto','Pusto! Może w innym krzaczku?'],['Tylko liście','Tylko liście. Szukajmy dalej!']];
function clickBush(bush){
  const i=+bush.dataset.i,bx=parseFloat(bush.style.left),bb=parseFloat(bush.style.bottom);
  walkTo(bx-10,bb-2,()=>{
    flip.style.transform='none';dog.classList.remove('left');
    bush.classList.remove('shake');void bush.offsetWidth;bush.classList.add('shake');
    if(S.found){speak('dog','Do kotka!','Mam już kłębek. Zanieśmy go kotkowi!','yarnSym');return}
    if(i===S.yarnBush){
      S.found=true;bushes.forEach(b=>b.classList.remove('hint'));
      yarn.style.transition='none';yarn.style.left=bx+'%';yarn.style.bottom=(bb+4)+'%';z(yarn,bb-1);yarn.classList.add('show');
      void yarn.offsetWidth;yarn.style.transition='';
      setTimeout(()=>{yarn.style.left=(bx-4)+'%';yarn.style.bottom=(bb-1)+'%'},30);
      sparkles(bx,bb+8);
      setTimeout(()=>{yarn.classList.remove('show');dog.classList.add('has');S.hasYarn=true;
        $('#chipText').textContent='Zanieś kotkowi';
        speak('dog','Jest kłębek!','Hura! Jest kłębek! Zanieśmy go kotkowi.','yarnSym')},700);
    }else{
      bush.classList.add('searched');const n=nope[Math.floor(Math.random()*nope.length)];
      speak('dog',n[0],n[1]);
    }
  });
}
function clickCat(){
  const cx=parseFloat(cat.style.left),cb=parseFloat(cat.style.bottom);
  walkTo(cx-12,cb-3,()=>{
    flip.style.transform='none';dog.classList.remove('left');
    if(S.hasYarn){
      S.hasYarn=false;S.done=true;dog.classList.remove('has');
      cat.classList.remove('happy');void cat.offsetWidth;cat.classList.add('happy');
      sparkles(cx,cb+10,'#E2525C');sparkles(cx,cb+10);
      $('#chip').classList.add('done');$('#chipText').textContent='Gotowe!';
      speak('cat','Dziękuję, '+S.name+'!','Mrrr! Dziękuję, '+S.name+'! Jesteś super pomocnikiem!','yarnSym');
      setTimeout(()=>{$('#endTitle').textContent='Brawo, '+S.name+'!';$('#endScreen').hidden=false;
        say('Brawo! Kotek ma swój kłębek. Dostajesz gwiazdkę pomocnika!')},3200);
    }else{
      speak('cat','Gdzie kłębek?','Miau! Mój kłębek jest gdzieś w krzaczkach. Poszukasz?','yarnSym');
    }
  });
}

/* ---------- podpowiedź po chwili bez postępu ---------- */
setInterval(()=>{
  if(S.done||S.found||!$('#nameScreen').hidden)return;
  if(Date.now()-S.lastAct>18000){
    S.lastAct=Date.now();S.hinted++;
    const b=bushes[S.yarnBush];b.classList.remove('hint');void b.offsetWidth;b.classList.add('hint');
    speak('cat','Słyszę szelest!','Psst! Ten krzaczek się rusza. Zajrzyj tam!');
  }
},2000);

/* ---------- start / reset ---------- */
function resetScene(){
  S.hasYarn=false;S.found=false;S.done=false;S.lastAct=Date.now();
  S.yarnBush=Math.floor(Math.random()*bushes.length);
  bushes.forEach(b=>{b.classList.remove('searched','hint','shake');z(b,parseFloat(b.style.bottom))});
  z(cat,22);yarn.classList.remove('show');dog.classList.remove('has','left');flip.style.transform='none';
  dog.style.transitionDuration='0ms';dog.style.left='22%';dog.style.bottom='10%';dogPos={x:22,b:10};z(dog,10.5);
  $('#chip').classList.remove('done');$('#chipText').textContent='Znajdź kłębek';
  $('#endScreen').hidden=true;bubble.hidden=true;
}
function startGame(){
  let n=nameInput.value.trim();if(!n)n='Burek';
  n=n.charAt(0).toUpperCase()+n.slice(1).toLowerCase();S.name=n;
  $('#nameScreen').hidden=true;resetScene();
  speak('dog','Hau! Jestem '+n+'!','Hau hau! Jestem '+n+'! Kliknij gdzieś na trawie, a tam pobiegnę.');
  setTimeout(()=>{if(!S.done)speak('cat','Zgubiłam kłębek!','Miau! Cześć, '+n+'! Zgubiłam mój kłębek wełny. Pomożesz mi go znaleźć w krzaczkach?','yarnSym')},4800);
}
nameInput.addEventListener('input',()=>{nameInput.value=nameInput.value.replace(/[^a-ząćęłńóśźżA-ZĄĆĘŁŃÓŚŹŻ ]/g,'')});
nameInput.addEventListener('keydown',e=>{if(e.key==='Enter')startGame()});
document.querySelectorAll('#sugg button').forEach(b=>b.onclick=()=>{nameInput.value=b.textContent;say(b.textContent)});
$('#startBtn').onclick=startGame;
$('#againBtn').onclick=()=>{resetScene();speak('cat','Bawimy się!','Miau! Znowu go zgubiłam! Poszukasz jeszcze raz?','yarnSym')};
$('#renameBtn').onclick=()=>{$('#endScreen').hidden=true;$('#nameScreen').hidden=false;nameInput.value='';nameInput.focus()};
resetScene();setTimeout(()=>{try{nameInput.focus({preventScroll:true})}catch(e){}},300);
})();
