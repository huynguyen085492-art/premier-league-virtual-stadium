let ctx, master, crowdGain, crowdSource, enabled = false;
export function startAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  if (!ctx) {
    ctx = new AC(); master = ctx.createGain(); master.gain.value = .65; master.connect(ctx.destination);
    crowdGain = ctx.createGain(); crowdGain.gain.value = .0001; crowdGain.connect(master);
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i] = (Math.random()*2-1) * .22;
    crowdSource = ctx.createBufferSource(); crowdSource.buffer = buffer; crowdSource.loop = true;
    const filter = ctx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=650;
    crowdSource.connect(filter); filter.connect(crowdGain); crowdSource.start();
  }
  ctx.resume(); enabled = true; crowdGain.gain.setTargetAtTime(.18, ctx.currentTime, .8); return true;
}
export function setCrowdIntensity(value=0.18) { if (ctx && crowdGain) crowdGain.gain.setTargetAtTime(enabled ? value : .0001, ctx.currentTime, .3); }
export function playWhistle() {
  if (!ctx || !enabled) return;
  const osc=ctx.createOscillator(), gain=ctx.createGain(); osc.type='sine'; osc.frequency.value=1850;
  gain.gain.setValueAtTime(.0001,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.16,ctx.currentTime+.03); gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.8);
  osc.connect(gain); gain.connect(master); osc.start(); osc.stop(ctx.currentTime+.85);
}
export function playCheer() {
  if (!ctx || !enabled) return;
  crowdGain.gain.cancelScheduledValues(ctx.currentTime); crowdGain.gain.setTargetAtTime(.55,ctx.currentTime,.08);
  setTimeout(()=>setCrowdIntensity(.18),2200);
  const osc=ctx.createOscillator(), gain=ctx.createGain(); osc.type='sawtooth'; osc.frequency.setValueAtTime(95,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(190,ctx.currentTime+.3);
  gain.gain.setValueAtTime(.0001,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.08,ctx.currentTime+.05); gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+1.1);
  osc.connect(gain); gain.connect(master); osc.start(); osc.stop(ctx.currentTime+1.2);
}
export function speakCommentary(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text); utterance.lang='vi-VN'; utterance.rate=1.02; utterance.pitch=.9; utterance.volume=.9;
  const voices=window.speechSynthesis.getVoices(); const voice=voices.find(v=>v.lang.toLowerCase().startsWith('vi'));
  if (voice) utterance.voice=voice; window.speechSynthesis.speak(utterance);
}
export function stopAudio() { enabled=false; if(ctx && crowdGain) crowdGain.gain.setTargetAtTime(.0001,ctx.currentTime,.2); if('speechSynthesis' in window) window.speechSynthesis.cancel(); }
