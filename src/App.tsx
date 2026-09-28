import { useState } from 'react'
import type { Difficulty } from './game/ai/index'
import { randomFleet } from './game/board'
import type { Player } from './game/rules'
import type { Fleet } from './game/types'
import { BattleScreen } from './ui/BattleScreen'
import { PlacementScreen } from './ui/PlacementScreen'
import { StartScreen } from './ui/StartScreen'
import { Starfield } from './ui/Starfield'
import { useI18n } from './i18n/context'
import { LanguageSwitch } from './i18n/LanguageSwitch'
import { MuteButton } from './audio/MuteButton'
import { Music } from './audio/Music'
import './App.css'

type Screen =
  | { name: 'start' }
  | { name: 'setup' }
  | { name: 'battle'; playerFleet: Fleet; aiFleet: Fleet }
  | { name: 'result'; winner: Player }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const { t } = useI18n()

  return (
    <main>
      <Starfield />
      <Music track={screen.name === 'battle' ? 'battle' : 'opening'} />
      <header className="app-header">
        <h1>{t.title}</h1>
        <div className="header-controls">
          <LanguageSwitch />
          <MuteButton />
        </div>
      </header>
      {screen.name === 'start' && (
        <StartScreen difficulty={difficulty} onDifficultyChange={setDifficulty} onStart={() => setScreen({ name: 'setup' })} />
      )}
      {screen.name === 'setup' && (
        <PlacementScreen
          onComplete={(playerFleet) => setScreen({ name: 'battle', playerFleet, aiFleet: randomFleet() })}
        />
      )}
      {screen.name === 'battle' && (
        <BattleScreen
          playerFleet={screen.playerFleet}
          aiFleet={screen.aiFleet}
          difficulty={difficulty}
          onFinish={(winner) => setScreen({ name: 'result', winner })}
        />
      )}
      {screen.name === 'result' && (
        <section className="start">
          <h2>{screen.winner === 'player' ? t.result.win : t.result.lose}</h2>
          <p>{screen.winner === 'player' ? t.result.winDetail : t.result.loseDetail}</p>
          <button type="button" className="primary" onClick={() => setScreen({ name: 'setup' })}>
            {t.result.again}
          </button>
        </section>
      )}
    </main>
  )
}

export default App
