'use client'

import { FeaturedProductCard } from '@/components/featured-product-card'
import { RotatingFashionCard } from '@/components/rotating-fashion-card'
import Link from 'next/link'

interface HomeClientProps {
  session: any
  featuredProducts: any[]
  categoryImages: Record<string, { src: string; alt: string }[]>
  onLogout: () => Promise<void>
  onAddToCart: (productId: string, size: string, color: string) => Promise<void>
}

const categories = [
  { name: 'Pria', key: 'Pria' },
  { name: 'Wanita', key: 'Wanita' },
  { name: 'Anak', key: 'Anak' },
  { name: 'Olahraga', key: 'Olahraga' },
  { name: 'Aksesoris', key: 'Aksesoris' },
]

export function HomeClient({
  session,
  featuredProducts,
  categoryImages,
  onLogout,
  onAddToCart,
}: HomeClientProps) {
  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section with Rotating Fashion Cards */}
      <div className='bg-gray-100 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
              Koleksi Fashion Terbaru
            </h1>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Temukan gaya Anda dengan koleksi pakaian berkualitas tinggi. Klik kartu di bawah untuk melihat berbagai pilihan.
            </p>
          </div>

          {/* Rotating Fashion Cards */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {categories.map((category) => (
              <Link
                key={category.key}
                href={`/products?category=${category.key.toLowerCase()}`}
                className='block'
              >
                <RotatingFashionCard
                  title={category.name}
                  images={categoryImages[category.key] || []}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>Beberapa Produk Unggulan</h2>
            <p className='text-gray-600 mt-2'>
              Koleksi terbaik pilihan kami untuk Anda
            </p>
          </div>
          <Link
            href='/products'
            className='text-gray-900 hover:text-gray-700 font-medium'
          >
            Lihat Semua &rarr;
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className='text-center py-16 bg-gray-50 rounded-lg'>
            <p className='text-gray-600 mb-4'>Belum ada produk tersedia.</p>
            {session?.user && (
              <Link
                href='/admin/products'
                className='inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition'
              >
                Tambah Produk
              </Link>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredProducts.map((product) => (
              <FeaturedProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                imageUrl={product.imageUrl || undefined}
                category={product.category || undefined}
                description={product.description || undefined}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className='bg-black text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <h4 className='font-semibold mb-4'>Tentang Kami</h4>
              <p className='text-gray-400 text-sm'>
                Novi adalah toko pakaian online terpercaya dengan koleksi fashion berkualitas tinggi.
              </p>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Kategori</h4>
              <ul className='text-gray-400 text-sm space-y-2'>
                <li><Link href='/products?category=pria' className='hover:text-white'>Pria</Link></li>
                <li><Link href='/products?category=wanita' className='hover:text-white'>Wanita</Link></li>
                <li><Link href='/products?category=anak' className='hover:text-white'>Anak</Link></li>
                <li><Link href='/products?category=olahraga' className='hover:text-white'>Olahraga</Link></li>
                <li><Link href='/products?category=aksesoris' className='hover:text-white'>Aksesoris</Link></li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Bantuan</h4>
              <ul className='text-gray-400 text-sm space-y-2'>
                <li><a href='#' className='hover:text-white'>Tentang Pengiriman</a></li>
                <li><a href='#' className='hover:text-white'>Kebijakan Pengembalian</a></li>
                <li><a href='#' className='hover:text-white'>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>Hubungi Kami</h4>
              <p className='text-gray-400 text-sm'>
                Email: info@geraifashion.com<br/>
                Telepon: +62-8XX-XXXX-XXXX
              </p>
            </div>
          </div>
          <div className='border-t border-gray-800 pt-8 text-center text-gray-400 text-sm'>
            <p>&copy; 2024 Novi. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
