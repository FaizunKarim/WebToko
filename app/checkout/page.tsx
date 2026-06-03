'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { CreditCard, Building, Smartphone, Truck, ChevronDown, CheckCircle, ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/app/actions/profile'
import { createOrder, generateMidtransToken } from '@/app/actions/orders'

declare global {
  interface Window {
    snap: any
  }
}

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  imageUrl: string
  size: string
  color: string
  quantity: number
}

const paymentMethods = [
  {
    id: 'bca_va',
    name: 'Transfer Virtual Account BCA',
    icon: Building,
    description: 'Bayar instan via Virtual Account BCA',
    details: 'Pembayaran instan langsung diverifikasi otomatis secara real-time',
  },
  {
    id: 'bni_va',
    name: 'Transfer Virtual Account BNI',
    icon: Building,
    description: 'Bayar instan via Virtual Account BNI',
    details: 'Pembayaran instan langsung diverifikasi otomatis secara real-time',
  },
  {
    id: 'bri_va',
    name: 'Transfer Virtual Account BRI',
    icon: Building,
    description: 'Bayar instan via Virtual Account BRI',
    details: 'Pembayaran instan langsung diverifikasi otomatis secara real-time',
  },
  {
    id: 'gopay',
    name: 'GoPay / QRIS',
    icon: Smartphone,
    description: 'Scan QR Code menggunakan GoPay atau e-wallet lainnya',
    details: 'Pembayaran langsung diverifikasi secara otomatis',
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    icon: Smartphone,
    description: 'Bayar menggunakan ShopeePay',
    details: 'Pembayaran langsung diverifikasi secara otomatis',
  },
  {
    id: 'credit_card',
    name: 'Kartu Kredit / Debit',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB, dll',
    details: 'Pembayaran aman terenkripsi 3D Secure',
  },
  {
    id: 'cod',
    name: 'COD (Bayar di Tempat)',
    icon: Truck,
    description: 'Bayar saat barang diterima',
    details: 'Tersedia untuk area Jabodetabek',
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [selectedPayment, setSelectedPayment] = useState('bca_va')
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const initializeCheckout = async () => {
      // Get user session
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setCustomerName(currentUser.name || '')
        }
      } catch (err) {
        console.error('Failed to get user session:', err)
      }

      // Load cart
      const stored = localStorage.getItem('guest_cart')
      if (stored) {
        try {
          const items = JSON.parse(stored)
          setCartItems(items)
        } catch {}
      }
      setLoaded(true)
    }

    initializeCheckout()
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const freeShipping = total > 500000
  const grandTotal = freeShipping ? total : total + 50000

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName.trim()) {
      alert('Silakan isi nama lengkap')
      return
    }

    if (!customerPhone.trim()) {
      alert('Silakan isi nomor telepon')
      return
    }

    if (!shippingAddress.trim()) {
      alert('Silakan isi alamat pengiriman')
      return
    }

    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran')
      return
    }

    setProcessing(true)

    try {
      // 1. Create Order in Database
      const orderRes = await createOrder({
        shippingAddress,
        paymentMethod: selectedPayment,
        customerName,
        customerPhone,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        }))
      })

      const newOrderId = orderRes.orderId

      // 2. If Payment Method is not COD, generate Token and launch Snap UI with dynamic payment selection
      if (selectedPayment !== 'cod') {
        const midtransRes = await generateMidtransToken(newOrderId, {
          name: customerName,
          phone: customerPhone
        }, selectedPayment)

        if (!midtransRes?.token) {
          throw new Error('Gagal mendapatkan token pembayaran Midtrans')
        }

        if (window.snap) {
          window.snap.pay(midtransRes.token, {
            onSuccess: function(result: any) {
              localStorage.removeItem('guest_cart')
              router.push(`/orders/${newOrderId}?status=success`)
            },
            onPending: function(result: any) {
              localStorage.removeItem('guest_cart')
              router.push(`/orders/${newOrderId}?status=pending`)
            },
            onError: function(result: any) {
              alert('Pembayaran gagal atau dibatalkan.')
              setProcessing(false)
            },
            onClose: function() {
              alert('Anda menutup popup pembayaran sebelum menyelesaikan transaksi. Silakan bayar melalui halaman riwayat pesanan.')
              localStorage.removeItem('guest_cart')
              router.push(`/orders/${newOrderId}`)
            }
          })
        } else {
          // Fallback to Midtrans payment page redirect if Snap is not initialized
          localStorage.removeItem('guest_cart')
          window.location.href = midtransRes.redirect_url
        }
      } else {
        // COD path
        setOrderId(newOrderId)
        setOrderComplete(true)
        localStorage.removeItem('guest_cart')
        setProcessing(false)
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Terjadi kesalahan saat memproses pesanan Anda. Silakan coba lagi.')
      setProcessing(false)
    }
  }

  if (!loaded) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-4xl mx-auto px-4 py-12 text-center text-gray-500'>
          Memuat...
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='max-w-md mx-auto px-4 text-center'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Pesanan Berhasil!</h1>
          <p className='text-gray-600 mb-6'>
            Pesanan Anda telah berhasil dibuat. Silakan lakukan pembayaran sesuai metode yang dipilih.
          </p>
          <div className='bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8'>
            <p className='text-sm text-gray-500 mb-2'>Nomor Pesanan</p>
            <p className='text-lg font-bold text-gray-900 font-mono'>{orderId}</p>
          </div>

          <>
            {paymentMethods.find(p => p.id === selectedPayment)?.id !== 'cod' && (
              <div className='bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left'>
                <h3 className='font-semibold text-blue-900 mb-3'>Informasi Pembayaran</h3>
                <p className='text-sm text-blue-800'>
                  {paymentMethods.find(p => p.id === selectedPayment)?.details}
                </p>
                <p className='text-sm text-blue-800 mt-2 font-semibold'>
                  Total Pembayaran: Rp {Math.round(grandTotal).toLocaleString('id-ID')}
                </p>
              </div>
            )}
            <div className='bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-left'>
              <h3 className='font-semibold text-gray-900 mb-3'>Data Pengiriman</h3>
              <p className='text-sm text-gray-700'><span className='font-medium'>Nama:</span> {customerName}</p>
              <p className='text-sm text-gray-700 mt-1'><span className='font-medium'>Telepon:</span> {customerPhone}</p>
              <p className='text-sm text-gray-700 mt-1'><span className='font-medium'>Alamat:</span> {shippingAddress}</p>
            </div>
          </>

          <div className='flex flex-col gap-3'>
            <Link
              href='/products'
              className='bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold'
            >
              Lanjut Belanja
            </Link>
            <Link
              href='/'
              className='text-gray-600 hover:text-gray-900 font-medium'
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-4xl mx-auto px-4 py-24 text-center'>
          <div className='text-6xl mb-6'>🛒</div>
          <p className='text-gray-600 text-lg mb-8'>Keranjang Anda kosong</p>
          <Link
            href='/products'
            className='inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium'
          >
            Mulai Belanja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <Link
          href='/cart'
          className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6'
        >
          <ArrowLeft className='w-4 h-4' />
          Kembali ke Keranjang
        </Link>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Checkout</h1>

        <form onSubmit={handleCheckout}>
          <div className='grid lg:grid-cols-5 gap-8'>
            {/* Left: Form */}
            <div className='lg:col-span-3 space-y-6'>
                {/* Data Pembeli */}
                <div className='bg-white border border-gray-200 rounded-xl p-6'>
                  <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                    Data Pembeli
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Nama Lengkap <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Nomor Telepon <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='tel'
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="081234567890"
                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Alamat Pengiriman <span className='text-red-500'>*</span>
                      </label>
                      <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Alamat lengkap, kota, kode pos"
                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900'
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

              {/* Metode Pembayaran */}
              <div className='bg-white border border-gray-200 rounded-xl p-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                  Metode Pembayaran
                </h2>
                <div className='space-y-3'>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    const isSelected = selectedPayment === method.id
                    return (
                      <button
                        key={method.id}
                        type='button'
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border transition ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className='w-5 h-5' />
                        </div>
                        <div className='text-left'>
                          <p className='font-medium text-gray-900'>{method.name}</p>
                          <p className='text-sm text-gray-500'>{method.description}</p>
                        </div>
                        <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-gray-900' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className='w-3 h-3 rounded-full bg-gray-900' />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className='lg:col-span-2'>
              <div className='bg-white border border-gray-200 rounded-xl p-6 sticky top-24'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                  Ringkasan Pesanan
                </h2>

                <div className='space-y-4 mb-6'>
                  {cartItems.map((item) => (
                    <div key={item.id} className='flex gap-3'>
                      <div className='w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative'>
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className='object-cover' />
                        ) : (
                          <div className='w-full h-full flex items-center justify-center text-gray-400'>-</div>
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-gray-900 text-sm truncate'>{item.name}</p>
                        <p className='text-xs text-gray-500'>{item.size} | {item.color} | x{item.quantity}</p>
                        <p className='font-semibold text-gray-900 text-sm mt-1'>
                          Rp {Math.round(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='border-t border-gray-200 pt-4 space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-medium'>Rp {Math.round(total).toLocaleString('id-ID')}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Ongkir</span>
                    <span className='font-medium'>{freeShipping ? 'Gratis' : 'Rp 50.000'}</span>
                  </div>
                  {freeShipping && (
                    <p className='text-xs text-green-600'>✓ Gratis ongkir untuk pembelian di atas Rp 500.000</p>
                  )}
                </div>

                <div className='border-t border-gray-200 pt-4 mt-4'>
                  <div className='flex justify-between items-center'>
                    <span className='font-bold text-gray-900'>Total</span>
                    <span className='font-bold text-xl text-gray-900'>
                      Rp {Math.round(grandTotal).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={processing}
                  className='w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold mt-6 disabled:opacity-50'
                >
                  {processing ? 'Memproses...' : 'Buat Pesanan'}
                </button>

                <p className='text-xs text-gray-500 text-center mt-4'>
                  Dengan membuat pesanan, Anda menyetujui syarat & ketentuan yang berlaku
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}