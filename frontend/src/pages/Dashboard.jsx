import SidebarLayout from '../components/layouts/SidebarLayout'
import { DashboardIcon } from '../assets'

function Card({ title, description, className = '' }) {
  return (
    <section className={`flex flex-col bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-md border border-slate-400 dark:border-slate-700 rounded-2xl shadow-sm shadow-[#2E5B70]/5 transition-all duration-300 ${className}`}>
      <div className="p-6 border-b border-slate-300 dark:border-slate-800/50">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 font-sans">{title}</h2>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-1">{description}</p>
      </div>
      <div className="flex-1" />
    </section>
  )
}

export default function Dashboard({ user, onNavigate, onSignOut, onOpenGuide }) {
  return (
    <SidebarLayout activeView="dashboard" user={user} onNavigate={onNavigate} onSignOut={onSignOut} onOpenGuide={onOpenGuide}>
      <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto w-full">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-heading">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-8 shrink-0 bg-current"
              style={{
                WebkitMaskImage: `url("${DashboardIcon}")`,
                maskImage: `url("${DashboardIcon}")`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Welcome back, {user?.name || 'Student'}! Track your focus, upcoming work, and study balance.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8 mt-4">
          <Card
            title="Mindfulness Meter"
            description="A quick snapshot of your current cognitive load."
            className="h-[380px]"
          />
          <Card
            title="Micro-break"
            description="Space for guided break recommendations."
            className="h-[380px]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.2fr_0.9fr] gap-8">
          <Card
            title="Today's Focus"
            description="Planned priorities for today"
            className="h-[360px]"
          />
          <Card
            title="Upcoming"
            description="Homework/Assignment/Project and the deadline"
            className="h-[360px]"
          />
          <Card
            title="Weekly Goal"
            description="Your Weekly progress"
            className="h-[360px]"
          />
        </div>
      </div>
    </SidebarLayout>
  )
}
