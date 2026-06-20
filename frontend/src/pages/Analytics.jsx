import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Analytics({ user, onNavigate, onSignOut }) {
  // Mock data for weekly logs to demonstrate scrollability
  const mockStudyStats = []

  const mockMoodLogs = []

  return (
    <SidebarLayout activeView="analytics" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            Productivity & Mood Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Monitor your study hours, focus levels, and stress trends over time to optimize your cognitive balance.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          
          {/* Card 1: Productivity Analysis (Fixed Height) */}
          <div className="flex flex-col h-170 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm5-18v3m4 8.25V21m0-8.25L17 10m0 3v8" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Productivity Metrics</h2>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Review hours spent and focus ratings per week.</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-thin">
              {/* Highlight summary widgets */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                  <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Focus</span>
                  <p className="text-lg font-black text-[#2E5B70] dark:text-sky-400 mt-0.5">67%</p>
                </div>
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                  <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hours Tracked</span>
                  <p className="text-lg font-black text-[#2E5B70] dark:text-sky-400 mt-0.5">67 hrs</p>
                </div>
                <div className="p-3 bg-[#F0FDF4] dark:bg-[#064E3B]/20 rounded-xl border border-emerald-100 dark:border-emerald-950/20 text-center">
                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Breaks Taken</span>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5">67</p>
                </div>
              </div>

              {/* Weekly Trends List */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Weekly Overview History</h3>
                {mockStudyStats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/30 flex items-center justify-between text-xs transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                  >
                    <div className="text-left">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{stat.week}</h4>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Total Study: {stat.totalHours} • {stat.breaksTaken}</p>
                    </div>
                    <div className="text-right flex flex-col gap-0.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Focus: {stat.avgFocus}</span>
                      <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                        stat.status === 'Healthy'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : stat.status === 'Mild Fatigue'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}>
                        {stat.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Mood & Stress Log (Fixed Height) */}
          <div className="flex flex-col h-90 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Mood & Stress Tracking</h2>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Review self-reported mood tags and stress triggers.</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin">
              {/* Mood Check-In Widget */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 text-left">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Quick Mood Check-in</h3>
                <div className="grid grid-cols-5 gap-2 mt-2.5">
                  <button className="h-10 text-lg hover:scale-110 active:scale-95 bg-white dark:bg-[#151a1f] border border-slate-200 dark:border-slate-800 rounded-lg transition-transform">😊</button>
                  <button className="h-10 text-lg hover:scale-110 active:scale-95 bg-white dark:bg-[#151a1f] border border-slate-200 dark:border-slate-800 rounded-lg transition-transform">😐</button>
                  <button className="h-10 text-lg hover:scale-110 active:scale-95 bg-white dark:bg-[#151a1f] border border-slate-200 dark:border-slate-800 rounded-lg transition-transform">😴</button>
                  <button className="h-10 text-lg hover:scale-110 active:scale-95 bg-white dark:bg-[#151a1f] border border-slate-200 dark:border-slate-800 rounded-lg transition-transform">😫</button>
                  <button className="h-10 text-lg hover:scale-110 active:scale-95 bg-white dark:bg-[#151a1f] border border-slate-200 dark:border-slate-800 rounded-lg transition-transform">😡</button>
                </div>
              </div>

              {/* Mood Logs Timeline */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mood Log History</h3>
                {mockMoodLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30 rounded-xl flex flex-col gap-1.5 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/40 text-left"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{log.rating}</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{log.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{log.notes}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">Stress Level:</span>
                      <span className={`text-[8.5px] font-extrabold uppercase px-1.5 rounded border ${
                        log.stressLevel === 'Low'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : log.stressLevel === 'Medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      }`}>
                        {log.stressLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </SidebarLayout>
  )
}

