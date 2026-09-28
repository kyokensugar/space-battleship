import { useSound } from './context'
import { useI18n } from '../i18n/context'

export function MuteButton() {
  const { muted, setMuted } = useSound()
  const { t } = useI18n()
  return (
    <button
      type="button"
      className="mute-button"
      aria-pressed={muted}
      aria-label={muted ? t.sound.unmute : t.sound.mute}
      title={muted ? t.sound.unmute : t.sound.mute}
      onClick={() => setMuted(!muted)}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
