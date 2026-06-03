import { getProducts, getProductsByCategory } from '@/app/actions/products'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const category = params.category
  const search = params.search

  let products
  let title = 'Koleksi Produk'
  let subtitle = 'Temukan produk fashion terbaru dan terlengkap kami'

  if (search) {
    // Search products
    const allProducts = await getProducts()
    products = allProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
    )
    title = `Hasil Pencarian: "${search}"`
    subtitle = `Ditemukan ${products.length} produk`
  } else if (category) {
    // Filter by category
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)
    products = await getProductsByCategory(capitalizedCategory)
    title = `Koleksi ${capitalizedCategory}`
    subtitle = `Temukan koleksi fashion ${capitalizedCategory} terlengkap`
  } else {
    // All products
    products = await getProducts()
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-12'>
          <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
            <Link href='/products' className='hover:text-gray-900'>Semua Produk</Link>
            {category && (
              <>
                <span>/</span>
                <span className='text-gray-900 font-medium'>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </>
            )}
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>{title}</h1>
          <p className='text-gray-600'>{subtitle}</p>
        </div>

        {products.length === 0 ? (
          <div className='text-center py-24'>
            <p className='text-gray-600 text-lg mb-4'>
              {category
                ? `Belum ada produk untuk kategori ${category}.`
                : search
                ? `Tidak ada produk yang cocok dengan "${search}".`
                : 'Belum ada produk tersedia.'}
            </p>
            <Link href='/products' className='text-gray-900 hover:underline font-medium'>
              ← Lihat semua produk
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
