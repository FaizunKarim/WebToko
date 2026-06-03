import { getUser } from '@/lib/session'
import { Navbar } from './navbar'

export async function NavbarWrapper() {
  const session = await getUser()

  return (
    <Navbar
      userName={session?.name || session?.email}
      showAuth={!!session}
      onLogout={undefined}
    />
  )
}