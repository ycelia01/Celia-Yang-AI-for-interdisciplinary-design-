'use strict';
// All portfolio media is local. SoundCloud loads only after a visitor requests it.
const songButton = document.querySelector('#load-song');
if (songButton) songButton.addEventListener('click', () => {
  const host = document.querySelector('#song-player');
  const player = document.createElement('iframe');
  player.title = 'Mind the Traffic by Celia on SoundCloud';
  player.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent('https://soundcloud.com/qgjchy7kp1ma/mind-the-traffic') + '&color=%23143aa2&auto_play=false&hide_related=true&show_comments=false&show_user=true&visual=false';
  player.allow = 'autoplay';
  player.loading = 'lazy';
  host.append(player);
  host.hidden = false;
  songButton.setAttribute('aria-expanded', 'true');
  songButton.textContent = 'SoundCloud player loaded';
  songButton.disabled = true;
});
const video = document.querySelector('#walkthrough-video');
if (video) video.addEventListener('error', () => {
  document.querySelector('#video-status').textContent = 'The video could not load. Use the download link to open it directly.';
});
const field = document.querySelector('#cattle-field');
if (field) {
  let soundEnabled = true;
  let context;
  let layer = 1;
  const positions = new Map();
  const cows = [...field.querySelectorAll('.cow')];
  const status = document.querySelector('#herd-status');
  // A locally synthesized, voiced "moo": falling fundamental and two vowel formants.
  // It needs no third-party audio and starts only after a visitor gesture.
  function moo(cow) {
    cow.classList.add('mooing');
    setTimeout(() => cow.classList.remove('mooing'), 1100);
    status.textContent = `Cow ${cow.dataset.cow}: moo!${soundEnabled ? '' : ' Sound is off.'}`;
    if (!soundEnabled) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) { status.textContent = 'Audio is unavailable in this browser.'; return; }
      context ||= new Audio();
      context.resume().then(() => {
        const t = context.currentTime;
        const voice = context.createOscillator();
        const volume = context.createGain();
        const formant = context.createBiquadFilter();
        const body = context.createBiquadFilter();
        const finish = context.createGain();
        voice.type = 'sawtooth';
        const pitch = 115 + Number(cow.dataset.cow) * 12;
        voice.frequency.setValueAtTime(pitch * .75, t);
        voice.frequency.exponentialRampToValueAtTime(pitch, t + .18);
        voice.frequency.exponentialRampToValueAtTime(pitch * .58, t + 1.05);
        formant.type = 'bandpass'; formant.Q.value = 3;
        formant.frequency.setValueAtTime(430, t);
        formant.frequency.exponentialRampToValueAtTime(290, t + 1.05);
        body.type = 'lowpass'; body.frequency.value = 750;
        volume.gain.setValueAtTime(.001, t);
        volume.gain.exponentialRampToValueAtTime(.38, t + .12);
        volume.gain.exponentialRampToValueAtTime(.25, t + .65);
        volume.gain.exponentialRampToValueAtTime(.001, t + 1.1);
        finish.gain.value = .6;
        voice.connect(formant); formant.connect(body); body.connect(volume); volume.connect(finish); finish.connect(context.destination);
        voice.start(t); voice.stop(t + 1.12);
        voice.onended = () => { voice.disconnect(); formant.disconnect(); body.disconnect(); volume.disconnect(); finish.disconnect(); };
      }).catch(() => { status.textContent = 'Audio could not start. Try turning sound off and on.'; });
    } catch (_) { status.textContent = 'Audio is unavailable in this browser.'; }
  }
  function move(cow, x, y) {
    const b = field.getBoundingClientRect();
    const c = cow.getBoundingClientRect();
    // Include rotation in the boundaries so the entire cow remains reachable.
    const maxX = Math.max(0, b.width - c.width - 12);
    const maxY = Math.max(0, b.height - c.height - 12);
    const p = {x: Math.max(8, Math.min(x, maxX)), y: Math.max(8, Math.min(y, maxY))};
    cow.style.left = `${p.x}px`; cow.style.top = `${p.y}px`;
    positions.set(cow, p);
  }
  cows.forEach(cow => {
    let drag;
    cow.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      cow.focus({preventScroll: true});
      cow.setPointerCapture(e.pointerId);
      const box = cow.getBoundingClientRect();
      const area = field.getBoundingClientRect();
      drag = {id: e.pointerId, dx: e.clientX - box.left, dy: e.clientY - box.top};
      cow.classList.add('dragging'); cow.style.zIndex = String(++layer);
      move(cow, box.left - area.left, box.top - area.top);
      moo(cow);
    });
    cow.addEventListener('pointermove', e => {
      if (!drag || e.pointerId !== drag.id) return;
      const box = field.getBoundingClientRect();
      move(cow, e.clientX - box.left - drag.dx, e.clientY - box.top - drag.dy);
    });
    function release() { drag = null; cow.classList.remove('dragging'); }
    cow.addEventListener('pointerup', release);
    cow.addEventListener('pointercancel', release);
    cow.addEventListener('lostpointercapture', release);
    cow.addEventListener('keydown', e => {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const b = field.getBoundingClientRect(), c = cow.getBoundingClientRect();
        const p = positions.get(cow) || {x: c.left - b.left, y: c.top - b.top};
        const step = e.shiftKey ? 30 : 12;
        cow.style.zIndex = String(++layer);
        move(cow, p.x + (e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0), p.y + (e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0));
      }
    });
    cow.addEventListener('click', e => { if (e.detail === 0) moo(cow); });
  });
  const toggle = document.querySelector('#sound-toggle');
  toggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggle.setAttribute('aria-pressed', String(soundEnabled));
    toggle.textContent = soundEnabled ? 'Sound on' : 'Sound off';
    status.textContent = soundEnabled ? 'Moo sounds enabled.' : 'Moo sounds muted.';
  });
  document.querySelector('#reset-herd').addEventListener('click', () => {
    cows.forEach(cow => { cow.style.left = ''; cow.style.top = ''; cow.style.zIndex = ''; });
    positions.clear(); status.textContent = 'The herd is back in its starting arrangement.';
  });
  window.addEventListener('resize', () => {
    cows.forEach(cow => { const p = positions.get(cow); if (p) move(cow, p.x, p.y); });
  });
}
