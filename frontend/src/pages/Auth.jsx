import Signin from './Auth/Signin';
import Signup from './Auth/Signup';

export default function Auth({ mode = 'signin', onSwitchMode, onAuthSuccess }) {
  const isSignup = mode === 'signup'

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] [background:var(--bg-accent)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-8 text-left">
          <p className="text-sm text-[var(--muted)]">Smart Planner</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">Study smarter, avoid burnout.</h1>
          <p className="mt-3 text-[var(--muted)]">
            Plan tasks, track progress, and build healthier study habits with reminders and insights.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-[var(--muted)]">
            <div className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--panel-strong)] border border-[var(--border)]">
                ✓
              </span>
              <p>Schedule study sessions and deadlines</p>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--panel-strong)] border border-[var(--border)]">
                ✓
              </span>
              <p>Pomodoro timer and break reminders</p>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--panel-strong)] border border-[var(--border)]">
                ✓
              </span>
              <p>Simple analytics to spot overload</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)] p-8">
          {isSignup ? (
            <Signup
              onAuthSuccess={onAuthSuccess}
              onGoToSignin={() => onSwitchMode?.('signin')}
            />
          ) : (
            <Signin
              onAuthSuccess={onAuthSuccess}
              onGoToSignup={() => onSwitchMode?.('signup')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
