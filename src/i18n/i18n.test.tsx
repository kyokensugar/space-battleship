import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { detectLanguage } from './context'
import { I18nProvider } from './I18nProvider'
import { LANGUAGES, MESSAGES } from './messages'

const renderApp = (initial?: 'ja' | 'en') =>
  render(
    <I18nProvider initial={initial}>
      <App />
    </I18nProvider>,
  )

describe('i18n', () => {
  beforeEach(() => localStorage.clear())

  it('every language defines the same ship and difficulty names', () => {
    for (const lang of LANGUAGES) {
      expect(Object.keys(MESSAGES[lang].shipNames)).toEqual(Object.keys(MESSAGES.ja.shipNames))
      expect(Object.keys(MESSAGES[lang].difficultyNames)).toEqual(Object.keys(MESSAGES.ja.difficultyNames))
    }
  })

  it('switches the whole UI to English and remembers the choice', () => {
    renderApp('ja')
    expect(screen.getByRole('button', { name: 'ゲーム開始' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(screen.getByRole('button', { name: 'Start game' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Hard (probability targeting)' })).toBeInTheDocument()
    expect(detectLanguage()).toBe('en')
  })

  it('renders placement and battle screens in English', () => {
    renderApp('en')
    fireEvent.click(screen.getByRole('button', { name: 'Start game' }))
    expect(screen.getByRole('heading', { name: 'Deploy your fleet' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Random layout' }))
    fireEvent.click(screen.getByRole('button', { name: 'Sortie' }))
    expect(screen.getByRole('grid', { name: 'Enemy sector' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Your turn')
  })

  it('falls back to the browser language when nothing is saved', () => {
    expect(['ja', 'en']).toContain(detectLanguage())
  })
})
