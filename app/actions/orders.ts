'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, orderItems, cartItems, products, adminUsers } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

const snap = require('midtrans-client')

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createOrder(data: {
  shippingAddress: string
  paymentMethod: string
}) {
  const userId = await getUserId()

  // Get cart items
  const userCartItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))

  if (userCartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // Calculate total and get product details
  let totalAmount = 0
  const orderItemsData = []

  for (const cartItem of userCartItems) {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, cartItem.productId))
      .then((res) => res[0])

    if (!product) throw new Error(`Product ${cartItem.productId} not found`)

    const subtotal = product.price * cartItem.quantity
    totalAmount += subtotal

    orderItemsData.push({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: product.price,
      size: cartItem.size,
      color: cartItem.color,
    })
  }

  // Create order
  const orderId = uuidv4()
  await db.insert(orders).values({
    id: orderId,
    userId,
    totalAmount: totalAmount.toString(),
    status: 'pending',
    paymentMethod: data.paymentMethod,
    shippingAddress: data.shippingAddress,
  })

  // Create order items
  for (const item of orderItemsData) {
    await db.insert(orderItems).values({
      id: uuidv4(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.price.toString(),
      size: item.size,
      color: item.color,
    })
  }

  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, userId))

  revalidatePath('/cart')
  revalidatePath('/orders')

  return { orderId, totalAmount }
}

export async function generateMidtransToken(orderId: string) {
  const userId = await getUserId()

  // Get order
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .then((res) => res[0])

  if (!order) throw new Error('Order not found')

  // Get user session for email
  const session = await auth.api.getSession({ headers: await headers() })
  const userEmail = session?.user?.email || 'customer@example.com'

  try {
    const snap_api = new snap.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(Number(order.totalAmount)),
      },
      customer_details: {
        email: userEmail,
        first_name: session?.user?.name || 'Customer',
      },
      enabled_payments: [
        'credit_card',
        'bank_transfer',
        'bank_bca',
        'echannel',
        'bca_klikbca',
        'bca_klikpay',
        'cimb_clicks',
        'bri_epay',
        'gci',
      ],
    }

    const transaction = await snap_api.createTransaction(parameter)
    return {
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    }
  } catch (error) {
    console.error('[v0] Midtrans error:', error)
    throw new Error('Failed to generate payment token')
  }
}

export async function getUserOrders() {
  const userId = await getUserId()

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))

  return userOrders
}

export async function getOrderDetails(orderId: string) {
  const userId = await getUserId()

  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .then((res) => res[0])

  if (!order) throw new Error('Order not found')

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId))

  return { order, items }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const userId = await getUserId()

  // Verify user is admin
  const adminUser = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .then((res) => res[0])

  if (!adminUser) throw new Error('Unauthorized - admin only')

  await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))

  revalidatePath('/admin/orders')
  revalidatePath('/orders')
}
