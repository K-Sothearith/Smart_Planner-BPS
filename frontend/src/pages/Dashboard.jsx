import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Dashboard({ user, onNavigate, onSignOut }) {
  return (
    <SidebarLayout activeView="dashboard" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div />
    </SidebarLayout>
  )
}
