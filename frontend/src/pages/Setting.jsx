import SidebarLayout from '../components/layouts/SidebarLayout'

export default function Setting({ user, onNavigate, onSignOut }) {
  return (
    <SidebarLayout activeView="settings" user={user} onNavigate={onNavigate} onSignOut={onSignOut}>
      <div />
    </SidebarLayout>
  )
}
