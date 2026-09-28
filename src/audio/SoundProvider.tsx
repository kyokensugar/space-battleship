import { useState, type ReactNode } from 'react'
import { SoundContext, loadMuted, saveMuted } from './context'
import { playSound, type SoundName } from './sounds'

export function SoundProvider({ play = playSound, children }: { play?: (name: SoundName) => void; children: ReactNode }) {
  const [muted, setMutedState] = useState<boolean>(loadMuted)
  const setMuted = (next: boolean) => {
    saveMuted(next)
    setMutedState(next)
  }
  const playIfOn = (name: SoundName) => {
    if (!muted) play(name)
  }
  return <SoundContext.Provider value={{ muted, setMuted, play: playIfOn }}>{children}</SoundContext.Provider>
}
