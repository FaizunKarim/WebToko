import { getCartItems, updateCartItem, removeFromCart } from '@/app/actions/cart'
import Link from 'next/link'

export default async function CartPage() {
  const cartItems = await getCartItems()

  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity
  }, 0)

  return (
    <div className='min-h-screen bg-white'>
      {/* Content */}
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
                    {item.product.imageUrl ? (
                      <div className='w-24 h-24 bg-gray-100 rounded flex-shrink-0 overflow-hidden'>
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className='w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-400'>
                        -
                      </div>
                    )}

                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 text-lg mb-1'>
                        {item.product.name}
                      </h3>
                      <p className='text-gray-600 text-sm mb-3'>
                        Ukuran: {item.size} | Warna: {item.color}
                      </p>
                      <p className='font-bold text-gray-900 mb-4'>
                        Rp {Math.round(Number(item.product.price)).toLocaleString('id-ID')}
                      </p>

                      <div className='flex items-center gap-4'>
                        <div className='flex items-center border border-gray-300 rounded'>
                          <form
                            action={async () => {
                              'use server'
                              await updateCartItem(item.id, item.quantity - 1)
                            }}
                          >
                            <button
                              type='submit'
                              className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                            >
                              −
                            </button>
                          </form>
                          <span className='w-8 h-8 flex items-center justify-center border-l border-r border-gray-300'>
                            {item.quantity}
                          </span>
                          <form
                            action={async () => {
                              'use server'
                              await updateCartItem(item.id, item.quantity + 1)
                            }}
                          >
                            <button
                              type='submit'
                              className='w-8 h-8 flex items-center justify-center hover:bg-gray-100'
                            >
                              +
                            </button>
                          </form>
                        </div>

                        <form
                          action={async () => {
                            'use server'
                            await removeFromCart(item.id)
                          }}
                        >
                          <button
                            type='submit'
                            className='text-red-600 hover:text-red-700 font-medium text-sm'
                          >
                            Hapus
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className='text-right flex-shrink-0'>
                      <p className='font-bold text-gray-900'>
                        Rp{' '}
                        {Math.round(
                          Number(item.product.price) * item.quantity
                        ).toLocaleString('id-ID')}
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
                    Rp {total > 500000 ? '0' : '50.000'}
                  </span>
                </div>
                {total > 500000 && (
                  <div className='text-sm text-green-600'>
                    ✓ Gratis ongkir!
                  </div>
                )}
              </div>

              <div className='flex justify-between items-center mb-6 text-lg'>
                <span className='font-bold'>Total</span>
                <span className='font-bold text-2xl'>
                  Rp{' '}
                  {Math.round(
                    total > 500000 ? total : total + 50000
                  ).toLocaleString('id-ID')}
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
