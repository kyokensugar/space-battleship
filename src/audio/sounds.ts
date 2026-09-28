/**
 * Sound effects synthesised with the Web Audio API — no audio files needed.
 * Every effect layers a few oscillators / noise bursts and is routed through a
 * shared "space" bus (echo + compressor) so they sit together with the music.
 */
export type SoundName = 'fire' | 'miss' | 'hit' | 'sunk' | 'win' | 'lose'

export const SOUND_NAMES: readonly SoundName[] = ['fire', 'miss', 'hit', 'sunk', 'win', 'lose']

let ctx: AudioContext | null = null
let bus: AudioNode | null = null

/** Browsers only allow audio after a user gesture, so the context is created lazily on first play. */
export function getAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** Master bus: compressor keeps loud explosions from clipping, a short feedback delay adds space. */
function getBus(ac: AudioContext): AudioNode {
  if (bus) return bus
  const comp = ac.createDynamicsCompressor()
  comp.threshold.value = -18
  comp.ratio.value = 6
  comp.connect(ac.destination)

  const input = ac.createGain()
  input.connect(comp)

  const delay = ac.createDelay(1)
  delay.delayTime.value = 0.23
  const feedback = ac.createGain()
  feedback.gain.value = 0.3
  const wet = ac.createGain()
  wet.gain.value = 0.25
  const damp = ac.createBiquadFilter()
  damp.type = 'lowpass'
  damp.frequency.value = 2200
  input.connect(delay)
  delay.connect(damp).connect(feedback).connect(delay)
  damp.connect(wet).connect(comp)

  bus = input
  return bus
}

type Env = { attack?: number; duration: number; gain: number; at?: number }

function envelope(ac: AudioContext, start: number, { attack = 0.005, duration, gain }: Env) {
  const env = ac.createGain()
  env.gain.setValueAtTime(0.0001, start)
  env.gain.exponentialRampToValueAtTime(gain, start + attack)
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  env.connect(getBus(ac))
  return env
}

function tone(
  ac: AudioContext,
  {
    type,
    from,
    to = from,
    detune = 0,
    ...env
  }: Env & { type: OscillatorType; from: number; to?: number; detune?: number },
) {
  const start = ac.currentTime + (env.at ?? 0)
  const osc = ac.createOscillator()
  osc.type = type
  osc.detune.value = detune
  osc.frequency.setValueAtTime(from, start)
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + env.duration)
  osc.connect(envelope(ac, start, env))
  osc.start(start)
  osc.stop(start + env.duration + 0.05)
}

/** Sine carrier whose pitch is wobbled by a second oscillator — the classic "laser" / "alien" timbre. */
function fm(
  ac: AudioContext,
  { from, to, modFreq, modDepth, ...env }: Env & { from: number; to: number; modFreq: number; modDepth: number },
) {
  const start = ac.currentTime + (env.at ?? 0)
  const carrier = ac.createOscillator()
  carrier.frequency.setValueAtTime(from, start)
  carrier.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + env.duration)
  const mod = ac.createOscillator()
  mod.frequency.value = modFreq
  const depth = ac.createGain()
  depth.gain.value = modDepth
  mod.connect(depth).connect(carrier.frequency)
  carrier.connect(envelope(ac, start, env))
  mod.start(start)
  carrier.start(start)
  mod.stop(start + env.duration + 0.05)
  carrier.stop(start + env.duration + 0.05)
}

function noise(
  ac: AudioContext,
  {
    filter = 'lowpass',
    cutoff,
    cutoffTo = 80,
    q = 1,
    ...env
  }: Env & { filter?: BiquadFilterType; cutoff: number; cutoffTo?: number; q?: number },
) {
  const start = ac.currentTime + (env.at ?? 0)
  const length = Math.ceil(ac.sampleRate * env.duration)
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buffer
  const biquad = ac.createBiquadFilter()
  biquad.type = filter
  biquad.Q.value = q
  biquad.frequency.setValueAtTime(cutoff, start)
  biquad.frequency.exponentialRampToValueAtTime(cutoffTo, start + env.duration)
  src.connect(biquad).connect(envelope(ac, start, env))
  src.start(start)
}

