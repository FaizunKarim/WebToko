'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct, getProductById } from '@/app/actions/products'

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(!!productId)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sizes: '',
    colors: '',
    stock: '',
    image_url: '',
  })

  useEffect(() => {
    if (productId) {
      loadProduct()
    }
  }, [productId])

  async function loadProduct() {
    try {
      const product = await getProductById(productId!)
      if (product) {
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          category: product.category || '',
          sizes: (product.sizes || []).join(', '),
          colors: (product.colors || []).join(', '),
          stock: product.stock?.toString() || '0',
          image_url: product.image_url || '',
        })
      }
    } catch (error) {
      console.error('[v0] Error loading product:', error)
      alert('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sizes: formData.sizes.split(',').map((s) => s.trim()),
        colors: formData.colors.split(',').map((c) => c.trim()),
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
      }

      if (productId) {
        await updateProduct(productId, data)
        alert('Product updated successfully!')
      } else {
        await createProduct(data)
        alert('Product created successfully!')
      }

      router.push('/admin/products')
    } catch (error) {
      console.error('[v0] Error saving product:', error)
      alert('Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading product...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Price (USD)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
            className="w-full rounded-lg border p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., T-Shirt, Dress, Jacket"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="XS, S, M, L, XL"
            className="w-full rounded-lg border p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Red, Blue, Black"
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitting ? 'Saving...' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
