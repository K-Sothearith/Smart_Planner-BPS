import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Planner({ user, onNavigate, onSignOut }) {
  return (
    <SidebarLayout activeView="planner" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div />
    </SidebarLayout>
  )
}
