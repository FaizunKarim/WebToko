import { redirect } from 'next/navigation'

// This page is no longer needed - users are auto-promoted to admin on signup.
// Redirect to admin portal.
export default function WaitingApprovalPage() {
  redirect('/admin/products')
}