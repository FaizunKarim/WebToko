import Link from 'next/link'
import { Package, Clock, Shield, MapPin, CreditCard, Headphones } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tentang Pengiriman
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami berkomitmen memberikan pengalaman berbelanja yang nyaman dengan layanan pengiriman yang cepat, aman, dan terpercaya.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Waktu Pengiriman</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pengiriman Jabodetabek: 1-2 hari kerja. Pengiriman ke kota-kota besar Indonesia: 3-5 hari kerja. 
                  Wilayah terpencil: 5-10 hari kerja.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Keamanan Paket</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Setiap paket dikemas dengan standar kualitas tinggi menggunakan bahan pelindung untuk memastikan 
                  produk sampai dalam kondisi sempurna.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Area Pengiriman</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kami melayani pengiriman ke seluruh Indonesia melalui jasa ekspedisi terpercaya seperti JNE, 
                  J&T, SiCepat, dan Pos Indonesia.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Biaya Pengiriman</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gratis ongkos kirim untuk pembelian minimal Rp 500.000. Biaya pengiriman dihitung otomatis 
                  saat checkout berdasarkan lokasi dan berat paket.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Detail Pengiriman</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Proses Pengemasan</h3>
                <p className="text-gray-600 leading-relaxed">
                  Setiap produk diperiksa kualitasnya sebelum dikemas. Kami menggunakan kotak kardus berkualitas 
                  dan bubble wrap untuk melindungi produk. Produk fashion dilipat rapi dan dimasukkan ke dalam 
                  plastik pelindung sebelum dikemas dalam kotak.
                </p>
              </div>

              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Tracking Pesanan</h3>
                <p className="text-gray-600 leading-relaxed">
                  Setelah pesanan diproses dan dikirim, Anda akan menerima nomor resi melalui email/SMS. 
                  Anda dapat melacak status pengiriman kapan saja melalui halaman Pesanan di akun Anda 
                  atau langsung melalui website ekspedisi terkait.
                </p>
              </div>

              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Pengiriman Internasional</h3>
                <p className="text-gray-600 leading-relaxed">
                  Saat ini kami hanya melayani pengiriman domestik ke seluruh wilayah Indonesia. 
                  Layanan pengiriman internasional akan segera tersedia. Pantau terus website kami untuk informasi terbaru.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Mini */}
          <section className="bg-gray-50 rounded-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pertanyaan Umum Seputar Pengiriman</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-gray-900 font-medium py-3 border-b border-gray-200 group-open:border-transparent">
                  Apa yang harus dilakukan jika paket belum sampai?
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 py-3 leading-relaxed">
                  Silakan hubungi customer service kami melalui email atau telepon. Kami akan membantu mengecek 
                  status pengiriman dan berkoordinasi dengan pihak ekspedisi.
                </p>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-gray-900 font-medium py-3 border-b border-gray-200 group-open:border-transparent">
                  Apakah bisa mengganti alamat pengiriman?
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 py-3 leading-relaxed">
                  Perubahan alamat dapat dilakukan selama pesanan belum diproses. Segera hubungi customer service 
                  kami untuk melakukan perubahan alamat pengiriman.
                </p>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-gray-900 font-medium py-3 border-b border-gray-200 group-open:border-transparent">
                  Bagaimana jika paket rusak saat diterima?
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-600 py-3 leading-relaxed">
                  Jika paket diterima dalam kondisi rusak, silakan foto paket dan hubungi customer service dalam 
                  waktu 1x24 jam. Kami akan memproses penggantian atau pengembalian dana sesuai kebijakan.
                </p>
              </details>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-black rounded-xl p-8">
          <Headphones className="w-10 h-10 text-white mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Butuh Bantuan?</h2>
          <p className="text-gray-400 mb-6">Tim customer service kami siap membantu Anda</p>
          <Link href="/" className="inline-block bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Hubungi Kami
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}