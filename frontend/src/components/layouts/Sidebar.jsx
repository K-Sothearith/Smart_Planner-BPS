import { navItems } from '../../navItems'
import { MindfulStudyLogo, DashboardIcon, AnalyticsIcon, PlannerIcon, SettingIcon, SupportIcon, SignoutIcon } from '../../assets'

const NAV_ICONS = {
  dashboard: DashboardIcon,
  planner: PlannerIcon,
  analytics: AnalyticsIcon,
  settings: SettingIcon,
}

function MaskIcon({ src, className }) {
  if (!src) return null
  const urlValue = `url("${src}")`
  return (
    <span
      aria-hidden="true"
      className={['inline-block w-5 h-5 shrink-0 bg-current', className].filter(Boolean).join(' ')}
      style={{
        WebkitMaskImage: urlValue,
        maskImage: urlValue,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

export default function Sidebar({ activeView, onNavigate, onNewTask, onHelpSupport, onSignOut }) {
  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-6 bg-[#e5eeff] dark:bg-[#0F172A] transition-colors duration-300">
      <div className="text-left">
        <div className="w-72 h-15 bg-white dark:bg-[#111A2E] -mt-5 -ml-5 -mr-5 flex flex-row p-3 border-b-[#2E5B70] dark:border-b-slate-800 border-b border-r border-r-slate-200 dark:border-r-slate-800">
          <div className="w-9 h-9 rounded-lg bg-[#2E5B70] dark:bg-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#2E5B70]/10 dark:shadow-sky-500/10 mb-4 transition-all duration-300 hover:scale-105">
            <img src={MindfulStudyLogo} alt="Logo" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"/>
          </div>
          <p className="text-xl mt-1 ml-2 font-sans font-bold text-[#2E5B70] dark:text-slate-100">Mindful Study</p>
        </div>
        <p className="mt-2 -ml-1 text-s text-gray-700 dark:text-slate-400 font-bold">Stay focused, Stay balanced</p>
      </div>

      <nav className="grid gap-1 text-left -mt-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id
          const iconSrc = NAV_ICONS[item.id]
          return (
            <button
              key={item.id}
              type="button"
              className={[
                'group h-11 w-full rounded-xl px-3 text-sm font-medium text-left transition flex items-center gap-3',
                isActive
                  ? 'bg-[#2E5B70] text-white dark:bg-[#38BDF8] dark:text-slate-900 border border-transparent'
                  : 'text-(--text) hover:bg-[#26A69A50] dark:hover:bg-slate-800/60 hover:text-white border border-transparent',
              ].join(' ')}
              onClick={() => onNavigate?.(item.id)}
            >
              <MaskIcon
                src={iconSrc}
                className={
                  isActive
                    ? 'text-white dark:text-slate-900'
                    : 'text-slate-900 dark:text-slate-200 group-hover:text-white'
                }
              />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto grid gap-2">
        <button
          type="button"
          className="h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#2E5B70] dark:bg-[#38BDF8] text-white dark:text-slate-900 text-sm font-medium hover:bg-[#214353] dark:hover:bg-[#0EA5E9] flex items-center gap-3 px-3 transition-colors"
          onClick={() => onNewTask?.()}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="truncate">New Task</span>
        </button>

        <div className="h-px bg-black/70 dark:bg-white/20 my-1" />

        <button
          type="button"
          className="group h-11 rounded-xl border border-[#2E5B70] dark:border-slate-700 bg-[#e5eeff] dark:bg-[#111A2E] text-(--text) text-sm font-medium hover:bg-[#2E5B70] dark:hover:bg-[#38BDF8] hover:text-white dark:hover:text-slate-900 flex items-center gap-3 px-3 transition-colors"
          onClick={() => onHelpSupport?.()}
        >
          <MaskIcon
            src={SupportIcon}
            className="text-slate-900 dark:text-slate-200 group-hover:text-white dark:group-hover:text-slate-900"
          />
          <span className="truncate">Help and Support</span>
        </button>

        <button
          type="button"
          className="group h-11 rounded-xl border border-[#2E5B70] dark:border-slate-700 bg-[#e5eeff] dark:bg-[#111A2E] text-(--text) text-sm font-medium hover:bg-[#2E5B70] dark:hover:bg-[#38BDF8] hover:text-white dark:hover:text-slate-900 flex items-center gap-3 px-3 transition-colors"
          onClick={onSignOut}
        >
          <MaskIcon
            src={SignoutIcon}
            className="text-slate-900 dark:text-slate-200 group-hover:text-white dark:group-hover:text-slate-900"
          />
          <span className="truncate">Sign out</span>
        </button>
      </div>
    </aside>
  )
}
