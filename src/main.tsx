import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider'
import { SoundProvider } from './audio/SoundProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <SoundProvider>
        <App />
      </SoundProvider>
    </I18nProvider>
  </StrictMode>,
)
