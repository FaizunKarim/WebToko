import { getUser } from '@/lib/session'
import { isUserAdmin } from '@/app/actions/admin'
import { Navbar } from './navbar'
import { logout } from '@/app/actions/auth'

export async function NavbarWrapper() {
  const session = await getUser()
  const isAdmin = session ? await isUserAdmin() : false

  return (
    <Navbar
      userName={session?.name || session?.email}
      userPhoto={session?.photo || null}
      showAuth={!!session}
      isAdmin={isAdmin}
      onLogout={logout}
    />
  )
}
