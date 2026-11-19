(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const progress=$("#progress"), camera=$(".camera"), ambient=$("#ambient"), whisper=$("#whisperLayer");
 const start=Date.now();let audio=null,gain=null,sound=false,finalShown=false;
 const update=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(max>0?scrollY/max*100:0)+"%";
  const p=max?scrollY/max:0;
  document.body.classList.toggle("descent",p>.28);
  document.body.classList.toggle("deep",p>.69);
  if(p>.78) camera.classList.add("awake");
  if(p>.91&&!finalShown){finalShown=true;whisper.classList.add("show");whisper.setAttribute("aria-hidden","false");}
 };
 addEventListener("scroll",update,{passive:true});update();
 const tick=()=>{
  const elapsed=Math.floor((Date.now()-start)/1000);
  const t=$("#visitTime");if(t)t.textContent=elapsed+"s";
  const d=new Date();const clock=$("#localTime");if(clock)clock.textContent=d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  const heard=$("#heardCount");if(heard&&elapsed>25)heard.textContent=String(Math.min(19,Math.floor((elapsed-20)/8)+1));
  const sleep=$("#sleepHours");if(sleep&&elapsed>40)sleep.textContent="56.2";
  const note=$("#personalNote");if(note&&elapsed>32)note.textContent="We see you're still here. We like having you home.";
  const cancel=$("#cancel");if(cancel&&elapsed>55)cancel.textContent="0";
  if(elapsed>68){const status=$("#camStatus");if(status)status.textContent="SUBJECT IN HALLWAY";}
 };
 setInterval(tick,1000);tick();
 const menu=$(".menu"),nav=$(".topbar nav");
 if(menu)menu.addEventListener("click",()=>nav.classList.toggle("open"));
 $$(".topbar nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
 $$(".faq details").forEach((d)=>d.addEventListener("toggle",()=>{if(d.open&&d.textContent.includes("crawlspace")){setTimeout(()=>{d.querySelector("p").textContent="Please do not open the crawlspace. We have asked you nicely. It is not empty.";},1800);}}));
 $("#contactForm").addEventListener("submit",e=>{e.preventDefault();$("#formNote").textContent="Thank you. Martin will be with you shortly.";});
 function startAudio(){
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  audio=new C();gain=audio.createGain();gain.gain.value=.0001;gain.connect(audio.destination);
  [48,48.7,72,96].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=i===2?"sine":"triangle";o.frequency.value=hz;g.gain.value=i===3?.035:.12;o.connect(g);g.connect(gain);o.start();});
  gain.gain.setTargetAtTime(.045,audio.currentTime,2);
 }
 ambient.addEventListener("click",()=>{
  sound=!sound;
  if(sound){if(!audio)startAudio();else{audio.resume();gain.gain.setTargetAtTime(.045,audio.currentTime,1);}}
  else if(audio)gain.gain.setTargetAtTime(.0001,audio.currentTime,.5);
  ambient.classList.toggle("on",sound);ambient.querySelector("span").textContent="Ambient mode: "+(sound?"on":"off");
 });
 // The tab quietly asks to be revisited after the visitor leaves it.
 let awayAt=0;
 document.addEventListener("visibilitychange",()=>{
  if(document.hidden){awayAt=Date.now();document.title="Come back. — Morrow";}
  else if(awayAt){const seconds=Math.max(1,Math.round((Date.now()-awayAt)/1000));document.title="Morrow — Your home, finally listening.";const note=$("#personalNote");if(note)note.textContent="You were away for "+seconds+" seconds. We waited.";awayAt=0;}
 });
})();