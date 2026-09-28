import { useState } from 'react'
import { DIFFICULTIES, type Difficulty } from './game/ai/index'
import { randomFleet } from './game/board'
import type { Player } from './game/rules'
import type { Fleet } from './game/types'
import { BattleScreen } from './ui/BattleScreen'
import { PlacementScreen } from './ui/PlacementScreen'
import { DIFFICULTY_NAMES } from './ui/shipNames'
import './App.css'

type Screen =
  | { name: 'start' }
  | { name: 'setup' }
  | { name: 'battle'; playerFleet: Fleet; aiFleet: Fleet }
  | { name: 'result'; winner: Player }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  return (
    <main>
      <h1>Space Battleship</h1>
      {screen.name === 'start' && (
        <section className="start">
          <p>AI 艦隊との一騎打ち。相手の艦をすべて撃沈せよ。</p>
          <fieldset className="difficulty">
            <legend>難易度</legend>
            {DIFFICULTIES.map((d) => (
              <label key={d}>
                <input
                  type="radio"
                  name="difficulty"
                  value={d}
                  checked={difficulty === d}
                  onChange={() => setDifficulty(d)}
                />
                {DIFFICULTY_NAMES[d]}
              </label>
            ))}
          </fieldset>
          <button type="button" className="primary" onClick={() => setScreen({ name: 'setup' })}>
            ゲーム開始
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
          <h2>{screen.winner === 'player' ? '勝利!' : '敗北…'}</h2>
          <p>{screen.winner === 'player' ? '敵艦隊を全滅させた。' : '自艦隊が全滅した。次は勝とう。'}</p>
          <button type="button" className="primary" onClick={() => setScreen({ name: 'setup' })}>
            もう一度
          </button>
        </section>
      )}
    </main>
  )
}

export default App
