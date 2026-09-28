import { coordKey, shipCells } from '../board'
import { hasBeenShot, isShipSunk, type Side } from '../shoot'
import { BOARD_SIZE, SHIP_LENGTHS, type Coord, type Orientation, type ShipKind } from '../types'
import type { AiStrategy } from './index'
import { activeHits } from './normal'

/** Extra weight for placements that explain an existing hit on an unsunk ship. */
const HIT_BONUS = 50

/** Kinds still afloat. Announced on sinking, so public information. */
export function remainingKinds(target: Side): ShipKind[] {
  return target.fleet.filter((ship) => !isShipSunk(target, ship)).map((ship) => ship.kind)
}

/**
 * For every unshot cell, count how many legal placements of the remaining ships cover it.
 * A placement is legal if it avoids misses and sunk ships; covering an active hit is rewarded.
 */
export function probabilityMap(target: Side): number[][] {
  const map: number[][] = Array.from({ length: BOARD_SIZE }, () => Array<number>(BOARD_SIZE).fill(0))
  const hits = new Set(activeHits(target).map(coordKey))
  const blocked = new Set(
    target.shotsReceived.map((shot) => coordKey(shot.target)).filter((key) => !hits.has(key)),
  )

  for (const kind of remainingKinds(target)) {
    const length = SHIP_LENGTHS[kind]
    for (const orientation of ['horizontal', 'vertical'] as Orientation[]) {
      const maxRow = orientation === 'vertical' ? BOARD_SIZE - length : BOARD_SIZE - 1
      const maxCol = orientation === 'horizontal' ? BOARD_SIZE - length : BOARD_SIZE - 1
      for (let row = 0; row <= maxRow; row++) {
        for (let col = 0; col <= maxCol; col++) {
          const cells = shipCells({ kind, bow: { row, col }, orientation })
          if (cells.some((c) => blocked.has(coordKey(c)))) continue
          const covered = cells.filter((c) => hits.has(coordKey(c))).length
          const weight = 1 + covered * HIT_BONUS
          for (const c of cells) {
            if (!hits.has(coordKey(c))) map[c.row][c.col] += weight
          }
        }
      }
    }
  }
  return map
}

/** Shoots the unshot cell most likely to hold a ship; ties are broken randomly. */
export const hardAi: AiStrategy = (target, rng = Math.random) => {
  const map = probabilityMap(target)
  let best = -1
  let candidates: Coord[] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const coord = { row, col }
      if (hasBeenShot(target, coord)) continue
      const score = map[row][col]
      if (score > best) {
        best = score
        candidates = [coord]
      } else if (score === best) {
        candidates.push(coord)
      }
    }
  }
  if (candidates.length === 0) throw new Error('No cells left to shoot')
  return candidates[Math.floor(rng() * candidates.length)]
}
