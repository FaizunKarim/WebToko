import { getProducts } from '@/app/actions/products'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className='min-h-screen bg-white'>
      {/* Navigation */}
      <nav className='border-b border-gray-200 bg-white sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <Link href='/' className='text-2xl font-bold text-gray-900'>
              GERAI FASHION
            </Link>
            <Link href='/cart' className='text-gray-700 hover:text-gray-900 font-medium'>
              Keranjang
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Koleksi Produk</h1>
          <p className='text-gray-600'>
            Temukan produk fashion terbaru dan terlengkap kami
          </p>
        </div>

        {products.length === 0 ? (
          <div className='text-center py-24'>
            <p className='text-gray-600 text-lg mb-4'>Belum ada produk tersedia.</p>
            <Link href='/' className='text-gray-900 hover:underline font-medium'>
              ← Kembali ke beranda
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                imageUrl={product.imageUrl || undefined}
                category={product.category || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
