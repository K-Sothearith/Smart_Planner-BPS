import Sidebar from './Sidebar'

export default function SidebarLayout({ activeView, onNavigate, onSignOut, user, children }) {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] [background:var(--bg-accent)] flex">
      <Sidebar activeView={activeView} onNavigate={onNavigate} onSignOut={onSignOut} user={user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

