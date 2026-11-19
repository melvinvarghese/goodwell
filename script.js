(() => {
  const progress = document.getElementById('progressBar');
  const ending = document.getElementById('ending');
  const title = document.getElementById('endingTitle');
  const message = document.getElementById('endingText');
  const foot = document.getElementById('endingFoot');
  const leave = document.getElementById('leaveButton');
  const terminal = document.getElementById('terminal');
  const soundButton = document.getElementById('soundToggle');
  let audioContext = null, masterGain = null, soundOn = false, stage = 0;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    const rect = ending.getBoundingClientRect();
    if (rect.top < innerHeight * .72 && rect.bottom > 0) {
      ending.classList.add('in-view');
      soundButton.classList.remove('hidden');
    }
  };
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Small, optional mobile navigation.
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.textContent='☰';
  }));

  // The ending starts polite. It gets less polite if the visitor stays.
  const clock = document.getElementById('endingTime');
  const start = Date.now();
  setInterval(() => {
    const s = Math.floor((Date.now()-start)/1000);
    clock.textContent = `00:${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    if (ending.classList.contains('in-view') && s > 25 && stage < 1) {
      stage = 1; title.textContent = 'You took your time.'; message.textContent = 'We like that. We have had a long time to get to know you.';
      foot.textContent = 'YOUR SESSION IS NOT FINISHED.';
      title.classList.add('ending-glitch');
    }
    if (ending.classList.contains('in-view') && s > 48 && stage < 2) {
      stage = 2; title.textContent = 'We can see you.'; message.textContent = 'Not your screen. You.';
      foot.textContent = 'DON’T TURN AROUND.';
      terminal.querySelectorAll('b')[0].textContent = 'WATCHING';
      terminal.querySelectorAll('b')[1].textContent = 'NOT AVAILABLE';
      terminal.querySelectorAll('b')[2].textContent = 'JUST THERE';
    }
  }, 1000);

  leave.addEventListener('click', () => {
    if (stage < 3) {
      stage = 3;
      title.textContent = 'There is no exit.'; message.textContent = 'There never was. You just needed somewhere to begin.';
      foot.textContent = 'THANK YOU FOR VISITING, ' + (localStorage.getItem('goodwell-visitor') || 'FRIEND') + '.';
      terminal.querySelectorAll('b')[1].textContent = 'REQUEST IGNORED';
      leave.textContent = 'PLEASE';
      leave.classList.add('ending-glitch');
      ending.classList.add('ending-glitch');
      setTimeout(() => { ending.classList.remove('ending-glitch'); }, 1100);
    } else {
      ending.classList.add('final-state');
      document.body.classList.add('horror-mode');
      setTimeout(() => { document.getElementById('finalWord').textContent = 'STAY.'; }, 1300);
    }
  });

  // Optional synthesized drone. No audio plays until the visitor opts in.
  function startSound() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.connect(audioContext.destination);
    [55, 55.7, 82.4].forEach((hz, i) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = i === 2 ? 'sine' : 'triangle';
      osc.frequency.value = hz;
      gain.gain.value = i === 2 ? .12 : .2;
      osc.connect(gain); gain.connect(masterGain); osc.start();
    });
    masterGain.gain.setTargetAtTime(.055, audioContext.currentTime, 2);
  }
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) {
      if (!audioContext) startSound();
      else { audioContext.resume(); masterGain.gain.setTargetAtTime(.055,audioContext.currentTime,1); }
    } else if (audioContext) {
      masterGain.gain.setTargetAtTime(.0001,audioContext.currentTime,.4);
    }
    soundButton.classList.toggle('active',soundOn);
    soundButton.querySelector('i').textContent = soundOn ? 'Sound on' : 'Sound off';
  });

  // A deliberately ordinary, local visitor token. It is not transmitted anywhere.
  if (!localStorage.getItem('goodwell-visitor')) {
    const token = Math.random().toString(36).slice(2,7).toUpperCase();
    localStorage.setItem('goodwell-visitor', token);
  }
})();