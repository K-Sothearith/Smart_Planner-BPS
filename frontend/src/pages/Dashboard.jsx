import { useState, useEffect } from 'react'
import SidebarLayout from '../components/layouts/SidebarLayout'
import { DashboardIcon } from '../assets'
import taskService from '../services/taskService.js'
import studySessionService from '../services/studySessionService.js'
import analyticsService from '../services/analyticsService.js'

function Card({ title, description, className = '', children }) {
  return (
    <section className={`flex flex-col bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300 ${className}`}>
      <div className="px-6 py-4.5 border-b border-slate-300 dark:border-slate-700 text-left">
        <h2 className="text-sm font-bold text-slate-850 dark:text-slate-100 font-heading">{title}</h2>
        <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold mt-0.5">{description}</p>
      </div>
      <div className="flex-1 p-6 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </section>
  )
}

export default function Dashboard({ user, onNavigate, onSignOut, onOpenGuide, refreshStreak }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [liveIndex, setLiveIndex] = useState(0)
  const [liveScores, setLiveScores] = useState(null)
  const [latestLog, setLatestLog] = useState(null)
  const [taskMetrics, setTaskMetrics] = useState({ pendingCount: 0, overdueCount: 0, missedCount: 0 })
  const [weeklyProductivity, setWeeklyProductivity] = useState([])
  const [tasks, setTasks] = useState([])
  const [sessions, setSessions] = useState([])

  const [breathingActive, setBreathingActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState('Breathe In')
  const [phaseTime, setPhaseTime] = useState(4)
  const [breathCount, setBreathCount] = useState(0)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [analyticsData, allTasks, allSessions] = await Promise.all([
        analyticsService.getAnalytics(),
        taskService.getTasks(),
        studySessionService.getSessions()
      ])

      setLiveIndex(analyticsData.liveIndex || 0)
      setLiveScores(analyticsData.liveScores || null)
      setLatestLog(analyticsData.latestLog || null)
      setTaskMetrics(analyticsData.taskMetrics || { pendingCount: 0, overdueCount: 0, missedCount: 0 })
      setWeeklyProductivity(analyticsData.weeklyProductivity || [])
      setTasks(allTasks || [])
      setSessions(allSessions || [])
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Could not retrieve dashboard metrics. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (!breathingActive) return

    const interval = setInterval(() => {
      setPhaseTime((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'Breathe In') {
            setBreathPhase('Hold')
            return 7
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Breathe Out')
            return 8
          } else {
            setBreathPhase('Breathe In')
            setBreathCount((c) => c + 1)
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [breathingActive, breathPhase])

  const handleStartBreathing = () => {
    setBreathingActive(true)
    setBreathPhase('Breathe In')
    setPhaseTime(4)
  }

  const handlePauseBreathing = () => {
    setBreathingActive(false)
  }

  const handleResetBreathing = () => {
    setBreathingActive(false)
    setBreathPhase('Breathe In')
    setPhaseTime(4)
    setBreathCount(0)
  }

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.completeTask(taskId)
      if (refreshStreak) {
        await refreshStreak()
      }
      fetchDashboardData()
    } catch (err) {
      console.error('Failed to complete task:', err)
    }
  }

  const isToday = (dateStr) => {
    if (!dateStr) return false
    const today = new Date()
    const date = new Date(dateStr)
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  const isPastDue = (dueDateStr) => {
    if (!dueDateStr) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dueDateStr)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  const formatRelativeDate = (dueDateStr) => {
    if (!dueDateStr) return 'No due date'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dueDateStr)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday (Overdue)'
    if (diffDays < 0) return `Overdue (${Math.abs(diffDays)}d ago)`
    if (diffDays <= 7) return `In ${diffDays} days`

    return dueDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    })
  }

  const getRiskDetails = (idx) => {
    if (idx >= 76) return { label: 'High Burnout Risk', colorClass: 'text-rose-500 dark:text-rose-455', borderClass: 'border-rose-500/20 bg-rose-500/10', circleColor: 'stroke-rose-500' }
    if (idx >= 41) return { label: 'Moderate Fatigue', colorClass: 'text-amber-500 dark:text-amber-455', borderClass: 'border-amber-500/20 bg-amber-500/10', circleColor: 'stroke-amber-500' }
    return { label: 'Healthy Balance', colorClass: 'text-emerald-600 dark:text-emerald-455', borderClass: 'border-emerald-500/20 bg-emerald-500/10', circleColor: 'stroke-emerald-500' }
  }

  const risk = getRiskDetails(liveIndex)

  const getRecommendation = (idx) => {
    if (idx >= 76) {
      return {
        title: "Critical Overload",
        text: "Your burnout risk is critical! Reschedule non-urgent tasks and take an extended recovery break.",
        boxClass: "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300",
        titleClass: "text-rose-800 dark:text-rose-400",
        actionText: "Take deep breaths ⏱️",
        actionType: "breathing"
      };
    }
    if (idx >= 41) {
      return {
        title: "Moderate Fatigue",
        text: "Study intensity is high. Take shorter 5-min stretch breaks every 25 minutes to avoid fatigue.",
        boxClass: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
        titleClass: "text-amber-800 dark:text-amber-400",
        actionText: "Breathing exercise ⏱️",
        actionType: "breathing"
      };
    }
    return {
      title: "Optimal Balance",
      text: "Workload and lifestyle are well balanced. Maintain your schedule and take standard scheduled breaks.",
      boxClass: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      titleClass: "text-emerald-800 dark:text-emerald-400",
      actionText: "View study planner 📅",
      actionType: "planner"
    };
  };

  const rec = getRecommendation(liveIndex)

  const todayTasks = tasks.filter(t => t.status === 'Undone' && (isToday(t.due_date) || t.priority === 'High'))
  const todaySessions = sessions.filter(s => isToday(s.start_time))

  const upcomingTasks = tasks
    .filter(t => t.status === 'Undone')
    .sort((a, b) => {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date) - new Date(b.due_date)
    })
    .slice(0, 3)

  const latestWeek = weeklyProductivity[0] || { studyHours: 0, focus: 0, breaks: 0, status: 'Healthy' }
  const targetStudyHours = 10
  const weeklyStudyPercentage = Math.min(100, Math.round((latestWeek.studyHours / targetStudyHours) * 100))

  return (
    <SidebarLayout activeView="dashboard" user={user} onNavigate={onNavigate} onSignOut={onSignOut} onOpenGuide={onOpenGuide}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
              <span
                aria-hidden="true"
                className="inline-block w-8 h-8 shrink-0 bg-current"
                style={{
                  WebkitMaskImage: `url("${DashboardIcon}")`,
                  maskImage: `url("${DashboardIcon}")`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                }}
              />
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Welcome back, {user?.name || 'Student'}! Here is a summary of your focus, workload, and well-being.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center justify-between gap-4">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-455">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="text-xs font-bold text-rose-700 dark:text-rose-455 hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
            <div className="w-10 h-10 border-4 border-slate-350 border-t-[#2E5B70] dark:border-slate-850 dark:border-t-sky-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 dark:text-slate-550 font-bold">Synchronizing metrics...</p>
          </div>
        ) : (
          <>
            {/* Top row: Mindfulness Meter & Micro-break */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.2fr] gap-8 mt-2">

              {/* Card 1: Mindfulness Meter */}
              <Card
                title="Mindfulness Meter"
                description="Live snapshot of your cognitive load based on logged stress and pending database workload."
                className="h-[380px]"
              >
                <div className="flex-1 flex flex-col md:flex-row items-center gap-6 justify-around min-h-0 overflow-hidden">

                  {/* Gauge indicator & Pulse (Left) */}
                  <div className="flex flex-col items-center justify-center relative shrink-0 select-none">
                    <div className="relative">
                      <div className={`absolute inset-8 rounded-full blur-md opacity-25 dark:opacity-35 transition-all duration-700 ${liveIndex >= 76
                          ? 'bg-rose-500'
                          : liveIndex >= 41
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`} />

                      <svg className="w-44 h-44 transform -rotate-90 relative z-10">
                        <circle
                          cx="88"
                          cy="88"
                          r="56"
                          className="stroke-slate-200 dark:stroke-slate-800"
                          strokeWidth="11"
                          fill="transparent"
                        />
                        <circle
                          cx="88"
                          cy="88"
                          r="56"
                          className={`${risk.circleColor} transition-all duration-700`}
                          strokeWidth="11"
                          fill="transparent"
                          strokeDasharray="351.8"
                          strokeDashoffset={351.8 - (351.8 * liveIndex) / 100}
                          strokeLinecap="round"
                          style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                        <span className="text-3.5xl font-black text-slate-800 dark:text-slate-100 transition-all duration-300">
                          {liveIndex}%
                        </span>
                        <p className="text-[9px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 mt-0.5">Burnout</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider ${risk.borderClass} ${risk.colorClass}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {risk.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center w-full md:w-auto min-h-0">
                    {latestLog ? (
                      <div className="flex flex-col gap-4 text-left">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <span>Mood Load</span>
                              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[50px]">{latestLog.mood_level}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                style={{ width: `${liveScores?.moodScore || 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <span>Sleep Health</span>
                              <span className="text-slate-700 dark:text-slate-355 truncate">{latestLog.sleep_hours}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                                style={{ width: `${120 - (liveScores?.sleepQualityScore || 60)}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <span>Screen Time</span>
                              <span className="text-slate-700 dark:text-slate-350 truncate max-w-[65px]">{latestLog.screen_time}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${liveScores?.screenTimeScore || 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              <span>Workload</span>
                              <span className="text-slate-700 dark:text-slate-350 truncate">
                                {taskMetrics.pendingCount} Tasks
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div
                                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.round((liveScores?.pendingScore || 0) * 0.5 + (liveScores?.overdueScore || 0) * 0.25 + (liveScores?.missedScore || 0) * 0.25)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${rec.boxClass}`}>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">💡</span>
                            <h4 className={`text-[10px] font-extrabold uppercase tracking-wider ${rec.titleClass}`}>
                              {rec.title}
                            </h4>
                          </div>
                          <p className="text-[10.5px] leading-relaxed font-semibold">
                            {rec.text}
                          </p>
                          <div className="mt-0.5 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (rec.actionType === 'breathing') {
                                  handleStartBreathing();
                                } else {
                                  onNavigate(rec.actionType);
                                }
                              }}
                              className="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border border-current bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                            >
                              {rec.actionText}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-3 p-4 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
                            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <h4 className="text-xs font-bold text-amber-850 dark:text-amber-300">
                            Mental Check-in Pending
                          </h4>
                        </div>
                        <p className="text-[11px] font-semibold text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
                          How is your mind feeling today? Record your sleep quality, mood state, and screen time to compute your live burnout index.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigate('analytics')}
                          className="mt-1 flex items-center gap-1 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white dark:text-slate-950 dark:bg-amber-450 dark:hover:bg-amber-500 text-[10px] font-black uppercase rounded-xl transition-all duration-200 active:scale-95 cursor-pointer shadow-xs border-0"
                        >
                          <span>Log Today's Status</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card
                title="Micro-break"
                description="GUIDED MINDFULNESS: Take a dynamic 4-7-8 breathing pause to reset focus levels."
                className="h-[380px]"
              >
                <div className="flex-1 flex flex-col items-center justify-between gap-4">
                  <div className="flex-1 flex items-center justify-center relative w-full">
                    {breathingActive && (
                      <div
                        className="absolute w-32 h-32 rounded-full border border-sky-400/30 dark:border-sky-500/30 animate-ping duration-1000 scale-[1.3]"
                        style={{
                          animationDuration: breathPhase === 'Breathe In' ? '4000ms' : breathPhase === 'Breathe Out' ? '8000ms' : '7000ms'
                        }}
                      />
                    )}

                    <div
                      className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white bg-gradient-to-br from-[#2E5B70] to-[#C1F9FF] dark:from-sky-500 dark:to-indigo-600 shadow-md border border-white relative z-10 transition-transform ease-in-out select-none"
                      style={{
                        transform: breathPhase === 'Breathe In' && breathingActive
                          ? 'scale(1.35)'
                          : breathPhase === 'Hold' && breathingActive
                            ? 'scale(1.35)'
                            : breathPhase === 'Breathe Out' && breathingActive
                              ? 'scale(0.95)'
                              : 'scale(1.0)',
                        transitionDuration: breathPhase === 'Breathe In' && breathingActive
                          ? '4000ms'
                          : breathPhase === 'Breathe Out' && breathingActive
                            ? '8000ms'
                            : breathPhase === 'Hold' && breathingActive
                              ? '0ms'
                              : '1000ms',
                      }}
                    >
                      <span className="text-[10px] font-black tracking-widest uppercase">{breathPhase}</span>
                      {breathingActive && (
                        <span className="text-xl font-black mt-1.5">{phaseTime}s</span>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[11px] font-bold text-slate-605 dark:text-slate-350 min-h-4">
                      {breathingActive
                        ? `Focus on your breath. Cycles completed: ${breathCount}`
                        : 'Ready to relax? Click start to begin a 4-7-8 focus check-in.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full pt-2">
                    {!breathingActive ? (
                      <button
                        type="button"
                        onClick={handleStartBreathing}
                        className="flex-1 h-9 rounded-xl bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer border-0"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Start Exercise</span>
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handlePauseBreathing}
                          className="flex-1 h-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Pause</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetBreathing}
                          className="h-9 w-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-505 dark:text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:text-rose-450 dark:hover:border-rose-950 flex items-center justify-center transition-all cursor-pointer"
                          title="Reset counter"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Card>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.2fr_0.9fr] gap-8">

              <Card
                title="Today's Focus"
                description="Prioritized tasks and study sessions mapped for today."
                className="h-[360px]"
              >
                <div className="flex-1 overflow-y-auto flex flex-col gap-4.5 scrollbar-thin">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider text-left border-l-2 border-[#2E5B70] dark:border-sky-500 pl-2">
                      Today's Study Blocks
                    </span>
                    {todaySessions.length === 0 ? (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold italic text-left pl-2">
                        No sessions scheduled for today.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2 pl-2">
                        {todaySessions.map((session) => (
                          <div
                            key={session.session_id}
                            className="p-2.5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-left"
                          >
                            <div className="min-w-0 flex-1">
                               <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {session.title || 'Untitled Session'}
                              </h4>
                              <p className="text-[9px] text-slate-455 dark:text-slate-500 font-semibold mt-0.5">
                                ⏰ {new Date(session.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} • {session.duration_minutes}m • {session.category_name || 'General'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onNavigate('manager')}
                              className="shrink-0 text-[10px] font-black text-[#2E5B70] dark:text-sky-400 hover:underline cursor-pointer bg-transparent border-0"
                            >
                              Launch ⏱️
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-455 dark:text-slate-500 font-extrabold uppercase tracking-wider text-left border-l-2 border-amber-500 pl-2">
                      Today's Urgent Tasks
                    </span>
                    {todayTasks.length === 0 ? (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold italic text-left pl-2">
                        No high priority or due tasks today.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2 pl-2">
                        {todayTasks.map((task) => (
                          <div
                            key={task.task_id}
                            className="p-2.5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3 text-left"
                          >
                            <input
                              type="checkbox"
                              checked={task.status === 'Done'}
                              onChange={() => handleCompleteTask(task.task_id)}
                              className="w-4 h-4 rounded border-slate-350 text-[#2E5B70] dark:text-sky-400 focus:ring-[#2E5B70] dark:bg-[#0F172A] dark:border-slate-850 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {task.title}
                              </h4>
                              <p className="text-[9px] text-slate-455 dark:text-slate-500 font-semibold mt-0.5">
                                {task.category || 'General'} • {task.priority} Priority
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card
                title="Upcoming"
                description="Assignments, projects, and deliverables sorted by nearest deadline."
                className="h-[360px]"
              >
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
                  {upcomingTasks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-1.5 py-6 select-none">
                      <span className="text-2xl">✨</span>
                      <p className="text-[11px] text-slate-455 dark:text-slate-500 font-bold">All caught up! No upcoming tasks.</p>
                    </div>
                  ) : (
                    upcomingTasks.map((task) => {
                      return (
                        <div
                          key={task.task_id}
                          className="p-3.5 bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl border border-[#2E5B7090] dark:border-[#38BDF890] flex items-center justify-between gap-4 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={task.status === 'Done'}
                              onChange={() => handleCompleteTask(task.task_id)}
                              className="w-4.5 h-4.5 rounded border-slate-350 text-[#2E5B70] focus:ring-[#2E5B70] dark:bg-[#0F172A] dark:border-slate-800 cursor-pointer"
                            />
                            <div className="text-left min-w-0 flex-1">
                              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                {task.title}
                              </h3>
                              <p className="text-[10px] text-slate-455 dark:text-slate-500 font-semibold truncate mt-0.5">
                                {task.category || 'General'} • Due {formatRelativeDate(task.due_date)}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${task.priority === 'High'
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                : task.priority === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                              }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </Card>

              <Card
                title="Weekly Goal"
                description="Compare your study progress to the weekly goal."
                className="h-[360px]"
              >
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2.5 text-left">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-205">Weekly Target</span>
                      <span className="text-xs font-black text-[#2E5B70] dark:text-sky-400">
                        {latestWeek.studyHours} / {targetStudyHours} hrs
                      </span>
                    </div>

                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/80">
                      <div
                        className="h-full bg-gradient-to-r from-[#2E5B70] to-[#E28743] dark:from-sky-400 dark:to-indigo-500 transition-all duration-500 rounded-full"
                        style={{ width: `${weeklyStudyPercentage}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold">
                      You are {weeklyStudyPercentage}% of the way to your 10-hour focus study target!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 border-t border-slate-200 dark:border-slate-800/80 pt-4.5">
                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider font-heading">Avg Focus</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                        {latestWeek.focus}%
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 text-left">
                      <span className="text-[9px] text-slate-400 dark:text-slate-555 font-extrabold uppercase tracking-wider">Breaks Taken</span>
                      <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                        {latestWeek.breaks} breaks
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 text-left col-span-2">
                      <span className="text-[9px] text-slate-400 dark:text-slate-555 font-extrabold uppercase tracking-wider font-heading">Balance Assessment</span>
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-350">
                        Status: <strong className={latestWeek.status.includes('Burnout') || latestWeek.status.includes('Fatigue') ? 'text-amber-500' : 'text-emerald-500 dark:text-emerald-450'}>{latestWeek.status}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-left">
                    <button
                      type="button"
                      onClick={() => onNavigate('analytics')}
                      className="text-[10px] font-black text-[#2E5B70] dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
                    >
                      <span>Analyze detailed logs</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </Card>

            </div>
          </>
        )}
      </div>
    </SidebarLayout>
  )
}