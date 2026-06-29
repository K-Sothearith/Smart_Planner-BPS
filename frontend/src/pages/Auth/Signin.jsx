import { useState, useEffect } from 'react';
import { MindfulStudyLogo } from '../../assets';
import authService from '../../services/authService.js';

export default function Signin({ onGoToSignup, onAuthSuccess }) {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('sp:remembered_email') || '';
    } catch {
      return '';
    }
  })
  const [password, setPassword] = useState(() => {
    try {
      return localStorage.getItem('sp:remembered_password') || '';
    } catch {
      return '';
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('sp:remember_me') === 'true';
    } catch {
      return false;
    }
  })

  // Manage Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sp:theme') || 'light'
  })

  // Sync theme attribute on document root
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail) return setError('Please enter your university email.')
    if (!password) return setError('Please enter your password.')

    try {
      const responseData = await authService.login(trimmedEmail, password);
      
      // Save or clear remembered credentials in LocalStorage
      if (rememberMe) {
        localStorage.setItem('sp:remembered_email', trimmedEmail);
        localStorage.setItem('sp:remembered_password', password);
        localStorage.setItem('sp:remember_me', 'true');
      } else {
        localStorage.removeItem('sp:remembered_email');
        localStorage.removeItem('sp:remembered_password');
        localStorage.setItem('sp:remember_me', 'false');
      }

      onAuthSuccess?.({
        token: responseData.token,
        name: responseData.name,
        email: responseData.email,
        age: responseData.age,
        gender: responseData.gender,
        isNewUser: responseData.isNewUser
      });
    } catch (err) {
      console.error('Login request failed:', err);
      const errMsg = err.response?.data?.message || 'Connection error. Please try again.';
      setError(errMsg);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-7 bg-linear-to-br from-[#F4F7FB] via-[#F8FAFC] to-[#EBF1F9] dark:from-[#0F172A] dark:via-[#111A2E] dark:to-[#1E293B] transition-colors duration-300 font-sans relative">
      {/* Floating Theme Switcher */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-8 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-[#2E5B70] dark:hover:text-sky-400 transition-all duration-200 focus:outline-none"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          /* Light mode */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          /* Dark mode */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 16.25A9 9 0 1111.25 3m.004 0a8.007 8.007 0 0010.5 10.5z" />
          </svg>
        )}
      </button>

      {/* Main Container */}
      <div className="w-full max-w-115 flex flex-col items-center">
        
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-13 h-13 rounded-2xl bg-[#2E5B70] dark:bg-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#2E5B70]/10 dark:shadow-sky-500/10 mb-4 transition-all duration-300 hover:scale-105">
            <img src={MindfulStudyLogo} alt="Icon" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"/>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2E5B70] dark:text-[#E2E8F0] font-heading">
            MindfulStudy
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Return to your focused flow.
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white/95 dark:bg-[#1E293B]/95 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-[0_16px_40px_rgba(43,92,116,0.06)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.3)] p-8 transition-all duration-300">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="signin-email" className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                University Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  autoComplete="email"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex justify-between items-center">
                <label htmlFor="signin-password" className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    /* Hide Password */
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815l3 3m-3-3l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    /* Show Password */
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                  type="button"
                  className="text-xs font-semibold text-[#2E5B70] dark:text-[#38BDF8] hover:underline transition-all duration-150 self-end"
                  onClick={() => alert('Password reset is not configured for LocalStorage accounts')}
                >
                  Forgot password?
                </button>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 mt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#2E5B70] focus:ring-[#2E5B70] dark:bg-[#0F172A] dark:border-slate-800"
              />
              <label htmlFor="remember-me" className="text-sm font-medium text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-xs text-rose-500 dark:text-rose-400 font-semibold text-left mt-1 flex gap-1.5 items-center bg-rose-50 dark:bg-rose-950/20 px-3.5 py-2.5 rounded-lg border border-rose-100 dark:border-rose-900/30 animate-pulse">
                <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#2E5B70] hover:bg-[#214353] active:bg-[#18323E] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white font-bold rounded-xl mt-3 flex items-center justify-center gap-2 shadow-lg shadow-[#2E5B70]/10 dark:shadow-sky-500/10 hover:shadow-[#2E5B70]/20 transition-all duration-200 cursor-pointer text-sm"
            >
              <span>Begin Session</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center justify-between my-5">
            <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 flex-1" />
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 uppercase">
              Or continue with
            </span>
            <div className="h-1px bg-slate-200/80 dark:bg-slate-800/80 flex-1" />
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert('Auth feature with Google has not been implemented, Design only')}
              className="h-11 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35 11.1H12v2.7h5.38c-.24 1.28-.96 2.37-2.04 3.1v2.57h3.3c1.93-1.78 3.04-4.4 3.04-7.49 0-.61-.05-1.2-.15-1.78z" fill="#4285F4"/>
                <path d="M12 20.58c2.43 0 4.47-.81 5.96-2.21l-3.3-2.57c-.91.61-2.07.97-3.3.97-2.34 0-4.33-1.58-5.03-3.7H2.9v2.66c1.49 2.96 4.54 4.85 8.1 4.85z" fill="#34A853"/>
                <path d="M6.97 13.07a5.2 5.2 0 010-3.3V7.1H2.9a8.98 8.98 0 000 8.63l4.07-2.66z" fill="#FBBC05"/>
                <path d="M12 6.96c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 4.21 14.42 3.42 12 3.42c-3.56 0-6.61 1.89-8.1 4.85l4.07 2.66c.7-2.12 2.69-3.7 5.03-3.7z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Auth feature with Microsoft has not been implemented, Design only')}
              className="h-11 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10.5" height="10.5" fill="#F25022"/>
                <rect x="11.5" width="10.5" height="10.5" fill="#7FBA00"/>
                <rect y="11.5" width="10.5" height="10.5" fill="#00A4EF"/>
                <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900"/>
              </svg>
              <span>Microsoft</span>
            </button>
          </div>
        </div>

        {/* Signup Link */}
        <p className="mt-7 text-sm font-medium text-slate-500 dark:text-slate-400">
          New to MindfulStudy?{' '}
          <button
            type="button"
            className="font-bold text-[#2E5B70] dark:text-[#38BDF8] hover:underline cursor-pointer transition-all"
            onClick={onGoToSignup}
          >
            Create an account
          </button>
        </p>
      </div>

      {/* Quote */}
      <div className="mt-6 transition-transform hover:scale-[1.02] duration-200">
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10 rounded-full shadow-sm">
          <span className="text-sm">☘️</span>
          <span className="text-[10px] font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase font-sans">
            -- &ldquo;THE SECRET OF GETTING AHEAD IS GETTING STARTED&rdquo;
          </span>
        </div>
      </div>
    </div>
  )
}
