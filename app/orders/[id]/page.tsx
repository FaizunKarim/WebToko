'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { getOrderDetails } from '@/app/actions/orders'
import Link from 'next/link'

import Script from 'next/script'
import { generateMidtransToken } from '@/app/actions/orders'

declare global {
  interface Window {
    snap: any
  }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.id as string
  const paymentStatus = searchParams.get('status')

  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadOrderDetails()
  }, [orderId])

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // High resolution capture
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `invoice-${orderId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Failed to download invoice:', error)
      alert('Gagal mengunduh invoice. Silakan coba lagi.')
    }
  }

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

  const handlePay = async () => {
    setPaying(true)
    try {
      const res = await generateMidtransToken(orderId, {
        name: order?.customerName,
        phone: order?.customerPhone
      })

      if (!res?.token) {
        throw new Error('Gagal mendapatkan token pembayaran Midtrans')
      }

      if (window.snap) {
        window.snap.pay(res.token, {
          onSuccess: function(result: any) {
            loadOrderDetails()
          },
          onPending: function(result: any) {
            loadOrderDetails()
          },
          onError: function(result: any) {
            alert('Pembayaran gagal atau dibatalkan.')
            setPaying(false)
          },
          onClose: function() {
            setPaying(false)
          }
        })
      } else {
        window.location.href = res.redirect_url
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      alert(error.message || 'Gagal memproses pembayaran')
      setPaying(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat rincian pesanan...</div>
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Pesanan tidak ditemukan</p>
        <Link href="/products" className="text-gray-900 font-semibold hover:underline">
          Lanjut Belanja
        </Link>
      </div>
    )
  }

  const totalAmount = Number(order.totalAmount || order.total_amount || 0)
  const shippingAddress = order.shippingAddress || order.shipping_address

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="mx-auto max-w-2xl">
        {/* Printable/Captureable Invoice area */}
        <div ref={invoiceRef} className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm mb-6">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Rincian Pesanan</h1>

          {paymentStatus === 'success' && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 no-print">
              Pembayaran berhasil! Pesanan Anda telah dikonfirmasi.
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 no-print">
              Pembayaran sedang diproses atau pending. Silakan selesaikan pembayaran Anda.
            </div>
          )}

          <div className="mb-8 space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-500">Nomor Pesanan</p>
              <p className="font-mono font-bold text-gray-900 text-lg">{order.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
              <div>
                <p className="text-sm text-gray-500">Tanggal Pemesanan</p>
                <p className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status Pembayaran</p>
                <p className={`font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-500">Alamat Pengiriman</p>
              <p className="font-medium text-gray-900 leading-relaxed">{shippingAddress}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Metode Pembayaran</p>
              <p className="font-medium text-gray-900">
                {order.paymentMethod === 'midtrans' ? 'Pembayaran Online (Midtrans)' : 'COD (Bayar di Tempat)'}
              </p>
            </div>
          </div>

        {/* Timeline Pelacakan Pesanan */}
        <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Status Pelacakan Pesanan</h2>
          <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
            {/* Step 1: Menunggu Pembayaran */}
            <div className="relative">
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white ${
                order.status === 'pending'
                  ? 'border-yellow-500 ring-4 ring-yellow-100'
                  : 'border-green-500 bg-green-500'
              }`} />
              <div>
                <p className="font-semibold text-gray-900">Menunggu Pembayaran</p>
                <p className="text-sm text-gray-500 mt-1">Selesaikan pembayaran Anda menggunakan metode pembayaran yang dipilih.</p>
                {order.status === 'pending' && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md font-semibold mt-2">SEDANG BERJALAN</span>
                )}
              </div>
            </div>

            {/* Step 2: Pembayaran Berhasil & Diproses */}
            <div className="relative">
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white ${
                order.status === 'processing' || order.status === 'paid'
                  ? 'border-blue-500 ring-4 ring-blue-100'
                  : order.status === 'pending'
                    ? 'border-gray-300'
                    : 'border-green-500 bg-green-500'
              }`} />
              <div>
                <p className={`font-semibold ${order.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>Pembayaran Berhasil & Sedang Diproses</p>
                <p className="text-sm text-gray-500 mt-1">Pembayaran telah kami terima dan pesanan Anda sedang dikemas oleh tim kami.</p>
                {(order.status === 'processing' || order.status === 'paid') && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-semibold mt-2">SEDANG BERJALAN</span>
                )}
              </div>
            </div>

            {/* Step 3: Sedang Dikirim */}
            <div className="relative">
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white ${
                order.status === 'shipped'
                  ? 'border-purple-500 ring-4 ring-purple-100'
                  : (order.status === 'pending' || order.status === 'processing' || order.status === 'paid')
                    ? 'border-gray-300'
                    : 'border-green-500 bg-green-500'
              }`} />
              <div>
                <p className={`font-semibold ${(order.status === 'pending' || order.status === 'processing' || order.status === 'paid') ? 'text-gray-400' : 'text-gray-900'}`}>Sedang Dikirim</p>
                <p className="text-sm text-gray-500 mt-1">Pesanan Anda telah diserahkan ke kurir dan dalam perjalanan ke alamat Anda.</p>
                {order.status === 'shipped' && (
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md font-semibold mt-2">SEDANG BERJALAN</span>
                )}
              </div>
            </div>

            {/* Step 4: Selesai */}
            <div className="relative">
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white ${
                order.status === 'completed'
                  ? 'border-green-500 bg-green-500 ring-4 ring-green-100'
                  : 'border-gray-300'
              }`} />
              <div>
                <p className={`font-semibold ${order.status !== 'completed' ? 'text-gray-400' : 'text-gray-900'}`}>Selesai</p>
                <p className="text-sm text-gray-500 mt-1">Paket telah sampai di tujuan dan diterima dengan baik.</p>
                {order.status === 'completed' && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-semibold mt-2">SELESAI</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Daftar Produk</h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900">ID Produk: {item.productId}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Ukuran: {item.size} | Warna: {item.color}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">Jumlah: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Rp {Math.round(Number(item.priceAtPurchase || item.price_at_purchase || 0)).toLocaleString('id-ID')}
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    Rp {Math.round(Number(item.priceAtPurchase || item.price_at_purchase || 0) * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 text-xl font-bold text-gray-900">
            <span>Total Bayar:</span>
            <span>Rp {Math.round(totalAmount).toLocaleString('id-ID')}</span>
          </div>
        </div>

        </div>

        {order.status === 'pending' && order.paymentMethod === 'midtrans' && (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full mb-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-md transition duration-200 disabled:opacity-50 no-print"
          >
            {paying ? 'Memproses Pembayaran...' : 'Bayar Sekarang'}
          </button>
        )}

        {/* Customer Download and Contact Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={downloadInvoice}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 font-semibold transition"
          >
            📥 Unduh Invoice (Gambar)
          </button>
          <a
            href="https://wa.link/4nnk69"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold transition"
          >
            💬 Chat Admin (WhatsApp)
          </a>
        </div>

        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Kembali Belanja
          </Link>
          <Link
            href="/orders"
            className="flex-1 rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-white hover:bg-gray-800 transition"
          >
            Riwayat Pesanan
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
