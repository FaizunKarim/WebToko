'use client'

import ProductForm from '@/components/product-form'
import { useParams } from 'next/navigation'

export default function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>
        <ProductForm productId={params.id} />
      </div>
    </div>
  )
}
