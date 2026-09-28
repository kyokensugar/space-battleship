import { createContext, useContext } from 'react'
import type { SoundName } from './sounds'

const STORAGE_KEY = 'space-battleship.muted'

export function loadMuted(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}

export function saveMuted(muted: boolean) {
  localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
}

export type Sound = { muted: boolean; setMuted: (muted: boolean) => void; play: (name: SoundName) => void }

export const SoundContext = createContext<Sound>({ muted: true, setMuted: () => {}, play: () => {} })

export function useSound(): Sound {
  return useContext(SoundContext)
}
