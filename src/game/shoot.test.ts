import { placeShip, randomFleet } from './board'
import { hasBeenShot, isFleetDestroyed, remainingCells, shoot, type Side } from './shoot'
import type { Coord } from './types'

const fleetWithScoutAndCruiser = () =>
  placeShip(placeShip([], { kind: 'scout', bow: { row: 0, col: 0 }, orientation: 'horizontal' }), {
    kind: 'cruiser',
    bow: { row: 5, col: 5 },
    orientation: 'vertical',
  })

const freshSide = (): Side => ({ fleet: fleetWithScoutAndCruiser(), shotsReceived: [] })

describe('shoot', () => {
  it('returns miss on an empty cell and records the shot', () => {
    const { side, outcome } = shoot(freshSide(), { row: 9, col: 9 })
    expect(outcome).toBe('miss')
    expect(side.shotsReceived).toEqual([{ target: { row: 9, col: 9 }, outcome: 'miss' }])
  })

  it('returns hit when a ship cell is struck but the ship still floats', () => {
    const { side, outcome, sunkShip } = shoot(freshSide(), { row: 0, col: 0 })
    expect(outcome).toBe('hit')
    expect(sunkShip).toBeUndefined()
    expect(side.shotsReceived).toHaveLength(1)
  })

  it('returns sunk with the ship kind when the last cell is struck', () => {
    const first = shoot(freshSide(), { row: 0, col: 0 })
    const second = shoot(first.side, { row: 0, col: 1 })
    expect(second.outcome).toBe('sunk')
    expect(second.sunkShip).toBe('scout')
  })

  it('does not mutate the original side', () => {
    const original = freshSide()
    shoot(original, { row: 0, col: 0 })
    expect(original.shotsReceived).toHaveLength(0)
  })

  it('rejects shooting the same cell twice', () => {
    const { side } = shoot(freshSide(), { row: 3, col: 3 })
    expect(hasBeenShot(side, { row: 3, col: 3 })).toBe(true)
    expect(() => shoot(side, { row: 3, col: 3 })).toThrow(/already shot/)
  })
})

describe('remainingCells / isFleetDestroyed', () => {
  it('counts unhit ship cells', () => {
    let side = freshSide()
    expect(remainingCells(side)).toBe(5)
    side = shoot(side, { row: 0, col: 0 }).side
    expect(remainingCells(side)).toBe(4)
    side = shoot(side, { row: 9, col: 9 }).side
    expect(remainingCells(side)).toBe(4)
  })

  it('declares the fleet destroyed only when every ship cell is hit', () => {
    let side: Side = { fleet: randomFleet(), shotsReceived: [] }
    const cells: Coord[] = side.fleet.flatMap((ship) => ship.cells)
    expect(cells).toHaveLength(17)

    cells.slice(0, -1).forEach((cell) => {
      side = shoot(side, cell).side
    })
    expect(isFleetDestroyed(side)).toBe(false)

    const last = shoot(side, cells[cells.length - 1])
    expect(last.outcome).toBe('sunk')
    expect(isFleetDestroyed(last.side)).toBe(true)
  })
})
