/**
 * Sound effects synthesised with the Web Audio API — no audio files needed.
 * Every effect is a short envelope on an oscillator or noise buffer.
 */
export type SoundName = 'fire' | 'miss' | 'hit' | 'sunk' | 'win' | 'lose'

export const SOUND_NAMES: readonly SoundName[] = ['fire', 'miss', 'hit', 'sunk', 'win', 'lose']

let ctx: AudioContext | null = null

/** Browsers only allow audio after a user gesture, so the context is created lazily on first play. */
export function getAudioContext(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(
  ac: AudioContext,
  { type, from, to, duration, gain, at = 0 }: {
    type: OscillatorType
    from: number
    to: number
    duration: number
    gain: number
    at?: number
  },
) {
  const start = ac.currentTime + at
  const osc = ac.createOscillator()
  const env = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, start)
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + duration)
  env.gain.setValueAtTime(gain, start)
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(env).connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration)
}

function noise(ac: AudioContext, { duration, gain, cutoff, at = 0 }: { duration: number; gain: number; cutoff: number; at?: number }) {
  const start = ac.currentTime + at
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * duration), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource()
  src.buffer = buffer
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(cutoff, start)
  filter.frequency.exponentialRampToValueAtTime(80, start + duration)
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, start)
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  src.connect(filter).connect(env).connect(ac.destination)
  src.start(start)
}

const EFFECTS: Record<SoundName, (ac: AudioContext) => void> = {
  fire: (ac) => tone(ac, { type: 'sawtooth', from: 900, to: 120, duration: 0.25, gain: 0.25 }),
  miss: (ac) => tone(ac, { type: 'sine', from: 320, to: 180, duration: 0.35, gain: 0.15 }),
  hit: (ac) => {
    noise(ac, { duration: 0.5, gain: 0.5, cutoff: 3000 })
    tone(ac, { type: 'square', from: 200, to: 40, duration: 0.4, gain: 0.3 })
  },
  sunk: (ac) => {
    noise(ac, { duration: 1.2, gain: 0.6, cutoff: 1500 })
    tone(ac, { type: 'sawtooth', from: 160, to: 30, duration: 1.2, gain: 0.35 })
    tone(ac, { type: 'sine', from: 60, to: 25, duration: 1.4, gain: 0.4, at: 0.1 })
  },
  win: (ac) => {
    ;[523, 659, 784, 1047].forEach((f, i) =>
      tone(ac, { type: 'triangle', from: f, to: f, duration: 0.5, gain: 0.25, at: i * 0.15 }),
    )
  },
  lose: (ac) => {
    ;[392, 330, 262, 196].forEach((f, i) =>
      tone(ac, { type: 'sawtooth', from: f, to: f * 0.9, duration: 0.6, gain: 0.2, at: i * 0.25 }),
    )
  },
}

/** Plays an effect; silently does nothing where Web Audio is unavailable (e.g. tests). */
export function playSound(name: SoundName) {
  const ac = getAudioContext()
  if (!ac) return
  EFFECTS[name](ac)
}
