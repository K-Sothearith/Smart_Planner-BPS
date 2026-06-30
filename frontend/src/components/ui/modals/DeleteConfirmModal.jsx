import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, taskTitle }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity" />

      {/* Container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-850 rounded-3xl shadow-2xl p-6 transition-all transform relative text-center">
          
          {/* Warning Icon */}
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-450 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <DialogTitle className="text-xl font-extrabold text-[#2E5B70] dark:text-slate-100 font-sans tracking-tight">
            Delete Task?
          </DialogTitle>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-slate-700 dark:text-slate-200">"{taskTitle}"</strong>? This action cannot be undone.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3.5 mt-6 justify-center">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 px-4 rounded-full border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-10 px-4 rounded-full bg-rose-500 hover:bg-rose-600 dark:bg-rose-500 dark:hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
