import { useState, useEffect } from 'react'
import SidebarLayout from '../components/layouts/SidebarLayout'
import { AnalyticsIcon } from '../assets'
import analyticsService from '../services/analyticsService.js'

export default function Analytics({ user, onNavigate, onSignOut, onOpenGuide, refreshStreak }) {
  // Loading and database states
  const [loading, setLoading] = useState(true)
  const [liveIndex, setLiveIndex] = useState(0)
  const [liveScores, setLiveScores] = useState(null)
  const [history, setHistory] = useState([])
  const [taskMetrics, setTaskMetrics] = useState({ pendingCount: 0, overdueCount: 0, missedCount: 0 })

  // Modal open state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [selectedMood, setSelectedMood] = useState('Normal')
  const [sleepHours, setSleepHours] = useState('7-8 hours')
  const [sleepQuality, setSleepQuality] = useState('4')
  const [screenTime, setScreenTime] = useState('5-6 hours')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Realistic mock data for fallback
  const mockStudyStats = [
    { week: 'Week 27 (Jun 29 - Jul 05)', totalHours: '24 hrs', breaksTaken: '16 breaks', avgFocus: '82%', status: 'Healthy' },
    { week: 'Week 26 (Jun 22 - Jun 28)', totalHours: '32 hrs', breaksTaken: '10 breaks', avgFocus: '68%', status: 'Mild Fatigue' },
    { week: 'Week 25 (Jun 15 - Jun 21)', totalHours: '40 hrs', breaksTaken: '6 breaks', avgFocus: '55%', status: 'High Fatigue' },
    { week: 'Week 24 (Jun 08 - Jun 14)', totalHours: '20 hrs', breaksTaken: '15 breaks', avgFocus: '85%', status: 'Healthy' },
  ]

  // Load analytics data from backend on mount
  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getAnalytics()
      setLiveIndex(data.liveIndex || 0)
      setLiveScores(data.liveScores || null)
      setHistory(data.history || [])
      setTaskMetrics(data.taskMetrics || { pendingCount: 0, overdueCount: 0, missedCount: 0 })
    } catch (err) {
      console.error("Failed to load analytics records:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  // Handle logging check-in submission
  const handleSubmitLog = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await analyticsService.createBurnoutLog({
        moodLevel: selectedMood,
        sleepHours,
        sleepQuality: Number(sleepQuality),
        screenTime,
        note
      })
      // Reset form fields
      setNote('')
      setSelectedMood('Normal')
      setSleepHours('7-8 hours')
      setSleepQuality('4')
      setScreenTime('5-6 hours')
      setIsLogModalOpen(false)
      
      // Refresh current states
      await fetchAnalytics()
      if (refreshStreak) {
        refreshStreak()
      }
    } catch (err) {
      console.error("Failed to save burnout check-in log:", err)
    } finally {
      setSubmitting(false)
    }
  }

  // Get index category badge label and colors
  const getRiskDetails = (idx) => {
    if (idx >= 76) return { label: 'High Burnout Risk', borderClass: 'border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/10', circleColor: 'stroke-rose-500' };
    if (idx >= 41) return { label: 'Moderate Fatigue', borderClass: 'border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/10', circleColor: 'stroke-amber-500' };
    return { label: 'Healthy Balance', borderClass: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10', circleColor: 'stroke-emerald-500' };
  };

  // Get dynamic recommendations text
  const getRecommendation = (idx) => {
    if (idx >= 76) {
      return {
        title: "Overload Warning",
        text: "Your burnout risk is critical! We highly recommend rescheduling non-urgent deadlines, and taking an extended break to recover focus.",
        boxClass: "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300",
        titleClass: "text-rose-700 dark:text-rose-400"
      };
    }
    if (idx >= 41) {
      return {
        title: "Rest Recommendation",
        text: "Your study intensity is high. Consider taking shorter, active 5-minute stretch breaks every 25 minutes today to avoid fatigue accumulation.",
        boxClass: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300",
        titleClass: "text-amber-700 dark:text-amber-400"
      };
    }
    return {
      title: "Optimal Balance",
      text: "Your workload and lifestyle metrics look well balanced. Continue following your schedule and take standard scheduled breaks to maintain this state.",
      boxClass: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300",
      titleClass: "text-emerald-700 dark:text-emerald-400"
    };
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

  const riskDetails = getRiskDetails(liveIndex);
  const rec = getRecommendation(liveIndex);

  // SVG Circular progress math
  const strokeDasharray = 251.2;
  const strokeDashoffset = 251.2 - (251.2 * liveIndex) / 100;

  return (
    <SidebarLayout activeView="analytics" user={user} onNavigate={onNavigate} onSignOut={onSignOut} onOpenGuide={onOpenGuide}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        {/* Page Header */}
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

        {/* 2-Column Symmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          
          {/* COLUMN 1 */}
          <div className="flex flex-col gap-8">
            {/* Card 1: Productivity & Workload (Fixed Height: h-118) */}
            <div className="flex flex-col h-118 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
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

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-thin">
                {/* Highlight summary widgets */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                    <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Focus</span>
                    <p className="text-lg font-black text-[#2E5B70] dark:text-sky-400 mt-0.5">72%</p>
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/40 text-center">
                    <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hours Tracked</span>
                    <p className="text-lg font-black text-[#2E5B70] dark:text-sky-400 mt-0.5">116 hrs</p>
                  </div>
                  <div className="p-3 bg-[#F0FDF4] dark:bg-[#064E3B]/20 rounded-xl border border-emerald-100 dark:border-emerald-950/20 text-center">
                    <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Breaks Taken</span>
                    <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5">47</p>
                  </div>
                </div>

                {/* Weekly Trends List */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-left">Weekly Overview History</h3>
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
                        <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`}>
                          {stat.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col gap-8">
            {/* Card 3: Burnout-Risk Analysis (Fixed Height: h-218) */}
            <div className="flex flex-col h-218 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
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

                {/* Burnout-log Button */}
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
              
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto scrollbar-thin">
                {/* Burnout Risk Ring Meter & Alert row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/40 p-4">
                  {/* SVG Ring (Left) */}
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
                  {/* Alert / Recommendation (Right) */}
                  <div className="flex-1 text-left space-y-1">
                    <h4 className={`text-[11px] font-extrabold uppercase tracking-wider ${rec.titleClass}`}>{rec.title}</h4>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                      {rec.text}
                    </p>
                  </div>
                </div>

                {/* Sub-metrics breakdown grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/20 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800/20">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Mood Risk (30%)</span>
                      <span className="text-amber-500">{liveScores?.moodScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${liveScores?.moodScore || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Sleep Quality Risk (10%)</span>
                      <span className="text-rose-500">{liveScores?.sleepQualityScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${liveScores?.sleepQualityScore || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Study Intensity Risk (20%)</span>
                      <span className="text-indigo-500">{liveScores?.pendingScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${liveScores?.pendingScore || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Overdue Tasks Risk (10%)</span>
                      <span className="text-red-500">{liveScores?.overdueScore || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full rounded-full" style={{ width: `${liveScores?.overdueScore || 0}%` }} />
                    </div>
                  </div>
                </div>

                {/* Recent Burnout logs list */}
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-left">Burnout Logs & Mood Entries</h3>
                  <div className="flex flex-col gap-2.5 max-h-100 overflow-y-auto scrollbar-thin pr-1">
                    {history.length === 0 ? (
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-dashed border-slate-200/40 dark:border-slate-800/30 rounded-xl text-center text-xs text-slate-400 dark:text-slate-550 font-semibold">
                        No burnout checks logged yet. Click "Burnout-log" to log today's check-in.
                      </div>
                    ) : (
                      history.map((log) => {
                        const rowRisk = getRiskDetails(log.burnout_index);
                        return (
                          <div
                            key={log.burnout_id}
                            className="p-3.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/30 rounded-xl flex flex-col gap-1.5 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/40 text-left"
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

      {/* Burnout-log Form Popup Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          {/* Modal Card */}
          <div className="w-full max-w-lg bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-lg border border-slate-200 dark:border-slate-850 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 text-left transform scale-100 transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/60">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">Submit Burnout Check-in</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Logs are saved to compute burnout index</p>
              </div>
              <button 
                onClick={() => setIsLogModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitLog} className="flex flex-col gap-4">
              {/* Mood (30% weight) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">How is your Mood? (30%)</label>
                <div className="grid grid-cols-5 gap-2 mt-1">
                  {[
                    { value: 'Happy', emoji: '😊', label: 'Happy' },
                    { value: 'Normal', emoji: '😐', label: 'Normal' },
                    { value: 'Tired', emoji: '😴', label: 'Tired' },
                    { value: 'Frustrated', emoji: '😫', label: 'Frustrated' },
                    { value: 'Stressed', emoji: '😡', label: 'Stressed' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setSelectedMood(item.value)}
                      className={`h-14 flex flex-col items-center justify-center rounded-xl border text-xl transition-all duration-200 cursor-pointer ${
                        selectedMood === item.value 
                          ? 'bg-[#2E5B70]/10 border-[#2E5B70] dark:bg-sky-400/10 dark:border-sky-500 scale-105 shadow-sm shadow-[#2E5B70]/10' 
                          : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span className="text-[8px] font-bold mt-1 uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Duration Dropdown (10%) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sleep Hours (10%)</label>
                <select
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-700 dark:text-slate-250 outline-none focus:border-[#2E5B70] dark:focus:border-sky-500 transition-all cursor-pointer"
                >
                  <option value="Under 4 hours">Under 4 hours (High Burnout Risk)</option>
                  <option value="5-6 hours">5-6 hours (Moderate-High Risk)</option>
                  <option value="7-8 hours">7-8 hours (Healthy, Lowest Risk)</option>
                  <option value="Above 8 hours">Above 8 hours (Mild Risk)</option>
                </select>
              </div>

              {/* Sleep Quality Dropdown (10%) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sleep Quality (10%)</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-700 dark:text-slate-250 outline-none focus:border-[#2E5B70] dark:focus:border-sky-500 transition-all cursor-pointer"
                >
                  <option value="1">1 - Terrible (High Burnout Risk)</option>
                  <option value="2">2 - Poor</option>
                  <option value="3">3 - Fair</option>
                  <option value="4">4 - Good</option>
                  <option value="5">5 - Excellent (Lowest Risk)</option>
                </select>
              </div>

              {/* Screen Time Dropdown (10%) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Screen Time (10%)</label>
                <select
                  value={screenTime}
                  onChange={(e) => setScreenTime(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-700 dark:text-slate-250 outline-none focus:border-[#2E5B70] dark:focus:border-sky-500 transition-all cursor-pointer"
                >
                  <option value="Under 4 hours">Under 4 hours (Lowest Risk)</option>
                  <option value="5-6 hours">5-6 hours (Mild Risk)</option>
                  <option value="7-8 hours">7-8 hours (Moderate-High Risk)</option>
                  <option value="Above 8 hours">Above 8 hours (High Burnout Risk)</option>
                </select>
              </div>

              {/* Note input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Check-in Note (Optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe how your day was..."
                  maxLength="100"
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-[#2E5B70] dark:focus:border-sky-500 transition-all"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 justify-end mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2E5B70] dark:bg-sky-500 hover:bg-[#1f3f50] dark:hover:bg-sky-600 rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-[#2E5B70]/10 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Submit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SidebarLayout>
  )
}
