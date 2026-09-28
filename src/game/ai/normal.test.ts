import { placeShip, randomFleet } from '../board'
import { shoot, type Side } from '../shoot'
import { FLEET_KINDS, type Coord, type Fleet } from '../types'
import { easyAi } from './easy'
import { activeHits, huntCandidates, normalAi } from './normal'

const rowFleet: Fleet = FLEET_KINDS.reduce<Fleet>(
  (fleet, kind, row) => placeShip(fleet, { kind, bow: { row: row * 2, col: 2 }, orientation: 'horizontal' }),
  [],
)

const withShots = (targets: Coord[]): Side =>
  targets.reduce<Side>((side, t) => shoot(side, t).side, { fleet: rowFleet, shotsReceived: [] })

const keys = (cells: Coord[]) => cells.map((c) => `${c.row},${c.col}`).sort()

/** Seeded LCG so both AIs face identical randomness. */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const shotsToDestroy = (ai: typeof normalAi, fleet: Fleet, rng: () => number) => {
  let side: Side = { fleet, shotsReceived: [] }
  let shots = 0
  while (side.fleet.some((ship) => ship.cells.some((c) => !side.shotsReceived.some((s) => s.target.row === c.row && s.target.col === c.col)))) {
    side = shoot(side, ai(side, rng)).side
    shots++
  }
  return shots
}

describe('normalAi', () => {
  it('searches randomly when nothing has been hit', () => {
    expect(huntCandidates(withShots([{ row: 9, col: 9 }]))).toEqual([])
    expect(normalAi(withShots([]), () => 0)).toEqual(easyAi(withShots([]), () => 0))
  })

  it('targets the four neighbours after a single hit', () => {
    const side = withShots([{ row: 4, col: 3 }])
    expect(keys(huntCandidates(side))).toEqual(keys([
      { row: 3, col: 3 },
      { row: 5, col: 3 },
      { row: 4, col: 2 },
      { row: 4, col: 4 },
    ]))
  })

  it('follows the line once two hits are adjacent', () => {
    const side = withShots([{ row: 2, col: 3 }, { row: 2, col: 4 }])
    expect(keys(huntCandidates(side))).toEqual(keys([{ row: 2, col: 2 }, { row: 2, col: 5 }]))
  })

  it('does not shoot past a miss at the end of a line', () => {
    const side = withShots([{ row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 5 }])
    expect(keys(huntCandidates(side))).toEqual(keys([{ row: 4, col: 2 }]))
  })

  it('never picks a shot cell and stops hunting once the ship is sunk', () => {
    const side = withShots([{ row: 8, col: 2 }, { row: 8, col: 3 }])
    expect(activeHits(side)).toEqual([])
    expect(huntCandidates(side)).toEqual([])
  })

  it('ignores line ends that fall off the board', () => {
    const side = withShots([{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 0, col: 5 }, { row: 0, col: 6 }, { row: 0, col: 1 }])
    expect(activeHits(side)).toEqual([])
  })

  it('destroys a fleet in noticeably fewer shots than the easy AI on average', () => {
    let easyTotal = 0
    let normalTotal = 0
    for (let i = 0; i < 40; i++) {
      const fleet = randomFleet(seeded(i))
      easyTotal += shotsToDestroy(easyAi, fleet, seeded(1000 + i))
      normalTotal += shotsToDestroy(normalAi, fleet, seeded(1000 + i))
    }
    expect(normalTotal).toBeLessThan(easyTotal * 0.8)
    expect(normalTotal / 40).toBeLessThanOrEqual(100)
  })
})
