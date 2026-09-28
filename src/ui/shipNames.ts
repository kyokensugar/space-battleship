import type { Difficulty } from '../game/ai/index'
import type { ShipKind } from '../game/types'

export const SHIP_NAMES: Record<ShipKind, string> = {
  flagship: '旗艦',
  battleship: '戦艦',
  cruiser: '巡洋艦',
  destroyer: '駆逐艦',
  scout: '偵察艇',
}

export const DIFFICULTY_NAMES: Record<Difficulty, string> = {
  easy: 'Easy(ランダム砲撃)',
  normal: 'Normal(ヒット周辺を追撃)',
}
