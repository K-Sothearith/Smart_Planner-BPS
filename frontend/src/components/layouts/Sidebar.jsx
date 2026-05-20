import { navItems } from '../../navItems'

export default function Sidebar({ activeView, onNavigate, user, onSignOut }) {
  return (
    <aside className="w-72 shrink-0 border-r border-(--border) bg-(--panel) p-5 flex flex-col gap-6">
      <div className="text-left">
        <p className="text-xs tracking-wide uppercase text-[var(--muted)]">Smart Planner & </p>
        <p className="text-xs tracking-wide uppercase text-[var(--text)]">Burnout Prevention</p>
        <p className="mt-1 text-lg font-bold text-[var(--text)] uppercase">
          {user?.name},
        </p>
      </div>

      <nav className="grid gap-1 text-left">
        {navItems.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              type="button"
              className={[
                'h-11 w-full rounded-xl px-3 text-sm font-medium text-left transition',
                isActive
                  ? 'bg-[var(--accent-bg)] text-[var(--accent-strong)] border border-[var(--accent-border)]'
                  : 'text-[var(--text)] hover:bg-[var(--panel-strong)] border border-transparent',
              ].join(' ')}
              onClick={() => onNavigate?.(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto grid gap-2">
        <button
          type="button"
          className="h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] text-[var(--text)] text-sm font-medium hover:opacity-90"
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
