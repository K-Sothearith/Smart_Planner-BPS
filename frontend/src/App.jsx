import { useMemo, useState, useEffect } from 'react'
import './App.css'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Manager from './pages/Task_Session-Manager'
import Analytics from './pages/Analytics'
import Planner from './pages/Planner'
import Setting from './pages/Setting'
import Support from './pages/Support'
import GuideModal from './components/ui/modals/GuideModal'
import authService from './services/authService'

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
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [streak, setStreak] = useState(0)

  // Load and apply cached theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem('sp:theme') || 'light'
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  const refreshStreak = async () => {
    if (!session) return
    try {
      const res = await authService.getStreak()
      if (res && res.streak !== undefined) {
        setStreak(res.streak)
      }
    } catch (err) {
      console.error('Failed to refresh streak:', err)
    }
  }

  // Fetch streak dynamically when user session is active
  useEffect(() => {
    if (session) {
      refreshStreak()
    }
  }, [session])

  const user = useMemo(() => {
    if (!session) return null
    return {
      name: session.name || 'Student',
      email: session.email,
      age: session.age,
      gender: session.gender,
      isNewUser: !!session.isNewUser,
      streak,
    }
  }, [session, streak])

  // Automatically trigger the guide modal for new users on registration/onboarding
  useEffect(() => {
    if (user?.isNewUser) {
      setIsGuideOpen(true)
    }
  }, [user])

  const handleCompleteGuide = async () => {
    setIsGuideOpen(false)
    if (user?.isNewUser) {
      try {
        await authService.completeGuide()
      } catch (err) {
        console.error('Failed to update onboarding guide status on backend:', err)
      }
      if (session) {
        const updatedSession = { ...session, isNewUser: false }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession))
        setSession(updatedSession)
      }
    }
  }

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

  const renderActivePage = () => {
    const props = {
      user,
      onNavigate: setRoute,
      onSignOut: handleSignOut,
      onOpenGuide: () => setIsGuideOpen(true),
      refreshStreak: refreshStreak
    }

    switch (route) {
      case 'manager':
        return <Manager {...props} />
      case 'analytics':
        return <Analytics {...props} />
      case 'planner':
        return <Planner {...props} />
      case 'settings':
        return <Setting {...props} />
      case 'support':
        return <Support {...props} />
      case 'dashboard':
      default:
        return <Dashboard {...props} />
    }
  }

  return (
    <>
      {renderActivePage()}
      <GuideModal isOpen={isGuideOpen} onClose={handleCompleteGuide} />
    </>
  )
}

export default App
