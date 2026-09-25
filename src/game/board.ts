import {
  BOARD_SIZE,
  FLEET_KINDS,
  SHIP_LENGTHS,
  type Coord,
  type Fleet,
  type Orientation,
  type Ship,
  type ShipPlacement,
} from './types'

export function coordKey({ row, col }: Coord): string {
  return `${row},${col}`
}

export function isInsideBoard({ row, col }: Coord): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

export function shipCells({ kind, bow, orientation }: ShipPlacement): Coord[] {
  const length = SHIP_LENGTHS[kind]
  return Array.from({ length }, (_, i) =>
    orientation === 'horizontal'
      ? { row: bow.row, col: bow.col + i }
      : { row: bow.row + i, col: bow.col },
  )
}

export type PlacementError = 'out_of_bounds' | 'overlap' | 'duplicate_kind'

export function validatePlacement(fleet: Fleet, placement: ShipPlacement): PlacementError | null {
  if (fleet.some((ship) => ship.kind === placement.kind)) return 'duplicate_kind'

  const cells = shipCells(placement)
  if (!cells.every(isInsideBoard)) return 'out_of_bounds'

  const occupied = new Set(fleet.flatMap((ship) => ship.cells.map(coordKey)))
  if (cells.some((cell) => occupied.has(coordKey(cell)))) return 'overlap'

  return null
}

export function placeShip(fleet: Fleet, placement: ShipPlacement): Fleet {
  const error = validatePlacement(fleet, placement)
  if (error) throw new Error(`Invalid placement (${error}): ${placement.kind}`)
  const ship: Ship = { ...placement, cells: shipCells(placement) }
  return [...fleet, ship]
}

export function isFleetComplete(fleet: Fleet): boolean {
  return FLEET_KINDS.every((kind) => fleet.some((ship) => ship.kind === kind))
}

export type Rng = () => number

export function randomFleet(rng: Rng = Math.random): Fleet {
  let fleet: Fleet = []
  for (const kind of FLEET_KINDS) {
    for (;;) {
      const orientation: Orientation = rng() < 0.5 ? 'horizontal' : 'vertical'
      const bow: Coord = {
        row: Math.floor(rng() * BOARD_SIZE),
        col: Math.floor(rng() * BOARD_SIZE),
      }
      const placement: ShipPlacement = { kind, bow, orientation }
      if (validatePlacement(fleet, placement) === null) {
        fleet = placeShip(fleet, placement)
        break
      }
    }
  }
  return fleet
}
