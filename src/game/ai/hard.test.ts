import { placeShip, randomFleet } from '../board'
import { shoot, type Side } from '../shoot'
import { FLEET_KINDS, type Coord, type Fleet } from '../types'
import { easyAi } from './easy'
import { hardAi, probabilityMap, remainingKinds } from './hard'
import { normalAi } from './normal'

const rowFleet: Fleet = FLEET_KINDS.reduce<Fleet>(
  (fleet, kind, row) => placeShip(fleet, { kind, bow: { row: row * 2, col: 2 }, orientation: 'horizontal' }),
  [],
)

const withShots = (targets: Coord[]): Side =>
  targets.reduce<Side>((side, t) => shoot(side, t).side, { fleet: rowFleet, shotsReceived: [] })

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const shotsToDestroy = (ai: typeof hardAi, fleet: Fleet, rng: () => number) => {
  let side: Side = { fleet, shotsReceived: [] }
  let shots = 0
  while (side.fleet.some((ship) => ship.cells.some((c) => !side.shotsReceived.some((s) => s.target.row === c.row && s.target.col === c.col)))) {
    side = shoot(side, ai(side, rng)).side
    shots++
  }
  return shots
}

describe('hardAi', () => {
  it('prefers the centre of an empty board (more placements cover it)', () => {
    const map = probabilityMap({ fleet: rowFleet, shotsReceived: [] })
    expect(map[4][4]).toBeGreaterThan(map[0][0])
    expect(map[0][0]).toBe(map[9][9])
  })

  it('gives shot cells no weight and never re-shoots them', () => {
    const side = withShots([{ row: 9, col: 9 }])
    expect(probabilityMap(side)[9][9]).toBe(0)
    let s = side
    for (let i = 0; i < 99; i++) s = shoot(s, hardAi(s)).side
    expect(s.shotsReceived).toHaveLength(100)
    expect(() => hardAi(s)).toThrow(/No cells left/)
  })

  it('hunts next to an unsunk hit', () => {
    const side = withShots([{ row: 4, col: 3 }])
    const pick = hardAi(side, () => 0)
    const adjacent = Math.abs(pick.row - 4) + Math.abs(pick.col - 3) === 1
    expect(adjacent).toBe(true)
  })

  it('drops sunk ships from the remaining list', () => {
    const side = withShots([{ row: 8, col: 2 }, { row: 8, col: 3 }])
    expect(remainingKinds(side)).toEqual(['flagship', 'battleship', 'cruiser', 'destroyer'])
  })

  it('beats both Easy and Normal on average', () => {
    let easy = 0
    let normal = 0
    let hard = 0
    for (let i = 0; i < 30; i++) {
      const fleet = randomFleet(seeded(i))
      easy += shotsToDestroy(easyAi, fleet, seeded(1000 + i))
      normal += shotsToDestroy(normalAi, fleet, seeded(1000 + i))
      hard += shotsToDestroy(hardAi, fleet, seeded(1000 + i))
    }
    expect(hard).toBeLessThan(normal)
    expect(hard).toBeLessThan(easy * 0.6)
  })
})
