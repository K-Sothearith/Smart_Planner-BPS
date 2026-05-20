import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Analytics({ user, onNavigate, onSignOut }) {
  return (
    <SidebarLayout activeView="analytics" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div />
    </SidebarLayout>
  )
}
