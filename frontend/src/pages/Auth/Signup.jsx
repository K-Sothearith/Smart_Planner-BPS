import { useState, useEffect } from 'react'

export default function Signup({ onGoToSignin, onAuthSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')

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

  // Password Validation Rules
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasMinLength = password.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) return setError('Please enter your full name.')
    if (!trimmedEmail) return setError('Please enter your student email.')
    
    // Strict password requirements check
    if (!hasMinLength) return setError('Password must be at least 6 characters.')
    if (!hasUppercase) return setError('Password must contain at least one uppercase letter.')
    if (!hasLowercase) return setError('Password must contain at least one lowercase letter.')
    if (!hasNumber) return setError('Password must contain at least one number.')
    if (!hasSpecial) return setError('Password must contain at least one special character.')
    
    if (!agreeTerms) return setError('You must agree to the Terms of Service and Privacy Policy.')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return setError('Please enter a valid email address.')
    }

    // Retrieve accounts database
    let accounts = []
    try {
      const storedAccounts = localStorage.getItem('sp:accounts')
      if (storedAccounts) {
        accounts = JSON.parse(storedAccounts)
      }
    } catch (err) {
      console.error('Failed to parse accounts from LocalStorage:', err)
    }

    // Check email uniqueness
    const emailExists = accounts.some(
      (acc) => acc.email.toLowerCase() === trimmedEmail.toLowerCase()
    )
    if (emailExists) {
      setError('An account with this email already exists. Please sign in instead.')
      return
    }

    // Register account
    const newAccount = {
      name: trimmedName,
      email: trimmedEmail,
      password: password
    }

    accounts.push(newAccount)

    try {
      localStorage.setItem('sp:accounts', JSON.stringify(accounts))
    } catch (err) {
      console.error('Failed to save account to LocalStorage:', err)
      setError('Could not complete registration due to a storage error.')
      return
    }

    // Auto log-in on signup success
    onAuthSuccess?.({
      name: trimmedName,
      email: trimmedEmail
    })
  }

  return (
    <div className="grid md:grid-cols-[42%_58%] min-h-screen w-full bg-white dark:bg-[#0F172A] font-sans transition-colors duration-300 relative">
      
      {/* Floating Theme Switcher */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-[#2E5B70] dark:hover:text-sky-400 transition-all duration-200 focus:outline-none"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          /* Sun SVG */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          /* Moon SVG */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 16.25A9 9 0 1111.25 3m.004 0a8.007 8.007 0 0010.5 10.5z" />
          </svg>
        )}
      </button>

      {/* Left Marketing Panel - Split Screen (Hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-b from-[#F0F4F8] to-[#E5ECF4] dark:from-[#111A2E] dark:to-[#17253D] border-r border-slate-200/50 dark:border-slate-800/50 text-left">
        
        {/* Top Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2E5B70] dark:bg-[#0EA5E9] flex items-center justify-center shadow-md">
            {/* 4-point star SVG */}
            <svg className="w-5 h-5 text-white dark:text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.6 7.4 7.4 2.6-7.4 2.6-2.6 7.4-2.6-7.4-7.4-2.6 7.4-2.6z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-[#2E5B70] dark:text-[#E2E8F0] tracking-tight font-heading">
            MindfulStudy
          </span>
        </div>

        {/* Central Marketing Message */}
        <div className="max-w-[400px] my-auto py-8">
          <h2 className="text-4.5xl font-black tracking-tight text-slate-800 dark:text-slate-100 leading-tight font-heading">
            Protect your <span className="text-[#2E5B70] dark:text-[#38BDF8]">focus</span>, prevent the <span className="text-[#E28743] dark:text-[#F0A45D]">burnout</span>.
          </h2>
          <p className="mt-4.5 text-[13.5px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            The only smart planner that prioritizes your cognitive well-being. We analyze your workload in real-time to suggest breaks before exhaustion hits.
          </p>

          {/* Marketing Option Cards */}
          <div className="flex flex-col gap-4.5 mt-9">
            
            {/* Card 1 */}
            <div className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 flex gap-4.5 shadow-sm shadow-[#2E5B70]/5">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] dark:bg-[#064E3B]/40 border border-emerald-100/50 dark:border-emerald-800/10 flex items-center justify-center shrink-0">
                {/* Leaf SVG */}
                <svg className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5m0 0l-4-4m4 4l4-4M3.75 19.5h16.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5c-4.5 0-8.25-3.75-8.25-8.25S7.5 3 12 3s8.25 3.75 8.25 8.25-3.75 8.25-8.25 8.25z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 font-sans">
                  Cognitive Load Balancing
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                  Intelligent task distribution that avoids academic fatigue.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 flex gap-4.5 shadow-sm shadow-[#2E5B70]/5">
              <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] dark:bg-[#075985]/40 border border-sky-100/50 dark:border-sky-800/10 flex items-center justify-center shrink-0">
                {/* Moon SVG */}
                <svg className="w-5.5 h-5.5 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 16.25A9 9 0 1111.25 3m.004 0a8.007 8.007 0 0010.5 10.5M12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13.5px] font-bold text-slate-800 dark:text-slate-200 font-sans">
                  Guided Mindful Breaks
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                  Scheduled disconnects based on your natural focus cycles.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Area */}
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Trusted by students at over 500+ universities.
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-6.5 h-6.5 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-800" />
            <span className="w-6.5 h-6.5 rounded-full bg-slate-400 dark:bg-slate-600 border-2 border-white dark:border-slate-800" />
            <span className="w-6.5 h-6.5 rounded-full bg-slate-500 dark:bg-slate-500 border-2 border-white dark:border-slate-800" />
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-col justify-center items-center px-6 py-12 md:p-14">
        
        {/* Outer Form Container */}
        <div className="w-full max-w-[420px] flex flex-col text-left">
          
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
              Start your journey toward sustainable productivity.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  {/* User Profile Outline Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  autoComplete="name"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Student Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Student Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  {/* Envelope SVG Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.j@university.edu"
                  autoComplete="email"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 pl-1">
                Use your university email for academic discounts.
              </p>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  {/* Lock SVG Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••••••"
                  autoComplete="new-password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    /* Eye Off SVG */
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.815 7.815l3 3m-3-3l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    /* Eye SVG */
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Validation Checklist */}
              {password.length > 0 && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 pl-1 transition-all duration-300">
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-200 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span>{hasMinLength ? '✓' : '•'}</span> <span>Min 6 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-200 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span>{hasUppercase ? '✓' : '•'}</span> <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-200 ${hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span>{hasLowercase ? '✓' : '•'}</span> <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-200 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span>{hasNumber ? '✓' : '•'}</span> <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-200 ${hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    <span>{hasSpecial ? '✓' : '•'}</span> <span>One special character</span>
                  </div>
                </div>
              )}
            </div>

            {/* Agree Terms Checkbox */}
            <div className="flex items-start gap-2.5 mt-1 text-left">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#2E5B70] focus:ring-[#2E5B70] dark:bg-[#0F172A] dark:border-slate-800"
              />
              <label htmlFor="agree-terms" className="text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer select-none leading-relaxed">
                I agree to the{' '}
                <button
                  type="button"
                  className="font-bold text-[#2E5B70] dark:text-[#38BDF8] hover:underline"
                  onClick={() => alert('Terms of Service: Play nice, plan smart!')}
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="font-bold text-[#2E5B70] dark:text-[#38BDF8] hover:underline"
                  onClick={() => alert('Privacy Policy: Your data stays inside LocalStorage!')}
                >
                  Privacy Policy
                </button>
                .
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
              <span>Get Started for Free</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center justify-between my-5">
            <div className="h-[1px] bg-slate-200/80 dark:bg-slate-800/80 flex-1" />
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 px-3 uppercase">
              Or continue with
            </span>
            <div className="h-[1px] bg-slate-200/80 dark:bg-slate-800/80 flex-1" />
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => alert('OAuth features are placeholders in this mockup demonstration.')}
              className="h-11 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              {/* Google SVG */}
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
              onClick={() => alert('OAuth features are placeholders in this mockup demonstration.')}
              className="h-11 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              {/* Microsoft 4-square SVG */}
              <svg className="w-4.5 h-4.5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="10.5" height="10.5" fill="#F25022"/>
                <rect x="11.5" width="10.5" height="10.5" fill="#7FBA00"/>
                <rect y="11.5" width="10.5" height="10.5" fill="#00A4EF"/>
                <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900"/>
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          {/* Switch Link */}
          <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              className="font-bold text-[#2E5B70] dark:text-[#38BDF8] hover:underline cursor-pointer transition-all"
              onClick={onGoToSignin}
            >
              Sign In
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}
