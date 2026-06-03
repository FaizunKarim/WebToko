import Link from 'next/link'
import { RotateCcw, CheckCircle, AlertCircle, Clock, FileText, MessageCircle, ArrowLeft, Package } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kebijakan Pengembalian
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kepuasan Anda adalah prioritas kami. Berikut adalah kebijakan pengembalian produk yang berlaku di Novi.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Policy Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Garansi 100%</h3>
            <p className="text-sm text-gray-600">Uang kembali jika produk tidak sesuai</p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
            <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">14 Hari</h3>
            <p className="text-sm text-gray-600">Waktu pengembalian produk</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
            <RotateCcw className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Gratis</h3>
            <p className="text-sm text-gray-600">Biaya pengembalian ditanggung</p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ketentuan Pengembalian</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Produk dapat dikembalikan dalam waktu 14 hari setelah diterima</p>
                  <p className="text-gray-600 text-sm mt-1">Terhitung sejak tanggal diterima sesuai resi pengiriman</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Produk dalam kondisi belum dipakai dan masih ada label</p>
                  <p className="text-gray-600 text-sm mt-1">Label dan kemasan asli produk harus masih lengkap dan tidak rusak</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Menyertakan bukti pembelian (invoice/struk)</p>
                  <p className="text-gray-600 text-sm mt-1">Bukti pembelian diperlukan untuk memproses pengembalian</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Produk cacat produksi akan diganti dengan yang baru</p>
                  <p className="text-gray-600 text-sm mt-1">Kami akan mengecek dan memverifikasi keluhan cacat produksi</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk yang Tidak Dapat Dikembalikan</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Produk yang sudah digunakan atau dicuci</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Produk tanpa label atau kemasan asli</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Produk yang sudah melewati batas waktu 14 hari</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Produk underwear, swimwear, dan aksesoris tertentu</p>
                </div>
              </div>
            </div>
          </section>

          {/* Process Steps */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Cara Mengembalikan Produk</h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
              
              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Hubungi Customer Service",
                    desc: "Hubungi kami melalui email atau telepon untuk melaporkan pengembalian produk. Sertakan nomor pesanan dan alasan pengembalian.",
                    icon: MessageCircle
                  },
                  {
                    step: "2",
                    title: "Konfirmasi Pengembalian",
                    desc: "Tim kami akan memverifikasi pengembalian dan memberikan instruksi lengkap termasuk alamat pengiriman pengembalian.",
                    icon: CheckCircle
                  },
                  {
                    step: "3",
                    title: "Kirim Produk Kembali",
                    desc: "Kemas produk dengan aman menggunakan kemasan asli dan kirimkan ke alamat yang telah diberikan. Simpan bukti pengiriman.",
                    icon: Package
                  },
                  {
                    step: "4",
                    title: "Inspeksi & Proses Refund",
                    desc: "Setelah produk diterima, tim kami akan melakukan inspeksi. Proses refund akan diproses dalam 3-5 hari kerja setelah produk dinyatakan sesuai ketentuan.",
                    icon: FileText
                  }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="relative flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-black flex items-center justify-center relative z-10">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 pt-3">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-sm font-bold text-gray-700 mb-2">
                          {item.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Refund Info */}
          <section className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Refund</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Metode Refund</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Transfer bank (1-3 hari kerja)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Kembali ke saldo dompet digital
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Kredit toko untuk belanja berikutnya
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Waktu Proses</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Konfirmasi pengembalian: 1x24 jam
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Inspeksi produk: 2-3 hari kerja
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Proses refund: 3-5 hari kerja
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">Butuh Bantuan Pengembalian?</h2>
          <p className="text-gray-400 mb-6">Tim kami siap membantu proses pengembalian Anda</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Hubungi Kami
            </Link>
            <Link href="/shipping" className="inline-block border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
              Info Pengiriman
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}