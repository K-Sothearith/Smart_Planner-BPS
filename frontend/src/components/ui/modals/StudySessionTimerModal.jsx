import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import studySessionService from '../../../services/studySessionService'

export default function StudySessionTimerModal({ isOpen, onClose, session, focusSetting, breakSetting, onSessionFinished }) {
  if (!session) return null

  // Helpers to parse minutes from global settings text
  const parseFocusMinutes = (str) => {
    if (!str) return 25
    if (str.includes('25')) return 25
    if (str.includes('50')) return 50
    if (str.includes('15')) return 15
    return 25
  }

  const parseBreakMinutes = (str) => {
    if (!str) return 5
    if (str.includes('5')) return 5
    if (str.includes('10')) return 10
    if (str.includes('No Break') || str.includes('Continuous')) return 0
    return 5
  }

  const focusMinutes = parseFocusMinutes(focusSetting)
  const breakMinutes = parseBreakMinutes(breakSetting)

  const totalSessionMinutes = session.duration_minutes || 30

  // State
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(totalSessionMinutes * 60)
  const [currentMode, setCurrentMode] = useState('focus') // 'focus' or 'break'
  const [periodSecondsLeft, setPeriodSecondsLeft] = useState(Math.min(focusMinutes * 60, totalSessionMinutes * 60))
  const [periodTotalSeconds, setPeriodTotalSeconds] = useState(Math.min(focusMinutes * 60, totalSessionMinutes * 60))
  const [isSaving, setIsSaving] = useState(false)

  // Ref to hold interval ID
  const intervalRef = useRef(null)

  // Play a simple synthesized alert chime
  const playChime = (type = 'switch') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      
      if (type === 'complete') {
        // High-pitch double chime for completion
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()
        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(ctx.destination)
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        osc1.frequency.setValueAtTime(880, ctx.currentTime) // A5
        osc2.frequency.setValueAtTime(1109, ctx.currentTime + 0.12) // C#6
        
        osc1.start()
        osc2.start()
        osc1.stop(ctx.currentTime + 0.12)
        osc2.stop(ctx.currentTime + 0.4)
      } else {
        // Normal focus/break switch sound
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        osc.frequency.setValueAtTime(type === 'break' ? 523.25 : 659.25, ctx.currentTime) // C5 or E5
        osc.start()
        osc.stop(ctx.currentTime + 0.25)
      }
    } catch (e) {
      console.log('Audio Context error (blocked by browser or not supported):', e)
    }
  }

  // Handle finalizing session in backend
  const handleFinishSession = async (finishedNormally = false) => {
    if (isSaving) return
    setIsSaving(true)
    try {
      // Mark session as completed
      await studySessionService.updateSession(session.session_id, {
        taskId: session.task_id || null,
        title: session.title || session.task_title || 'Focused Study Block',
        startTime: new Date(session.start_time).toISOString(),
        durationMinutes: totalSessionMinutes,
        focusTechnique: session.focus_technique || 'Pomodoro',
        breakDuration: session.break_duration || '5 mins',
        burnoutPrevention: !!session.burnout_prevention,
        isCompleted: true
      })

      playChime('complete')
      if (onSessionFinished) {
        onSessionFinished()
      }
      onClose()
    } catch (err) {
      console.error('Failed to complete study session:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Timer runner
  useEffect(() => {
    if (isOpen) {
      // Reset state for new timer run
      const initialTotalSeconds = totalSessionMinutes * 60
      const initialFocusSeconds = Math.min(focusMinutes * 60, initialTotalSeconds)
      setTotalSecondsLeft(initialTotalSeconds)
      setCurrentMode('focus')
      setPeriodSecondsLeft(initialFocusSeconds)
      setPeriodTotalSeconds(initialFocusSeconds)

      intervalRef.current = setInterval(() => {
        setTotalSecondsLeft((prevTotal) => {
          const nextTotal = prevTotal - 1
          
          if (nextTotal <= 0) {
            // Auto complete
            clearInterval(intervalRef.current)
            handleFinishSession(true)
            return 0
          }

          setPeriodSecondsLeft((prevPeriod) => {
            if (prevPeriod - 1 <= 0) {
              // Transition between modes
              setCurrentMode((prevMode) => {
                const nextMode = prevMode === 'focus' && breakMinutes > 0 ? 'break' : 'focus'
                const nextModeMinutes = nextMode === 'focus' ? focusMinutes : breakMinutes
                const nextPeriodSeconds = Math.min(nextModeMinutes * 60, nextTotal)

                setPeriodTotalSeconds(nextPeriodSeconds)
                // Schedule update for period seconds left
                setTimeout(() => setPeriodSecondsLeft(nextPeriodSeconds), 0)
                
                // Play notification sound
                playChime(nextMode)
                return nextMode
              })
              return 0
            }
            return prevPeriod - 1
          })

          return nextTotal
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isOpen, session, focusSetting, breakSetting])

  // Skip the current break early
  const handleEndBreakEarly = () => {
    if (currentMode !== 'break') return
    playChime('focus')
    setCurrentMode('focus')
    const nextPeriodSeconds = Math.min(focusMinutes * 60, totalSecondsLeft)
    setPeriodTotalSeconds(nextPeriodSeconds)
    setPeriodSecondsLeft(nextPeriodSeconds)
  }

  // SVG configurations for Round circular timer
  const radius = 80
  const circumfrence = 2 * Math.PI * radius
  // Time that has passed starts at 0% and grows to 100%
  const percentage = periodTotalSeconds > 0 ? ((periodTotalSeconds - periodSecondsLeft) / periodTotalSeconds) * 100 : 0
  const strokeDashoffset = circumfrence - (percentage * circumfrence) / 100

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Active progress circle color based on mode
  const strokeColor = currentMode === 'focus' ? '#2E5B70' : '#10B981'
  const isBreakActive = currentMode === 'break'

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity" />

      {/* Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all transform relative text-center">
          
          <DialogTitle className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            {isBreakActive ? 'Break Time' : 'Study Session Active'}
          </DialogTitle>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider font-mono">
            {session.title || session.task_title || 'Focused block'}
          </p>

          {/* SVG Round Circular Timer */}
          <div className="relative w-48 h-48 mx-auto my-8 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background thick circle defining whole duration */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth={10}
                fill="transparent"
              />
              {/* Progress active thin circle defining time that has passed */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke={strokeColor}
                strokeWidth={4}
                fill="transparent"
                strokeDasharray={circumfrence}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Inner text countdown */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono tracking-tighter">
                {formatTime(periodSecondsLeft)}
              </span>
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                {isBreakActive ? (
                  <span className="text-emerald-500">☕ Take a Rest</span>
                ) : (
                  <span className="text-[#2E5B70] dark:text-sky-400">🧠 Focus Mode</span>
                )}
              </span>
            </div>
          </div>

          {/* Session Progress info */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block tracking-wide">
              Total Remaining Time
            </span>
            <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300 font-mono mt-0.5 block">
              {formatTime(totalSecondsLeft)} / {totalSessionMinutes}:00
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            {isBreakActive && (
              <button
                type="button"
                onClick={handleEndBreakEarly}
                className="w-full h-11 rounded-full border border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                End Break Early
              </button>
            )}

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleFinishSession(false)}
              className="w-full h-11 rounded-full bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Finishing...' : 'Finish Session'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
