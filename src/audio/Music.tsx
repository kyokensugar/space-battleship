import { useEffect, useRef } from 'react'
import { useSound } from './context'
import { TRACK_FILES, type Track } from './tracks'

const VOLUME = 0.35

/** Loops the given track, crossing to a new file when `track` changes and pausing while muted. */
export function Music({ track }: { track: Track }) {
  const { muted } = useSound()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof Audio === 'undefined') return
    const audio = new Audio(TRACK_FILES[track])
    audio.loop = true
    audio.volume = VOLUME
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [track])

  // Browsers block autoplay until the user interacts, so also retry on the first click/tap.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.pause()
      return
    }
    const tryPlay = () => audio.play()?.catch(() => {})
    tryPlay()
    document.addEventListener('pointerdown', tryPlay, { once: true })
    return () => document.removeEventListener('pointerdown', tryPlay)
  }, [muted, track])

  return null
}
