import { useState, useEffect } from 'react'
import SidebarLayout from '../components/layouts/SidebarLayout'
import { AnalyticsIcon } from '../assets'
import analyticsService from '../services/analyticsService.js'
import Select from '../components/ui/Select'
import BurnoutLogModal from '../components/ui/modals/BurnoutLogModal'

export default function Analytics({ user, onNavigate, onSignOut, onOpenGuide, refreshStreak }) {
  const [loading, setLoading] = useState(true)
  const [liveIndex, setLiveIndex] = useState(0)
  const [liveScores, setLiveScores] = useState(null)
  const [backendRiskDetails, setBackendRiskDetails] = useState(null)
  const [backendRecommendation, setBackendRecommendation] = useState(null)
  const [history, setHistory] = useState([])
  const [taskMetrics, setTaskMetrics] = useState({ pendingCount: 0, overdueCount: 0, missedCount: 0 })
  const [weeklyProductivity, setWeeklyProductivity] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])

  const [isLogModalOpen, setIsLogModalOpen] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getAnalytics()
      setLiveIndex(data.liveIndex || 0)
      setLiveScores(data.liveScores || null)
      setBackendRiskDetails(data.riskDetails || null)
      setBackendRecommendation(data.recommendation || null)
      setHistory(data.history || [])
      setTaskMetrics(data.taskMetrics || { pendingCount: 0, overdueCount: 0, missedCount: 0 })
      setWeeklyProductivity(data.weeklyProductivity || [])
      setCategoryDistribution(data.categoryDistribution || [])
    } catch (err) {
      console.error("Failed to load analytics records:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleSubmitSuccess = async (data) => {
    await fetchAnalytics()
    if (refreshStreak) {
      refreshStreak()
    }
  }

  const getRiskDetails = (idx) => {
    if (idx >= 76) return { label: 'High Burnout Risk', borderClass: 'border-rose-500/20 text-rose-600 dark:text-rose-450 bg-rose-500/10', circleColor: 'stroke-rose-500' };
    if (idx >= 41) return { label: 'Moderate Fatigue', borderClass: 'border-amber-500/20 text-amber-600 dark:text-amber-455 bg-amber-500/10', circleColor: 'stroke-amber-500' };
    return { label: 'Healthy Balance', borderClass: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-450 bg-emerald-500/10', circleColor: 'stroke-emerald-500' };
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      'Happy': '😊 Happy',
      'Normal': '😐 Normal',
      'Tired': '😴 Tired',
      'Frustrated': '😫 Frustrated',
      'Stressed': '😡 Stressed'
    };
    return emojis[mood] || '😐 Normal';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const riskDetails = backendRiskDetails || {
    label: 'Healthy Balance',
    borderClass: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    circleColor: 'stroke-emerald-500'
  };

  const rec = backendRecommendation || {
    title: "Optimal Balance",
    text: "Your workload and lifestyle metrics look well balanced. Continue following your schedule and take standard scheduled breaks to maintain this state.",
    boxClass: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300",
    titleClass: "text-emerald-700 dark:text-emerald-400"
  };

  const avgFocusOverall = weeklyProductivity.length > 0
    ? Math.round(weeklyProductivity.reduce((sum, w) => sum + w.focus, 0) / weeklyProductivity.length)
    : 0;

  const totalHoursOverall = Math.round(weeklyProductivity.reduce((sum, w) => sum + w.studyHours, 0) * 10) / 10;
  const totalBreaksOverall = weeklyProductivity.reduce((sum, w) => sum + w.breaks, 0);

  const strokeDasharray = 251.2;
  const strokeDashoffset = 251.2 - (251.2 * liveIndex) / 100;

  return (
    <SidebarLayout activeView="analytics" user={user} onNavigate={onNavigate} onSignOut={onSignOut} onOpenGuide={onOpenGuide}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-8 shrink-0 bg-current"
              style={{
                WebkitMaskImage: `url("${AnalyticsIcon}")`,
                maskImage: `url("${AnalyticsIcon}")`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
            Productivity & Burnout-Risk Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Monitor your study hours, focus levels, and stress trends over time to optimize your cognitive balance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          
          <div className="flex flex-col gap-8 h-[872px]">
            <div className="flex flex-col h-[420px] bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
              <div className="p-6 border-b border-slate-300 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm5-18v3m4 8.25V21m0-8.25L17 10m0 3v8" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Productivity & Workload</h2>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Track your total study hours, focus levels, and completed tasks to monitor academic performance.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-thin">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                    <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Focus</span>
                    <p className="text-lg font-black text-[#2E5B70] dark:text-sky-400 mt-0.5">{avgFocusOverall}%</p>
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                    <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hours Tracked</span>
                    <p className="text-lg font-black text-[#2E5B70] dark:text-sky-400 mt-0.5">{totalHoursOverall} hrs</p>
                  </div>
                  <div className="p-3 bg-[#F0FDF4] dark:bg-[#064E3B]/20 rounded-xl border border-emerald-100 dark:border-emerald-950/20 text-center">
                    <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Breaks Taken</span>
                    <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{totalBreaksOverall}</p>
                  </div>
                </div>

                {/* Weekly Trends List */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-left">Weekly Overview History</h3>
                  {weeklyProductivity.length === 0 ? (
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200/40 dark:border-slate-800/30 rounded-xl text-center text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      No study history recorded yet. Use the Planner to start study sessions!
                    </div>
                  ) : (
                    weeklyProductivity.map((stat, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-[#2E5B7090] dark:border-[#38BDF890] flex items-center justify-between text-xs transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                      >
                        <div className="text-left">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{stat.week}</h4>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Total Study: {stat.studyHours} hrs • {stat.breaks} breaks</p>
                        </div>
                        <div className="text-right flex flex-col gap-0.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Focus: {stat.focus}%</span>
                          <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                            stat.status === "Healthy" 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : stat.status === "Mild Fatigue"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20"
                          }`}>
                            {stat.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex-col h-[420px] bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
              <div className="p-6 border-b border-slate-300 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Study Distribution & Balance</h2>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Review the balance of focus hours spent across category types.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin">
                {categoryDistribution.length === 0 || categoryDistribution.every(c => c.percentage === 0) ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200/40 dark:border-slate-800/30 rounded-xl text-center text-xs text-slate-400 dark:text-slate-500 font-semibold">
                    No study distribution data found. Complete a timed study session to see distribution trends!
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {categoryDistribution.map((item, i) => {
                      const colors = {
                        Practice: { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
                        Assignment: { bar: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
                        Project: { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
                        Revision: { bar: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
                        Research: { bar: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
                        Others: { bar: "bg-slate-400", text: "text-slate-600 dark:text-slate-450" }
                      };
                      const theme = colors[item.category] || colors.Others;

                      return (
                        <div key={i} className="flex flex-col gap-1 text-xs">
                          <div className="flex justify-between items-center font-semibold">
                            <span className="text-slate-800 dark:text-slate-200">{item.category}</span>
                            <span className="text-slate-400 dark:text-slate-500">{item.hours} hrs ({item.percentage}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${theme.bar} rounded-full transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col h-[872px] bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
              <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Burnout-Risk Analysis</h2>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Assess burnout risk to prevent academic overload.</p>
                </div>

                <button 
                  onClick={() => setIsLogModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2E5B70] dark:bg-sky-500 hover:bg-[#1f3f50] dark:hover:bg-sky-600 rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-[#2E5B70]/10 shrink-0 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Burnout-log
                </button>
              </div>
              
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto scrollbar-thin">
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/40 p-4">
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                      <circle cx="50" cy="50" r="40" className={`${riskDetails.circleColor} transition-all duration-500`} strokeWidth="8" fill="transparent" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-[8px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Risk</span>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-100 -mt-0.5">{liveIndex}%</p>
                      <span className="text-[7.5px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                        {liveIndex >= 76 ? 'Severe' : liveIndex >= 41 ? 'Moderate' : 'Healthy'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 text-left space-y-1">
                    <h4 className={`text-[11px] font-extrabold uppercase tracking-wider ${rec.titleClass}`}>{rec.title}</h4>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                      {rec.text}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50/20 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800/20">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Mood Risk</span>
                      <span className="text-amber-500">{liveScores?.moodScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${liveScores?.moodScore || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Sleep Quality Risk</span>
                      <span className="text-rose-500">{liveScores?.sleepQualityScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${liveScores?.sleepQualityScore || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Study Intensity Risk</span>
                      <span className="text-indigo-500">{liveScores?.pendingScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${liveScores?.pendingScore || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Overdue Tasks Risk</span>
                      <span className="text-red-500">{liveScores?.overdueScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: `${liveScores?.overdueScore || 0}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-left">Burnout Logs & Mood Entries</h3>
                  <div className="flex flex-col gap-2.5 max-h-100 overflow-y-auto scrollbar-thin pr-1">
                    {history.length === 0 ? (
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200/40 dark:border-slate-800/30 rounded-xl text-center text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        No burnout checks logged yet. Click "Burnout-log" to log today's check-in.
                      </div>
                    ) : (
                      history.map((log) => {
                        const rowRisk = getRiskDetails(log.burnout_index);
                        return (
                          <div
                            key={log.burnout_id}
                            className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-[#2E5B7090] dark:border-[#38BDF890] rounded-xl flex flex-col gap-1.5 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/40 text-left"
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{getMoodEmoji(log.mood_level)}</span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">{formatDate(log.created_at)}</span>
                            </div>
                            {log.note && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{log.note}</p>
                            )}
                            <div className="flex justify-between items-center mt-1.5 text-[9px] font-bold text-slate-450 dark:text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <span>Sleep: <span className="text-slate-700 dark:text-slate-300">{log.sleep_hours}</span></span>
                                <span>•</span>
                                <span>Quality: <span className="text-slate-700 dark:text-slate-300">{log.sleep_quality}/5</span></span>
                              </div>
                              <span className={`text-[8.5px] font-extrabold uppercase px-1.5 rounded border ${rowRisk.borderClass}`}>
                                Index: {log.burnout_index}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <BurnoutLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        taskMetrics={taskMetrics}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </SidebarLayout>
  )
}
