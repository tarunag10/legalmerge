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
    localStorage.setItem('legalmerge_darkmode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
