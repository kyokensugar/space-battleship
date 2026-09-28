import { act, fireEvent, render, screen } from '@testing-library/react'
import { placeShip } from '../game/board'
import { FLEET_KINDS, type Fleet } from '../game/types'
import { BattleScreen } from './BattleScreen'

/** All five ships stacked in rows 0-4, bow at column 0. */
const rowFleet: Fleet = FLEET_KINDS.reduce<Fleet>(
  (fleet, kind, row) => placeShip(fleet, { kind, bow: { row, col: 0 }, orientation: 'horizontal' }),
  [],
)

const enemyCell = (label: string) => screen.getByRole('gridcell', { name: new RegExp(`エイリアン宙域 ${label} `) })

const aiTurn = async () => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0)
  })
}

describe('BattleScreen', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('marks a miss and a hit on the enemy board and logs them', async () => {
    render(<BattleScreen playerFleet={rowFleet} aiFleet={rowFleet} difficulty="easy" onFinish={() => {}} aiDelayMs={0} />)
    expect(screen.getByRole('status')).toHaveTextContent('あなたの番')

    fireEvent.click(enemyCell('A10'))
    expect(enemyCell('A10')).toHaveAccessibleName(/miss$/)
    expect(screen.getByRole('status')).toHaveTextContent('エイリアンの番')
    await aiTurn()
    expect(screen.getByRole('status')).toHaveTextContent('あなたの番')

    fireEvent.click(enemyCell('A1'))
    expect(enemyCell('A1')).toHaveAccessibleName(/hit$/)
    expect(screen.getByText(/あなたが A1 を砲撃 → ヒット!/)).toBeInTheDocument()
  })

  it('captain reacts to hits, misses and sunk ships with a matching face', async () => {
    render(<BattleScreen playerFleet={rowFleet} aiFleet={rowFleet} difficulty="easy" onFinish={() => {}} aiDelayMs={0} />)
    const captain = () => screen.getByTestId('captain')
    expect(captain()).toHaveClass('normal')
    expect(captain()).toHaveTextContent('エイリアン宙域を狙え')

    fireEvent.click(enemyCell('A5'))
    expect(captain()).toHaveClass('happy')
    expect(captain()).toHaveTextContent('いいぞ! その調子だ!')
    await aiTurn()
    expect(captain()).not.toHaveTextContent('いいぞ')

    fireEvent.click(enemyCell('B5'))
    expect(captain()).toHaveClass('happy')
    expect(captain()).toHaveTextContent('相手の斥候虫を沈めたぞ!')
  })

  it('alien commander taunts on misses, thinks during its turn and sulks when hit', async () => {
    render(<BattleScreen playerFleet={rowFleet} aiFleet={rowFleet} difficulty="easy" onFinish={() => {}} aiDelayMs={0} />)
    const alien = () => screen.getByTestId('alien-captain')
    expect(alien()).toHaveTextContent('ヒトよ、この宙域は我らのものだ')

    fireEvent.click(enemyCell('A10'))
    expect(alien()).toHaveTextContent('どこに潜んでいる')
    await aiTurn()
    fireEvent.click(enemyCell('A5'))
    await aiTurn()
    fireEvent.click(enemyCell('B5'))
    await aiTurn()
    expect(alien()).not.toHaveTextContent('どこに潜んでいる')
    expect(screen.getByText(/斥候虫を撃沈!!/)).toBeInTheDocument()
  })

  it('ignores clicks on already-shot cells and during the AI turn', async () => {
    render(<BattleScreen playerFleet={rowFleet} aiFleet={rowFleet} difficulty="easy" onFinish={() => {}} aiDelayMs={0} />)
    fireEvent.click(enemyCell('A10'))
    fireEvent.click(enemyCell('B10'))
    expect(enemyCell('B10')).toHaveAccessibleName(/empty$/)
    await aiTurn()
    fireEvent.click(enemyCell('A10'))
    expect(screen.getByText(/第 2 手/)).toBeInTheDocument()
  })

  it('shows sunk ships struck through and ends the game when all are destroyed', async () => {
    const onFinish = vi.fn()
    render(<BattleScreen playerFleet={rowFleet} aiFleet={rowFleet} difficulty="easy" onFinish={onFinish} aiDelayMs={0} />)

    fireEvent.click(enemyCell('A5'))
    await aiTurn()
    fireEvent.click(enemyCell('B5'))
    expect(screen.getByText(/斥候虫を撃沈!!/)).toBeInTheDocument()
    expect(enemyCell('A5')).toHaveAccessibleName(/sunk$/)

    // Sink the rest. Each player shot is followed by one (random) AI shot on a 17-cell fleet,
    // so the AI cannot win before we finish 15 more hits.
    for (const [row, len] of [
      [1, 5],
      [2, 4],
      [3, 3],
      [4, 3],
    ]) {
      for (let col = 0; col < len; col++) {
        await aiTurn()
        fireEvent.click(enemyCell(`${'ABCDE'[col]}${row}`))
      }
    }
    expect(screen.getByRole('status')).toHaveTextContent('勝利')
    const dialog = screen.getByRole('dialog', { name: '勝利!' })
    expect(dialog).toHaveTextContent('勝ったぞ! 太陽系は守られた!')
    expect(dialog).toHaveTextContent('ありえん')
    fireEvent.click(screen.getByRole('button', { name: '結果へ' }))
    expect(onFinish).toHaveBeenCalledWith('player')
  })
})
