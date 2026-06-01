'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sparkles, ShoppingCart, X, Upload, Loader2 } from 'lucide-react'

interface FeaturedProductCardProps {
  id: string
  name: string
  price: number
  imageUrl?: string
  category?: string
  description?: string
  onAddToCart: (productId: string, size: string, color: string) => Promise<void>
}

export function FeaturedProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
  description,
  onAddToCart,
}: FeaturedProductCardProps) {
  const [showTryOnModal, setShowTryOnModal] = useState(false)
  const [userImage, setUserImage] = useState<string | null>(null)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUserImage(event.target?.result as string)
        setTryOnResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTryOn = async () => {
    if (!userImage || !imageUrl) {
      setError('Silakan upload foto Anda terlebih dahulu')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage,
          garmentImage: imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses coba AI')
      }

      setTryOnResult(data.result)
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCartFromTryOn = async () => {
    setAddingToCart(true)
    setError(null)
    try {
      await onAddToCart(id, 'M', 'Default')
      setSuccess('Berhasil ditambahkan ke keranjang!')
      setTimeout(() => {
        setSuccess(null)
        setShowTryOnModal(false)
        setUserImage(null)
        setTryOnResult(null)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Gagal menambahkan ke keranjang')
    } finally {
      setAddingToCart(false)
    }
  }

  const resetModal = () => {
    setShowTryOnModal(false)
    setUserImage(null)
    setTryOnResult(null)
    setError(null)
    setSuccess(null)
  }

  return (
    <>
      <div className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group'>
        <div className='aspect-square bg-gray-100 relative overflow-hidden'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className='object-cover group-hover:scale-105 transition'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400'>
              <span>Tidak ada gambar</span>
            </div>
          )}
        </div>
        <div className='p-4'>
          {category && (
            <p className='text-xs text-gray-500 uppercase tracking-wider mb-2'>
              {category}
            </p>
          )}
          <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>{name}</h3>
          <p className='text-lg font-bold text-gray-900 mb-4'>
            Rp {Math.round(price).toLocaleString('id-ID')}
          </p>
          <button
            onClick={() => setShowTryOnModal(true)}
            className='w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition font-medium text-sm'
          >
            <Sparkles className='w-4 h-4' />
            Coba AI
          </button>
        </div>
      </div>

      {/* AI Try-On Modal */}
      {showTryOnModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-900'>Coba AI - {name}</h2>
                <button
                  onClick={resetModal}
                  className='text-gray-500 hover:text-gray-700'
                >
                  <X className='w-6 h-6' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-6'>
                {/* Product Image */}
                <div>
                  <h3 className='font-medium text-gray-900 mb-3'>Produk</h3>
                  <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden relative'>
                    {imageUrl ? (
                      <Image src={imageUrl} alt={name} fill className='object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400'>
                        Tidak ada gambar
                      </div>
                    )}
                  </div>
                  <p className='text-sm text-gray-600 mt-2'>{description}</p>
                </div>

                {/* User Upload / Result */}
                <div>
                  <h3 className='font-medium text-gray-900 mb-3'>
                    {tryOnResult ? 'Hasil Coba AI' : 'Upload Foto Anda'}
                  </h3>

                  {tryOnResult ? (
                    <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden relative'>
                      <Image
                        src={tryOnResult}
                        alt='Try-on result'
                        fill
                        className='object-cover'
                      />
                    </div>
                  ) : userImage ? (
                    <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden relative'>
                      <Image
                        src={userImage}
                        alt='Your photo'
                        fill
                        className='object-cover'
                      />
                    </div>
                  ) : (
                    <label className='aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition'>
                      <Upload className='w-10 h-10 text-gray-400 mb-2' />
                      <span className='text-sm text-gray-600'>Klik untuk upload</span>
                      <span className='text-xs text-gray-400 mt-1'>JPG, PNG max 5MB</span>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleFileUpload}
                        className='hidden'
                      />
                    </label>
                  )}

                  {userImage && !tryOnResult && (
                    <button
                      onClick={() => {
                        setUserImage(null)
                        setError(null)
                      }}
                      className='mt-2 text-sm text-gray-600 hover:text-gray-900'
                    >
                      Ganti foto
                    </button>
                  )}
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className='mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm'>
                  {error}
                </div>
              )}
              {success && (
                <div className='mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm'>
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className='mt-6 flex gap-3'>
                {!tryOnResult ? (
                  <button
                    onClick={handleTryOn}
                    disabled={!userImage || loading}
                    className='flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? (
                      <>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Sparkles className='w-5 h-5' />
                        Coba Sekarang
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setTryOnResult(null)
                        setUserImage(null)
                      }}
                      className='flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg hover:bg-gray-300 transition font-medium'
                    >
                      Coba Lagi
                    </button>
                    <button
                      onClick={handleAddToCartFromTryOn}
                      disabled={addingToCart}
                      className='flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50'
                    >
                      {addingToCart ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin' />
                          Menambahkan...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className='w-5 h-5' />
                          Tambah ke Keranjang
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
