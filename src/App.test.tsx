import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows the title and moves to placement on start', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Space Battleship' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'ゲーム開始' }))
    expect(screen.getByRole('heading', { name: '艦隊を配置' })).toBeInTheDocument()
  })
})
