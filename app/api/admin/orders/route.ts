import { getUser } from '@/lib/session'
import { db } from '@/lib/db'
import { orders, adminUsers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getUser()

    if (!session?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, session.id))
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
