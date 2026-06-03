'use server'

import { getUser } from '@/lib/session'
import { db } from '@/lib/db'
import { orders, orderItems, cartItems, products, adminUsers, user } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

const snap = require('midtrans-client')

async function getUserId() {
  const session = await getUser()
  if (session?.id) {
    return session.id
  }

  const guestUserId = 'guest_buyer'
  try {
    const existingGuest = await db
      .select()
      .from(user)
      .where(eq(user.id, guestUserId))
      .then((res) => res[0])

    if (!existingGuest) {
      await db.insert(user).values({
        id: guestUserId,
        name: 'Guest Buyer',
        email: 'guest@novifashion.com',
        password: 'guest_password_dummy',
        role: 'user',
      })
    }
  } catch (err) {
    console.error('Error ensuring guest user exists:', err)
  }

  return guestUserId
}

export async function createOrder(data: {
  shippingAddress: string
  paymentMethod: string
  customerName?: string
  customerPhone?: string
  items?: {
    productId: string
    quantity: number
    price: number
    size: string
    color: string
  }[]
}) {
  const userId = await getUserId()

  let orderItemsData = []
  let totalAmount = 0

  if (data.items && data.items.length > 0) {
    // Use the passed items directly (perfect for guest_cart from localStorage)
    for (const item of data.items) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, item.productId))
        .then((res) => res[0])

      if (!product) throw new Error(`Product ${item.productId} not found`)

      const subtotal = Number(product.price) * item.quantity
      totalAmount += subtotal

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(product.price),
        size: item.size,
        color: item.color,
      })
    }
  } else {
    // Get cart items from DB
    const userCartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId))

    if (userCartItems.length === 0) {
      throw new Error('Cart is empty')
    }

    for (const cartItem of userCartItems) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, cartItem.productId))
        .then((res) => res[0])

      if (!product) throw new Error(`Product ${cartItem.productId} not found`)

      const subtotal = Number(product.price) * cartItem.quantity
      totalAmount += subtotal

      orderItemsData.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: Number(product.price),
        size: cartItem.size,
        color: cartItem.color,
      })
    }

    // Clear cart in DB
    await db.delete(cartItems).where(eq(cartItems.userId, userId))
  }

  // Calculate shipping cost
  // Free shipping for orders above Rp 500,000
  const freeShipping = totalAmount > 500000
  const grandTotal = freeShipping ? totalAmount : totalAmount + 50000

  // Create order
  const orderId = `ORDER-${uuidv4().substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  await db.insert(orders).values({
    id: orderId,
    userId,
    totalAmount: grandTotal.toString(),
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

  revalidatePath('/cart')
  revalidatePath('/orders')

  return { orderId, totalAmount: grandTotal }
}

export async function generateMidtransToken(orderId: string, customerData?: { name?: string; phone?: string }) {
  const userId = await getUserId()

  // Get order
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .then((res) => res[0])

  if (!order) throw new Error('Order not found')

  // Get user session for email
  const session = await getUser()
  const userEmail = session?.email || 'customer@example.com'
  const customerName = customerData?.name || session?.name || 'Customer'
  const customerPhone = customerData?.phone || '081234567890'

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
        first_name: customerName,
        phone: customerPhone,
        billing_address: {
          first_name: customerName,
          phone: customerPhone,
          address: order.shippingAddress || '',
        },
        shipping_address: {
          first_name: customerName,
          phone: customerPhone,
          address: order.shippingAddress || '',
        }
      },
      enabled_payments: [
        'credit_card',
        'bank_transfer',
        'gopay',
        'shopeepay',
        'indomaret',
        'alfamart'
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
  const session = await getUser()
  if (!session?.id) return []

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.id))

  return userOrders
}

export async function getOrderDetails(orderId: string) {
  // Get order regardless of user session first
  const order = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .then((res) => res[0])

  if (!order) throw new Error('Order not found')

  // If order is not a guest buyer order, verify ownership
  if (order.userId !== 'guest_buyer') {
    const session = await getUser()
    if (order.userId !== session?.id) {
      throw new Error('Unauthorized')
    }
  }

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
