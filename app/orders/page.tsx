'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getUserOrders } from '@/app/actions/orders'
import { getCurrentUser } from '@/app/actions/profile'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [trackOrderId, setTrackOrderId] = useState('')
  const [trackError, setTrackError] = useState('')

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        
        if (currentUser) {
          const data = await getUserOrders()
          setOrders(data)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDataAndOrders()
  }, [])

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setTrackError('')

    if (!trackOrderId.trim()) {
      setTrackError('Silakan masukkan nomor pesanan Anda')
      return
    }

    // Direct tracking to the order details page
    router.push(`/orders/${trackOrderId.trim()}`)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-gray-500'>Memuat data pesanan...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='mb-8'>
          <Link href='/' className='text-gray-600 hover:text-gray-900 font-medium'>
            ← Kembali ke Beranda
          </Link>
        </div>

        <h1 className='text-3xl font-extrabold text-gray-900 mb-8'>Pelacakan & Riwayat Pesanan</h1>

        {/* Form Lacak Pesanan untuk Semua User (Terutama Tamu) */}
        <div className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>Lacak Pesanan (Guest/Tamu)</h2>
          <p className='text-sm text-gray-500 mb-4'>
            Masukkan Nomor Pesanan (Order ID) unik Anda yang didapatkan setelah checkout untuk melacak status proses pembelian Anda secara real-time.
          </p>
          <form onSubmit={handleTrackOrder} className='flex flex-col sm:flex-row gap-3'>
            <div className='flex-1'>
              <input
                type='text'
                value={trackOrderId}
                onChange={(e) => setTrackOrderId(e.target.value)}
                placeholder='Masukkan Nomor Pesanan (cth: ORDER-XXXXX)'
                className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900'
              />
              {trackError && <p className='text-red-500 text-xs mt-1.5'>{trackError}</p>}
            </div>
            <button
              type='submit'
              className='bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold text-center'
            >
              Lacak Pesanan
            </button>
          </form>
        </div>

        {/* Daftar Riwayat Pesanan jika User sedang Login */}
        {user ? (
          <div>
            <h2 className='text-xl font-bold text-gray-900 mb-4'>Riwayat Pesanan Anda</h2>
            {orders.length === 0 ? (
              <div className='bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm'>
                <p className='text-gray-500 mb-4'>Belum ada pesanan yang tercatat</p>
                <Link
                  href='/products'
                  className='inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition font-semibold'
                >
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className='space-y-4'>
                {orders.map((order: any) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className='block bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-400 shadow-sm transition'
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='text-gray-900 font-semibold'>
                          Pesanan {order.id.slice(0, 15)}...
                        </p>
                        <p className='text-gray-500 text-sm mt-1'>
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-gray-900 font-bold'>
                          Rp {Math.round(Number(order.totalAmount || order.total_amount || 0)).toLocaleString('id-ID')}
                        </p>
                        <p
                          className={`text-sm font-semibold mt-1 ${
                            order.status === 'paid' || order.status === 'completed' || order.status === 'success'
                              ? 'text-green-600'
                              : order.status === 'pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className='bg-blue-50 border border-blue-200 rounded-xl p-6 text-center shadow-sm'>
            <p className='text-blue-800 text-sm'>
              <strong>Tips:</strong> Silakan <Link href='/auth' className='underline font-semibold hover:text-blue-900'>Masuk / Daftar Akun</Link> agar semua riwayat pesanan Anda otomatis terekam dan terkumpul di halaman ini secara otomatis.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
