export const BOARD_SIZE = 10

export type Coord = { row: number; col: number }

export type Orientation = 'horizontal' | 'vertical'

export type ShipKind = 'flagship' | 'battleship' | 'cruiser' | 'destroyer' | 'scout'

export const SHIP_LENGTHS: Record<ShipKind, number> = {
  flagship: 5,
  battleship: 4,
  cruiser: 3,
  destroyer: 3,
  scout: 2,
}

export const FLEET_KINDS: readonly ShipKind[] = [
  'flagship',
  'battleship',
  'cruiser',
  'destroyer',
  'scout',
]

export type ShipPlacement = {
  kind: ShipKind
  bow: Coord
  orientation: Orientation
}

export type Ship = ShipPlacement & {
  cells: Coord[]
}

export type Fleet = Ship[]
