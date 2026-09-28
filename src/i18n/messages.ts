import type { Difficulty } from '../game/ai/index'
import type { Player } from '../game/rules'
import type { Orientation, ShipKind } from '../game/types'

export type Language = 'ja' | 'en'

export const LANGUAGES: readonly Language[] = ['ja', 'en']

export type Messages = {
  languageName: string
  title: string
  intro: string
  difficulty: string
  difficultyNames: Record<Difficulty, string>
  start: string
  shipNames: Record<ShipKind, string>
  who: Record<Player, string>
  orientation: Record<Orientation, string>
  placement: {
    heading: string
    ownSector: string
    cells: (n: number) => string
    hint: (ship: string, orientation: string) => string
    done: string
    rotate: string
    random: string
    reset: string
    sortie: string
  }
  battle: {
    heading: string
    enemySector: string
    enemyFleet: string
    ownFleet: string
    yourTurn: string
    aiTurn: string
    win: string
    lose: string
    log: (turn: number) => string
    shot: (who: string, coord: string) => string
    miss: string
    hit: string
    sunk: (ship: string) => string
    toResult: string
  }
  sound: { mute: string; unmute: string }
  result: {
    win: string
    lose: string
    winDetail: string
    loseDetail: string
    again: string
  }
}

const ja: Messages = {
  languageName: '日本語',
  title: 'Space Battleship',
  intro: 'AI 艦隊との一騎打ち。相手の艦をすべて撃沈せよ。',
  difficulty: '難易度',
  difficultyNames: {
    easy: 'Easy(ランダム砲撃)',
    normal: 'Normal(ヒット周辺を追撃)',
    hard: 'Hard(確率で狙う)',
  },
  start: 'ゲーム開始',
  shipNames: { flagship: '旗艦', battleship: '戦艦', cruiser: '巡洋艦', destroyer: '駆逐艦', scout: '偵察艇' },
  who: { player: 'あなた', ai: 'AI' },
  orientation: { horizontal: '横', vertical: '縦' },
  placement: {
    heading: '艦隊を配置',
    ownSector: '自分の宙域',
    cells: (n) => `${n}マス`,
    hint: (ship, orientation) => `${ship}を置く位置をクリック(向き: ${orientation})`,
    done: '配置完了!',
    rotate: '向きを変える',
    random: 'ランダム配置',
    reset: 'やり直す',
    sortie: '出撃',
  },
  battle: {
    heading: '戦闘',
    enemySector: '敵の宙域',
    enemyFleet: '敵の残艦',
    ownFleet: '自分の残艦',
    yourTurn: 'あなたの番: 敵宙域をクリックして砲撃',
    aiTurn: 'AI の番…',
    win: '勝利! 敵艦隊を全滅させた',
    lose: '敗北… 自艦隊が全滅した',
    log: (turn) => `戦況ログ(第 ${turn} 手)`,
    shot: (who, coord) => `${who}が ${coord} を砲撃 → `,
    miss: 'ミス',
    hit: 'ヒット!',
    sunk: (ship) => `${ship}を撃沈!!`,
    toResult: '結果へ',
  },
  sound: { mute: '音を消す', unmute: '音を出す' },
  result: {
    win: '勝利!',
    lose: '敗北…',
    winDetail: '敵艦隊を全滅させた。',
    loseDetail: '自艦隊が全滅した。次は勝とう。',
    again: 'もう一度',
  },
}

const en: Messages = {
  languageName: 'English',
  title: 'Space Battleship',
  intro: 'A duel against the AI fleet. Sink every enemy ship.',
  difficulty: 'Difficulty',
  difficultyNames: {
    easy: 'Easy (random fire)',
    normal: 'Normal (hunts around hits)',
    hard: 'Hard (probability targeting)',
  },
  start: 'Start game',
  shipNames: { flagship: 'Flagship', battleship: 'Battleship', cruiser: 'Cruiser', destroyer: 'Destroyer', scout: 'Scout' },
  who: { player: 'You', ai: 'AI' },
  orientation: { horizontal: 'horizontal', vertical: 'vertical' },
  placement: {
    heading: 'Deploy your fleet',
    ownSector: 'Your sector',
    cells: (n) => `${n} cells`,
    hint: (ship, orientation) => `Click where to place the ${ship} (${orientation})`,
    done: 'Fleet deployed!',
    rotate: 'Rotate',
    random: 'Random layout',
    reset: 'Reset',
    sortie: 'Sortie',
  },
  battle: {
    heading: 'Battle',
    enemySector: 'Enemy sector',
    enemyFleet: 'Enemy fleet',
    ownFleet: 'Your fleet',
    yourTurn: 'Your turn: click the enemy sector to fire',
    aiTurn: "AI's turn…",
    win: 'Victory! Enemy fleet destroyed',
    lose: 'Defeat… Your fleet was destroyed',
    log: (turn) => `Battle log (shot ${turn})`,
    shot: (who, coord) => `${who} fired at ${coord} → `,
    miss: 'Miss',
    hit: 'Hit!',
    sunk: (ship) => `${ship} sunk!!`,
    toResult: 'Results',
  },
  sound: { mute: 'Mute sound', unmute: 'Unmute sound' },
  result: {
    win: 'Victory!',
    lose: 'Defeat…',
    winDetail: 'You destroyed the enemy fleet.',
    loseDetail: 'Your fleet was destroyed. Win the next one.',
    again: 'Play again',
  },
}

export const MESSAGES: Record<Language, Messages> = { ja, en }
