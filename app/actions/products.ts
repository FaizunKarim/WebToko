'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  return session.user.id
}

export async function getProducts() {
  try {
    return await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
  } catch (error) {
    console.error('[v0] getProducts error:', error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    return await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then(rows => rows[0] || null)
  } catch (error) {
    console.error('[v0] getProductById error:', error)
    return null
  }
}

export async function createProduct(data: {
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  sizes: string[]
  colors: string[]
  stock: number
}) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  await db.insert(products).values({
    id,
    name: data.name,
    description: data.description,
    price: data.price.toString(),
    imageUrl: data.imageUrl,
    category: data.category,
    sizes: data.sizes,
    colors: data.colors,
    stock: data.stock,
    createdBy: userId,
  })

  revalidatePath('/products')
  revalidatePath('/admin/products')
  return { id }
}

export async function updateProduct(
  id: string,
  data: {
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
    sizes: string[]
    colors: string[]
    stock: number
  }
) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const product = await getProductById(id)
  if (!product || product.createdBy !== userId) {
    throw new Error('Unauthorized')
  }

  await db
    .update(products)
    .set({
      name: data.name,
      description: data.description,
      price: data.price.toString(),
      imageUrl: data.imageUrl,
      category: data.category,
      sizes: data.sizes,
      colors: data.colors,
      stock: data.stock,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))

  revalidatePath('/products')
  revalidatePath('/admin/products')
  revalidatePath(`/products/${id}`)
}

export async function deleteProduct(id: string) {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized')

  const product = await getProductById(id)
  if (!product || product.createdBy !== userId) {
    throw new Error('Unauthorized')
  }

  await db.delete(products).where(eq(products.id, id))

  revalidatePath('/products')
  revalidatePath('/admin/products')
}

export async function addToCart(data: {
  productId: string
  quantity: number
  size: string
  color: string
}) {
  // Re-export from cart actions
  const { addToCart: _addToCart } = await import('./cart')
  return _addToCart(data)
}

export async function getFeaturedProducts(limit = 12) {
  try {
    const result = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt))
      .limit(limit)
    return result
  } catch (error) {
    console.error('[v0] getFeaturedProducts error:', error)
    return []
  }
}

export async function getProductsByCategory(category: string) {
  try {
    return await db
      .select()
      .from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt))
  } catch (error) {
    console.error('[v0] getProductsByCategory error:', error)
    return []
  }
}

export async function seedProducts() {
  const userId = await getUserId()
  if (!userId) throw new Error('Unauthorized - must be logged in to seed products')

  const { sampleProducts } = await import('@/lib/sample-products')

  // Check if products already exist
  const existingProducts = await getProducts()
  if (existingProducts.length > 0) {
    return { message: 'Products already seeded', count: existingProducts.length }
  }

  // Insert all sample products
  for (const product of sampleProducts) {
    const id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    await db.insert(products).values({
      id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      createdBy: userId,
    })
    // Small delay to ensure unique IDs
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  revalidatePath('/')
  revalidatePath('/products')
  revalidatePath('/admin/products')

  return { message: 'Products seeded successfully', count: sampleProducts.length }
}
