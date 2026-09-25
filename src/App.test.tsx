import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows the game title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Space Battleship' })).toBeInTheDocument()
  })
})
