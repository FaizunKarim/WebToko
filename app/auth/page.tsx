'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { autoPromoteToAdmin } from '@/app/actions/admin'

export default function AdminAuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal masuk')
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!name || !email || !password) {
        setError('Semua field harus diisi')
        setLoading(false)
        return
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal daftar')
        return
      }

      // Auto-promote new user to admin
      if (data?.user?.id) {
        await autoPromoteToAdmin(data.user.id)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center py-12 px-4'>
        <div className='w-full max-w-md'>
          <div className='bg-white border border-gray-200 rounded-lg p-8'>
            <h2 className='text-3xl font-bold text-gray-900 mb-2 text-center'>
              Admin Portal
            </h2>
            <p className='text-center text-gray-600 mb-8'>
              {mode === 'signin'
                ? 'Masuk ke akun admin Anda'
                : 'Buat akun admin baru'}
            </p>

            {error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
                {error}
              </div>
            )}

            <form
              onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}
              className='space-y-4'
            >
              {mode === 'signup' && (
                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    Nama Lengkap
                  </label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                    placeholder='John Doe'
                  />
                </div>
              )}

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                  placeholder='admin@example.com'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Password
                </label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                  placeholder='••••••••'
                />
              </div>

              <button
                type='submit'
                className='w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium'
              >
                {mode === 'signin' ? 'Masuk' : 'Daftar'}
              </button>
            </form>

            {mode === 'signin' && (
              <div className='mt-6 text-center'>
                <p className='text-gray-600'>
                  Belum punya akun?{' '}
                  <button
                    onClick={() => {
                      setMode('signup')
                      setError('')
                    }}
                    className='text-gray-900 font-semibold hover:underline'
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            )}

            {mode === 'signup' && (
              <div className='mt-6 text-center'>
                <p className='text-gray-600'>
                  Sudah punya akun?{' '}
                  <button
                    onClick={() => {
                      setMode('signin')
                      setError('')
                    }}
                    className='text-gray-900 font-semibold hover:underline'
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className='mt-6 text-center'>
            <Link href='/' className='text-gray-600 hover:text-gray-900 font-medium'>
              ← Kembali ke toko
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}