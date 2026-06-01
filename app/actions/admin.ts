'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, adminUsers } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  
  const admin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, session.user.id))
    .then(rows => rows[0] || null)
  
  return admin ? { ...session.user, isAdmin: true, adminRole: admin.role } : null
}

export async function getAllUsers() {
  const admin = await getAdminUser()
  if (!admin) throw new Error('Unauthorized - Admin access required')
  
  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(desc(user.createdAt))
  
  // Get admin status for each user
  const admins = await db.select().from(adminUsers)
  const adminMap = new Map(admins.map(a => [a.userId, a.role]))
  
  return users.map(u => ({
    ...u,
    isAdmin: adminMap.has(u.id),
    adminRole: adminMap.get(u.id) || null,
  }))
}

export async function promoteToAdmin(userId: string) {
  const admin = await getAdminUser()
  if (!admin) throw new Error('Unauthorized - Admin access required')
  
  // Check if user exists
  const targetUser = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .then(rows => rows[0] || null)
  
  if (!targetUser) throw new Error('User not found')
  
  // Check if already admin
  const existingAdmin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .then(rows => rows[0] || null)
  
  if (existingAdmin) throw new Error('User is already an admin')
  
  // Promote to admin
  const id = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  await db.insert(adminUsers).values({
    id,
    userId,
    role: 'admin',
    permissions: ['products', 'orders', 'users'],
  })
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function demoteFromAdmin(userId: string) {
  const admin = await getAdminUser()
  if (!admin) throw new Error('Unauthorized - Admin access required')
  
  // Cannot demote yourself
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user?.id === userId) {
    throw new Error('Cannot demote yourself')
  }
  
  await db.delete(adminUsers).where(eq(adminUsers.userId, userId))
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function isUserAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false
  
  const admin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, session.user.id))
    .then(rows => rows[0] || null)
  
  return !!admin
}
