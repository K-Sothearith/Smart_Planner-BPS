import { useState, useEffect } from 'react'
import SidebarLayout from '../components/layouts/SidebarLayout'
import { ManagerIcon } from '../assets'
import Select from '../components/ui/Select'
import NewTaskModal from '../components/ui/modals/NewTaskModal'
import NewSessionModal from '../components/ui/modals/NewSessionModal'
import DeleteConfirmModal from '../components/ui/modals/DeleteConfirmModal'
import StartSessionDetailModal from '../components/ui/modals/StartSessionDetailModal'
import StudySessionTimerModal from '../components/ui/modals/StudySessionTimerModal'
import taskService from '../services/taskService.js'
import studySessionService from '../services/studySessionService.js'

export default function Manager({ user, onNavigate, onSignOut, onOpenGuide, refreshStreak }) {
  
  const [focusDuration, setFocusDuration] = useState('25 Minutes (Standard)')
  const [breakMethod, setBreakMethod] = useState('5 Mins (Pomodoro Break)')
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [isNewSessionOpen, setIsNewSessionOpen] = useState(false)
  const [selectedStartSession, setSelectedStartSession] = useState(null)
  const [isStartDetailOpen, setIsStartDetailOpen] = useState(false)
  const [isTimerOpen, setIsTimerOpen] = useState(false)

  const focusOptions = [
    { value: '25 Minutes (Standard)', label: '25 Minutes (Standard)' },
    { value: '50 Minutes (Deep Work)', label: '50 Minutes (Deep Work)' },
    { value: '15 Minutes (Short Focus)', label: '15 Minutes (Short Focus)' },
    { value: 'Custom (Settings-Based)', label: 'Custom (Settings-Based)' },
  ]

  const breakOptions = [
    { value: '5 Mins (Pomodoro Break)', label: '5 Mins (Pomodoro Break)' },
    { value: '10 Mins (Extended Rest)', label: '10 Mins (Extended Rest)' },
    { value: 'No Break (Continuous)', label: 'No Break (Continuous)' },
    { value: 'Custom (Settings-Based)', label: 'Custom (Settings-Based)' },
  ]

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const isPastDueOrToday = (dueDateStr) => {
    if (!dueDateStr) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dueDateStr)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate <= today
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.completeTask(taskId)
      fetchTasks()
      if (refreshStreak) {
        refreshStreak()
      }
    } catch (err) {
      console.error('Failed to complete task:', err)
    }
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return
    try {
      await taskService.deleteTask(taskToDelete.task_id)
      fetchTasks()
      setIsDeleteOpen(false)
      setTaskToDelete(null)
      if (refreshStreak) {
        refreshStreak()
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return

    try {
      await studySessionService.deleteSession(sessionToDelete.session_id)

      fetchSessions()

      setIsDeleteSessionOpen(false)
      setSessionToDelete(null)

      if (refreshStreak) {
        refreshStreak()
      }

    } catch (err) {
      console.error("Failed to delete session:", err)
    }
  }

  const [sessions, setSessions] = useState([])
  const [sessionToEdit, setSessionToEdit] = useState(null)
  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [isDeleteSessionOpen, setIsDeleteSessionOpen] = useState(false)

  const fetchSessions = async () => {
    try {
      const data = await studySessionService.getSessions()
      setSessions(data || [])
    } catch (err) {
      console.error('Failed to fetch study sessions:', err)
    }
  }

  useEffect(() => {
    fetchTasks()
    fetchSessions()
  }, [])

  return (
    <SidebarLayout activeView="manager" user={user} onNavigate={onNavigate} onSignOut={onSignOut} onOpenGuide={onOpenGuide}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-8 shrink-0 bg-current"
              style={{
                WebkitMaskImage: `url("${ManagerIcon}")`,
                maskImage: `url("${ManagerIcon}")`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
            Task-Study Session Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Manage your daily tasks and launch study sessions to maintain balanced focus and avoid burnout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[38%_60%] gap-8 mt-4">
          
          <div className="flex flex-col h-155 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
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
                onClick={() => {
                  setTaskToEdit(null)
                  setIsNewTaskOpen(true)
                }}
                className="h-9 px-4 rounded-xl bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                <span>Add Task</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 scrollbar-thin">
              {loading ? (
                <div className="text-center py-6 text-xs text-slate-400 font-semibold">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl">📝</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">No tasks yet. Click "Add Task" to get started!</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 rounded-xl border border-[#2E5B7090] dark:border-[#38BDF890] flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'Done'}
                        disabled={task.status === 'Done'}
                        onChange={() => handleCompleteTask(task.task_id)}
                        className="w-4.5 h-4.5 rounded border-slate-300 text-[#2E5B70] focus:ring-[#2E5B70] dark:bg-[#0F172A] dark:border-slate-800 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="text-left min-w-0 flex-1">
                        <h3 className={`text-xs font-bold text-slate-800 dark:text-slate-200 truncate ${task.status === 'Done' ? 'line-through text-slate-455 dark:text-slate-600' : ''}`}>{task.title}</h3>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold truncate mt-0.5">{task.category || 'General'} • Due {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
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
                          task.status === 'Done'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : isPastDueOrToday(task.due_date)
                            ? 'bg-rose-500/10 text-rose-650 dark:text-rose-455 border-rose-500/20'
                            : 'bg-slate-105 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>
                          {task.status === 'Done' ? 'Done' : (isPastDueOrToday(task.due_date) ? 'Overdue' : 'Undone')}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 border-l border-slate-200 dark:border-slate-800/80 pl-3">
                        <button
                          type="button"
                          disabled={task.status === 'Done'}
                          onClick={() => {
                            if (task.status !== 'Done') {
                              setTaskToEdit(task)
                              setIsNewTaskOpen(true)
                            }
                          }}
                          className={`transition-colors p-0.5 ${
                            task.status === 'Done'
                              ? 'text-slate-350 dark:text-slate-700 opacity-40 cursor-not-allowed pointer-events-none'
                              : 'text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 cursor-pointer'
                          }`}
                          title="Edit Task"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 19.482a4.5 4.5 0 01-2.203 1.258l-3.483.782.782-3.483a4.5 4.5 0 011.258-2.203L16.862 4.487zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setTaskToDelete(task)
                            setIsDeleteOpen(true)
                          }}
                          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-0.5 cursor-pointer"
                          title="Delete Task"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col h-155 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
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
                onClick={() => {
                  setSessionToEdit(null)
                  setIsNewSessionOpen(true)
                }}
                className="h-9 px-4 rounded-xl bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Add Session</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8 scrollbar-thin">
              
              <div className="flex-1 flex flex-col gap-4 text-left min-w-[440px] border-r-slate-400 border-r-1">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Session History</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold -mt-3.5">Click on the study session card to start</p>
                <div className="flex flex-col gap-2.5">
                  {sessions.length === 0 ? (
                    <div className="p-4 w-105 bg-slate-80 dark:bg-slate-900/10 border border-dashed border-slate-200/40 dark:border-slate-800/30 rounded-xl text-center text-xs text-slate-400 dark:text-slate-650 font-semibold">
                      No study sessions scheduled yet. Click "Start Session" to schedule one.
                    </div>
                  ) : (
                    sessions.map((session) => {
                      const isCompleted = session.is_completed === 1 || session.is_completed === true;
                      const safeStartTime = new Date(typeof session.start_time === 'string' ? session.start_time.replace(' ', 'T') : session.start_time);
                      const isLate = !isCompleted && safeStartTime < new Date();
                      const formattedDate = safeStartTime.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <div
                          key={session.session_id}
                          onClick={() => {
                            if (!isCompleted) {
                              setSelectedStartSession(session)
                              setIsStartDetailOpen(true)
                            }
                          }}
                          className={`p-3 w-105 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-[#2E5B7090] dark:border-[#38BDF890] flex items-center justify-between text-xs transition-all hover:bg-slate-100/50 dark:hover:bg-slate-800/40 ${
                            isCompleted ? '' : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex flex-col text-left gap-0.5 min-w-0 flex-1 pr-2">
                            <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                              {session.title || session.task_title || 'Focused Study'}
                            </span>
                            <span className="text-[10px] text-slate-455 dark:text-slate-400 font-medium">
                              {session.focus_technique || 'Pomodoro'} • {session.duration_minutes} mins
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
                              {formattedDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-right shrink-0">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {isCompleted ? '95' : '--'}
                              </span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">Focus Score</span>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                              isCompleted
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : (isLate
                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20'
                                    : 'bg-amber-500/10 text-amber-605 dark:text-amber-400 border-amber-500/20')
                            }`}>
                              {isCompleted ? 'Completed' : (isLate ? 'Late' : 'Scheduled')}
                            </span>
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col gap-1.5 border-l border-slate-200 dark:border-slate-800/80 pl-3">
                                <button
                                  type="button"
                                  disabled={isCompleted}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!isCompleted) {
                                      setSessionToEdit(session)
                                      setIsNewSessionOpen(true)
                                    }
                                  }}
                                  className={`transition-colors p-0.5 ${
                                    isCompleted
                                      ? 'text-slate-350 dark:text-slate-700 opacity-40 cursor-not-allowed pointer-events-none'
                                      : 'text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 cursor-pointer'
                                  }`}
                                  title="Edit Session"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <path
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 19.482a4.5 4.5 0 01-2.203 1.258l-3.483.782.782-3.483a4.5 4.5 0 011.258-2.203L16.862 4.487zm0 0L19.5 7.125"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSessionToDelete(session)
                                    setIsDeleteSessionOpen(true)
                                  }}
                                  className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-450 transition-colors p-0.5 cursor-pointer"
                                  title="Delete Session"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <path
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 text-left">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Timer Settings</h3>
                <div className="grid grid-cols-1 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Focus Duration</label>
                    <Select
                      value={focusDuration}
                      onChange={setFocusDuration}
                      options={focusOptions}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Break Method</label>
                    <Select
                      value={breakMethod}
                      onChange={setBreakMethod}
                      options={breakOptions}
                    />
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onTaskCreated={() => {
          fetchTasks()
          if (refreshStreak) {
            refreshStreak()
          }
        }}
        task={taskToEdit}
      />
      <NewSessionModal 
        isOpen={isNewSessionOpen}
        onClose={() => {
          setIsNewSessionOpen(false)
          setSessionToEdit(null)
        }}
          onSessionCreated={() => {
            fetchSessions()
            if (refreshStreak)
            refreshStreak()
        }}
        session={sessionToEdit}
      />
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setTaskToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete ? taskToDelete.title : ''}
        type="Task"
      />
      <DeleteConfirmModal
        isOpen={isDeleteSessionOpen}
        onClose={() => {
            setIsDeleteSessionOpen(false)
            setSessionToDelete(null)
        }}
        onConfirm={handleDeleteSession}
        taskTitle={
            sessionToDelete
                ? sessionToDelete.title || sessionToDelete.task_title
                : ""
        }
        type="Study Session"
      />
      <StartSessionDetailModal
        isOpen={isStartDetailOpen}
        onClose={() => {
          setIsStartDetailOpen(false)
          setSelectedStartSession(null)
        }}
        onStart={() => {
          setIsStartDetailOpen(false)
          setIsTimerOpen(true)
        }}
        session={selectedStartSession}
      />
      <StudySessionTimerModal
        isOpen={isTimerOpen}
        onClose={() => {
          setIsTimerOpen(false)
          setSelectedStartSession(null)
        }}
        session={selectedStartSession}
        focusSetting={focusDuration}
        breakSetting={breakMethod}
        onSessionFinished={() => {
          fetchSessions()
          if (refreshStreak) {
            refreshStreak()
          }
        }}
      />
    </SidebarLayout>
  )
}

