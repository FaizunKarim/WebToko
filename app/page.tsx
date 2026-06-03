import { redirect } from 'next/navigation'
import { getUser, deleteSession } from '@/lib/session'
import { getFeaturedProducts, seedProducts } from '@/app/actions/products'
import { addToCart } from '@/app/actions/cart'
import { categoryImages } from '@/lib/sample-products'
import { HomeClient } from '@/components/home-client'

export default async function HomePage() {
  const session = await getUser()
  
  // Redirect logged-in users to admin dashboard
  if (session) {
    redirect('/admin/products')
  }
  
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
        session={null}
        featuredProducts={featuredProducts}
        categoryImages={categoryImages}
        onLogout={handleLogout}
        onAddToCart={handleAddToCart}
      />
    </>
  )
}