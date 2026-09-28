export type Track = 'opening' | 'battle'

/** Background music files live in public/music/ and are served relative to the app base path. */
export const TRACK_FILES: Record<Track, string> = {
  opening: `${import.meta.env.BASE_URL}music/opening.mp3`,
  battle: `${import.meta.env.BASE_URL}music/battle.mp3`,
}
