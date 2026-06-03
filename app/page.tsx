import { redirect } from 'next/navigation'
import { getUser } from '@/lib/session'
import { getFeaturedProducts } from '@/app/actions/products'
import { categoryImages } from '@/lib/sample-products'
import { HomeClient } from '@/components/home-client'

export default async function HomePage() {
  const session = await getUser()
  
  // Redirect logged-in users to admin dashboard
  if (session) {
    redirect('/admin/products')
  }
  
  const featuredProducts = await getFeaturedProducts(12)


  return (
    <>
      <HomeClient
        session={null}
        featuredProducts={featuredProducts}
        categoryImages={categoryImages}
      />
    </>
  )
}