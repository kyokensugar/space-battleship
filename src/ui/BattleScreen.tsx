import { useEffect, useRef, useState } from 'react'
import type { Difficulty } from '../game/ai/index'
import { AI_STRATEGIES } from '../game/ai/strategies'
import { coordKey } from '../game/board'
import { startBattle, takeTurn, type GameState, type Player } from '../game/rules'
import { hasBeenShot, isShipSunk, type ShotOutcome, type Side } from '../game/shoot'
import type { Coord, Fleet, ShipKind } from '../game/types'
import { coordLabel } from './coordLabel'
import { Grid, type CellState } from './Grid'
import { useI18n } from '../i18n/context'
import { useSound } from '../audio/context'
import { Captain, type Mood } from './Captain'
import type { Messages } from '../i18n/messages'
import './BattleScreen.css'

type Props = {
  playerFleet: Fleet
  aiFleet: Fleet
  difficulty: Difficulty
  onFinish: (winner: Player) => void
  aiDelayMs?: number
  bannerMs?: number
}

type Banner = { who: Player; ship: ShipKind; id: number }

/** Full-screen finale shown once a fleet is destroyed. Stars drift for a win, a red alert pulses for a loss. */
function ResultOverlay({ winner, onContinue }: { winner: Player; onContinue: () => void }) {
  const { t } = useI18n()
  const won = winner === 'player'
  return (
    <div className={`result-overlay ${won ? 'win' : 'lose'}`} role="dialog" aria-labelledby="result-title">
      {won && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.25}s` }} />
          ))}
        </div>
      )}
      <div className="result-card">
        <h2 id="result-title">{won ? t.result.win : t.result.lose}</h2>
        <p>{won ? t.battle.win : t.battle.lose}</p>
        <button type="button" className="primary" onClick={onContinue}>
          {t.battle.toResult}
        </button>
      </div>
    </div>
  )
}

type LogEntry = { who: Player; target: Coord; outcome: ShotOutcome; sunkShip?: ShipKind }

/** What the captain reacts to; stored as data and translated at render time. */
function captainSpeech(t: Messages, state: GameState, last: LogEntry | undefined): { mood: Mood; line: string } {
  if (state.phase === 'finished') {
    return state.winner === 'player' ? { mood: 'happy', line: t.captain.win } : { mood: 'sad', line: t.captain.lose }
  }
  if (!last) return { mood: 'normal', line: t.captain.aim }
  if (last.who === 'player') {
    if (last.outcome === 'sunk') return { mood: 'happy', line: t.captain.playerSunk(shipName(t, 'ai', last.sunkShip ?? 'scout')) }
    if (last.outcome === 'hit') return { mood: 'happy', line: t.captain.playerHit }
    return { mood: 'normal', line: t.captain.playerMiss }
  }
  if (last.outcome === 'sunk') return { mood: 'sad', line: t.captain.enemySunk(shipName(t, 'player', last.sunkShip ?? 'scout')) }
  if (last.outcome === 'hit') return { mood: 'sad', line: t.captain.enemyHit }
  return { mood: 'normal', line: t.captain.enemyMiss }
}

/** Ships owned by the AI are aliens; `owner` is the side the ship belongs to. */
function shipName(t: Messages, owner: Player, kind: ShipKind) {
  return owner === 'ai' ? t.alienShipNames[kind] : t.shipNames[kind]
}

/** Log entries are stored as data and rendered in the current language. */
function describeShot(t: Messages, { who, target, outcome, sunkShip }: LogEntry) {
  const base = t.battle.shot(t.who[who], coordLabel(target))
  if (outcome === 'miss') return base + t.battle.miss
  if (outcome === 'hit') return base + t.battle.hit
  return base + t.battle.sunk(sunkShip ? shipName(t, who === 'player' ? 'ai' : 'player', sunkShip) : '?')
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

function FleetStatus({ side, owner, title }: { side: Side; owner: Player; title: string }) {
  const { t } = useI18n()
  return (
    <div className={`fleet-status ${owner}`}>
      <h3>{title}</h3>
      <ul>
        {side.fleet.map((ship) => (
          <li key={ship.kind} className={isShipSunk(side, ship) ? 'sunk' : ''}>
            {shipName(t, owner, ship.kind)}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BattleScreen({ playerFleet, aiFleet, difficulty, onFinish, aiDelayMs = 700, bannerMs = 1800 }: Props) {
  const [state, setState] = useState<GameState>(() => startBattle(playerFleet, aiFleet))
  const [log, setLog] = useState<LogEntry[]>([])
  const [banner, setBanner] = useState<Banner | null>(null)
  const [shake, setShake] = useState(false)
  const { t } = useI18n()
  const { play } = useSound()
  const playRef = useRef(play)
  useEffect(() => {
    playRef.current = play
  }, [play])

  const finished = state.phase === 'finished'
  const winner = state.winner
  const playersTurn = state.currentTurn === 'player' && !finished

  const fire = (from: GameState, target: Coord) => {
    const result = takeTurn(from, target)
    setState(result.state)
    const sfx = playRef.current
    if (from.currentTurn === 'player') sfx('fire')
    sfx(result.outcome)
    if (result.state.phase === 'finished') sfx(result.state.winner === 'player' ? 'win' : 'lose')
    setLog((prev) => [{ who: from.currentTurn, target, outcome: result.outcome, sunkShip: result.sunkShip }, ...prev])
    if (result.outcome !== 'miss') setShake(true)
    if (result.outcome === 'sunk' && result.sunkShip) {
      setBanner({ who: from.currentTurn, ship: result.sunkShip, id: result.state.turnCount })
    }
  }

  useEffect(() => {
    if (!shake) return
    const timer = setTimeout(() => setShake(false), 400)
    return () => clearTimeout(timer)
  }, [shake])

  useEffect(() => {
    if (!banner) return
    const timer = setTimeout(() => setBanner(null), bannerMs)
    return () => clearTimeout(timer)
  }, [banner, bannerMs])

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

  const speech = captainSpeech(t, state, log[0])

  return (
    <section className={`battle ${shake ? 'shake' : ''}`}>
      <h2>{t.battle.heading}</h2>
      <Captain mood={speech.mood} line={speech.line} lineKey={log.length} />
      {banner && (
        <div key={banner.id} className={`sunk-banner ${banner.who === 'player' ? 'enemy-down' : 'own-down'}`} role="alert">
          {banner.who === 'player'
            ? t.battle.sunkEnemy(shipName(t, 'ai', banner.ship))
            : t.battle.sunkOwn(shipName(t, 'player', banner.ship))}
        </div>
      )}
      <p className={`status ${finished ? (state.winner === 'player' ? 'win' : 'lose') : ''}`} role="status">
        {status}
      </p>
      <div className="battle-body">
        <div className="board-block alien">
          <Grid
            label={t.battle.enemySector}
            cellState={sideCellState(state.ai, false)}
            onCellClick={handleEnemyClick}
            disabled={!playersTurn}
          />
          <FleetStatus side={state.ai} owner="ai" title={t.battle.enemyFleet} />
        </div>
        <div className="board-block">
          <Grid label={t.placement.ownSector} cellState={sideCellState(state.player, true)} disabled />
          <FleetStatus side={state.player} owner="player" title={t.battle.ownFleet} />
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
      {winner && <ResultOverlay winner={winner} onContinue={() => onFinish(winner)} />}
    </section>
  )
}
