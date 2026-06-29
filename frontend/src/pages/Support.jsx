import { useState } from 'react'
import SidebarLayout from '../components/layouts/SidebarLayout'
import { SupportIcon } from '../assets'

const helpOptions = [
  {
    title: 'Study Planning',
    description: 'Get help arranging weekly blocks, task priorities, and focus goals.',
    accent: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/20',
    path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    title: 'Timer & Sessions',
    description: 'Troubleshoot Pomodoro sessions, reminders, and break settings.',
    accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20',
    path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Account Support',
    description: 'Find answers about profiles, password updates, and saved settings.',
    accent: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/20',
    path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
]

const faqs = [
  {
    question: 'Why are my planner events not showing?',
    answer: 'Make sure your task has a due date or scheduled block. Empty planner sections are shown when no study events have been added yet.',
  },
  {
    question: 'Can I change my focus and break duration?',
    answer: 'Yes. Open Settings and adjust the timer preferences for focus periods, short breaks, long breaks, and daily goals.',
  },
  {
    question: 'Where is my account information stored?',
    answer: 'This app currently stores demo account information in your browser local storage, so it stays on this device and browser.',
  },
]

export default function Support({ user, onNavigate, onSignOut, onOpenGuide }) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!message.trim()) {
      setStatus('Please describe what you need help with.')
      return
    }
    setMessage('')
    setStatus('Support request saved. We will review it soon.')
  }

  return (
    <SidebarLayout activeView="support" user={user} onNavigate={onNavigate} onSignOut={onSignOut} onOpenGuide={onOpenGuide}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-8 shrink-0 bg-current"
              style={{
                WebkitMaskImage: `url("${SupportIcon}")`,
                maskImage: `url("${SupportIcon}")`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
            Help and Support
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Find answers, report issues, and get guidance for keeping your study workflow running smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[62%_35%] gap-8 mt-4">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {helpOptions.map((option) => (
                <div
                  key={option.title}
                  className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-300 dark:border-slate-700 rounded-2xl p-5 shadow-sm shadow-[#2E5B70]/5"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.accent}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={option.path} />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-4">{option.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 leading-5">{option.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5">
              <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Frequently Asked Questions</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                  Quick answers for common Mindful Study questions.
                </p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 px-4 py-3"
                  >
                    <summary className="cursor-pointer list-none text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between gap-3">
                      <span>{faq.question}</span>
                      <span className="text-lg leading-none text-[#2E5B70] dark:text-sky-400 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-5 mt-3">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5">
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Contact Support</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                Tell us what happened and we will help you sort it out.
              </p>
            </div>

            <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Name</label>
                <input
                  type="text"
                  value={user?.name || 'Student'}
                  disabled
                  className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Email</label>
                <input
                  type="email"
                  value={user?.email || 'student@university.edu'}
                  disabled
                  className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="support-message" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Message</label>
                <textarea
                  id="support-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={8}
                  placeholder="Describe the issue or question..."
                  className="resize-none px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                />
              </div>

              {status && (
                <div className="text-xs text-[#2E5B70] dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/20 px-3.5 py-2.5 rounded-lg border border-sky-100 dark:border-sky-900/30">
                  {status}
                </div>
              )}

              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-colors"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
