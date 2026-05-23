import { useEffect, useState } from 'react'

export default function ThemeToggle({ className }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('sp:theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('sp:theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        'z-50 flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-[#2E5B70] dark:hover:text-sky-400 transition-all duration-200 focus:outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 16.25A9 9 0 1111.25 3m.004 0a8.007 8.007 0 0010.5 10.5z"
          />
        </svg>
      )}
    </button>
  )
}

