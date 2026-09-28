import { useEffect, useState } from 'react'
import type { Difficulty } from '../game/ai/index'
import { AI_STRATEGIES } from '../game/ai/strategies'
import { coordKey } from '../game/board'
import { startBattle, takeTurn, type GameState, type Player } from '../game/rules'
import { hasBeenShot, isShipSunk, type ShotOutcome, type Side } from '../game/shoot'
import type { Coord, Fleet, ShipKind } from '../game/types'
import { coordLabel } from './coordLabel'
import { Grid, type CellState } from './Grid'
import { SHIP_NAMES } from './shipNames'
import './BattleScreen.css'

type Props = {
  playerFleet: Fleet
  aiFleet: Fleet
  difficulty: Difficulty
  onFinish: (winner: Player) => void
  aiDelayMs?: number
}

const WHO = { player: 'あなた', ai: 'AI' } as const

function describeShot(who: Player, target: Coord, outcome: ShotOutcome, sunkShip?: ShipKind) {
  const base = `${WHO[who]}が ${coordLabel(target)} を砲撃 → `
  if (outcome === 'miss') return base + 'ミス'
  if (outcome === 'hit') return base + 'ヒット!'
  return base + `${sunkShip ? SHIP_NAMES[sunkShip] : '艦'}を撃沈!!`
}

/** Cell state for a board as seen by the viewer. `revealShips` shows intact ship cells (own board). */
function sideCellState(side: Side, revealShips: boolean) {
  const shotByKey = new Map(side.shotsReceived.map((s) => [coordKey(s.target), s.outcome]))
  const sunkKeys = new Set(
    side.fleet.filter((ship) => isShipSunk(side, ship)).flatMap((ship) => ship.cells.map(coordKey)),
  )
  const shipKeys = new Set(side.fleet.flatMap((ship) => ship.cells.map(coordKey)))
  return (coord: Coord): CellState => {
    const key = coordKey(coord)
    if (sunkKeys.has(key)) return 'sunk'
    const shot = shotByKey.get(key)
    if (shot === 'hit') return 'hit'
    if (shot === 'miss') return 'miss'
    if (revealShips && shipKeys.has(key)) return 'ship'
    return 'empty'
  }
}

function FleetStatus({ side, title }: { side: Side; title: string }) {
  return (
    <div className="fleet-status">
      <h3>{title}</h3>
      <ul>
        {side.fleet.map((ship) => (
          <li key={ship.kind} className={isShipSunk(side, ship) ? 'sunk' : ''}>
            {SHIP_NAMES[ship.kind]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BattleScreen({ playerFleet, aiFleet, difficulty, onFinish, aiDelayMs = 700 }: Props) {
  const [state, setState] = useState<GameState>(() => startBattle(playerFleet, aiFleet))
  const [log, setLog] = useState<string[]>([])

  const finished = state.phase === 'finished'
  const winner = state.winner
  const playersTurn = state.currentTurn === 'player' && !finished

  const fire = (from: GameState, target: Coord) => {
    const result = takeTurn(from, target)
    setState(result.state)
    setLog((prev) => [describeShot(from.currentTurn, target, result.outcome, result.sunkShip), ...prev])
  }

  useEffect(() => {
    if (state.phase !== 'battle' || state.currentTurn !== 'ai') return
    const timer = setTimeout(() => fire(state, AI_STRATEGIES[difficulty](state.player)), aiDelayMs)
    return () => clearTimeout(timer)
  }, [state, difficulty, aiDelayMs])

  const handleEnemyClick = (coord: Coord) => {
    if (!playersTurn || hasBeenShot(state.ai, coord)) return
    fire(state, coord)
  }

  const status = finished
    ? state.winner === 'player'
      ? '勝利! 敵艦隊を全滅させた'
      : '敗北… 自艦隊が全滅した'
    : playersTurn
      ? 'あなたの番: 敵宙域をクリックして砲撃'
      : 'AI の番…'

  return (
    <section className="battle">
      <h2>戦闘</h2>
      <p className={`status ${finished ? (state.winner === 'player' ? 'win' : 'lose') : ''}`} role="status">
        {status}
      </p>
      <div className="battle-body">
        <div className="board-block">
          <Grid
            label="敵の宙域"
            cellState={sideCellState(state.ai, false)}
            onCellClick={handleEnemyClick}
            disabled={!playersTurn}
          />
          <FleetStatus side={state.ai} title="敵の残艦" />
        </div>
        <div className="board-block">
          <Grid label="自分の宙域" cellState={sideCellState(state.player, true)} disabled />
          <FleetStatus side={state.player} title="自分の残艦" />
        </div>
        <aside className="battle-log">
          <h3>戦況ログ(第 {state.turnCount} 手)</h3>
          <ol>
            {log.map((line, i) => (
              <li key={log.length - i}>{line}</li>
            ))}
          </ol>
        </aside>
      </div>
      {winner && (
        <button type="button" className="primary" onClick={() => onFinish(winner)}>
          結果へ
        </button>
      )}
    </section>
  )
}
