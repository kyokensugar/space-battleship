import { coordKey, isInsideBoard } from '../board'
import { hasBeenShot, isShipSunk, shipAt, type Side } from '../shoot'
import type { Coord } from '../types'
import { easyAi } from './easy'
import type { AiStrategy } from './index'

const DIRECTIONS: Coord[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
]

/** Hits on ships that are not yet sunk. Sunk status is public information (announced with the shot). */
export function activeHits(target: Side): Coord[] {
  return target.shotsReceived
    .filter((shot) => shot.outcome !== 'miss')
    .map((shot) => shot.target)
    .filter((cell) => {
      const ship = shipAt(target.fleet, cell)
      return ship !== undefined && !isShipSunk(target, ship)
    })
}

function shootable(target: Side, cell: Coord): boolean {
  return isInsideBoard(cell) && !hasBeenShot(target, cell)
}

/** Walk from `from` in `dir` over active hits; return the first cell past them. */
function extend(from: Coord, dir: Coord, hitKeys: Set<string>): Coord {
  let cell = from
  while (hitKeys.has(coordKey({ row: cell.row + dir.row, col: cell.col + dir.col }))) {
    cell = { row: cell.row + dir.row, col: cell.col + dir.col }
  }
  return { row: cell.row + dir.row, col: cell.col + dir.col }
}

/** Candidate cells to finish off a damaged ship: line ends if two hits align, else neighbours. */
export function huntCandidates(target: Side): Coord[] {
  const hits = activeHits(target)
  if (hits.length === 0) return []
  const hitKeys = new Set(hits.map(coordKey))

  const lineEnds: Coord[] = []
  for (const hit of hits) {
    for (const dir of DIRECTIONS) {
      const next = { row: hit.row + dir.row, col: hit.col + dir.col }
      if (hitKeys.has(coordKey(next))) {
        lineEnds.push(extend(hit, dir, hitKeys), extend(hit, { row: -dir.row, col: -dir.col }, hitKeys))
      }
    }
  }
  const validEnds = dedupe(lineEnds).filter((cell) => shootable(target, cell))
  if (validEnds.length > 0) return validEnds

  const neighbours = hits.flatMap((hit) =>
    DIRECTIONS.map((dir) => ({ row: hit.row + dir.row, col: hit.col + dir.col })),
  )
  return dedupe(neighbours).filter((cell) => shootable(target, cell))
}

function dedupe(cells: Coord[]): Coord[] {
  const seen = new Set<string>()
  return cells.filter((cell) => {
    const key = coordKey(cell)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Random search until a hit, then hunt along the damaged ship. */
export const normalAi: AiStrategy = (target, rng = Math.random) => {
  const candidates = huntCandidates(target)
  if (candidates.length === 0) return easyAi(target, rng)
  return candidates[Math.floor(rng() * candidates.length)]
}
