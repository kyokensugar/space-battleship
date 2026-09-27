import { useState } from 'react'
import type { Fleet } from './game/types'
import { PlacementScreen } from './ui/PlacementScreen'
import './App.css'

type Screen = { name: 'start' } | { name: 'setup' } | { name: 'ready'; fleet: Fleet }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'start' })

  return (
    <main>
      <h1>Space Battleship</h1>
      {screen.name === 'start' && (
        <section className="start">
          <p>AI 艦隊との一騎打ち。相手の艦をすべて撃沈せよ。</p>
          <button type="button" className="primary" onClick={() => setScreen({ name: 'setup' })}>
            ゲーム開始
          </button>
        </section>
      )}
      {screen.name === 'setup' && <PlacementScreen onComplete={(fleet) => setScreen({ name: 'ready', fleet })} />}
      {screen.name === 'ready' && (
        <section className="start">
          <p>配置完了({screen.fleet.length}隻)。対戦画面は次の更新で追加されます。</p>
          <button type="button" onClick={() => setScreen({ name: 'start' })}>
            最初に戻る
          </button>
        </section>
      )}
    </main>
  )
}

export default App
