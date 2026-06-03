import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Novi - Toko Pakaian Online',
  description: 'Belanja pakaian berkualitas tinggi dengan koleksi lengkap dan harga terjangkau. Pengiriman cepat ke seluruh Indonesia.',
  keywords: 'fashion, pakaian, toko online, baju, belanja',
  generator: 'v0.app',
  icons: {
    icon: '/novi-logo.png',
    apple: '/novi-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
