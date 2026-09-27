import { isFleetDestroyed, shoot, type ShotOutcome, type Side } from './shoot'
import type { Coord, Fleet, ShipKind } from './types'

export type Player = 'player' | 'ai'

export type GameState = {
  phase: 'battle' | 'finished'
  player: Side
  ai: Side
  currentTurn: Player
  turnCount: number
  winner?: Player
}

export type TurnResult = {
  state: GameState
  outcome: ShotOutcome
  sunkShip?: ShipKind
}

export function opponentOf(who: Player): Player {
  return who === 'player' ? 'ai' : 'player'
}

export function startBattle(playerFleet: Fleet, aiFleet: Fleet): GameState {
  return {
    phase: 'battle',
    player: { fleet: playerFleet, shotsReceived: [] },
    ai: { fleet: aiFleet, shotsReceived: [] },
    currentTurn: 'player',
    turnCount: 0,
  }
}

export function takeTurn(state: GameState, target: Coord): TurnResult {
  if (state.phase !== 'battle') throw new Error('Game is already finished')

  const shooter = state.currentTurn
  const defender = opponentOf(shooter)
  const { side, outcome, sunkShip } = shoot(state[defender], target)

  const next: GameState = {
    ...state,
    [defender]: side,
    currentTurn: defender,
    turnCount: state.turnCount + 1,
  }

  if (isFleetDestroyed(side)) {
    return { state: { ...next, phase: 'finished', winner: shooter }, outcome, sunkShip }
  }
  return { state: next, outcome, sunkShip }
}
