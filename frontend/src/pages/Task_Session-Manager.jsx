import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Manager({ user, onNavigate, onSignOut }) {
  return (
    <SidebarLayout activeView="manager" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div />
    </SidebarLayout>
  )
}
