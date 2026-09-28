import { useI18n } from '../i18n/context'
import './Captain.css'

export type Mood = 'normal' | 'happy' | 'sad'

const CAPTAIN_FACES: Record<Mood, string> = {
  normal: `${import.meta.env.BASE_URL}images/captain-normal.png`,
  happy: `${import.meta.env.BASE_URL}images/captain-happy.png`,
  sad: `${import.meta.env.BASE_URL}images/captain-sad.png`,
}

type Props = {
  mood: Mood
  line: string
  /** Changing this replays the bubble's entrance animation. */
  lineKey?: string | number
}

/** The human fleet's captain: a portrait plus a speech bubble that reacts to the battle. */
export function Captain({ mood, line, lineKey }: Props) {
  const { t } = useI18n()
  return (
    <div className={`captain ${mood}`} data-testid="captain">
      <img className="captain-face" src={CAPTAIN_FACES[mood]} width={256} height={256} alt={t.captain.name} />
      <p key={lineKey} className="captain-bubble">
        {line}
      </p>
    </div>
  )
}
