import { useState } from 'react'
import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Setting({ user, onNavigate, onSignOut }) {
  const ageDisplay = user?.age ? `${user.age}` : 'Not provided'
  const genderDisplay = user?.gender || 'Not provided'
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasLowercase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  const hasMinLength = newPassword.length >= 6

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (!user?.email) return setPasswordError('No signed-in account found.')
    if (!currentPassword) return setPasswordError('Please enter your current password.')
    if (!newPassword) return setPasswordError('Please enter a new password.')
    if (!hasMinLength) return setPasswordError('New password must be at least 6 characters.')
    if (!hasUppercase) return setPasswordError('New password must contain at least one uppercase letter.')
    if (!hasLowercase) return setPasswordError('New password must contain at least one lowercase letter.')
    if (!hasNumber) return setPasswordError('New password must contain at least one number.')
    if (!hasSpecial) return setPasswordError('New password must contain at least one special character.')
    if (newPassword !== confirmPassword) return setPasswordError('New password and confirmation do not match.')

    try {
      const storedAccounts = localStorage.getItem('sp:accounts')
      const accounts = storedAccounts ? JSON.parse(storedAccounts) : []
      const accountIndex = accounts.findIndex(
        (account) => account.email?.toLowerCase() === user.email.toLowerCase()
      )

      if (accountIndex === -1) {
        setPasswordError('Could not find this account in local storage.')
        return
      }

      if (accounts[accountIndex].password !== currentPassword) {
        setPasswordError('Current password is incorrect.')
        return
      }

      accounts[accountIndex] = {
        ...accounts[accountIndex],
        password: newPassword,
      }
      localStorage.setItem('sp:accounts', JSON.stringify(accounts))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage('Password updated successfully.')
    } catch (err) {
      console.error('Failed to update password in LocalStorage:', err)
      setPasswordError('Could not update password due to a storage error.')
    }
  }

  return (
    <SidebarLayout activeView="settings" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Customize your Pomodoro timers, notification alerts, and account preferences to suit your workflow.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[37%_60%] gap-8 mt-4">
          
          {/* Card 1: Timer Preferences (Fixed Height) */}
          <div className="flex flex-col h-150 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#accent]/10 dark:bg-[#accent]/20 flex items-center justify-center text-[#accent] dark:text-[#f0a45d]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">Timer Settings</h2>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Configure study blocks and break intervals.</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-thin">
              {/* Pomodoro Focus Time Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Focus Period (Minutes)</label>
                <input
                  type="number"
                  defaultValue={25}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                />
              </div>

              {/* Short Break Time Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Short Break (Minutes)</label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                />
              </div>

              {/* Long Break Time Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Long Break (Minutes)</label>
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                />
              </div>

              {/* Long Break Interval Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Long Break Interval (Cycles)</label>
                <input
                  type="number"
                  defaultValue={4}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                />
              </div>

              {/* Target Focus Hours Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Daily Goal (Hours)</label>
                <input
                  type="number"
                  defaultValue={4}
                  className="w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                />
              </div>
            </div>
          </div>

          {/* Card 2: System Settings & Profile (Fixed Height) */}
          <div className="flex flex-col h-150 bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300">
            <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">System & Profile</h2>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Configure profile details and notifications.</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin">
              {/* Profile sub-section */}
              <div className="flex flex-col gap-4 text-left">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">User Profile</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'Student'}
                      disabled
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Student Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'student@university.edu'}
                      disabled
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Age</label>
                    <input
                      type="text"
                      value={ageDisplay}
                      disabled
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Gender</label>
                    <input
                      type="text"
                      value={genderDisplay}
                      disabled
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Password sub-section */}
              <form className="flex flex-col gap-4 text-left" onSubmit={handlePasswordUpdate}>
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="current-password" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Current Password</label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="new-password" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="confirm-password" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Confirm Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E5B70] dark:focus:ring-sky-500/50"
                    />
                  </div>
                </div>

                {newPassword.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-semibold">
                    <span className={hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>Min 6 characters</span>
                    <span className={hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>One uppercase letter</span>
                    <span className={hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>One lowercase letter</span>
                    <span className={hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>One number</span>
                    <span className={hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>One special character</span>
                  </div>
                )}

                {passwordError && (
                  <div className="text-xs text-rose-500 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/20 px-3.5 py-2.5 rounded-lg border border-rose-100 dark:border-rose-900/30">
                    {passwordError}
                  </div>
                )}

                {passwordMessage && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    {passwordMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="self-start h-10 px-4 rounded-xl bg-[#2E5B70] hover:bg-[#214353] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:text-slate-900 text-white text-xs font-bold transition-colors"
                >
                  Update Password
                </button>
              </form>

              {/* Notification Toggles */}
              <div className="flex flex-col gap-4.5 text-left">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Notifications & Sound</h3>
                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/30">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Desktop Notifications</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Receive alerts when focus timer finishes and break ends.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-9 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border-none relative text-[#2E5B70]" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/30">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Sound Effects</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Play a chime when transitioning study modes.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-9 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border-none relative text-[#2E5B70]" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/30">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Weekly Progress Report</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Send a summary of my study stats to my university email.</p>
                  </div>
                  <input type="checkbox" className="w-9 h-5 rounded-full bg-slate-200 dark:bg-slate-800 border-none relative text-[#2E5B70]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </SidebarLayout>
  )
}
