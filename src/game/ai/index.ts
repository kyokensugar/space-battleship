import type { Rng } from '../board'
import type { Side } from '../shoot'
import type { Coord } from '../types'

export type Difficulty = 'easy'

/** Chooses where to shoot next, given the opponent's side as seen by the AI. */
export type AiStrategy = (target: Side, rng?: Rng) => Coord
