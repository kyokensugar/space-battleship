import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App'
import { I18nProvider } from '../i18n/I18nProvider'
import { loadMuted } from './context'
import { SoundProvider } from './SoundProvider'
import { SOUND_NAMES, playSound } from './sounds'

const renderApp = (play: (name: string) => void) =>
  render(
    <I18nProvider initial="ja">
      <SoundProvider play={play}>
        <App />
      </SoundProvider>
    </I18nProvider>,
  )

const startBattle = () => {
  fireEvent.click(screen.getByRole('button', { name: 'ゲーム開始' }))
  fireEvent.click(screen.getByRole('button', { name: 'ランダム配置' }))
  fireEvent.click(screen.getByRole('button', { name: '出撃' }))
}

describe('sound', () => {
  beforeEach(() => localStorage.clear())

  it('playSound is a no-op where Web Audio is unavailable', () => {
    expect(typeof AudioContext).toBe('undefined')
    for (const name of SOUND_NAMES) expect(() => playSound(name)).not.toThrow()
  })

  it('plays fire and outcome sounds when the player shoots', () => {
    const play = vi.fn()
    renderApp(play)
    startBattle()
    fireEvent.click(screen.getByRole('gridcell', { name: /敵の宙域 A1 / }))
    expect(play).toHaveBeenNthCalledWith(1, 'fire')
    expect(['miss', 'hit']).toContain(play.mock.calls[1][0])
  })

  it('mute button silences effects and remembers the choice', () => {
    const play = vi.fn()
    renderApp(play)
    fireEvent.click(screen.getByRole('button', { name: '音を消す' }))
    expect(screen.getByRole('button', { name: '音を出す' })).toHaveAttribute('aria-pressed', 'true')
    expect(loadMuted()).toBe(true)
    startBattle()
    fireEvent.click(screen.getByRole('gridcell', { name: /敵の宙域 A1 / }))
    expect(play).not.toHaveBeenCalled()
  })
})
