import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function BreakTimerModal({ isOpen, onClose }) {
  // SVG Ring values
  const radius = 64
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (70 / 100) * circumference // 70% filled progress ring

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all transform text-center relative">
          
          {/* Circular progress countdown ring */}
          <div className="my-8 flex items-center justify-center">
            <div className="relative h-36 w-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  className="text-slate-100 dark:text-slate-850"
                  strokeWidth={strokeWidth}
                  stroke="currentColor"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + 8}
                  cy={radius + 8}
                />
                {/* Filled Ring Progress */}
                <circle
                  className="text-[#2E5B70] dark:text-sky-400"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius + 8}
                  cy={radius + 8}
                />
              </svg>
              {/* Central Time Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-black tracking-tight text-slate-850 dark:text-slate-100 font-mono">
                  03:27
                </span>
              </div>
            </div>
          </div>

          <DialogTitle className="sr-only">
            Break's Timer
          </DialogTitle>

          <p className="text-xs text-slate-500 dark:text-slate-400 px-4 font-medium leading-relaxed">
            Take a deep breath. This short break helps reset your cognitive load for better focus.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 mb-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-11 rounded-full bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center"
            >
              Finish early
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
