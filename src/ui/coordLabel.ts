import type { Coord } from '../game/types'

export const COLUMN_LABELS = 'ABCDEFGHIJ'

export function coordLabel({ row, col }: Coord): string {
  return `${COLUMN_LABELS[col]}${row + 1}`
}
