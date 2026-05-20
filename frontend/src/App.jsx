import { useMemo, useState } from 'react'
import './App.css'
import Auth from './pages/Auth'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import Setting from './pages/Setting'

const SESSION_KEY = 'sp:session'

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
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

  const user = useMemo(() => {
    if (!session) return null
    return {
      name: session.name || 'Student',
      email: session.email,
    }
  }, [session])

  const handleAuthSuccess = (nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)
    setRoute('dashboard')
  }

  const handleSignOut = () => {
    localStorage.removeItem(SESSION_KEY)
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
    case 'planner':
      return <Planner user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'analytics':
      return <Analytics user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'settings':
      return <Setting user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
    case 'dashboard':
    default:
      return <Dashboard user={user} onNavigate={setRoute} onSignOut={handleSignOut} />
  }
}

export default App
