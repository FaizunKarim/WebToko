'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Camera, Save, User } from 'lucide-react'
import { getCurrentUser, updateProfile } from '@/app/actions/profile'

export default function AdminProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    try {
      const data = await getCurrentUser()
      setUser(data)
      setName(data?.name || '')
      setPhoto(data?.photo || '')
    } catch (err: any) {
      setMessage('Gagal memuat data profil')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      await updateProfile({ name, photo })
      setMessage('Profil berhasil diperbarui!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setMessage(err.message || 'Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='p-8 text-center'>Memuat data profil...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Admin Sub-Navigation */}
      <nav className='bg-gray-900 border-b border-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-4 h-10'>
            <Link
              href='/admin/products'
              className='text-gray-300 hover:text-white font-medium text-sm'
            >
              Produk
            </Link>
            <Link
              href='/admin/orders'
              className='text-gray-300 hover:text-white font-medium text-sm'
            >
              Pesanan
            </Link>
            <Link
              href='/admin/users'
              className='text-gray-300 hover:text-white font-medium text-sm'
            >
              Pengguna
            </Link>
            <Link
              href='/admin/profile'
              className='text-white font-medium text-sm'
            >
              Profil
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <Link
            href='/admin/products'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
          >
            <ArrowLeft className='w-4 h-4' />
            Kembali ke Admin
          </Link>
          <h1 className='text-3xl font-bold text-gray-900'>Edit Profil</h1>
          <p className='text-gray-600 mt-2'>
            Kelola informasi profil Anda
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('berhasil')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className='bg-white rounded-lg border border-gray-200 p-8'>
          {/* Photo Section */}
          <div className='flex flex-col items-center mb-8'>
            <div className='relative mb-4'>
              {photo ? (
                <img
                  src={photo}
                  alt='Profile'
                  className='w-32 h-32 rounded-full object-cover border-4 border-gray-200'
                />
              ) : (
                <div className='w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200'>
                  <User className='w-16 h-16 text-gray-400' />
                </div>
              )}
              <div className='absolute bottom-0 right-0 bg-gray-900 rounded-full p-2'>
                <Camera className='w-4 h-4 text-white' />
              </div>
            </div>
            <p className='text-sm text-gray-500'>Klik ikon kamera untuk mengubah foto</p>
          </div>

          {/* Form */}
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Nama Lengkap
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                placeholder='Masukkan nama Anda'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={user?.email || ''}
                disabled
                className='w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500'
              />
              <p className='mt-1 text-sm text-gray-500'>Email tidak dapat diubah</p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>
                URL Foto Profil
              </label>
              <input
                type='url'
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                placeholder='https://example.com/photo.jpg'
              />
              <p className='mt-1 text-sm text-gray-500'>Masukkan URL gambar untuk foto profil Anda</p>
            </div>

            <div className='flex gap-4 pt-4'>
              <button
                onClick={handleSave}
                disabled={saving}
                className='flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50'
              >
                <Save className='w-4 h-4' />
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <Link
                href='/admin/products'
                className='px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium'
              >
                Batal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}