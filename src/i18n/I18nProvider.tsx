import { useState, type ReactNode } from 'react'
import { I18nContext, detectLanguage, saveLanguage } from './context'
import { MESSAGES, type Language } from './messages'

export function I18nProvider({ initial, children }: { initial?: Language; children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initial ?? detectLanguage)
  const setLanguage = (next: Language) => {
    saveLanguage(next)
    setLanguageState(next)
  }
  return <I18nContext.Provider value={{ language, t: MESSAGES[language], setLanguage }}>{children}</I18nContext.Provider>
}
