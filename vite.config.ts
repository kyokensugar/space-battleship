/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Production is served from the repo sub-path; PR previews override this with BASE_PATH=/space-battleship/pr-N/
  base: process.env.BASE_PATH ?? '/space-battleship/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
