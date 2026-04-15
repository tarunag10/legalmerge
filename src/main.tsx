import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Guide from './Guide'
import './styles/app.css'

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('legalmerge_darkmode');
  if (stored !== null) return stored === 'true';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

function Root() {
  const [page, setPage] = useState<'home' | 'guide'>('home')
  const [darkMode, setDarkMode] = useState(getInitialDarkMode)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('legalmerge_darkmode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    if (!mounted) return
    const stored = localStorage.getItem('legalmerge_darkmode');
    if (stored === 'true') {
      document.documentElement.classList.add('dark');
    } else if (stored === 'false') {
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, [mounted]);

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
