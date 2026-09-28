import { useI18n } from './context'
import { LANGUAGES, MESSAGES } from './messages'

export function LanguageSwitch() {
  const { language, setLanguage } = useI18n()
  return (
    <nav className="language-switch" aria-label="Language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          lang={lang}
          aria-pressed={language === lang}
          onClick={() => setLanguage(lang)}
        >
          {MESSAGES[lang].languageName}
        </button>
      ))}
    </nav>
  )
}
