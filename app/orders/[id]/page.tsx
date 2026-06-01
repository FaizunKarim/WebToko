'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { getOrderDetails } from '@/app/actions/orders'
import Link from 'next/link'

export default function OrderDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string
  const paymentStatus = searchParams.get('status')

  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrderDetails()
  }, [orderId])

  async function loadOrderDetails() {
    try {
      const { order, items } = await getOrderDetails(orderId)
      setOrder(order)
      setItems(items)
    } catch (error) {
      console.error('[v0] Error loading order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading order details...</div>
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Order not found</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold">Order Details</h1>

        {paymentStatus === 'success' && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            Payment successful! Your order has been confirmed.
          </div>
        )}

        {paymentStatus === 'pending' && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            Payment is pending. Please complete the payment.
          </div>
        )}

        <div className="mb-8 rounded-lg border p-6">
          <div className="mb-4 border-b pb-4">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono font-semibold">{order.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-medium ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">Shipping Address</p>
            <p className="font-medium">{order.shipping_address}</p>
          </div>
        </div>

        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Order Items</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-4">
              <div>
                <p className="font-medium">{item.productId}</p>
                <p className="text-sm text-gray-600">
                  Size: {item.size} | Color: {item.color}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${item.price_at_purchase.toFixed(2)} each
                </p>
                <p className="text-sm font-semibold">
                  ${(item.price_at_purchase * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total:</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            My Orders
          </Link>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600'
    case 'completed':
      return 'text-green-600'
    case 'cancelled':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}
