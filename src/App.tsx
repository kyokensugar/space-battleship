import { useState } from 'react'
import { DIFFICULTIES, type Difficulty } from './game/ai/index'
import { randomFleet } from './game/board'
import type { Player } from './game/rules'
import type { Fleet } from './game/types'
import { BattleScreen } from './ui/BattleScreen'
import { PlacementScreen } from './ui/PlacementScreen'
import { Starfield } from './ui/Starfield'
import { useI18n } from './i18n/context'
import { LanguageSwitch } from './i18n/LanguageSwitch'
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
      <header className="app-header">
        <h1>{t.title}</h1>
        <LanguageSwitch />
      </header>
      {screen.name === 'start' && (
        <section className="start">
          <p>{t.intro}</p>
          <fieldset className="difficulty">
            <legend>{t.difficulty}</legend>
            {DIFFICULTIES.map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  name="difficulty"
                  value={d}
                  checked={difficulty === d}
                  onChange={() => setDifficulty(d)}
                />
                {t.difficultyNames[d]}
              </label>
            ))}
          </fieldset>
          <button type="button" className="primary" onClick={() => setScreen({ name: 'setup' })}>
            {t.start}
          </button>
        </section>
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
