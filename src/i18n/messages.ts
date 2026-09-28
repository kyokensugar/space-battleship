import type { Difficulty } from '../game/ai/index'
import type { Player } from '../game/rules'
import type { Orientation, ShipKind } from '../game/types'

export type Language = 'ja' | 'en'

export const LANGUAGES: readonly Language[] = ['ja', 'en']

export type Messages = {
  languageName: string
  title: string
  intro: string
  story: string
  difficulty: string
  difficultyNames: Record<Difficulty, string>
  difficultyDescriptions: Record<Difficulty, string>
  start: string
  shipNames: Record<ShipKind, string>
  alienShipNames: Record<ShipKind, string>
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
    sunkEnemy: (ship: string) => string
    sunkOwn: (ship: string) => string
    toResult: string
  }
  sound: { mute: string; unmute: string }
  captain: {
    name: string
    deploy: string
    deployReady: string
    aim: string
    waiting: string
    playerHit: string
    playerMiss: string
    playerSunk: (ship: string) => string
    enemyHit: string
    enemyMiss: string
    enemySunk: (ship: string) => string
    win: string
    lose: string
  }
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
  intro: '人類艦隊 vs エイリアン艦隊。暗黒の宙域に潜む敵をすべて撃沈せよ。',
  story:
    '西暦 2417 年。太陽系の外縁に、未知のエイリアン艦隊が姿を現した。互いの位置は分からない。頼れるのは砲撃の手応えだけ。人類最後の艦隊の指揮官として、宙域を制圧せよ。',
  difficulty: '難易度',
  difficultyNames: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  difficultyDescriptions: {
    easy: 'エイリアンは手当たり次第に撃ってくる',
    normal: '一度当てると周囲を執拗に追撃してくる',
    hard: '艦の位置を確率で読み、最も怪しい場所を撃つ',
  },
  start: '出撃準備へ',
  shipNames: { flagship: '旗艦', battleship: '戦艦', cruiser: '巡洋艦', destroyer: '駆逐艦', scout: '偵察艇' },
  alienShipNames: { flagship: '母船', battleship: '巨獣船', cruiser: '襲撃船', destroyer: '寄生艇', scout: '斥候虫' },
  who: { player: 'あなた', ai: 'エイリアン' },
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
    enemySector: 'エイリアン宙域',
    enemyFleet: 'エイリアン艦隊',
    ownFleet: '人類艦隊',
    yourTurn: 'あなたの番: エイリアン宙域をクリックして砲撃',
    aiTurn: 'エイリアンの番…',
    win: '勝利! エイリアン艦隊を全滅させた',
    lose: '敗北… 自艦隊が全滅した',
    log: (turn) => `戦況ログ(第 ${turn} 手)`,
    shot: (who, coord) => `${who}が ${coord} を砲撃 → `,
    miss: 'ミス',
    hit: 'ヒット!',
    sunk: (ship) => `${ship}を撃沈!!`,
    sunkEnemy: (ship) => `エイリアンの${ship}を撃沈!`,
    sunkOwn: (ship) => `${ship}が撃沈された…`,
    toResult: '結果へ',
  },
  sound: { mute: '音を消す', unmute: '音を出す' },
  captain: {
    name: '艦長',
    deploy: '人類艦隊の配置を決定せよ!',
    deployReady: '全艦、配置完了。いざ出撃!!',
    aim: 'エイリアン宙域を狙え。座標を選べ!',
    waiting: '敵の砲撃が来る… 全艦、衝撃に備えよ!',
    playerHit: 'いいぞ! その調子だ!',
    playerMiss: '外れたか… 落ち着いて次を狙え。',
    playerSunk: (ship) => `相手の${ship}を沈めたぞ!`,
    enemyHit: '被弾! 持ちこたえろ!',
    enemyMiss: '敵の砲撃は外れた。反撃だ!',
    enemySunk: (ship) => `こちらの${ship}がやられてしまった…`,
    win: '勝ったぞ! 太陽系は守られた!',
    lose: '……全滅か。だが、人類はまだ終わらん。',
  },
  result: {
    win: '勝利!',
    lose: '敗北…',
    winDetail: 'エイリアン艦隊を全滅させた。太陽系は守られた。',
    loseDetail: '人類艦隊は全滅した。次は勝とう。',
    again: 'もう一度',
  },
}

const en: Messages = {
  languageName: 'English',
  title: 'Space Battleship',
  intro: 'Human fleet vs alien fleet. Sink every enemy lurking in the dark.',
  story:
    'Year 2417. An unknown alien armada has appeared at the edge of the solar system. Neither side can see the other; only the feedback of each shot tells you where they hide. As commander of the last human fleet, take control of the sector.',
  difficulty: 'Difficulty',
  difficultyNames: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  difficultyDescriptions: {
    easy: 'The aliens fire at random',
    normal: 'After a hit they hunt the surrounding cells',
    hard: 'They read ship probabilities and fire at the likeliest cell',
  },
  start: 'Prepare for sortie',
  shipNames: { flagship: 'Flagship', battleship: 'Battleship', cruiser: 'Cruiser', destroyer: 'Destroyer', scout: 'Scout' },
  alienShipNames: { flagship: 'Mothership', battleship: 'Leviathan', cruiser: 'Raider', destroyer: 'Parasite', scout: 'Drone' },
  who: { player: 'You', ai: 'Aliens' },
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
    enemySector: 'Alien sector',
    enemyFleet: 'Alien fleet',
    ownFleet: 'Human fleet',
    yourTurn: 'Your turn: click the alien sector to fire',
    aiTurn: "Aliens' turn…",
    win: 'Victory! Alien fleet destroyed',
    lose: 'Defeat… Your fleet was destroyed',
    log: (turn) => `Battle log (shot ${turn})`,
    shot: (who, coord) => `${who} fired at ${coord} → `,
    miss: 'Miss',
    hit: 'Hit!',
    sunk: (ship) => `${ship} sunk!!`,
    sunkEnemy: (ship) => `Alien ${ship} sunk!`,
    sunkOwn: (ship) => `Your ${ship} was sunk…`,
    toResult: 'Results',
  },
  sound: { mute: 'Mute sound', unmute: 'Unmute sound' },
  captain: {
    name: 'Captain',
    deploy: 'Commander, position the human fleet!',
    deployReady: 'All ships in position. Sortie!!',
    aim: 'Target the alien sector. Pick your coordinates!',
    waiting: 'Incoming fire… all hands, brace for impact!',
    playerHit: 'Good shot! Keep it up!',
    playerMiss: 'A miss… steady now, aim again.',
    playerSunk: (ship) => `We took down their ${ship}!`,
    enemyHit: "We're hit! Hold together!",
    enemyMiss: 'Their shot went wide. Return fire!',
    enemySunk: (ship) => `We lost our ${ship}…`,
    win: 'We did it! The solar system is safe!',
    lose: '…Fleet lost. But humanity is not finished yet.',
  },
  result: {
    win: 'Victory!',
    lose: 'Defeat…',
    winDetail: 'You destroyed the alien fleet. The solar system is safe.',
    loseDetail: 'The human fleet was destroyed. Win the next one.',
    again: 'Play again',
  },
}

export const MESSAGES: Record<Language, Messages> = { ja, en }
