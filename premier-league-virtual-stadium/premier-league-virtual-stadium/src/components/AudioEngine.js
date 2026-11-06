let audioContext
let crowdGain
let crowdOscillators = []
let active = false

export function startCrowdAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return false
  if (!audioContext) {
    audioContext = new AudioCtx()
    crowdGain = audioContext.createGain()
    crowdGain.gain.value = 0.025
    crowdGain.connect(audioContext.destination)
    // Synthesized stadium bed: layered filtered noise-like oscillators.
    ;[54, 71, 93, 117].forEach((freq, i) => {
      const osc = audioContext.createOscillator()
      const filter = audioContext.createBiquadFilter()
      const gain = audioContext.createGain()
      osc.type = i % 2 ? 'triangle' : 'sawtooth'
      osc.frequency.value = freq
      filter.type = 'lowpass'
      filter.frequency.value = 180 + i * 70
      gain.gain.value = 0.08 / (i + 1)
      osc.connect(filter); filter.connect(gain); gain.connect(crowdGain)
      osc.start()
      crowdOscillators.push(osc)
    })
  }
  audioContext.resume()
  active = true
  return true
}

export function setCrowdVolume(value) {
  if (crowdGain && audioContext) crowdGain.gain.setTargetAtTime(value * 0.08, audioContext.currentTime, 0.15)
}

export function crowdRoar(intensity = 1) {
  if (!audioContext || !active) return
  const now = audioContext.currentTime
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  const filter = audioContext.createBiquadFilter()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(95, now)
  osc.frequency.exponentialRampToValueAtTime(42, now + 1.7)
  filter.type = 'lowpass'; filter.frequency.value = 260
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(0.22 * intensity, now + 0.18)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1)
  osc.connect(filter); filter.connect(gain); gain.connect(audioContext.destination)
  osc.start(now); osc.stop(now + 2.2)
}

export function speakCommentary(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'vi-VN'
  utterance.rate = 1.02
  utterance.pitch = 0.92
  utterance.volume = 0.9
  window.speechSynthesis.speak(utterance)
}
