'use server'

import { getUser } from '@/lib/session'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function updateProfile(data: { name?: string; photo?: string }) {
  const currentUser = await getUser()
  if (!currentUser) {
    throw new Error('Anda harus login terlebih dahulu')
  }

  await db
    .update(user)
    .set(data)
    .where(eq(user.id, currentUser.id))

  return { success: true }
}

export async function getCurrentUser() {
  return await getUser()
}