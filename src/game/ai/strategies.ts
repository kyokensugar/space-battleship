import { easyAi } from './easy'
import type { AiStrategy, Difficulty } from './index'
import { normalAi } from './normal'

export const AI_STRATEGIES: Record<Difficulty, AiStrategy> = {
  easy: easyAi,
  normal: normalAi,
}
