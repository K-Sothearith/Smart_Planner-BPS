import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Select from '../Select'

export default function NewTaskModal({ isOpen, onClose }) {
  const [taskName, setTaskName] = useState('')
  const [category, setCategory] = useState('Assignment')
  const [priority, setPriority] = useState('Med')
  const [dueDate, setDueDate] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')

  const categoryOptions = [
    { value: 'Practice', label: 'Practice' },
    { value: 'Assignment', label: 'Assignment' },
    { value: 'Project', label: 'Project' },
    { value: 'Revision', label: 'Revision' },
    { value: 'Research', label: 'Research' },
    { value: 'Others', label: 'Others' },
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
        <DialogPanel className="w-full max-w-md bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-850 rounded-3xl shadow-2xl p-6 transition-all transform relative">
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
            New Task
          </DialogTitle>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-medium mt-1">
            Add a mindful addition to your schedule.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 text-left">
            {/* Task Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Task Name</label>
              <input
                type="text"
                required
                placeholder="What needs to be done?"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all"
              />
            </div>

            {/* Category and Priority side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</label>
                <Select value={category} onChange={setCategory} options={categoryOptions} className="h-11" />
              </div>

              {/* Priority Select Buttons */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Priority</label>
                <div className="flex gap-2 h-11">
                  {['Low', 'Med', 'High'].map((p) => {
                    const isActive = priority === p
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 h-full rounded-xl border font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? 'border-[#2E5B70] bg-[#2E5B70]/10 text-[#2E5B70] dark:border-[#38BDF8] dark:bg-[#38BDF8]/10 dark:text-[#38BDF8]'
                            : 'border-slate-200 dark:border-slate-850 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Due Date and Estimated Time side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Due Date Input with Icon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Due Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-11 pl-4 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all appearance-none"
                  />
                </div>
              </div>

              {/* Estimated Time Input with Icon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Time</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 45m"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 transition-all"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-5">
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
                Add Task
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
