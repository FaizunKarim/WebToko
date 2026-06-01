# Perubahan Sistem - Gerai Fashion

## Ringkasan Perubahan

Sistem telah diubah dari model toko dengan login wajib menjadi toko fashion normal yang mudah diakses pembeli biasa, dengan admin portal terpisah.

## Perubahan Utama

### 1. Akses Pembeli (Public/Tidak Perlu Login)
- **Landing Page** (`/`): Tidak perlu login
  - Design menggunakan style toko fashion normal (bukan modern futuristik)
  - Warna: Abu-abu, putih, hitam (profesional)
  - Menampilkan: Hero, fitur utama, kategori, footer
  
- **Katalog Produk** (`/products`): Tidak perlu login
  - Pembeli bisa melihat semua produk
  - Styling: Clean dan professional
  
- **Detail Produk** (`/products/[id]`): Tidak perlu login
  - Pembeli bisa melihat detail produk
  - Bisa menambah ke keranjang tanpa login
  
- **Keranjang** (`/cart`): Tidak perlu login
  - Melihat dan mengelola keranjang
  - Proses checkout tersedia

### 2. Admin Portal (Dibuat Terpisah)
- **URL Admin**: `/auth` (bukan di navbar publik)
  - Login untuk admin yang sudah terdaftar
  - Atau mendaftar sebagai calon admin
  
- **Proses Pendaftaran Admin**:
  - Calon admin bisa daftar di `/auth`
  - Setelah daftar → redirek ke `/auth/waiting-approval`
  - Status: Menunggu approval dari superadmin
  - Superadmin harus approve via database atau admin panel khusus
  - Setelah diapprove → bisa login ke portal admin
  
- **Menu Admin** (Hanya untuk yang sudah login):
  - `/admin/products` - Manajemen produk
  - `/admin/orders` - Manajemen pesanan
  - Link ada di navigasi hanya jika sudah login

### 3. Design & Styling
- **Warna**: Abu-abu (gray), putih, hitam (professional)
- **Typography**: Sederhana, readable
- **Layout**: Flexbox untuk navigation, grid untuk product cards
- **Responsif**: Mobile-first approach
- **Tidak menggunakan**: Gradient, modern futuristic, cyan colors

### 4. User Experience
- **Pembeli**: Bebas akses, tanpa friction, bisa langsung belanja
- **Admin Baru**: Daftar → tunggu approval → bisa masuk portal
- **Superadmin**: Bisa approve admin baru (fitur masih perlu ditambahkan)

## File yang Diubah

### Pages
- `app/page.tsx` - Landing page redesign (toko fashion normal)
- `app/auth/page.tsx` - NEW: Admin portal (signin/signup)
- `app/auth/waiting-approval/page.tsx` - NEW: Halaman tunggu approval
- `app/products/page.tsx` - Update styling (light theme)
- `app/products/[id]/page.tsx` - Redesign dengan styling normal
- `app/cart/page.tsx` - Redesign dengan styling normal
- `app/layout.tsx` - Update metadata dan body styling (light theme)

### Components
- `components/product-card.tsx` - Update styling (light theme, currency IDR)

### Not Changed (Admin masih perlu dikerjakan):
- Admin pages belum fully didesain
- Superadmin approval workflow belum implemented
- Dashboard admin order/product management perlu disesuaikan

## Perubahan Metadata
- Title: "Gerai Fashion - Toko Pakaian Online"
- Description: Tentang belanja pakaian berkualitas
- Keywords: Fashion, pakaian, toko online, baju, belanja

## Currency & Locale
- Menggunakan IDR (Rp) untuk harga
- Menggunakan bahasa Indonesia di UI

## Next Steps
1. Buat workflow approval untuk admin baru
2. Update admin pages styling
3. Tambahkan superadmin role
4. Test flow pembelian lengkap
5. Tambahkan more pages (FAQ, kebijakan, dll)

---

**Changelog dibuat**: 2024
**Version**: 2.0 - Public Shop Release
