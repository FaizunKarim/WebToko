'use client'

import Link from 'next/link'
import { Search, ShoppingCart, Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface NavbarProps {
  userName?: string | null
  userPhoto?: string | null
  showAuth?: boolean
  onLogout?: () => void
}

const categories = [
  { name: 'Pria', href: '/products?category=pria' },
  { name: 'Wanita', href: '/products?category=wanita' },
  { name: 'Anak', href: '/products?category=anak' },
  { name: 'Olahraga', href: '/products?category=olahraga' },
  { name: 'Aksesoris', href: '/products?category=aksesoris' },
]

export function Navbar({ userName, userPhoto, showAuth = false, onLogout }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout()
    }
  }

  return (
    <nav className='bg-black sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='shrink-0'>
            <Image src='/novi.png' alt='Novi' width={120} height={40} className='h-10 w-auto' />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-6'>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className='text-gray-300 hover:text-white font-medium transition text-sm'
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className='hidden md:flex items-center flex-1 max-w-md mx-6'>
            <div className='relative w-full'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Cari produk...'
                className='w-full bg-gray-900 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 text-sm'
              />
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            </div>
          </form>

          {/* Right Side - Cart & Auth */}
          <div className='flex items-center gap-4'>
            <Link
              href='/cart'
              className='flex items-center gap-2 text-gray-300 hover:text-white transition'
            >
              <ShoppingCart className='w-5 h-5' />
              <span className='hidden sm:inline text-sm font-medium'>Keranjang</span>
            </Link>

            {showAuth && userName && (
              <>
                <Link
                  href='/orders'
                  className='hidden sm:block text-gray-300 hover:text-white font-medium transition text-sm'
                >
                  Pesanan
                </Link>

                {/* Profile Menu */}
                <div className='relative'>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className='flex items-center gap-2 text-gray-300 hover:text-white transition'
                  >
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={userName}
                        className='w-8 h-8 rounded-full object-cover border-2 border-gray-600'
                      />
                    ) : (
                      <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600'>
                        <User className='w-4 h-4 text-gray-300' />
                      </div>
                    )}
                  </button>

                  {profileMenuOpen && (
                    <div className='absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2 z-50'>
                      <div className='px-4 py-2 border-b border-gray-700'>
                        <p className='text-sm text-white font-medium truncate'>{userName}</p>
                      </div>
                      <Link
                        href='/admin/profile'
                        onClick={() => setProfileMenuOpen(false)}
                        className='flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition'
                      >
                        <User className='w-4 h-4' />
                        Edit Profil
                      </Link>
                      <Link
                        href='/admin/products'
                        onClick={() => setProfileMenuOpen(false)}
                        className='flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition'
                      >
                        Admin
                      </Link>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false)
                          handleLogout()
                        }}
                        className='flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition'
                      >
                        <LogOut className='w-4 h-4' />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden text-gray-300 hover:text-white'
            >
              {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-800'>
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className='mb-4'>
              <div className='relative'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Cari produk...'
                  className='w-full bg-gray-900 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 text-sm'
                />
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              </div>
            </form>

            {/* Mobile Categories */}
            <div className='space-y-2'>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className='block text-gray-300 hover:text-white font-medium py-2 transition'
                >
                  {category.name}
                </Link>
              ))}
              {showAuth && userName && (
                <>
                  <div className='border-t border-gray-800 pt-2 mt-2'>
                    <div className='flex items-center gap-3 py-2'>
                      {userPhoto ? (
                        <img
                          src={userPhoto}
                          alt={userName}
                          className='w-8 h-8 rounded-full object-cover border-2 border-gray-600'
                        />
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600'>
                          <User className='w-4 h-4 text-gray-300' />
                        </div>
                      )}
                      <span className='text-sm text-white font-medium'>{userName}</span>
                    </div>
                  </div>
                  <Link
                    href='/orders'
                    onClick={() => setMobileMenuOpen(false)}
                    className='block text-gray-300 hover:text-white font-medium py-2 transition'
                  >
                    Pesanan
                  </Link>
                  <Link
                    href='/admin/profile'
                    onClick={() => setMobileMenuOpen(false)}
                    className='block text-gray-300 hover:text-white font-medium py-2 transition'
                  >
                    Edit Profil
                  </Link>
                  <Link
                    href='/admin/products'
                    onClick={() => setMobileMenuOpen(false)}
                    className='block text-gray-300 hover:text-white font-medium py-2 transition'
                  >
                    Admin
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className='block text-red-400 hover:text-red-300 font-medium py-2 transition w-full text-left'
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}