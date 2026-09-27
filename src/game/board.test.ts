import {
  coordKey,
  isFleetComplete,
  isInsideBoard,
  placeShip,
  randomFleet,
  shipCells,
  validatePlacement,
} from './board'
import { BOARD_SIZE, FLEET_KINDS, SHIP_LENGTHS, type Fleet } from './types'

describe('shipCells', () => {
  it('lays a horizontal ship to the right of its bow', () => {
    expect(shipCells({ kind: 'cruiser', bow: { row: 2, col: 3 }, orientation: 'horizontal' })).toEqual([
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 2, col: 5 },
    ])
  })

  it('lays a vertical ship downward from its bow', () => {
    expect(shipCells({ kind: 'scout', bow: { row: 7, col: 0 }, orientation: 'vertical' })).toEqual([
      { row: 7, col: 0 },
      { row: 8, col: 0 },
    ])
  })
})

describe('isInsideBoard', () => {
  it('accepts corners and rejects anything beyond them', () => {
    expect(isInsideBoard({ row: 0, col: 0 })).toBe(true)
    expect(isInsideBoard({ row: 9, col: 9 })).toBe(true)
    expect(isInsideBoard({ row: -1, col: 0 })).toBe(false)
    expect(isInsideBoard({ row: 0, col: BOARD_SIZE })).toBe(false)
  })
})

describe('validatePlacement', () => {
  it('accepts a ship fully inside an empty board', () => {
    expect(validatePlacement([], { kind: 'flagship', bow: { row: 0, col: 5 }, orientation: 'horizontal' })).toBeNull()
  })

  it('rejects a ship that sticks out of the board', () => {
    expect(validatePlacement([], { kind: 'flagship', bow: { row: 0, col: 6 }, orientation: 'horizontal' })).toBe(
      'out_of_bounds',
    )
    expect(validatePlacement([], { kind: 'scout', bow: { row: 9, col: 0 }, orientation: 'vertical' })).toBe(
      'out_of_bounds',
    )
  })

  it('rejects a ship overlapping an existing one', () => {
    const fleet = placeShip([], { kind: 'cruiser', bow: { row: 4, col: 4 }, orientation: 'horizontal' })
    expect(validatePlacement(fleet, { kind: 'scout', bow: { row: 3, col: 5 }, orientation: 'vertical' })).toBe(
      'overlap',
    )
  })

  it('allows ships to touch side by side without overlapping', () => {
    const fleet = placeShip([], { kind: 'cruiser', bow: { row: 4, col: 4 }, orientation: 'horizontal' })
    expect(validatePlacement(fleet, { kind: 'scout', bow: { row: 5, col: 4 }, orientation: 'horizontal' })).toBeNull()
  })

  it('rejects placing the same kind of ship twice', () => {
    const fleet = placeShip([], { kind: 'scout', bow: { row: 0, col: 0 }, orientation: 'horizontal' })
    expect(validatePlacement(fleet, { kind: 'scout', bow: { row: 5, col: 5 }, orientation: 'horizontal' })).toBe(
      'duplicate_kind',
    )
  })
})

describe('placeShip', () => {
  it('returns a new fleet containing the ship with its cells', () => {
    const fleet = placeShip([], { kind: 'destroyer', bow: { row: 1, col: 1 }, orientation: 'vertical' })
    expect(fleet).toHaveLength(1)
    expect(fleet[0].cells).toHaveLength(SHIP_LENGTHS.destroyer)
  })

  it('does not mutate the original fleet', () => {
    const original: Fleet = []
    placeShip(original, { kind: 'destroyer', bow: { row: 1, col: 1 }, orientation: 'vertical' })
    expect(original).toHaveLength(0)
  })

  it('throws on an invalid placement', () => {
    expect(() => placeShip([], { kind: 'flagship', bow: { row: 9, col: 9 }, orientation: 'vertical' })).toThrow(
      /out_of_bounds/,
    )
  })
})

describe('isFleetComplete', () => {
  it('is false until all five kinds are placed', () => {
    let fleet: Fleet = []
    expect(isFleetComplete(fleet)).toBe(false)
    FLEET_KINDS.forEach((kind, i) => {
      fleet = placeShip(fleet, { kind, bow: { row: i * 2, col: 0 }, orientation: 'horizontal' })
    })
    expect(isFleetComplete(fleet)).toBe(true)
  })
})

describe('randomFleet', () => {
  it('always produces a complete, valid fleet of 17 cells', () => {
    for (let i = 0; i < 200; i++) {
      const fleet = randomFleet()
      expect(isFleetComplete(fleet)).toBe(true)
      const cells = fleet.flatMap((ship) => ship.cells)
      expect(cells).toHaveLength(17)
      expect(cells.every(isInsideBoard)).toBe(true)
      expect(new Set(cells.map(coordKey)).size).toBe(17)
    }
  })

  it('is deterministic for a fixed random source', () => {
    const makeRng = (seed = 42) => {
      let state = seed
      return () => {
        state = (state * 1664525 + 1013904223) % 4294967296
        return state / 4294967296
      }
    }
    expect(randomFleet(makeRng())).toEqual(randomFleet(makeRng()))
  })
})
