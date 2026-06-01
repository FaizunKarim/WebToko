import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, session.user.id))
      .then((res) => res[0])

    if (!adminUser) {
      return Response.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all orders
    const allOrders = await db.select().from(orders)

    return Response.json(allOrders)
  } catch (error) {
    console.error('[v0] API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
