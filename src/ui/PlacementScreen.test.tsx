import { fireEvent, render, screen } from '@testing-library/react'
import { PlacementScreen } from './PlacementScreen'

const cell = (label: string) => screen.getByRole('gridcell', { name: new RegExp(`自分の宙域 ${label} `) })

describe('PlacementScreen', () => {
  it('places the flagship horizontally on click and moves on to the next ship', () => {
    render(<PlacementScreen onComplete={() => {}} />)
    fireEvent.click(cell('A1'))
    for (const label of ['A1', 'B1', 'C1', 'D1', 'E1']) {
      expect(cell(label)).toHaveAccessibleName(/ship$/)
    }
    expect(screen.getByText(/戦艦を置く位置をクリック/)).toBeInTheDocument()
  })

  it('ignores an out-of-bounds click', () => {
    render(<PlacementScreen onComplete={() => {}} />)
    fireEvent.click(cell('H1'))
    expect(screen.queryAllByRole('gridcell', { name: /ship$/ })).toHaveLength(0)
    expect(screen.getByText(/旗艦を置く位置をクリック/)).toBeInTheDocument()
  })

  it('shows a red preview even when the whole ship overlaps an existing one', () => {
    render(<PlacementScreen onComplete={() => {}} />)
    fireEvent.click(cell('A1'))
    fireEvent.mouseEnter(cell('A1'))
    for (const label of ['A1', 'B1', 'C1', 'D1']) {
      expect(cell(label)).toHaveAccessibleName(/preview-bad$/)
    }
    expect(cell('E1')).toHaveAccessibleName(/ship$/)
  })

  it('rotates orientation', () => {
    render(<PlacementScreen onComplete={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: '向きを変える' }))
    fireEvent.click(cell('A1'))
    for (const label of ['A1', 'A2', 'A3', 'A4', 'A5']) {
      expect(cell(label)).toHaveAccessibleName(/ship$/)
    }
  })

  it('enables 出撃 only after all five ships are placed and reports the fleet', () => {
    const onComplete = vi.fn()
    render(<PlacementScreen onComplete={onComplete} />)
    const launch = screen.getByRole('button', { name: '出撃' })
    expect(launch).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'ランダム配置' }))
    expect(screen.getAllByRole('gridcell', { name: /ship$/ })).toHaveLength(17)
    expect(launch).toBeEnabled()

    fireEvent.click(launch)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete.mock.calls[0][0]).toHaveLength(5)
  })

  it('clears the board with やり直す', () => {
    render(<PlacementScreen onComplete={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'ランダム配置' }))
    fireEvent.click(screen.getByRole('button', { name: 'やり直す' }))
    expect(screen.queryAllByRole('gridcell', { name: /ship$/ })).toHaveLength(0)
  })
})
