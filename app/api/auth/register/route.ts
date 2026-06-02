import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hash(password, 12)
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await db.insert(user).values({
      id,
      name: name || null,
      email,
      password: hashedPassword,
      role: 'user',
    })

    // Create session
    await createSession(id)

    return NextResponse.json({
      success: true,
      user: { id, name, email, role: 'user' },
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}