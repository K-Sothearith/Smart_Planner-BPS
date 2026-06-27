import { useMemo, useState, useEffect } from 'react'
import './App.css'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Manager from './pages/Task_Session-Manager'
import Analytics from './pages/Analytics'
import Planner from './pages/Planner'
import Setting from './pages/Setting'
import Support from './pages/Support'

const SESSION_KEY = 'sp:session'

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function App() {
  const [session, setSession] = useState(() => readSession())
  const [route, setRoute] = useState(() => (session ? 'dashboard' : 'signin'))

  // Load and apply cached theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('sp:theme') || 'light'
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  const user = useMemo(() => {
    if (!session) return null
    return {
      name: session.name || 'Student',
      email: session.email,
      age: session.age,
      gender: session.gender,
    }
  }, [session])

  const handleAuthSuccess = (nextSession) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
    setRoute('dashboard')
  }

  const handleSignOut = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setSession(null)
    setRoute('signin')
  }

  if (!session) {
    return (
      <Auth
        mode={route === 'signup' ? 'signup' : 'signin'}
        onSwitchMode={(mode) => setRoute(mode)}
        onAuthSuccess={handleAuthSuccess}
      />
    )
  }

  switch (route) {
    case 'manager':
      return <Manager user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'analytics':
      return <Analytics user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'planner':
      return <Planner user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'settings':
      return <Setting user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'support':
      return <Support user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'dashboard':
    default:
      return <Dashboard user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
  }
}

export default App
