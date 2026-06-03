import { getUser } from '@/lib/session'
import { Navbar } from './navbar'
import { logout } from '@/app/actions/auth'

export async function NavbarWrapper() {
  const session = await getUser()

  return (
    <Navbar
      userName={session?.name || session?.email}
      userPhoto={session?.photo || null}
      showAuth={!!session}
      onLogout={logout}
    />
  )
}