'use server'

import { getUser } from '@/lib/session'
import { db } from '@/lib/db'
import { cartItems, products } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await getUser()
  if (!session?.id) throw new Error('Unauthorized')
  return session.id
}

export async function getCartItems() {
  const userId = await getUserId()
  return db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      size: cartItems.size,
      color: cartItems.color,
      product: {
        id: products.id,
        name: products.name,
        price: products.price,
        image_url: products.imageUrl,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
    .orderBy(desc(cartItems.createdAt))
}

export async function addToCart(data: {
  productId: string
  quantity: number
  size: string
  color: string
}) {
  const userId = await getUserId()

  // Check if item already exists
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, data.productId),
        eq(cartItems.size, data.size),
        eq(cartItems.color, data.color)
      )
    )
    .then(rows => rows[0] || null)

  if (existing) {
    // Update quantity
    await db
      .update(cartItems)
      .set({
        quantity: existing.quantity + data.quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, existing.id))
  } else {
    // Create new cart item
    const id = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await db.insert(cartItems).values({
      id,
      userId,
      productId: data.productId,
      quantity: data.quantity,
      size: data.size,
      color: data.color,
    })
  }

  revalidatePath('/cart')
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const userId = await getUserId()

  const item = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .then(rows => rows[0] || null)

  if (!item || item.userId !== userId) {
    throw new Error('Unauthorized')
  }

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
  } else {
    await db
      .update(cartItems)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, cartItemId))
  }

  revalidatePath('/cart')
}

export async function removeFromCart(cartItemId: string) {
  const userId = await getUserId()

  const item = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .then(rows => rows[0] || null)

  if (!item || item.userId !== userId) {
    throw new Error('Unauthorized')
  }

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
  revalidatePath('/cart')
}

export async function clearCart() {
  const userId = await getUserId()
  await db.delete(cartItems).where(eq(cartItems.userId, userId))
  revalidatePath('/cart')
}
