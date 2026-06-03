'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductById, deleteProduct } from '@/app/actions/products'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, Trash2, ArrowLeft, Package } from 'lucide-react'

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(params.id as string)
        setProduct(data)
      } catch (error) {
        console.error('[v0] Error loading product:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    setDeleting(true)
    try {
      await deleteProduct(product.id)
      router.push('/admin/products')
    } catch (error) {
      console.error('[v0] Error deleting product:', error)
      alert('Gagal menghapus produk')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-500">Memuat...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-gray-600 mb-4">Produk tidak ditemukan</p>
        <Link href="/admin/products" className="text-blue-600 hover:underline font-medium">
          ← Kembali ke produk
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Produk
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>

        {/* Product Detail Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              {product.imageUrl ? (
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <Package className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                {product.category && (
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                    {product.category}
                  </p>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-3xl font-bold text-gray-900">
                  Rp {Math.round(Number(product.price)).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Status Stok</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'Tersedia' : 'Habis'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-600">Jumlah Stok</span>
                  <span className="font-semibold text-gray-900">{product.stock}</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ukuran</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size: string) => (
                      <span
                        key={size}
                        className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Warna</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <span
                        key={color}
                        className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Meta */}
              <div className="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>ID Produk</span>
                  <span className="font-mono text-gray-900">{product.id}</span>
                </div>
                {product.createdAt && (
                  <div className="flex justify-between">
                    <span>Dibuat</span>
                    <span className="text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}