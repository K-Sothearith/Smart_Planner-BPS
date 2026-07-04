import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function StartSessionDetailModal({ isOpen, onClose, onStart, session }) {
  if (!session) return null

  const formattedDate = new Date(session.start_time).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const formattedTime = new Date(session.start_time).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Container */}
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
            Ready to Focus?
          </DialogTitle>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-medium mt-1">
            Review your session details before starting.
          </p>

          {/* Details Card */}
          <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col gap-4 text-left">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Session Title</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                {session.title || session.task_title || 'Focused Study Block'}
              </span>
            </div>

            {session.task_title && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Linked Task</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5 block truncate">
                  🔗 {session.task_title}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Date</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">
                  {formattedDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Scheduled Time</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 block">
                  ⏰ {formattedTime}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/40">
              <div className="text-center p-2 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Duration</span>
                <span className="text-xs font-extrabold text-[#2E5B70] dark:text-sky-400 mt-0.5 block">{session.duration_minutes}m</span>
              </div>
              <div className="text-center p-2 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Focus</span>
                <span className="text-xs font-extrabold text-[#2E5B70] dark:text-sky-400 mt-0.5 block">{session.focus_technique || 'Pomodoro'}</span>
              </div>
              <div className="text-center p-2 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Break</span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{session.break_duration || '5 mins'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mt-6 border-t border-slate-100 dark:border-slate-850 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial h-11 px-10 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onStart}
              className="flex-1 sm:flex-initial h-11 px-8 rounded-full bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start Study Session</span>
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
