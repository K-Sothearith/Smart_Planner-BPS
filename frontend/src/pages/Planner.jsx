import { useState, useEffect } from 'react'
import SidebarLayout from '../components/layouts/SidebarLayout'
import { PlannerIcon } from '../assets'
import taskService from '../services/taskService.js'
import studySessionService from '../services/studySessionService.js'
import NewSessionModal from '../components/ui/modals/NewSessionModal'

export default function Planner({ user, onNavigate, onSignOut, onOpenGuide, refreshStreak }) {
  const [tasks, setTasks] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
  )
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false)
  const [preselectedDate, setPreselectedDate] = useState('')

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const fetchData = async () => {
    try {
      setLoading(true)
      const tasksData = await taskService.getTasks()
      const sessionsData = await studySessionService.getSessions()
      setTasks(tasksData || [])
      setSessions(sessionsData || [])
    } catch (err) {
      console.error('Failed to fetch planner data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.completeTask(taskId)
      fetchData()
      if (refreshStreak) {
        refreshStreak()
      }
    } catch (err) {
      console.error('Failed to complete task:', err)
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getStartDayIndex = (year, month) => {
    const day = new Date(year, month, 1).getDay()
    return (day + 6) % 7
  }

  const days = []
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth)
  const startDay = getStartDayIndex(currentYear, currentMonth)

  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      dayNum: daysInPrevMonth - i,
      month: prevMonth,
      year: prevMonthYear,
      isCurrentMonth: false,
    })
  }

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    days.push({
      dayNum: i,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true,
    })
  }

  const remainingCells = 42 - days.length
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      dayNum: i,
      month: nextMonth,
      year: nextMonthYear,
      isCurrentMonth: false,
    })
  }

  const getCellDateStr = (year, month, day) => {
    const y = year
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const getTasksForDate = (dateStr) => {
    return tasks.filter(t => t.due_date && String(t.due_date).substring(0, 10) === dateStr)
  }

  const getSessionsForDate = (dateStr) => {
    return sessions.filter(s => s.start_time && String(s.start_time).substring(0, 10) === dateStr)
  }

  const getSelectedDateTitle = () => {
    if (!selectedDateStr) return 'Select a Day'
    const parts = selectedDateStr.split('-')
    const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    return dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const selectedDateTasks = getTasksForDate(selectedDateStr)
  const selectedDateSessions = getSessionsForDate(selectedDateStr)

  const upcomingItems = []
  
  tasks.forEach(t => {
    if (t.due_date && t.status !== 'Done') {
      upcomingItems.push({
        id: `task-${t.task_id}`,
        type: 'task',
        title: t.title,
        date: new Date(String(t.due_date).substring(0, 10) + 'T23:59:59'),
        priority: t.priority,
        category: t.category,
        status: t.status,
        originalItem: t
      })
    }
  })

  sessions.forEach(s => {
    if (s.start_time) {
      const sDate = new Date(s.start_time)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (sDate >= today) {
        upcomingItems.push({
          id: `session-${s.session_id}`,
          type: 'session',
          title: s.title || s.task_title || 'Focused Study',
          date: sDate,
          duration: s.duration_minutes,
          technique: s.focus_technique,
          originalItem: s
        })
      }
    }
  })

  upcomingItems.sort((a, b) => a.date - b.date)

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })

  return (
    <SidebarLayout activeView="planner" user={user} onNavigate={onNavigate} onSignOut={onSignOut} onOpenGuide={onOpenGuide}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
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

        <div className="grid grid-cols-1 lg:grid-cols-[68%_30%] gap-6 mt-2">
          
          <div className="flex flex-col gap-6">
            
            <div className="flex flex-col bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
              {/* Calendar Header */}
              <div className="p-5 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2.5 h-11.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">{monthName} {currentYear}</h2>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Select a day to view daily scheduled work.</p>
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                    title="Previous Month"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                    title="Next Month"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-1.5 select-none">
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <span key={day} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1">
                      {day}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {days.map((dayData, index) => {
                    const cellDateStr = getCellDateStr(dayData.year, dayData.month, dayData.dayNum)
                    const dayTasks = getTasksForDate(cellDateStr)
                    const daySessions = getSessionsForDate(cellDateStr)
                    
                    const today = new Date()
                    const isToday = getCellDateStr(today.getFullYear(), today.getMonth(), today.getDate()) === cellDateStr
                    const isSelected = selectedDateStr === cellDateStr
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDateStr(cellDateStr)}
                        className={`group relative min-h-16 md:min-h-20 p-1.5 rounded-xl border flex flex-col text-left transition-all duration-200 cursor-pointer hover:border-indigo-400/50 dark:hover:border-indigo-500/30 ${
                          dayData.isCurrentMonth
                            ? 'bg-slate-50/20 dark:bg-[#0F172A]/10 border-slate-200/60 dark:border-slate-800/40 text-slate-700 dark:text-slate-355'
                            : 'bg-slate-100/10 dark:bg-[#0F172A]/5 border-slate-100 dark:border-slate-900/10 text-slate-350 dark:text-slate-650'
                        } ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500 dark:border-indigo-400 dark:bg-indigo-400/5 dark:ring-indigo-400'
                            : ''
                        } ${
                          isToday && !isSelected
                            ? 'border-emerald-500/50 bg-emerald-500/5 dark:border-emerald-500/30 dark:bg-emerald-500/5 font-extrabold'
                            : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[10px] md:text-xs font-bold px-1 py-0.5 rounded-md ${
                            isToday ? 'bg-emerald-500 text-white dark:bg-emerald-600' : ''
                          }`}>
                            {dayData.dayNum}
                          </span>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreselectedDate(cellDateStr)
                              setIsNewSessionOpen(true)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded bg-[#2E5B70]/10 hover:bg-[#2E5B70] text-[#2E5B70] hover:text-white dark:bg-sky-500/20 dark:hover:bg-[#38BDF8] dark:text-sky-400 dark:hover:text-slate-900 flex items-center justify-center text-[10px] font-bold cursor-pointer"
                            title="Schedule Study Session"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex flex-col gap-1 overflow-hidden mt-0.5">
                          {dayTasks.map(t => (
                            <div
                              key={t.task_id}
                              className={`text-[8px] md:text-[9px] font-bold px-1 py-0.5 rounded truncate border ${
                                t.status === 'Done'
                                  ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-450 border-emerald-500/10 line-through'
                                  : 'bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/10'
                              }`}
                              title={`Task Deadline: ${t.title}`}
                            >
                              ⏰ {t.title}
                            </div>
                          ))}
                          {daySessions.map(s => (
                            <div
                              key={s.session_id}
                              className="text-[8px] md:text-[9px] font-bold px-1 py-0.5 rounded truncate border bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/10"
                              title={`Study Session: ${s.title || s.task_title}`}
                            >
                              📚 {s.title || s.task_title || 'Focused Study'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm p-6 text-left transition-all duration-300">
              <div className="flex justify-between items-start border-b border-slate-300 dark:border-slate-700/80 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Schedule for Today
                  </h3>
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-[#38BDF8] mt-1 font-sans">
                    {getSelectedDateTitle()}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPreselectedDate(selectedDateStr)
                    setIsNewSessionOpen(true)
                  }}
                  className="h-8 px-3 rounded-lg bg-[#2E5B70]/10 hover:bg-[#2E5B70]/20 text-[#2E5B70] dark:bg-[#38BDF8]/20 dark:hover:bg-[#38BDF8]/30 dark:text-[#38BDF8] text-[10px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                  <span>Schedule Study Session</span>
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {selectedDateTasks.length === 0 && selectedDateSessions.length === 0 ? (
                  <div className="text-center py-6 flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">🍃</span>
                    <p className="text-xs text-slate-450 dark:text-slate-500 font-bold">No tasks or study sessions scheduled for this day.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Tasks Due ({selectedDateTasks.length})
                      </h4>
                      {selectedDateTasks.map(t => (
                        <div
                          key={t.task_id}
                          className="p-3 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-850 flex items-center justify-between gap-3 text-xs transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={t.status === 'Done'}
                              disabled={t.status === 'Done'}
                              onChange={() => handleCompleteTask(t.task_id)}
                              className="w-4 h-4 rounded border-slate-300 text-[#2E5B70] focus:ring-[#2E5B70] dark:bg-[#0F172A] dark:border-slate-800 cursor-pointer disabled:cursor-not-allowed shrink-0"
                            />
                            <span className={`font-bold text-slate-700 dark:text-slate-300 truncate ${t.status === 'Done' ? 'line-through text-slate-400 dark:text-slate-655' : ''}`}>
                              {t.title}
                            </span>
                          </div>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                            t.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : t.priority === 'Medium'
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Study Sessions ({selectedDateSessions.length})
                      </h4>
                      {selectedDateSessions.map(s => {
                        const formattedTime = new Date(s.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                        return (
                          <div
                            key={s.session_id}
                            className="p-3 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-850 flex items-center justify-between gap-3 text-xs transition-all"
                          >
                            <div className="text-left min-w-0 flex-1">
                              <h5 className="font-bold text-slate-700 dark:text-slate-300 truncate">
                                {s.title || s.task_title || 'Focused Study'}
                              </h5>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                                {s.focus_technique || 'Pomodoro'} • {s.duration_minutes} mins
                              </p>
                            </div>
                            <span className="text-[10px] font-extrabold text-indigo-600 dark:text-[#38BDF8] shrink-0 bg-indigo-500/5 px-2 py-0.5 rounded">
                              {formattedTime}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col h-230 lg:h-auto bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300 max-h-[910px]">
            <div className="p-5 border-b border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-455">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Agenda Chronology</h2>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                Deadlines and study sessions sorted by closest date first.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5 scrollbar-thin">
              {loading ? (
                <div className="text-center py-6 text-xs text-slate-400 font-semibold">Loading agenda...</div>
              ) : upcomingItems.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">📋</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">No upcoming items.</p>
                </div>
              ) : (
                upcomingItems.map((item) => {
                  const isTask = item.type === 'task'
                  const formattedDate = item.date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })
                  const formattedTime = !isTask 
                    ? item.date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                    : ''

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2.5 text-left ${
                        isTask
                          ? 'bg-rose-500/5 border-rose-500/10 hover:bg-rose-500/10'
                          : 'bg-indigo-500/5 border-indigo-500/10 hover:bg-indigo-500/10'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm shrink-0">
                            {isTask ? '⏰' : '📚'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {item.title}
                          </h4>
                        </div>

                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                          isTask
                            ? 'bg-rose-500/15 text-rose-600 border-rose-500/20'
                            : 'bg-indigo-500/15 text-indigo-600 border-indigo-500/20'
                        }`}>
                          {isTask ? 'Task' : 'Session'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-200/40 dark:border-slate-800/40 pt-2">
                        <div className="flex flex-col gap-0.5">
                          <span>
                            {isTask ? 'Due Date' : 'Scheduled'}
                          </span>
                          <span className="text-slate-600 dark:text-slate-350 font-bold">
                            {formattedDate} {formattedTime && `at ${formattedTime}`}
                          </span>
                        </div>

                        <div>
                          {isTask ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={item.status === 'Done'}
                                disabled={item.status === 'Done'}
                                onChange={() => handleCompleteTask(item.originalItem.task_id)}
                                className="w-3.5 h-3.5 rounded border-slate-300 text-rose-500 focus:ring-rose-500 dark:bg-[#0F172A] dark:border-slate-800 cursor-pointer disabled:cursor-not-allowed"
                                title="Mark as Completed"
                              />
                              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                                item.priority === 'High'
                                  ? 'bg-rose-500/10 text-rose-500'
                                  : item.priority === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-slate-500/10 text-slate-500'
                              }`}>
                                {item.priority}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-600 dark:text-slate-355 font-bold">
                              {item.duration} mins
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>

      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => {
          setIsNewSessionOpen(false)
          setPreselectedDate('')
        }}
        preselectedDate={preselectedDate}
        onSessionCreated={fetchData}
      />
    </SidebarLayout>
  )
}
