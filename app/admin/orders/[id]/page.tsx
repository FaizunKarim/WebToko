'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getOrderDetails, updateOrderStatus } from '@/app/actions/orders'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, Truck, Check, X, ShieldAlert, CreditCard } from 'lucide-react'

export default function AdminOrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrderDetails()
  }, [orderId])

  async function loadOrderDetails() {
    try {
      const { order, items } = await getOrderDetails(orderId)
      setOrder(order)
      setItems(items)
    } catch (error) {
      console.error('[v0] Error loading admin order details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrder((prev: any) => ({ ...prev, status: newStatus }))
      alert('Status pesanan berhasil diperbarui!')
    } catch (error) {
      console.error('[v0] Error updating status:', error)
      alert('Gagal memperbarui status pesanan')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Memuat rincian invoice admin...</div>
  }

  if (!order) {
    return (
      <div className="p-12 text-center">
        <p className="mb-4 text-red-500 font-semibold">Pesanan tidak ditemukan</p>
        <Link href="/admin/orders" className="text-gray-900 font-semibold hover:underline">
          ← Kembali ke Kelola Pesanan
        </Link>
      </div>
    )
  }

  const totalAmount = Number(order.totalAmount || order.total_amount || 0)
  const shippingAddress = order.shippingAddress || order.shipping_address

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Kelola Pesanan
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Invoice & Receipt Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
              {/* Decorative Receipt Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-900" />

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">STRUK PEMBELIAN</h1>
                  <p className="text-xs text-gray-500 mt-1">Novi Fashion Store</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBg(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-6 mb-6 text-sm">
                <div>
                  <p className="text-gray-500">Nomor Invoice</p>
                  <p className="font-mono font-bold text-gray-900 mt-0.5">{order.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tanggal Transaksi</p>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} WIB
                  </p>
                </div>
              </div>

              {/* Products Table */}
              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Rincian Belanja</h3>
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">Produk ID: {item.productId}</p>
                        <p className="text-xs text-gray-500">
                          Ukuran: {item.size} | Warna: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          @Rp {Math.round(Number(item.priceAtPurchase || 0)).toLocaleString('id-ID')}
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                          Rp {Math.round(Number(item.priceAtPurchase || 0) * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Calculations */}
              <div className="border-t border-gray-100 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Belanja</span>
                  <span>Rp {Math.round(totalAmount > 500000 ? totalAmount : totalAmount - 50000).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span>{totalAmount > 500000 ? 'Gratis' : 'Rp 50.000'}</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total Bayar</span>
                  <span className="text-lg text-gray-900">
                    Rp {Math.round(totalAmount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Pengiriman</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-500 block text-xs">Penerima</span>
                  <span className="font-semibold text-gray-900">{order.customerName || 'Tamu / Guest'}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-500 block text-xs">Nomor Telepon</span>
                  <span className="font-semibold text-gray-900">{order.customerPhone || '-'}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-500 block text-xs">Alamat Lengkap</span>
                  <span className="font-semibold text-gray-900 leading-relaxed">{shippingAddress || '-'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Status & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-sm tracking-wide uppercase">Kelola Status Pesanan</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Pilih Status Baru</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm font-semibold text-gray-800 bg-white"
                  >
                    <option value="pending">Pending (Menunggu Bayar)</option>
                    <option value="paid">Paid (Sudah Dibayar)</option>
                    <option value="processing">Processing (Sedang Diproses)</option>
                    <option value="shipped">Shipped (Dalam Pengiriman)</option>
                    <option value="completed">Completed (Selesai)</option>
                    <option value="cancelled">Cancelled (Dibatalkan)</option>
                  </select>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-xs text-gray-500 space-y-1">
                  <p className="font-semibold text-gray-700 mb-1">Panduan Status:</p>
                  <p>• <strong>Pending</strong>: Pesanan baru / belum dibayar.</p>
                  <p>• <strong>Paid</strong>: Pembayaran sukses terverifikasi Midtrans.</p>
                  <p>• <strong>Processing</strong>: Tim sedang menyiapkan barang belanja.</p>
                  <p>• <strong>Shipped</strong>: Nomor resi keluar / barang dalam pengiriman.</p>
                  <p>• <strong>Completed</strong>: Paket sudah sukses sampai di pelanggan.</p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-sm tracking-wide uppercase">Metode Pembayaran</h3>
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 bg-gray-100 text-gray-800 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod === 'cod' ? 'COD (Bayar di Tempat)' : 'Online / Midtrans'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ID Transaksi Midtrans: <span className="font-mono">{order.paymentId || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusBg(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'paid':
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
