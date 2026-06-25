import { useState } from 'react'
import Sidebar from './Sidebar'
import ThemeToggle from '../ui/ThemeToggle'
import NewTaskModal from '../ui/modals/NewTaskModal'

export default function SidebarLayout({ activeView, onNavigate, onSignOut, user, children }) {
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)

  const handleUserClick = () => {
    onNavigate?.('settings')
  }

  return (
    <div className="min-h-screen w-full flex relative bg-linear-to-br from-[#F4F7FB] via-[#F8FAFC] to-[#EBF1F9] dark:from-[#0F172A] dark:via-[#111A2E] dark:to-[#1E293B] transition-colors duration-300 font-sans">
      
      {/* Top Right Utility Controls */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 h-10 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 font-bold text-xs select-none shadow-sm">
          <span>🔥</span>
          <span>67</span>
        </div>

        {/* Light Mode Switch */}
        <ThemeToggle />

        {/* User Icon */}
        <button
          type="button"
          onClick={handleUserClick}
          className="w-10 h-10 rounded-full bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#2E5B70] dark:hover:text-sky-400 border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer shadow-sm focus:outline-none"
          aria-label="View settings"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>

      <Sidebar
        activeView={activeView}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
        user={user}
        onNewTask={() => setIsNewTaskOpen(true)}
        onHelpSupport={() => onNavigate?.('support')}
      />
      <main className="flex-1 p-6 relative">{children}</main>

      {/* Global Modals */}
      <NewTaskModal isOpen={isNewTaskOpen} onClose={() => setIsNewTaskOpen(false)} />
    </div>
  )
}

