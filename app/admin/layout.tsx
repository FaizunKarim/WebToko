import { getUser } from '@/lib/session'
import { AdminNavbar } from '@/components/admin-navbar'
import { logout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getUser()

  if (!session) {
    redirect('/auth')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar
        userName={session?.name || session?.email}
        userPhoto={session?.photo || null}
        onLogout={logout}
      />
      {children}
    </div>
  )
}