'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Minus, Plus } from 'lucide-react'

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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('guest_cart')
    if (stored) {
      try {
        setCartItems(JSON.parse(stored))
      } catch {}
    }
    setLoaded(true)
  }, [])

  const saveCart = (items: CartItem[]) => {
    setCartItems(items)
    localStorage.setItem('guest_cart', JSON.stringify(items))
  }

  const updateQuantity = (id: string, delta: number) => {
    const newItems = cartItems
      .map(item => {
        if (item.id === id) {
          const qty = item.quantity + delta
          return qty <= 0 ? null : { ...item, quantity: qty }
        }
        return item
      })
      .filter(Boolean) as CartItem[]
    saveCart(newItems)
  }

  const removeItem = (id: string) => {
    saveCart(cartItems.filter(item => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const freeShipping = total > 500000

  if (!loaded) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500'>
          Memuat...
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-12'>Keranjang Belanja</h1>

        {cartItems.length === 0 ? (
          <div className='text-center py-24'>
            <div className='text-6xl mb-6'>🛒</div>
            <p className='text-gray-600 text-lg mb-8'>Keranjang Anda kosong</p>
            <Link
              href='/products'
              className='inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium'
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='space-y-6'>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className='border border-gray-200 rounded-lg p-6 flex gap-6'
                  >
                    {item.imageUrl ? (
                      <div className='w-24 h-24 bg-gray-100 rounded flex-shrink-0 overflow-hidden relative'>
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                    ) : (
                      <div className='w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-400'>
                        -
                      </div>
                    )}

                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 text-lg mb-1'>
                        {item.name}
                      </h3>
                      <p className='text-gray-600 text-sm mb-3'>
                        Ukuran: {item.size} | Warna: {item.color}
                      </p>
                      <p className='font-bold text-gray-900 mb-4'>
                        Rp {Math.round(item.price).toLocaleString('id-ID')}
                      </p>

                      <div className='flex items-center gap-4'>
                        <div className='flex items-center border border-gray-300 rounded'>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                          >
                            <Minus className='w-3 h-3' />
                          </button>
                          <span className='w-8 h-8 flex items-center justify-center border-l border-r border-gray-300 text-sm'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                          >
                            <Plus className='w-3 h-3' />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className='text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1'
                        >
                          <Trash2 className='w-4 h-4' />
                          Hapus
                        </button>
                      </div>
                    </div>

                    <div className='text-right flex-shrink-0'>
                      <p className='font-bold text-gray-900'>
                        Rp {Math.round(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 h-fit sticky top-24'>
              <h2 className='text-xl font-bold text-gray-900 mb-6'>Ringkasan Pesanan</h2>

              <div className='space-y-4 mb-6 border-b border-gray-200 pb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-semibold'>
                    Rp {Math.round(total).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Ongkir</span>
                  <span className='font-semibold'>
                    {freeShipping ? 'Gratis' : 'Rp 50.000'}
                  </span>
                </div>
                {freeShipping && (
                  <div className='text-sm text-green-600'>
                    ✓ Gratis ongkir!
                  </div>
                )}
              </div>

              <div className='flex justify-between items-center mb-6 text-lg'>
                <span className='font-bold'>Total</span>
                <span className='font-bold text-2xl'>
                  Rp {Math.round(freeShipping ? total : total + 50000).toLocaleString('id-ID')}
                </span>
              </div>

              <Link
                href='/checkout'
                className='block w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold text-center'
              >
                Lanjut Checkout
              </Link>

              <Link
                href='/products'
                className='block w-full bg-white text-gray-900 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-center mt-3'
              >
                Lanjut Belanja
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}