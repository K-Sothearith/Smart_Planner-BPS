import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Manager({ user, onNavigate, onSignOut }) {
  
  const mockTasks = []

  const mockSessions = []

  return (
    <SidebarLayout activeView="manager" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div className="flex flex-col gap-6 text-left max-w-5xl mx-auto w-full">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            Task-Study Session Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Manage your daily tasks and launch study sessions to maintain balanced focus and avoid burnout.
          </p>
        </div>

        {/* Vertical Stack Layout */}
        <div className="flex flex-col gap-8 mt-4">
          
          {/* Card 1: Managing Tasks (Top Card) */}
          <div className="flex flex-col h-[350px] bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2E5B70]/10 dark:bg-sky-500/20 flex items-center justify-center text-[#2E5B70] dark:text-sky-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Manage Tasks</h2>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Keep track of your current deliverables and micro-goals.</p>
              </div>
              <button
                type="button"
                className="h-9 px-4 rounded-xl bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                <span>Add Task</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 scrollbar-thin">
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/30 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.status === 'Completed'}
                      readOnly
                      className="w-4.5 h-4.5 rounded border-slate-300 text-[#2E5B70] focus:ring-[#2E5B70] dark:bg-[#0F172A] dark:border-slate-800"
                    />
                    <div className="text-left min-w-0">
                      <h3 className={`text-xs font-bold text-slate-800 dark:text-slate-200 truncate ${task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-600' : ''}`}>{task.title}</h3>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-0.5">{task.course} • Due {task.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      task.priority === 'High'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : task.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      task.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : task.status === 'In Progress'
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Managing Study Sessions (Bottom Card) */}
          <div className="flex flex-col h-[380px] bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#accent]/10 dark:bg-[#accent]/20 flex items-center justify-center text-[#accent] dark:text-[#f0a45d]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Manage Study Sessions</h2>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Configure and review your focused study blocks and intervals.</p>
              </div>
              <button
                type="button"
                className="h-9 px-4 rounded-xl bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Start Session</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8 scrollbar-thin">
              
              {/* Right Side: Mock Session Log Table */}
              <div className="flex-1 flex flex-col gap-4 text-left min-w-[280px] border-r-slate-400 border-r-1">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Session History</h3>
                <div className="flex flex-col gap-2.5">
                  {mockSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/30 flex items-center justify-between text-xs transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                    >
                      <div className="flex flex-col text-left gap-0.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{session.mode} ({session.duration})</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{session.focusScore}</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">Focus Score</span>
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                          session.outcome === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                        }`}>
                          {session.outcome}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Left Side: Mock Quick Config Controls */}
              <div className="flex-1 flex flex-col gap-4 text-left">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Timer Settings</h3>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Focus Duration</label>
                    <select className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <option>25 Minutes (Standard)</option>
                      <option>50 Minutes (Deep Work)</option>
                      <option>15 Minutes (Short Focus)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Break Method</label>
                    <select className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <option>5 Mins (Pomodoro Break)</option>
                      <option>10 Mins (Extended Rest)</option>
                      <option>No Break (Continuous)</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Smart Break Mode</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Let algorithm recommend breaks based on fatigue.</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-9 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border-none relative text-[#2E5B70]" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </SidebarLayout>
  )
}

