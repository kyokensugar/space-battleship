import { useEffect, useState } from 'react'
import type { Difficulty } from '../game/ai/index'
import { AI_STRATEGIES } from '../game/ai/strategies'
import { coordKey } from '../game/board'
import { startBattle, takeTurn, type GameState, type Player } from '../game/rules'
import { hasBeenShot, isShipSunk, type ShotOutcome, type Side } from '../game/shoot'
import type { Coord, Fleet, ShipKind } from '../game/types'
import { coordLabel } from './coordLabel'
import { Grid, type CellState } from './Grid'
import { useI18n } from '../i18n/context'
import type { Messages } from '../i18n/messages'
import './BattleScreen.css'

type Props = {
  playerFleet: Fleet
  aiFleet: Fleet
  difficulty: Difficulty
  onFinish: (winner: Player) => void
  aiDelayMs?: number
}

type LogEntry = { who: Player; target: Coord; outcome: ShotOutcome; sunkShip?: ShipKind }

/** Log entries are stored as data and rendered in the current language. */
function describeShot(t: Messages, { who, target, outcome, sunkShip }: LogEntry) {
  const base = t.battle.shot(t.who[who], coordLabel(target))
  if (outcome === 'miss') return base + t.battle.miss
  if (outcome === 'hit') return base + t.battle.hit
  return base + t.battle.sunk(sunkShip ? t.shipNames[sunkShip] : '?')
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
  const { t } = useI18n()
  return (
    <div className="fleet-status">
      <h3>{title}</h3>
      <ul>
        {side.fleet.map((ship) => (
          <li key={ship.kind} className={isShipSunk(side, ship) ? 'sunk' : ''}>
            {t.shipNames[ship.kind]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BattleScreen({ playerFleet, aiFleet, difficulty, onFinish, aiDelayMs = 700 }: Props) {
  const [state, setState] = useState<GameState>(() => startBattle(playerFleet, aiFleet))
  const [log, setLog] = useState<LogEntry[]>([])
  const { t } = useI18n()

  const finished = state.phase === 'finished'
  const winner = state.winner
  const playersTurn = state.currentTurn === 'player' && !finished

  const fire = (from: GameState, target: Coord) => {
    const result = takeTurn(from, target)
    setState(result.state)
    setLog((prev) => [{ who: from.currentTurn, target, outcome: result.outcome, sunkShip: result.sunkShip }, ...prev])
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
      ? t.battle.win
      : t.battle.lose
    : playersTurn
      ? t.battle.yourTurn
      : t.battle.aiTurn

  return (
    <section className="battle">
      <h2>{t.battle.heading}</h2>
      <p className={`status ${finished ? (state.winner === 'player' ? 'win' : 'lose') : ''}`} role="status">
        {status}
      </p>
      <div className="battle-body">
        <div className="board-block">
          <Grid
            label={t.battle.enemySector}
            cellState={sideCellState(state.ai, false)}
            onCellClick={handleEnemyClick}
            disabled={!playersTurn}
          />
          <FleetStatus side={state.ai} title={t.battle.enemyFleet} />
        </div>
        <div className="board-block">
          <Grid label={t.placement.ownSector} cellState={sideCellState(state.player, true)} disabled />
          <FleetStatus side={state.player} title={t.battle.ownFleet} />
        </div>
        <aside className="battle-log">
          <h3>{t.battle.log(state.turnCount)}</h3>
          <ol>
            {log.map((entry, i) => (
              <li key={log.length - i}>{describeShot(t, entry)}</li>
            ))}
          </ol>
        </aside>
      </div>
      {winner && (
        <button type="button" className="primary" onClick={() => onFinish(winner)}>
          {t.battle.toResult}
        </button>
      )}
    </section>
  )
}