/** Explosion building block: sub-bass thump + filtered noise body + crackle. */
function explosion(ac: AudioContext, size: number, at = 0) {
  tone(ac, { type: 'sine', from: 110 * size, to: 28, duration: 0.5 * size, gain: 0.7, at })
  noise(ac, { cutoff: 4000, cutoffTo: 60, duration: 0.7 * size, gain: 0.55, at })
  noise(ac, { filter: 'bandpass', cutoff: 1800, cutoffTo: 300, q: 0.8, duration: 0.35 * size, gain: 0.35, at: at + 0.02 })
  tone(ac, { type: 'square', from: 70, to: 20, duration: 0.3 * size, gain: 0.2, at })
}

const EFFECTS: Record<SoundName, (ac: AudioContext) => void> = {
  // Plasma cannon: sharp FM zap sweeping down, with a tiny click and a hiss tail.
  fire: (ac) => {
    fm(ac, { from: 1800, to: 180, modFreq: 55, modDepth: 400, duration: 0.3, gain: 0.7 })
    tone(ac, { type: 'square', from: 2400, to: 400, duration: 0.05, gain: 0.3 })
    noise(ac, { filter: 'highpass', cutoff: 3000, cutoffTo: 6000, duration: 0.25, gain: 0.08, at: 0.03 })
  },
  // Miss: the shell streaks past (whoosh) and the sonar reports nothing (two soft pings).
  miss: (ac) => {
    noise(ac, { filter: 'bandpass', cutoff: 600, cutoffTo: 2500, q: 2, duration: 0.45, attack: 0.15, gain: 0.35 })
    tone(ac, { type: 'sine', from: 880, duration: 0.5, gain: 0.25, at: 0.35 })
    tone(ac, { type: 'sine', from: 660, duration: 0.6, gain: 0.16, at: 0.6 })
  },
  // Hit: mid-size explosion with a metallic ring.
  hit: (ac) => {
    explosion(ac, 1)
    tone(ac, { type: 'triangle', from: 1200, to: 900, duration: 0.5, gain: 0.12, at: 0.05 })
    tone(ac, { type: 'triangle', from: 1520, to: 1100, duration: 0.4, gain: 0.08, at: 0.07 })
  },
  // Sunk: two chained explosions, a long rumble and a groaning hull breaking up.
  sunk: (ac) => {
    explosion(ac, 1.6)
    explosion(ac, 1.1, 0.35)
    noise(ac, { cutoff: 400, cutoffTo: 40, duration: 2.2, attack: 0.1, gain: 0.5, at: 0.2 })
    fm(ac, { from: 220, to: 40, modFreq: 9, modDepth: 60, duration: 1.8, attack: 0.2, gain: 0.3, at: 0.3 })
    tone(ac, { type: 'sawtooth', from: 140, to: 35, duration: 1.6, gain: 0.2, detune: 12, at: 0.4 })
  },
  // Win: brass-like fanfare (detuned saws) over a major chord pad, ending with a shimmer.
  win: (ac) => {
    const melody = [523, 659, 784, 1047, 1047, 1175, 1319]
    const times = [0, 0.15, 0.3, 0.45, 0.75, 0.9, 1.05]
    melody.forEach((f, i) => {
      tone(ac, { type: 'sawtooth', from: f, duration: i === melody.length - 1 ? 1.4 : 0.3, gain: 0.16, at: times[i], detune: -6 })
      tone(ac, { type: 'sawtooth', from: f, duration: i === melody.length - 1 ? 1.4 : 0.3, gain: 0.16, at: times[i], detune: 6 })
    })
    ;[262, 330, 392].forEach((f) => tone(ac, { type: 'triangle', from: f, duration: 2.4, attack: 0.3, gain: 0.12 }))
    noise(ac, { filter: 'highpass', cutoff: 5000, cutoffTo: 9000, duration: 1.6, attack: 0.4, gain: 0.06, at: 1.0 })
  },
  // Lose: klaxon, a sinking minor drone and a distant final explosion.
  lose: (ac) => {
    ;[0, 0.5, 1.0].forEach((at) => fm(ac, { from: 440, to: 380, modFreq: 30, modDepth: 40, duration: 0.4, gain: 0.2, at }))
    ;[196, 233, 294].forEach((f) => tone(ac, { type: 'sawtooth', from: f, to: f * 0.7, duration: 2.6, attack: 0.4, gain: 0.1, detune: 8 }))
    explosion(ac, 1.4, 1.4)
  },
}

/** Plays an effect; silently does nothing where Web Audio is unavailable (e.g. tests). */
export function playSound(name: SoundName) {
  const ac = getAudioContext()
  if (!ac) return
  EFFECTS[name](ac)
}
