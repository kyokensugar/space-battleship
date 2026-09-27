import { BOARD_SIZE, type Coord } from '../game/types'
import { COLUMN_LABELS, coordLabel } from './coordLabel'
import './Grid.css'

export type CellState = 'empty' | 'ship' | 'preview-ok' | 'preview-bad' | 'miss' | 'hit' | 'sunk'

type Props = {
  label: string
  cellState: (coord: Coord) => CellState
  onCellClick?: (coord: Coord) => void
  onCellHover?: (coord: Coord | null) => void
  disabled?: boolean
}

export function Grid({ label, cellState, onCellClick, onCellHover, disabled }: Props) {
  const indices = Array.from({ length: BOARD_SIZE }, (_, i) => i)
  return (
    <div className="grid" role="grid" aria-label={label} onMouseLeave={() => onCellHover?.(null)}>
      <div className="grid-corner" />
      {indices.map((col) => (
        <div key={`c${col}`} className="grid-header">
          {COLUMN_LABELS[col]}
        </div>
      ))}
      {indices.map((row) => (
        <div key={`r${row}`} className="grid-row" role="row">
          <div className="grid-header">{row + 1}</div>
          {indices.map((col) => {
            const coord = { row, col }
            const state = cellState(coord)
            return (
              <button
                key={col}
                type="button"
                role="gridcell"
                className={`cell cell-${state}`}
                aria-label={`${label} ${coordLabel(coord)} ${state}`}
                disabled={disabled}
                onClick={() => onCellClick?.(coord)}
                onMouseEnter={() => onCellHover?.(coord)}
                onFocus={() => onCellHover?.(coord)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
