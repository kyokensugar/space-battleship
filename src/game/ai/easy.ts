import { hasBeenShot } from '../shoot'
import type { Side } from '../shoot'
import { BOARD_SIZE, type Coord } from '../types'
import type { AiStrategy } from './index'

export function unshotCells(target: Side): Coord[] {
  const cells: Coord[] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const coord = { row, col }
      if (!hasBeenShot(target, coord)) cells.push(coord)
    }
  }
  return cells
}

export const easyAi: AiStrategy = (target, rng = Math.random) => {
  const candidates = unshotCells(target)
  if (candidates.length === 0) throw new Error('No cells left to shoot')
  return candidates[Math.floor(rng() * candidates.length)]
}
