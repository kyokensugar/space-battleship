import { useI18n } from '../i18n/context'
import './Captain.css'

export type Mood = 'normal' | 'happy' | 'sad'
export type Speaker = 'human' | 'alien'

const FACES: Record<Speaker, Record<Mood, string>> = {
  human: {
    normal: `${import.meta.env.BASE_URL}images/captain-normal.png`,
    happy: `${import.meta.env.BASE_URL}images/captain-happy.png`,
    sad: `${import.meta.env.BASE_URL}images/captain-sad.png`,
  },
  alien: {
    normal: `${import.meta.env.BASE_URL}images/alien-normal.png`,
    happy: `${import.meta.env.BASE_URL}images/alien-happy.png`,
    sad: `${import.meta.env.BASE_URL}images/alien-sad.png`,
  },
}

type Props = {
  speaker?: Speaker
  mood: Mood
  line: string
  /** Changing this replays the bubble's entrance animation. */
  lineKey?: string | number
  className?: string
}

/** A commander portrait plus a speech bubble. The alien version is mirrored (portrait on the right). */
export function Captain({ speaker = 'human', mood, line, lineKey, className = '' }: Props) {
  const { t } = useI18n()
  const name = speaker === 'human' ? t.captain.name : t.alienCaptain.name
  return (
    <div className={`captain ${speaker} ${mood} ${className}`} data-testid={speaker === 'human' ? 'captain' : 'alien-captain'}>
      <img className="captain-face" src={FACES[speaker][mood]} width={256} height={256} alt={name} />
      <p key={lineKey} className="captain-bubble">
        {line}
      </p>
    </div>
  )
}
