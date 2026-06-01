import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Snap from 'midtrans-client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_id, transaction_status } = body

    console.log('[v0] Midtrans callback received:', {
      order_id,
      transaction_status,
    })

    // Verify the transaction with Midtrans
    const snap = new Snap.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    })

    const statusResponse = await snap.transaction.status(order_id)

    // Update order status based on payment status
    let orderStatus = 'pending'
    if (
      statusResponse.transaction_status === 'settlement' ||
      statusResponse.transaction_status === 'capture'
    ) {
      orderStatus = 'paid'
    } else if (statusResponse.transaction_status === 'pending') {
      orderStatus = 'pending'
    } else if (
      statusResponse.transaction_status === 'deny' ||
      statusResponse.transaction_status === 'expire' ||
      statusResponse.transaction_status === 'cancel'
    ) {
      orderStatus = 'cancelled'
    }

    // Update order in database
    await db
      .update(orders)
      .set({
        status: orderStatus,
        payment_id: order_id,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order_id))

    console.log('[v0] Order updated:', { order_id, orderStatus })

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('[v0] Callback error:', error)
    return NextResponse.json(
      { error: error.message || 'Callback processing failed' },
      { status: 500 }
    )
  }
}
