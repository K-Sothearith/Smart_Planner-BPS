import { useMemo, useState } from 'react'

export default function Signup({ onGoToSignin, onAuthSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    return name.trim() && email.trim() && password.length >= 4
  }, [email, name, password])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Please enter your name.')
    if (!email.trim()) return setError('Please enter your email.')
    if (password.length < 4) return setError('Password must be at least 4 characters.')

    onAuthSuccess?.({
      name: name.trim(),
      email: email.trim(),
    })
  }

  return (
    <div className="text-left">
      <h2 className="text-2xl font-semibold text-[var(--text)]">Create account</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">Start organizing your study schedule in minutes.</p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm text-[var(--muted)]">
          Name
          <input
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-[var(--text)] outline-none focus:border-[var(--accent)]"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--muted)]">
          Email
          <input
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-[var(--text)] outline-none focus:border-[var(--accent)]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="grid gap-2 text-sm text-[var(--muted)]">
          Password
          <input
            className="h-11 rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-[var(--text)] outline-none focus:border-[var(--accent)]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
            autoComplete="new-password"
          />
        </label>

        {error ? (
          <p className="text-sm text-[var(--danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="h-11 rounded-xl bg-[var(--accent)] text-white font-medium disabled:opacity-60"
          disabled={!canSubmit}
        >
          Sign up
        </button>
      </form>

      <div className="mt-6 text-sm text-[var(--muted)]">
        Already have an account?{' '}
        <button
          type="button"
          className="font-medium text-[var(--accent-strong)] hover:underline"
          onClick={onGoToSignin}
        >
          Sign in
        </button>
      </div>
    </div>
  )
}
