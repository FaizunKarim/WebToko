import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/session'
import { db } from '@/lib/db'
import { cartItems, products } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const session = await getUser()
    const { productId, quantity, size, color } = await request.json()

    if (!productId || !size || !color) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .then(rows => rows[0] || null)

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    // If user is logged in, save to database
    if (session?.id) {
      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.userId, session.id),
            eq(cartItems.productId, productId),
            eq(cartItems.size, size),
            eq(cartItems.color, color)
          )
        )
        .then(rows => rows[0] || null)

      if (existing) {
        await db
          .update(cartItems)
          .set({
            quantity: existing.quantity + (quantity || 1),
            updatedAt: new Date(),
          })
          .where(eq(cartItems.id, existing.id))
      } else {
        const id = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        await db.insert(cartItems).values({
          id,
          userId: session.id,
          productId,
          quantity: quantity || 1,
          size,
          color,
        })
      }
    }

    return NextResponse.json({ success: true, loggedIn: !!session?.id })
  } catch (error) {
    console.error('[v0] Cart API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}