import type { ShipKind } from '../game/types'

export const SHIP_NAMES: Record<ShipKind, string> = {
  flagship: '旗艦',
  battleship: '戦艦',
  cruiser: '巡洋艦',
  destroyer: '駆逐艦',
  scout: '偵察艇',
}
