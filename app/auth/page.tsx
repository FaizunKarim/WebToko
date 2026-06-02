'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
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
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message ?? 'Gagal masuk')
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

      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (signUpError) {
        setError(signUpError.message ?? 'Gagal daftar')
        setLoading(false)
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

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/admin/products',
      })
    } catch (err: any) {
      setError(err.message ?? 'Gagal masuk dengan Google')
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Navigation */}
      <nav className='border-b border-gray-200 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center h-16'>
            <Link href='/' className='text-2xl font-bold text-gray-900'>
              GERAI FASHION
            </Link>
          </div>
        </div>
      </nav>

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
                disabled={loading}
                className='w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50'
              >
                {loading
                  ? 'Tunggu...'
                  : mode === 'signin'
                    ? 'Masuk'
                    : 'Daftar'}
              </button>
            </form>

            {/* Divider */}
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type='button'
              onClick={handleGoogleSignIn}
              disabled={loading}
              className='w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50'
            >
              <svg className='h-5 w-5' viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
              Google
            </button>

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