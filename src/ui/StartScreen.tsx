import { DIFFICULTIES, type Difficulty } from '../game/ai/index'
import { useI18n } from '../i18n/context'
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
      <div className="hero">
        <img
          className="hero-image"
          src={`${import.meta.env.BASE_URL}images/opening.webp`}
          width={1800}
          height={595}
          alt=""
        />
        <div className="hero-logo" aria-hidden="true">
          <span className="hero-logo-top">SPACE</span>
          <span className="hero-logo-bottom">BATTLESHIP</span>
        </div>
      </div>
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
