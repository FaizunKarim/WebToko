import Link from 'next/link'

export default function WaitingApprovalPage() {
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
        <div className='w-full max-w-md text-center'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-8'>
            <div className='text-5xl mb-6'>⏳</div>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>
              Pendaftaran Sedang Diproses
            </h2>
            <p className='text-gray-600 mb-6'>
              Terima kasih telah mendaftar sebagai admin. Akun Anda sedang menunggu persetujuan dari superadmin.
            </p>
            <div className='bg-blue-100 border-l-4 border-blue-500 p-4 rounded mb-6 text-left'>
              <p className='text-sm text-gray-700'>
                <strong>Apa selanjutnya?</strong><br/>
                Kami akan menghubungi Anda melalui email ketika akun Anda telah disetujui. Harap tunggu beberapa hari kerja.
              </p>
            </div>
            <Link
              href='/'
              className='inline-block bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition font-medium'
            >
              Kembali ke Toko
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
