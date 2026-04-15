import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Guide from './Guide'
import './styles/app.css'

function Root() {
  const [page, setPage] = useState<'home' | 'guide'>('home')
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('legalmerge_darkmode') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('legalmerge_darkmode', String(darkMode));
  }, [darkMode]);

  const navigate = (p: 'home' | 'guide') => {
    setPage(p)
    window.scrollTo(0, 0)
  }

  if (page === 'guide') return <Guide onNavigate={navigate} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
  return <App onNavigate={navigate} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
