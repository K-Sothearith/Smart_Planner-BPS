import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

export default function GuideModal({ isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(0)

  const pages = [
    {
      title: "Welcome to Mindful Study 📖",
      tagline: "Your companion for sustainable productivity and academic balance.",
      altText: "Mindful Study Logo and Welcome screen banner placeholder",
      placeholderLabel: "Onboarding Graphic / Welcome Screen Overview",
      description: (
        <div className="space-y-3.5 text-slate-650 dark:text-slate-350 text-xs leading-relaxed font-medium">
          <p>
            Welcome to <span className="font-bold text-[#2E5B70] dark:text-[#38BDF8]">Mindful Study</span>, a system engineered to help you conquer assignments and schedules without burning out.
          </p>
          <p>
            Traditional planners only track what you do. Mindful Study tracks how it affects your energy. By monitoring tasks, study sessions, and your mood, the system helps you maintain a healthy study-life balance.
          </p>
          <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex gap-2.5 items-start mt-2">
            <span className="text-base select-none">💡</span>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-450 leading-normal">
              <strong>Quick Tip:</strong> Use the "open book" icon at the top of any page to re-open this guide whenever you need a quick system refresher!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Your Dashboard (Page 1/4) 📊",
      tagline: "Monitor your current workload & cognitive state at a glance.",
      altText: "Dashboard screen showing Mindfulness Meter, Micro-break recommendations, Focus items, and Weekly progress",
      placeholderLabel: "Dashboard Page Layout (Mindfulness Meter & Today's focus)",
      description: (
        <div className="space-y-3.5 text-slate-650 dark:text-slate-350 text-xs leading-relaxed font-medium">
          <p>
            The <span className="font-bold text-[#2E5B70] dark:text-[#38BDF8]">Dashboard</span> is your mission control. It displays:
          </p>
          <ul className="list-disc pl-4.5 space-y-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <li><span className="text-[#2E5B70] dark:text-[#38BDF8]">Mindfulness Meter:</span> Evaluates your stress level and task load dynamically.</li>
            <li><span className="text-[#E28743] dark:text-[#F0A45D]">Micro-break Box:</span> Actionable suggestions and exercises when workload gets high.</li>
            <li><span className="text-slate-800 dark:text-slate-100">Today's Focus & Upcoming:</span> Keeps your top priorities visible.</li>
          </ul>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            🎯 <strong>Where to go:</strong> Land here to check if you're taking enough breaks or to quickly see what assignment is due next.
          </p>
        </div>
      )
    },
    {
      title: "Smart Planner & Calendar (Page 2/4) 📅",
      tagline: "Plan tasks, set priorities, and view schedule allocations.",
      altText: "Planner screen showing Calendar view, deadline counters, and task priorities",
      placeholderLabel: "Planner & Calendar Page Layout (Monthly grid & Task timelines)",
      description: (
        <div className="space-y-3.5 text-slate-650 dark:text-slate-350 text-xs leading-relaxed font-medium">
          <p>
            The <span className="font-bold text-[#2E5B70] dark:text-[#38BDF8]">Planner</span> visualizes your deadlines. It features a interactive calendar grid and scheduling layout.
          </p>
          <ul className="list-disc pl-4.5 space-y-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <li><span className="text-slate-800 dark:text-slate-100">Visual Calendar:</span> Displays tasks on their due date to avoid clutter.</li>
            <li><span className="text-slate-800 dark:text-slate-100">Task Priorities:</span> Categorizes items into High, Medium, or Low priority blocks.</li>
          </ul>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            🎯 <strong>Where to go:</strong> Navigate to the <strong>Planner</strong> page via the sidebar to structure your weekly assignments, schedule study blocks, and track due dates.
          </p>
        </div>
      )
    },
    {
      title: "Tasks & Study Sessions (Page 3/4) ⏱️",
      tagline: "Time your focus periods and log your cognitive stress.",
      altText: "Task & Session Manager showing task list, Pomodoro timer, and mood logging module",
      placeholderLabel: "Task & Session Manager Page Layout (Pomodoro Timer & Mood Log)",
      description: (
        <div className="space-y-3.5 text-slate-650 dark:text-slate-350 text-xs leading-relaxed font-medium">
          <p>
            The <span className="font-bold text-[#2E5B70] dark:text-[#38BDF8]">Task & Session Manager</span> is where you get things done. It hosts your Pomodoro study tools:
          </p>
          <ul className="list-disc pl-4.5 space-y-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <li><span className="text-[#2E5B70] dark:text-[#38BDF8]">Pomodoro Timer:</span> Custom study sessions (default 25 minutes) with forced break chimes.</li>
            <li><span className="text-[#E28743] dark:text-[#F0A45D]">Mood & Stress Log:</span> Quick check-in to record your emotional level (Happy, Normal, Tired, Frustrated, Stressed).</li>
          </ul>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            🎯 <strong>Where to go:</strong> Visit <strong>Tasks & Sessions</strong> in the sidebar when you start a study block to activate your focus timer and record check-ins.
          </p>
        </div>
      )
    },
    {
      title: "Insights & Customization (Page 4/4) 📈",
      tagline: "Track productivity metrics and customize system variables.",
      altText: "Analytics graphs showing stress history and Settings panel configuring timer durations",
      placeholderLabel: "Analytics & Settings Page Layouts (Productivity charts & Preferences)",
      description: (
        <div className="space-y-3.5 text-slate-650 dark:text-slate-350 text-xs leading-relaxed font-medium">
          <p>
            Optimize your study habits by tracking long-term trends and customizing parameters:
          </p>
          <ul className="list-disc pl-4.5 space-y-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <li><span className="text-[#2E5B70] dark:text-[#38BDF8]">Analytics Insights:</span> Line and bar graphs illustrating task completion rates, focus durations, and mood history over time.</li>
            <li><span className="text-slate-800 dark:text-slate-100">Custom Timers & Dark Mode:</span> Personalize your study/break durations and toggle dark mode settings.</li>
          </ul>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
            🎯 <strong>Where to go:</strong> Check <strong>Analytics</strong> weekly to audit your habits, and use <strong>Settings</strong> to match the timer length to your natural focus cycles.
          </p>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleClose = () => {
    setCurrentPage(0)
    onClose()
  }

  const pageInfo = pages[currentPage]

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-[9999]">
      {/* Dark overlay backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity" />

      {/* Main outer container */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl p-6 transition-all transform relative flex flex-col max-h-[90vh] text-left">
          
          {/* Header controls (Skip & Close buttons) */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <DialogTitle className="text-xl font-extrabold text-[#2E5B70] dark:text-slate-100 font-sans tracking-tight leading-tight">
                {pageInfo.title}
              </DialogTitle>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {pageInfo.tagline}
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 transition-colors focus:outline-none cursor-pointer"
              title="Skip guide"
            >
              Skip
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="flex-1 overflow-y-auto py-5 flex flex-col scrollbar-thin">
            {/* Image Placeholder Layout */}
            <div className="w-full aspect-[16/9] mb-4 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-450 dark:text-slate-500 p-4 transition-colors relative group select-none overflow-hidden shadow-inner">
              <img
                src=""
                alt={pageInfo.altText}
                className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
              />
              
              {/* Nice icon graphic */}
              <svg className="w-8 h-8 mb-2 opacity-50 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>

              <span className="text-[11px] font-bold text-center text-slate-500 dark:text-slate-400">
                [ Screenshot: {pageInfo.placeholderLabel} ]
              </span>
              <span className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-1 font-medium">
                (Image source will show screenshot when added)
              </span>
            </div>

            {/* Slide description */}
            {pageInfo.description}
          </div>

          {/* Footer Controls (Navigation & Page Indicators) */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-auto">
            {/* Prev button */}
            <div className="w-24 flex">
              {currentPage > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="h-10 px-4 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <span>Back</span>
                </button>
              )}
            </div>

            {/* Pagination Dot Indicators */}
            <div className="flex items-center gap-1.5">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentPage
                      ? 'bg-[#2E5B70] dark:bg-[#38BDF8] w-4'
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-450 dark:hover:bg-slate-650'
                  }`}
                  aria-label={`Go to guide slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next or Finish button */}
            <div className="w-28 flex justify-end">
              {currentPage < pages.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="h-10 px-4.5 rounded-full bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#2E5B70]/10 dark:shadow-sky-500/10 cursor-pointer"
                >
                  <span>Next</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-650 text-white dark:text-slate-950 font-extrabold text-xs flex items-center justify-center transition-all shadow-md shadow-emerald-600/10 cursor-pointer animate-pulse"
                >
                  Close Guide
                </button>
              )}
            </div>
          </div>

        </DialogPanel>
      </div>
    </Dialog>
  )
}
