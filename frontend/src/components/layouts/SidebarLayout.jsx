import Sidebar from './Sidebar'
import ThemeToggle from '../ui/ThemeToggle'

export default function SidebarLayout({ activeView, onNavigate, onSignOut, user, children }) {
  return (
    <div className="min-h-screen w-full flex relative bg-linear-to-br from-[#F4F7FB] via-[#F8FAFC] to-[#EBF1F9] dark:from-[#0F172A] dark:via-[#111A2E] dark:to-[#1E293B] transition-colors duration-300 font-sans">
      <ThemeToggle className="absolute top-6 right-6" />
      <Sidebar activeView={activeView} onNavigate={onNavigate} onSignOut={onSignOut} user={user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
