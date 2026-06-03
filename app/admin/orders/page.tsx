'use client'

import { useState, useEffect } from 'react'
import { getAdminOrders, updateOrderStatus } from '@/app/actions/orders'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      // Query all orders directly using getAdminOrders server action
      const data = await getAdminOrders()
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        console.error('[v0] Error loading orders:', data)
        setOrders([])
      }
    } catch (error) {
      console.error('[v0] Error loading orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (error) {
      console.error('[v0] Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data pesanan...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">Manage Orders</h1>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Total</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    Rp {Math.round(Number(order.totalAmount || order.total_amount || 0)).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`rounded-lg px-3 py-1 font-medium ${getStatusBg(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="py-8 text-center text-gray-600">No orders yet</div>
        )}
      </div>
    </div>
  )
}

function getStatusBg(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
