import { useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Select from '../Select'
import taskService from '../../../services/taskService'
import studySessionService from '../../../services/studySessionService'

export default function NewSessionModal({ isOpen, onClose, preselectedDate, onSessionCreated }) {
  const [subjectTask, setSubjectTask] = useState('')
  const [date, setDate] = useState('')
  const [timeVal, setTimeVal] = useState('')
  const [ampm, setAmpm] = useState('AM')
  const [tasks, setTasks] = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [error, setError] = useState('')

  // Populate preselected date on open
  useEffect(() => {
    if (isOpen) {
      if (preselectedDate) {
        setDate(preselectedDate)
      } else {
        setDate('')
      }
      setSelectedTaskId(null)
      setSubjectTask('')
      setTimeVal('10:00')
      setAmpm('AM')
      setError('')
    }
  }, [isOpen, preselectedDate])

  // Load user tasks to link with sessions
  useEffect(() => {
    if (isOpen) {
      taskService.getTasks()
        .then(data => {
          setTasks((data || []).filter(t => t.status !== 'Done'))
        })
        .catch(err => console.error("Error loading tasks for session modal:", err))
    }
  }, [isOpen])

  const handleTimeChange = (e) => {
    let val = e.target.value.replace(/[^0-9:]/g, '')
    if (val.length === 2 && !val.includes(':') && e.nativeEvent.inputType !== 'deleteContentBackward') {
      val = val + ':'
    }
    if (val.length > 5) {
      val = val.substring(0, 5)
    }
    setTimeVal(val)
  }

  const toggleAmPm = () => {
    setAmpm((prev) => (prev === 'AM' ? 'PM' : 'AM'))
  }
  const [duration, setDuration] = useState('30 mins')
  const [focusTechnique, setFocusTechnique] = useState('Pomodoro')
  const [breakDuration, setBreakDuration] = useState('5 mins')
  const [burnoutPrevention, setBurnoutPrevention] = useState(true)

  const techniqueOptions = [
    { value: 'Pomodoro', label: 'Pomodoro' },
    { value: 'Custom', label: 'Custom' },
  ]

  const breakOptions = [
    { value: '5 mins', label: '5 mins' },
    { value: '10 mins', label: '10 mins' },
    { value: '15 mins', label: '15 mins' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (!date) {
        setError('Please select a date')
        return
      }

      if (!timeVal || !timeVal.includes(':')) {
        setError('Please enter time in HH:MM format')
        return
      }

      const [hoursStr, minutesStr] = timeVal.split(':')
      const hours = parseInt(hoursStr, 10)
      const minutes = parseInt(minutesStr, 10)

      if (isNaN(hours) || isNaN(minutes)) {
        setError('Please enter a valid hour and minute')
        return
      }

      if (hours < 1 || hours > 12) {
        setError('Hours must be between 1 and 12')
        return
      }

      if (minutes < 0 || minutes > 59) {
        setError('Minutes must be between 00 and 59')
        return
      }

      let adjustedHours = hours
      if (ampm === 'PM' && hours < 12) adjustedHours += 12
      if (ampm === 'AM' && hours === 12) adjustedHours = 0

      // Form datetime in local timezone
      const startDateTime = new Date(date)
      startDateTime.setHours(adjustedHours, minutes, 0, 0)

      if (isNaN(startDateTime.getTime())) {
        setError('Please enter a valid date')
        return
      }

      const now = new Date()
      if (startDateTime < now) {
        setError("Study session date and time can't be in the past")
        return
      }

      const durationMinutes = parseInt(duration, 10) || 30

      await studySessionService.createSession({
        taskId: selectedTaskId || null,
        title: subjectTask,
        startTime: startDateTime.toISOString(),
        durationMinutes,
        focusTechnique,
        breakDuration,
        burnoutPrevention: !!burnoutPrevention
      })

      if (onSessionCreated) {
        onSessionCreated()
      }
      onClose()
    } catch (err) {
      console.error('Failed to create study session:', err)
      setError('Server error while saving session')
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all transform relative">
          
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <DialogTitle className="text-2xl font-extrabold text-[#2E5B70] dark:text-slate-100 font-sans tracking-tight">
            New Study Session
          </DialogTitle>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-medium mt-1">
            Design your focused session for learning.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4.5 text-left">
            {/* Link to Task Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Link to Task (Optional)</label>
              <select
                value={selectedTaskId || ''}
                onChange={(e) => {
                  const val = e.target.value
                  if (val) {
                    const id = parseInt(val, 10)
                    setSelectedTaskId(id)
                    const found = tasks.find(t => t.task_id === id)
                    if (found) {
                      setSubjectTask(found.title)
                    }
                  } else {
                    setSelectedTaskId(null)
                    setSubjectTask('')
                  }
                }}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all cursor-pointer"
              >
                <option value="">-- No Task / Custom Session --</option>
                {tasks.map(t => (
                  <option key={t.task_id} value={t.task_id}>{t.title} ({t.priority})</option>
                ))}
              </select>
            </div>

            {/* Subject / Task */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Subject / Task</label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structure and Algorithms"
                value={subjectTask}
                onChange={(e) => setSubjectTask(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all cursor-pointer datetime-input"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 z-0">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Time</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="10:00"
                    value={timeVal}
                    onChange={handleTimeChange}
                    className="w-full h-11 pl-4 pr-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={toggleAmPm}
                    className="absolute right-1.5 h-8 px-2.5 rounded-lg bg-[#2E5B70]/10 dark:bg-sky-500/20 text-[#2E5B70] dark:text-sky-400 hover:bg-[#2E5B70]/20 text-[10px] font-extrabold tracking-wider transition-colors cursor-pointer select-none"
                  >
                    {ampm}
                  </button>
                </div>
              </div>
            </div>

            {/* Duration Buttons */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</label>
              <div className="flex gap-3 h-11">
                {['30 mins', '60 mins', '90 mins'].map((d) => {
                  const isActive = duration === d
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`flex-1 h-full rounded-xl border font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#2E5B70] bg-[#2E5B70]/10 text-[#2E5B70] dark:border-[#38BDF8] dark:bg-[#38BDF8]/10 dark:text-[#38BDF8]'
                          : 'border-slate-200 dark:border-slate-850 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Focus Technique and Break Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Focus Technique</label>
                <Select value={focusTechnique} onChange={setFocusTechnique} options={techniqueOptions} className="h-11" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Break Duration</label>
                <Select value={breakDuration} onChange={setBreakDuration} options={breakOptions} className="h-11" />
              </div>
            </div>

            {/* Burnout Prevention Card */}
            <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between transition-all">
              <div className="flex items-center gap-3 text-left">
                <span className="text-xl text-emerald-600 dark:text-emerald-400">🍃</span>
                <div>
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Burnout Prevention</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Auto-scales breaks based on intensity.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBurnoutPrevention(!burnoutPrevention)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  burnoutPrevention ? 'bg-emerald-600' : 'bg-slate-350 dark:bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    burnoutPrevention ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Validation Error Alert */}
            {error && (
              <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20 text-xs font-bold rounded-xl text-center">
                ⚠️ {error}
              </div>
            )}

            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end gap-3.5 mt-4 border-t border-slate-100 dark:border-slate-800 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial h-11 px-6 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial h-11 px-8 rounded-full bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Schedule Session
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
