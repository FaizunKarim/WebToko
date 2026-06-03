'use client'

import { useState, useEffect } from 'react'
import { getAllUsers, promoteToAdmin, demoteFromAdmin } from '@/app/actions/admin'
import Link from 'next/link'
import { UserPlus, UserMinus, ArrowLeft, Users, Shield } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: Date
  isAdmin: boolean
  adminRole: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handlePromote = async (userId: string, userName: string) => {
    if (!confirm(`Promosikan ${userName || 'user ini'} menjadi Admin?`)) return

    setActionLoading(userId)
    setError(null)
    setSuccess(null)

    try {
      await promoteToAdmin(userId)
      setSuccess(`${userName || 'User'} berhasil dipromosikan menjadi Admin`)
      await loadUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to promote user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDemote = async (userId: string, userName: string) => {
    if (!confirm(`Hapus status Admin dari ${userName || 'user ini'}?`)) return

    setActionLoading(userId)
    setError(null)
    setSuccess(null)

    try {
      await demoteFromAdmin(userId)
      setSuccess(`Status Admin ${userName || 'User'} berhasil dihapus`)
      await loadUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to demote user')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='p-8 text-center'>Memuat data pengguna...</div>
      </div>
    )
  }

  const adminCount = users.filter((u) => u.isAdmin).length
  const userCount = users.filter((u) => !u.isAdmin).length

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
              className='text-white font-medium text-sm'
            >
              Pengguna
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <Link
            href='/admin/products'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4'
          >
            <ArrowLeft className='w-4 h-4' />
            Kembali ke Produk
          </Link>
          <h1 className='text-3xl font-bold text-gray-900'>Manajemen Pengguna</h1>
          <p className='text-gray-600 mt-2'>
            Kelola akun pengguna dan promosikan menjadi Admin
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-4 mb-8'>
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Users className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>{userCount}</p>
                <p className='text-sm text-gray-600'>Pengguna Biasa</p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <Shield className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <p className='text-2xl font-bold text-gray-900'>{adminCount}</p>
                <p className='text-sm text-gray-600'>Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>
            {error}
          </div>
        )}
        {success && (
          <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700'>
            {success}
          </div>
        )}

        {/* Users Table */}
        <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
                    Pengguna
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
                    Status
                  </th>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>
                    Bergabung
                  </th>
                  <th className='px-6 py-4 text-right text-sm font-semibold text-gray-900'>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {users.map((user) => (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || ''}
                              className='w-10 h-10 rounded-full object-cover'
                            />
                          ) : (
                            <span className='text-gray-600 font-medium'>
                              {(user.name || user.email || 'U')[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className='font-medium text-gray-900'>
                            {user.name || 'Tanpa Nama'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-gray-600'>{user.email}</td>
                    <td className='px-6 py-4'>
                      {user.isAdmin ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                          <Shield className='w-3.5 h-3.5' />
                          Admin
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'>
                          <Users className='w-3.5 h-3.5' />
                          User
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-gray-600 text-sm'>
                      {new Date(user.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      {user.isAdmin ? (
                        <button
                          onClick={() => handleDemote(user.id, user.name || user.email)}
                          disabled={actionLoading === user.id}
                          className='inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium disabled:opacity-50'
                        >
                          <UserMinus className='w-4 h-4' />
                          {actionLoading === user.id ? 'Memproses...' : 'Hapus Admin'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePromote(user.id, user.name || user.email)}
                          disabled={actionLoading === user.id}
                          className='inline-flex items-center gap-1.5 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition text-sm font-medium disabled:opacity-50'
                        >
                          <UserPlus className='w-4 h-4' />
                          {actionLoading === user.id ? 'Memproses...' : 'Jadikan Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className='py-12 text-center'>
              <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-600'>Belum ada pengguna terdaftar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
