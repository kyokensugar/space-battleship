import { coordKey, randomFleet } from '../board'
import { shoot, type Side } from '../shoot'
import { easyAi, unshotCells } from './easy'

const freshTarget = (): Side => ({ fleet: randomFleet(), shotsReceived: [] })

describe('unshotCells', () => {
  it('lists all 100 cells on an untouched board', () => {
    expect(unshotCells(freshTarget())).toHaveLength(100)
  })

  it('excludes cells that have already been shot', () => {
    const { side } = shoot(freshTarget(), { row: 4, col: 4 })
    const cells = unshotCells(side)
    expect(cells).toHaveLength(99)
    expect(cells.some((c) => c.row === 4 && c.col === 4)).toBe(false)
  })
})

describe('easyAi', () => {
  it('always picks a cell inside the board that has not been shot yet', () => {
    let side = freshTarget()
    for (let i = 0; i < 100; i++) {
      const pick = easyAi(side)
      expect(pick.row).toBeGreaterThanOrEqual(0)
      expect(pick.row).toBeLessThan(10)
      expect(pick.col).toBeGreaterThanOrEqual(0)
      expect(pick.col).toBeLessThan(10)
      side = shoot(side, pick).side
    }
    expect(side.shotsReceived).toHaveLength(100)
    expect(new Set(side.shotsReceived.map((s) => coordKey(s.target))).size).toBe(100)
  })

  it('throws when the board is fully shot', () => {
    let side = freshTarget()
    for (let i = 0; i < 100; i++) side = shoot(side, easyAi(side)).side
    expect(() => easyAi(side)).toThrow(/No cells left/)
  })

  it('is deterministic for a fixed random source', () => {
    const side = freshTarget()
    expect(easyAi(side, () => 0)).toEqual({ row: 0, col: 0 })
    expect(easyAi(side, () => 0.999)).toEqual({ row: 9, col: 9 })
  })
})
