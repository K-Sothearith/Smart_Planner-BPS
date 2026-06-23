import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Select from '../Select'

export default function NewSessionModal({ isOpen, onClose }) {
  const [subjectTask, setSubjectTask] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Do nothing for now
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all transform relative">
          {/* Close button */}
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
            {/* Subject / Task (Input field as requested) */}
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

            {/* Date and Time side by side */}
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
                    className="w-full h-11 pl-4 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all appearance-none"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Time</label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 pl-4 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Duration Buttons row */}
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

            {/* Focus Technique and Break Duration side by side */}
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

            {/* Burnout Prevention Toggle Card */}
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
