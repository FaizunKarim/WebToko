import ProductForm from '@/components/product-form'

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Create New Product</h1>
        <ProductForm />
      </div>
    </div>
  )
}
