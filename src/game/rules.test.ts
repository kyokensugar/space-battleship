import { placeShip } from './board'
import { opponentOf, startBattle, takeTurn, type GameState } from './rules'
import type { Fleet } from './types'

const scoutOnly = (row: number): Fleet =>
  placeShip([], { kind: 'scout', bow: { row, col: 0 }, orientation: 'horizontal' })

const start = (): GameState => startBattle(scoutOnly(0), scoutOnly(9))

describe('startBattle', () => {
  it('begins in battle phase with the player to move', () => {
    const state = start()
    expect(state.phase).toBe('battle')
    expect(state.currentTurn).toBe('player')
    expect(state.turnCount).toBe(0)
    expect(state.winner).toBeUndefined()
  })
})

describe('opponentOf', () => {
  it('flips sides', () => {
    expect(opponentOf('player')).toBe('ai')
    expect(opponentOf('ai')).toBe('player')
  })
})

describe('takeTurn', () => {
  it('records the shot against the opponent and passes the turn', () => {
    const { state, outcome } = takeTurn(start(), { row: 5, col: 5 })
    expect(outcome).toBe('miss')
    expect(state.ai.shotsReceived).toHaveLength(1)
    expect(state.player.shotsReceived).toHaveLength(0)
    expect(state.currentTurn).toBe('ai')
    expect(state.turnCount).toBe(1)
  })

  it('lets the ai shoot at the player on its turn', () => {
    const afterPlayer = takeTurn(start(), { row: 5, col: 5 }).state
    const { state, outcome } = takeTurn(afterPlayer, { row: 0, col: 0 })
    expect(outcome).toBe('hit')
    expect(state.player.shotsReceived).toHaveLength(1)
    expect(state.currentTurn).toBe('player')
  })

  it('finishes the game and names the winner when the last ship sinks', () => {
    let state = start()
    state = takeTurn(state, { row: 9, col: 0 }).state
    state = takeTurn(state, { row: 5, col: 5 }).state
    const final = takeTurn(state, { row: 9, col: 1 })
    expect(final.outcome).toBe('sunk')
    expect(final.sunkShip).toBe('scout')
    expect(final.state.phase).toBe('finished')
    expect(final.state.winner).toBe('player')
  })

  it('refuses further turns after the game has finished', () => {
    let state = start()
    state = takeTurn(state, { row: 9, col: 0 }).state
    state = takeTurn(state, { row: 5, col: 5 }).state
    state = takeTurn(state, { row: 9, col: 1 }).state
    expect(() => takeTurn(state, { row: 0, col: 0 })).toThrow(/finished/)
  })
})
