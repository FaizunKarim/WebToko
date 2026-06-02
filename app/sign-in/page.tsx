import { getUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await getUser()
  if (session?.id) redirect('/')
  return <AuthForm mode="sign-in" />
}