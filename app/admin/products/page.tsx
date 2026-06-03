'use client'

import { useState, useEffect } from 'react'
import { getProducts, deleteProduct } from '@/app/actions/products'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('[v0] Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Price</th>
                <th className="px-6 py-3 text-left font-semibold">Stock</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.description?.substring(0, 50)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    Rp {Math.round(Number(product.price)).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-600 mb-4">No products yet</p>
            <Link
              href="/admin/products/new"
              className="text-blue-600 hover:underline"
            >
              Create your first product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
