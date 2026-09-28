import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows the title and moves to placement on start', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Space Battleship' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '出撃準備へ' }))
    expect(screen.getByRole('heading', { name: '艦隊を配置' })).toBeInTheDocument()
  })
})

describe('App flow', () => {
  it('goes from placement into battle after 出撃', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '出撃準備へ' }))
    fireEvent.click(screen.getByRole('button', { name: 'ランダム配置' }))
    fireEvent.click(screen.getByRole('button', { name: '出撃' }))
    expect(screen.getByRole('heading', { name: '戦闘' })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: 'エイリアン宙域' })).toBeInTheDocument()
  })
})

describe('difficulty', () => {
  it('defaults to Easy and lets the player pick Normal', () => {
    render(<App />)
    const easy = screen.getByRole('radio', { name: /Easy/ })
    const normal = screen.getByRole('radio', { name: /Normal/ })
    expect(easy).toBeChecked()
    fireEvent.click(normal)
    expect(normal).toBeChecked()
    expect(easy).not.toBeChecked()
  })
})
