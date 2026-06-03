'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HelpCircle, ShoppingBag, CreditCard, Truck, RotateCcw, User, MessageCircle, ChevronDown } from 'lucide-react'

const faqCategories = [
  {
    id: 'order',
    title: 'Pesanan',
    icon: ShoppingBag,
    questions: [
      {
        q: 'Bagaimana cara memesan produk?',
        a: 'Pilih produk yang diinginkan, tentukan ukuran dan warna, lalu klik "Tambah ke Keranjang". Setelah selesai berbelanja, buka halaman Keranjang dan klik "Checkout" untuk melanjutkan ke pembayaran.'
      },
      {
        q: 'Apakah saya perlu mendaftar akun untuk berbelanja?',
        a: 'Ya, Anda perlu mendaftar akun untuk dapat berbelanja. Proses pendaftaran mudah dan cepat, cukup dengan email dan password.'
      },
      {
        q: 'Bagaimana cara melihat status pesanan?',
        a: 'Anda dapat melihat status pesanan melalui halaman "Pesanan" di akun Anda. Status akan diperbarui secara otomatis dari proses pembayaran hingga pengiriman.'
      },
      {
        q: 'Bisakah saya membatalkan pesanan?',
        a: 'Pesanan dapat dibatalkan selama status masih "Menunggu Pembayaran" atau "Diproses". Hubungi customer service kami untuk pembatalan pesanan.'
      },
    ]
  },
  {
    id: 'payment',
    title: 'Pembayaran',
    icon: CreditCard,
    questions: [
      {
        q: 'Metode pembayaran apa saja yang tersedia?',
        a: 'Kami menerima pembayaran melalui transfer bank (BCA, Mandiri, BRI, BNI), e-wallet (GoPay, OVO, Dana), dan kartu kredit.'
      },
      {
        q: 'Apakah pembayaran aman?',
        a: 'Ya, semua transaksi diproses dengan sistem keamanan terenkripsi. Data pembayaran Anda dilindungi dan tidak akan disalahgunakan.'
      },
      {
        q: 'Berapa lama konfirmasi pembayaran?',
        a: 'Konfirmasi pembayaran biasanya diproses dalam 1x24 jam setelah pembayaran diterima. Anda akan mendapat notifikasi melalui email.'
      },
      {
        q: 'Apakah tersedia cicilan?',
        a: 'Saat ini kami belum menyediakan opsi cicilan. Namun, berbagai metode pembayaran yang tersedia diharapkan dapat memudahkan transaksi Anda.'
      },
    ]
  },
  {
    id: 'shipping',
    title: 'Pengiriman',
    icon: Truck,
    questions: [
      {
        q: 'Berapa lama waktu pengiriman?',
        a: 'Pengiriman Jabodetabek 1-2 hari kerja, kota besar 3-5 hari kerja, dan wilayah terpencil 5-10 hari kerja.'
      },
      {
        q: 'Apakah gratis ongkos kirim?',
        a: 'Ya, gratis ongkos kirim untuk pembelian minimal Rp 500.000. Syarat dan ketentuan berlaku.'
      },
      {
        q: 'Jasa pengiriman apa yang digunakan?',
        a: 'Kami bekerja sama dengan JNE, J&T Express, SiCepat, dan Pos Indonesia untuk memastikan pengiriman ke seluruh Indonesia.'
      },
      {
        q: 'Bagaimana cara melacak pesanan?',
        a: 'Setelah pesanan dikirim, Anda akan menerima nomor resi melalui email. Anda bisa melacak di website ekspedisi terkait atau melalui halaman Pesanan.'
      },
    ]
  },
  {
    id: 'returns',
    title: 'Pengembalian',
    icon: RotateCcw,
    questions: [
      {
        q: 'Bagaimana cara mengembalikan produk?',
        a: 'Hubungi customer service kami dalam waktu 14 hari setelah produk diterima. Kami akan memandu proses pengembalian dengan mudah.'
      },
      {
        q: 'Apakah biaya pengembalian ditanggung?',
        a: 'Ya, biaya pengembalian ditanggung sepenuhnya oleh kami jika produk mengalami cacat produksi atau kesalahan dari pihak kami.'
      },
      {
        q: 'Berapa lama proses refund?',
        a: 'Proses refund biasanya memakan waktu 3-5 hari kerja setelah produk diterima dan diinspeksi oleh tim kami.'
      },
      {
        q: 'Produk apa yang tidak bisa dikembalikan?',
        a: 'Produk yang sudah digunakan, dicuci, tanpa label asli, atau melewati batas waktu 14 hari tidak dapat dikembalikan. Produk underwear dan swimwear juga tidak dapat dikembalikan.'
      },
    ]
  },
  {
    id: 'account',
    title: 'Akun',
    icon: User,
    questions: [
      {
        q: 'Bagaimana cara mengubah data profil?',
        a: 'Anda dapat mengubah data profil melalui halaman "Edit Profil" yang tersedia di menu dropdown akun Anda.'
      },
      {
        q: 'Lupa password?',
        a: 'Silakan hubungi customer service kami untuk membantu mereset password akun Anda.'
      },
      {
        q: 'Apakah saya bisa memiliki lebih dari satu akun?',
        a: 'Kami menyarankan setiap pengguna hanya memiliki satu akun untuk memudahkan pengelolaan pesanan dan riwayat belanja.'
      },
    ]
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('order')
  const [openQuestions, setOpenQuestions] = useState<string[]>([])

  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev =>
      prev.includes(id)
        ? prev.filter(q => q !== id)
        : [...prev, id]
    )
  }

  const activeFaq = faqCategories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan. Jika Anda tidak menemukan jawaban yang dicari, jangan ragu untuk menghubungi kami.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Categories */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-2">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Kategori
              </p>
              {faqCategories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                      activeCategory === category.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{category.title}</span>
                    <span className="ml-auto text-xs opacity-60">
                      {category.questions.length}
                    </span>
                  </button>
                )
              })}

              {/* Contact */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <MessageCircle className="w-8 h-8 text-gray-900 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Masih butuh bantuan?</h3>
                <p className="text-sm text-gray-600 mb-4">Tim kami siap membantu Anda</p>
                <Link
                  href="/"
                  className="block w-full text-center bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 min-w-0">
            {activeFaq && (
              <>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                    <activeFaq.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{activeFaq.title}</h2>
                    <p className="text-sm text-gray-600">
                      {activeFaq.questions.length} pertanyaan
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {activeFaq.questions.map((item, index) => {
                    const questionId = `${activeFaq.id}-${index}`
                    const isOpen = openQuestions.includes(questionId)

                    return (
                      <div
                        key={questionId}
                        className="border border-gray-200 rounded-xl overflow-hidden transition"
                      >
                        <button
                          onClick={() => toggleQuestion(questionId)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed mt-4">{item.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* Back Link */}
            <div className="mt-12 text-center">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                ← Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}