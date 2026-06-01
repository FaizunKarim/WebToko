'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getMyOrders } from '@/app/actions/orders'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (error) {
        console.error('[v0] Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-slate-400'>Loading orders...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <Link href='/' className='text-cyan-400 hover:text-cyan-300'>
            ← Back to Home
          </Link>
        </div>

        <h1 className='text-3xl font-bold text-white mb-8'>Order History</h1>

        {orders.length === 0 ? (
          <div className='bg-slate-800 border border-slate-700 rounded-lg p-8 text-center'>
            <p className='text-slate-400 mb-4'>No orders yet</p>
            <Link
              href='/products'
              className='text-cyan-400 hover:text-cyan-300'
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {orders.map((order: any) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className='block bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 transition'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='text-white font-semibold'>
                      Order {order.id.slice(0, 8)}
                    </p>
                    <p className='text-slate-400 text-sm'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-white font-semibold'>
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        order.status === 'completed'
                          ? 'text-green-400'
                          : order.status === 'pending'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
