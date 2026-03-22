import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Guide from './Guide'
import './styles/app.css'

function Root() {
  const [page, setPage] = useState<'home' | 'guide'>('home')

  const navigate = (p: 'home' | 'guide') => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  if (page === 'guide') return <Guide onNavigate={navigate} />
  return <App onNavigate={navigate} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
