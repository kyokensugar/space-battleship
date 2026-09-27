import { coordKey } from './board'
import type { Coord, Fleet, Ship, ShipKind } from './types'

export type ShotOutcome = 'miss' | 'hit' | 'sunk'

export type ShotRecord = {
  target: Coord
  outcome: ShotOutcome
}

export type Side = {
  fleet: Fleet
  shotsReceived: ShotRecord[]
}

export type ShotResult = {
  side: Side
  outcome: ShotOutcome
  sunkShip?: ShipKind
}

export function hasBeenShot(side: Side, target: Coord): boolean {
  const key = coordKey(target)
  return side.shotsReceived.some((shot) => coordKey(shot.target) === key)
}

export function shipAt(fleet: Fleet, target: Coord): Ship | undefined {
  const key = coordKey(target)
  return fleet.find((ship) => ship.cells.some((cell) => coordKey(cell) === key))
}

export function isShipSunk(side: Side, ship: Ship): boolean {
  const hitKeys = new Set(side.shotsReceived.map((shot) => coordKey(shot.target)))
  return ship.cells.every((cell) => hitKeys.has(coordKey(cell)))
}

export function remainingCells(side: Side): number {
  const hitKeys = new Set(side.shotsReceived.map((shot) => coordKey(shot.target)))
  return side.fleet.flatMap((ship) => ship.cells).filter((cell) => !hitKeys.has(coordKey(cell))).length
}

export function isFleetDestroyed(side: Side): boolean {
  return remainingCells(side) === 0
}

export function shoot(side: Side, target: Coord): ShotResult {
  if (hasBeenShot(side, target)) {
    throw new Error(`Cell already shot: ${coordKey(target)}`)
  }

  const ship = shipAt(side.fleet, target)
  if (!ship) {
    return {
      side: { ...side, shotsReceived: [...side.shotsReceived, { target, outcome: 'miss' }] },
      outcome: 'miss',
    }
  }

  const provisional: Side = {
    ...side,
    shotsReceived: [...side.shotsReceived, { target, outcome: 'hit' }],
  }
  if (!isShipSunk(provisional, ship)) {
    return { side: provisional, outcome: 'hit' }
  }

  return {
    side: { ...side, shotsReceived: [...side.shotsReceived, { target, outcome: 'sunk' }] },
    outcome: 'sunk',
    sunkShip: ship.kind,
  }
}
