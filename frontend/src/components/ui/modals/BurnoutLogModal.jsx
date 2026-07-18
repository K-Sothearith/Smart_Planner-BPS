import { useState } from 'react'
import Select from '../Select'
import analyticsService from '../../../services/analyticsService'

export default function BurnoutLogModal({ isOpen, onClose, taskMetrics, onSubmitSuccess }) {
  const [selectedMood, setSelectedMood] = useState('Normal')
  const [sleepHours, setSleepHours] = useState('7-8 hours')
  const [sleepQuality, setSleepQuality] = useState('4')
  const [screenTime, setScreenTime] = useState('5-6 hours')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmitLog = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const data = await analyticsService.createBurnoutLog({
        moodLevel: selectedMood,
        sleepHours,
        sleepQuality: Number(sleepQuality),
        screenTime,
        note
      })
      setNote('')
      setSelectedMood('Normal')
      setSleepHours('7-8 hours')
      setSleepQuality('4')
      setScreenTime('5-6 hours')
      if (onSubmitSuccess) {
        await onSubmitSuccess(data)
      }
      onClose()
    } catch (err) {
      console.error("Failed to save burnout check-in log:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-lg bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-lg border border-slate-200 dark:border-slate-850 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 text-left transform scale-100 transition-all duration-300">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700/60">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">Submit Burnout Check-in</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Logs are saved to compute burnout index</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmitLog} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">How is your Mood?</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sleep Hours</label>
              <Select
                value={sleepHours}
                onChange={setSleepHours}
                options={[
                  { value: "Under 4 hours", label: "Under 4 hours (High Risk)" },
                  { value: "5-6 hours", label: "5-6 hours (Mod-High Risk)" },
                  { value: "7-8 hours", label: "7-8 hours (Healthy)" },
                  { value: "Above 8 hours", label: "Above 8 hours (Mild Risk)" }
                ]}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sleep Quality</label>
              <Select
                value={sleepQuality}
                onChange={setSleepQuality}
                options={[
                  { value: "1", label: "1 - Terrible (High Risk)" },
                  { value: "2", label: "2 - Poor" },
                  { value: "3", label: "3 - Fair" },
                  { value: "4", label: "4 - Good" },
                  { value: "5", label: "5 - Excellent" }
                ]}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Screen Time</label>
              <Select
                value={screenTime}
                onChange={setScreenTime}
                options={[
                  { value: "Under 4 hours", label: "Under 4 hours (Low Risk)" },
                  { value: "5-6 hours", label: "5-6 hours (Mild Risk)" },
                  { value: "7-8 hours", label: "7-8 hours (Mod-High Risk)" },
                  { value: "Above 8 hours", label: "Above 8 hours (High Risk)" }
                ]}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pending Tasks</label>
              <div className="w-full h-9 px-3 flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
                {taskMetrics?.pendingCount || 0} Active {(taskMetrics?.pendingCount || 0) === 1 ? 'Task' : 'Tasks'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Overdue Tasks</label>
              <div className="w-full h-9 px-3 flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
                {taskMetrics?.overdueCount || 0} Overdue {(taskMetrics?.overdueCount || 0) === 1 ? 'Task' : 'Tasks'}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Missed Sessions</label>
              <div className="w-full h-9 px-3 flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
                {taskMetrics?.missedCount || 0} Missed {(taskMetrics?.missedCount || 0) === 1 ? 'Session' : 'Sessions'}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Check-in Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe how your day was..."
              maxLength="100"
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70]/50 dark:focus:ring-sky-500/50 transition-all"
            />
          </div>

          <div className="flex gap-3 justify-end mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
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
  )
}
