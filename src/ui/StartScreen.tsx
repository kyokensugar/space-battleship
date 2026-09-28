import { DIFFICULTIES, type Difficulty } from '../game/ai/index'
import { useI18n } from '../i18n/context'
import { HeroScene } from './HeroScene'
import './StartScreen.css'

type Props = {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onStart: () => void
}

export function StartScreen({ difficulty, onDifficultyChange, onStart }: Props) {
  const { t } = useI18n()
  return (
    <section className="start">
      <HeroScene />
      <div className="start-copy">
        <p className="start-tagline">{t.intro}</p>
        <p className="start-story">{t.story}</p>
      </div>
      <fieldset className="difficulty">
        <legend>{t.difficulty}</legend>
        <div className="difficulty-cards">
          {DIFFICULTIES.map((d) => (
            <label key={d} className={`difficulty-card ${difficulty === d ? 'selected' : ''}`}>
              <input
                type="radio"
                name="difficulty"
                value={d}
                checked={difficulty === d}
                aria-label={t.difficultyNames[d]}
                onChange={() => onDifficultyChange(d)}
              />
              <span className="difficulty-name">{t.difficultyNames[d]}</span>
              <span className="difficulty-desc">{t.difficultyDescriptions[d]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="button" className="primary start-button" onClick={onStart}>
        {t.start}
      </button>
    </section>
  )
}
