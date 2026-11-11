import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from 'antd'
import Rotas from './routes/Rotas'
import { QueryClientProvider } from '@tanstack/react-query'
import { QUERYCLIENT } from './services'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={QUERYCLIENT}>
    <App>
      <Rotas />
    </App>
    </QueryClientProvider>
  </StrictMode>,
)
