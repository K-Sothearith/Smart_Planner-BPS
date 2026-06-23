import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function BreakModal({ isOpen, onClose, onTakeBreak }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all transform text-center relative">
          
          {/* Circular illustration header */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EBF1F9] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm mt-2">
            <span className="text-4xl animate-bounce">⏱️</span>
          </div>

          <DialogTitle className="text-2xl font-black text-[#2E5B70] dark:text-slate-100 font-sans tracking-tight mt-5">
            Time for a breather?
          </DialogTitle>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3.5 font-medium leading-relaxed max-w-xs mx-auto">
            You've been focused for 50 minutes. A quick 5-minute stretch will help your brain consolidate what you've learned.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 mt-7 mb-2 w-full">
            <button
              type="button"
              onClick={onTakeBreak || onClose}
              className="w-full h-11 rounded-full bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center"
            >
              Take Break
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
            >
              Skip for now
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
