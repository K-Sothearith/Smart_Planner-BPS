import SidebarLayout from '../components/layouts/SidebarLayout'
import { PlannerIcon } from '../assets'

export default function Planner({ user, onNavigate, onSignOut }) {
  // Mock weekly schedule content
  const weeklySchedule = []

  // Mock backlog items
  const backlog = []

  return (
    <SidebarLayout activeView="planner" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-8 shrink-0 bg-current"
              style={{
                WebkitMaskImage: `url("${PlannerIcon}")`,
                maskImage: `url("${PlannerIcon}")`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
            Study Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Plan your weekly schedule, reserve time blocks, and ensure your workload is evenly spread.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_28%] gap-8 mt-4">
          
          {/* Card 1: Weekly Timetable (Large Card) */}
          <div className="flex flex-col h-170 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Timetable</h2>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Review scheduled lectures and reserved deep work intervals.</p>
              </div>
              
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin">
              {weeklySchedule.map((dayData) => (
                <div key={dayData.day} className="flex flex-col gap-2.5">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">{dayData.day}</h3>
                  {dayData.slots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {dayData.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-xl border-l-4 border border-slate-200/55 dark:border-slate-800/40 text-left ${slot.color} transition-all hover:scale-[1.01]`}
                        >
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{slot.label}</h4>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1 block">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-50/30 dark:bg-slate-900/10 border border-dashed border-slate-200/40 dark:border-slate-800/30 rounded-xl text-xs text-slate-400 dark:text-slate-600 font-semibold text-center">
                      No study events scheduled. Tap + to add.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Backlog & Time Blocking (Smaller Side Card) */}
          <div className="flex flex-col h-170 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Task Backlog</h2>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Assign backlog tasks to weekly time slots.</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3.5 scrollbar-thin">
              {backlog.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border border-slate-100 dark:border-slate-800/30 rounded-xl flex items-center justify-between gap-3 transition-all cursor-grab active:cursor-grabbing"
                >
                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 block">Estimated: {item.est}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border shrink-0 ${
                    item.priority === 'High'
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      : item.priority === 'Medium'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </SidebarLayout>
  )
}
