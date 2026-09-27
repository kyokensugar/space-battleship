import { useState } from 'react'
import { coordKey, isFleetComplete, placeShip, randomFleet, shipCells, validatePlacement } from '../game/board'
import { FLEET_KINDS, SHIP_LENGTHS, type Coord, type Fleet, type Orientation, type ShipKind } from '../game/types'
import { Grid, type CellState } from './Grid'
import { SHIP_NAMES } from './shipNames'
import './PlacementScreen.css'

type Props = {
  onComplete: (fleet: Fleet) => void
}

export function PlacementScreen({ onComplete }: Props) {
  const [fleet, setFleet] = useState<Fleet>([])
  const [orientation, setOrientation] = useState<Orientation>('horizontal')
  const [hover, setHover] = useState<Coord | null>(null)

  const nextKind: ShipKind | undefined = FLEET_KINDS.find((kind) => !fleet.some((ship) => ship.kind === kind))
  const complete = isFleetComplete(fleet)

  const preview = nextKind && hover ? { kind: nextKind, bow: hover, orientation } : null
  const previewError = preview ? validatePlacement(fleet, preview) : null
  const previewKeys = new Set(preview ? shipCells(preview).map(coordKey) : [])
  const shipKeys = new Set(fleet.flatMap((ship) => ship.cells.map(coordKey)))

  const cellState = (coord: Coord): CellState => {
    const key = coordKey(coord)
    if (shipKeys.has(key)) return 'ship'
    if (previewKeys.has(key)) return previewError ? 'preview-bad' : 'preview-ok'
    return 'empty'
  }

  const handleClick = (coord: Coord) => {
    if (!nextKind) return
    const placement = { kind: nextKind, bow: coord, orientation }
    if (validatePlacement(fleet, placement) === null) {
      setFleet(placeShip(fleet, placement))
    }
  }

  return (
    <section className="placement">
      <h2>艦隊を配置</h2>
      <div className="placement-body">
        <Grid label="自分の宙域" cellState={cellState} onCellClick={handleClick} onCellHover={setHover} />
        <aside className="placement-panel">
          <ul className="ship-list">
            {FLEET_KINDS.map((kind) => {
              const placed = fleet.some((ship) => ship.kind === kind)
              const current = kind === nextKind
              return (
                <li key={kind} className={current ? 'current' : placed ? 'placed' : ''}>
                  {SHIP_NAMES[kind]}({SHIP_LENGTHS[kind]}マス){placed ? ' ✓' : current ? ' ←' : ''}
                </li>
              )
            })}
          </ul>
          <p className="hint">
            {nextKind
              ? `${SHIP_NAMES[nextKind]}を置く位置をクリック(向き: ${orientation === 'horizontal' ? '横' : '縦'})`
              : '配置完了!'}
          </p>
          <div className="placement-actions">
            <button type="button" onClick={() => setOrientation((o) => (o === 'horizontal' ? 'vertical' : 'horizontal'))}>
              向きを変える
            </button>
            <button type="button" onClick={() => setFleet(randomFleet())}>
              ランダム配置
            </button>
            <button type="button" onClick={() => setFleet([])} disabled={fleet.length === 0}>
              やり直す
            </button>
            <button type="button" className="primary" disabled={!complete} onClick={() => onComplete(fleet)}>
              出撃
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
