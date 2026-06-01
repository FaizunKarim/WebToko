'use client'

import Link from 'next/link'
import { Search, ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  userName?: string | null
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

export function Navbar({ userName, showAuth = false, onLogout }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <nav className='bg-black sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link href='/' className='text-xl font-bold text-white shrink-0'>
            GERAI FASHION
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
                <Link
                  href='/auth'
                  className='hidden sm:block text-gray-300 hover:text-white font-medium transition text-sm'
                >
                  Admin
                </Link>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className='hidden sm:block text-gray-300 hover:text-white font-medium transition text-sm'
                  >
                    Logout
                  </button>
                )}
                <span className='hidden lg:block text-sm text-gray-400'>
                  {userName}
                </span>
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
                  <Link
                    href='/orders'
                    onClick={() => setMobileMenuOpen(false)}
                    className='block text-gray-300 hover:text-white font-medium py-2 transition'
                  >
                    Pesanan
                  </Link>
                  <Link
                    href='/auth'
                    onClick={() => setMobileMenuOpen(false)}
                    className='block text-gray-300 hover:text-white font-medium py-2 transition'
                  >
                    Admin
                  </Link>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        onLogout()
                      }}
                      className='block text-gray-300 hover:text-white font-medium py-2 transition w-full text-left'
                    >
                      Logout
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
