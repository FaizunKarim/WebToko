'use client'

import { useState, useEffect } from 'react'
import { getProducts, deleteProduct, getProductsByCategory } from '@/app/actions/products'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [categoryParam, searchParam])

  async function loadProducts() {
    setLoading(true)
    try {
      let data
      if (searchParam) {
        const allProducts = await getProducts()
        data = allProducts.filter((p: any) =>
          p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchParam.toLowerCase())) ||
          (p.category && p.category.toLowerCase().includes(searchParam.toLowerCase()))
        )
      } else if (categoryParam) {
        const capitalizedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
        data = await getProductsByCategory(capitalizedCategory)
      } else {
        data = await getProducts()
      }
      setProducts(data)
    } catch (error) {
      console.error('[v0] Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    setDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting product:', error)
      alert('Gagal menghapus produk')
    } finally {
      setDeletingId(null)
    }
  }

  const categories = ['Pria', 'Wanita', 'Anak', 'Olahraga', 'Aksesoris']

  let title = 'Semua Produk'
  let subtitle = 'Kelola semua produk toko Anda'

  if (searchParam) {
    title = `Hasil Pencarian: "${searchParam}"`
    subtitle = `Ditemukan ${products.length} produk`
  } else if (categoryParam) {
    title = `Kategori ${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`
    subtitle = 'Kelola produk dalam kategori ini'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-24">
          <p className="text-gray-500">Memuat produk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/admin/products" className="hover:text-gray-900">Produk</Link>
                {categoryParam && (
                  <>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">
                      {categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{subtitle}</p>
            </div>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Tambah Produk
            </Link>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Link
              href="/admin/products"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                !categoryParam && !searchParam
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/admin/products?category=${cat.toLowerCase()}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  categoryParam?.toLowerCase() === cat.toLowerCase()
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-600 text-lg mb-4">
              {searchParam
                ? `Tidak ada produk yang cocok dengan "${searchParam}".`
                : 'Belum ada produk tersedia.'}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Tambah Produk Pertama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group"
              >
                {/* Product Image */}
                <Link href={`/admin/products/${product.id}`}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>Tidak ada gambar</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  {product.category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                  )}
                  <Link href={`/admin/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:underline">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    Rp {Math.round(Number(product.price)).toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}