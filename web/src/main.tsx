import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryProvider } from './providers/ReactQueryProvider'
import './index.css'
import './App.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/organisms/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
          <Toaster position="top-right" />
        </BrowserRouter>
      </ErrorBoundary>
    </ReactQueryProvider>
  </StrictMode>,
)
