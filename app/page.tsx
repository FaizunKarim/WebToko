import { redirect } from 'next/navigation'
import { getUser, deleteSession } from '@/lib/session'
import { getFeaturedProducts, seedProducts } from '@/app/actions/products'
import { addToCart } from '@/app/actions/cart'
import { categoryImages } from '@/lib/sample-products'
import { HomeClient } from '@/components/home-client'

export default async function HomePage() {
  const session = await getUser()
  const featuredProducts = await getFeaturedProducts(12)

  async function handleLogout() {
    'use server'
    await deleteSession()
    redirect('/')
  }

  async function handleAddToCart(productId: string, size: string, color: string) {
    'use server'
    await addToCart({
      productId,
      quantity: 1,
      size,
      color,
    })
  }

  async function handleSeedProducts() {
    'use server'
    const result = await seedProducts()
    redirect('/')
  }

  return (
    <>
      <HomeClient
        session={session}
        featuredProducts={featuredProducts}
        categoryImages={categoryImages}
        onLogout={handleLogout}
        onAddToCart={handleAddToCart}
      />
      {featuredProducts.length === 0 && session?.id && (
        <div className='fixed bottom-8 right-8'>
          <form action={handleSeedProducts}>
            <button
              type='submit'
              className='bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition font-medium'
            >
              Seed 50 Produk Contoh
            </button>
          </form>
        </div>
      )}
    </>
  )
}