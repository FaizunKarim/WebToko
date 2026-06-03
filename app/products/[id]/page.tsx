'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getProductById } from '@/app/actions/products'
import { addToCart } from '@/app/actions/cart'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductById(params.id as string)
      setProduct(data)
      if (data?.sizes?.[0]) setSelectedSize(data.sizes[0])
      if (data?.colors?.[0]) setSelectedColor(data.colors[0])
      setLoading(false)
    }
    loadProduct()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setMessage('Pilih ukuran dan warna terlebih dahulu')
      return
    }

    setAddingToCart(true)
    setMessage('')
    try {
      await addToCart({
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
        quantity,
      })
      setMessage('Berhasil ditambahkan ke keranjang!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Gagal menambahkan ke keranjang')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <p className='text-gray-600'>Memuat...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <p className='text-gray-600 mb-4'>Produk tidak ditemukan</p>
          <Link href='/products' className='text-gray-900 hover:underline font-medium'>
            ← Kembali ke produk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <Link
          href='/products'
          className='text-gray-600 hover:text-gray-900 font-medium mb-8 inline-block'
        >
          ← Kembali ke produk
        </Link>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          {/* Product Image */}
          <div>
            {product.imageUrl ? (
              <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className='object-cover'
                />
              </div>
            ) : (
              <div className='aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400'>
                Tidak ada gambar
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              {product.name}
            </h1>
            {product.category && (
              <p className='text-gray-600 mb-6 uppercase text-sm tracking-wider'>
                {product.category}
              </p>
            )}

            <div className='border-t border-gray-200 pt-6 mb-6'>
              <p className='text-3xl font-bold text-gray-900'>
                Rp {Math.round(Number(product.price)).toLocaleString('id-ID')}
              </p>
              {product.stock > 0 ? (
                <p className='text-green-600 mt-2'>Stok Tersedia</p>
              ) : (
                <p className='text-red-600 mt-2'>Stok Habis</p>
              )}
            </div>

            {product.description && (
              <div className='mb-6'>
                <h3 className='font-semibold text-gray-900 mb-2'>Deskripsi</h3>
                <p className='text-gray-600 leading-relaxed'>
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className='mb-6'>
                <label className='block font-semibold text-gray-900 mb-3'>
                  Pilih Ukuran
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border rounded-lg font-medium transition ${
                        selectedSize === size
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className='mb-6'>
                <label className='block font-semibold text-gray-900 mb-3'>
                  Pilih Warna
                </label>
                <div className='flex gap-3'>
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-3 border rounded-lg font-medium transition ${
                        selectedColor === color
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-900 border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className='mb-6'>
              <label className='block font-semibold text-gray-900 mb-3'>
                Jumlah
              </label>
              <div className='flex items-center gap-4'>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='w-10 h-10 border border-gray-300 rounded hover:bg-gray-100'
                >
                  −
                </button>
                <span className='text-xl font-semibold w-10 text-center'>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className='w-10 h-10 border border-gray-300 rounded hover:bg-gray-100'
                >
                  +
                </button>
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.includes('Berhasil')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className='w-full bg-gray-900 text-white py-4 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {addingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
            </button>

            {/* Additional Info */}
            <div className='mt-8 pt-8 border-t border-gray-200 space-y-4 text-sm text-gray-600'>
              <p>✓ Pengiriman gratis untuk pembelian di atas Rp 500.000</p>
              <p>✓ Garansi uang kembali 100%</p>
              <p>✓ Dukungan pelanggan 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
