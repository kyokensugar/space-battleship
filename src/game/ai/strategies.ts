import { easyAi } from './easy'
import { hardAi } from './hard'
import type { AiStrategy, Difficulty } from './index'
import { normalAi } from './normal'

export const AI_STRATEGIES: Record<Difficulty, AiStrategy> = {
  easy: easyAi,
  normal: normalAi,
  hard: hardAi,
}
