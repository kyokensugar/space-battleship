import { createContext, useContext } from 'react'
import { LANGUAGES, MESSAGES, type Language, type Messages } from './messages'

const STORAGE_KEY = 'space-battleship.language'

export function detectLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && LANGUAGES.includes(saved as Language)) return saved as Language
  return navigator.language.startsWith('ja') ? 'ja' : 'en'
}

export function saveLanguage(language: Language) {
  localStorage.setItem(STORAGE_KEY, language)
}

export type I18n = { language: Language; t: Messages; setLanguage: (language: Language) => void }

export const I18nContext = createContext<I18n>({ language: 'ja', t: MESSAGES.ja, setLanguage: () => {} })

export function useI18n(): I18n {
  return useContext(I18nContext)
}
