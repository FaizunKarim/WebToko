# Quick Start Guide - Gerai Fashion

## Akses Aplikasi

### Untuk Pembeli (Public/Tanpa Login)
1. Buka: `http://localhost:3000`
2. Klik "Belanja" atau "Mulai Belanja"
3. Browse produk, klik produk untuk detail
4. Pilih ukuran, warna, jumlah
5. Klik "Tambah ke Keranjang"
6. Lihat keranjang: `/cart`

### Untuk Admin (Login/Signup)
1. Buka: `http://localhost:3000/auth`
2. **Untuk login**: Masukkan email & password admin yang sudah terdaftar
3. **Untuk daftar baru**: 
   - Klik "Daftar di sini"
   - Isi Nama, Email, Password
   - Klik "Daftar"
   - Tunggu approval dari superadmin
   - Setelah diapprove, login dan akses `/admin/products`

---

## URL Penting

| URL | Akses | Deskripsi |
|-----|-------|-----------|
| `/` | Public | Landing page / Home |
| `/products` | Public | Katalog semua produk |
| `/products/[id]` | Public | Detail produk individual |
| `/cart` | Public | Keranjang belanja |
| `/checkout` | Public | Proses checkout |
| `/auth` | Manual | Admin login/signup |
| `/auth/waiting-approval` | Auto | Status tunggu approval |
| `/admin/products` | Login Required | Manage produk (admin) |
| `/admin/orders` | Login Required | Manage pesanan (admin) |

---

## User Types

### 1. Pembeli Biasa
- **Akses**: Semua halaman public
- **Tidak perlu**: Sign up, login, atau registrasi
- **Bisa**: Lihat produk, tambah cart, checkout
- **Keranjang**: Disimpan di session

### 2. Calon Admin
- **Daftar di**: `/auth` → "Daftar di sini"
- **Status**: Pending approval
- **Tunggu**: Superadmin approve
- **Akses**: Portal admin setelah diapprove

### 3. Admin
- **Login**: `/auth` dengan credentials
- **Akses**: `/admin/products`, `/admin/orders`
- **Bisa**: CRUD produk, manage orders

### 4. Superadmin (TBD)
- Approve calon admin
- Akses semua fitur admin
- Manage admin users

---

## Testing Flows

### Test 1: Pembeli Akses Toko
```
1. Buka http://localhost:3000
2. Lihat landing page → "Koleksi Fashion Terbaru Kami"
3. Klik "Mulai Belanja"
4. Lihat produk (sekarang kosong, tambahkan via admin)
5. Kembali ke home
```

### Test 2: Admin Signup
```
1. Buka http://localhost:3000/auth
2. Klik "Daftar di sini"
3. Isi:
   - Nama: Admin Test
   - Email: admin@test.com
   - Password: password123
4. Klik "Daftar"
5. Lihat halaman "Pendaftaran Sedang Diproses"
```

### Test 3: Admin Login (Jika sudah ada akun)
```
1. Buka http://localhost:3000/auth
2. Masukkan:
   - Email: admin@example.com
   - Password: password
3. Klik "Masuk"
4. Redirect ke /admin/products
```

---

## Demo Data

Untuk menambah produk demo, gunakan admin panel:
1. Login ke `/auth`
2. Akses `/admin/products`
3. Klik "Tambah Produk"
4. Isi data:
   - Nama: "T-Shirt Biru"
   - Harga: 150000
   - Ukuran: S, M, L, XL
   - Warna: Biru, Merah, Hitam
   - Stock: 10
   - Category: Pria
5. Klik "Simpan"

---

## Common Issues & Solutions

### Produk tidak muncul di katalog
- Admin belum menambah produk
- Gunakan admin panel untuk tambah produk

### Signup meminta approval
- **NORMAL!** Calon admin harus di-approve superadmin
- Fitur approval masih perlu dikonfigurasi

### Cart kosong/tidak tersimpan
- Cart disimpan per-session
- Refresh page akan menghilangkan cart
- Implementasi persistent cart bisa ditambahkan

### Admin portal tidak bisa diakses
- Pastikan sudah login terlebih dahulu
- Cek email/password yang benar

---

## Environment Variables Needed

Pastikan sudah ada di `.env.local`:
```
DATABASE_URL=your_neon_postgres_url
BETTER_AUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MIDTRANS_SERVER_KEY=your_midtrans_key
MIDTRANS_CLIENT_KEY=your_client_key
REPLICATE_API_TOKEN=your_replicate_token
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
```

---

## Development Tips

1. **Ubah Design**
   - Edit warna di Tailwind classes
   - File: `app/page.tsx`, `app/products/page.tsx`, dll

2. **Tambah Halaman Baru**
   - Buat folder di `app/`
   - Buat `page.tsx` di dalamnya
   - Auto-route di Next.js

3. **Tambah Components**
   - Buat di `components/`
   - Import di halaman yang butuh

4. **Database Changes**
   - Edit schema di `lib/db/schema.ts`
   - Update Neon dengan DDL di Neon console

5. **Testing**
   - Gunakan `agent-browser` untuk UI testing
   - Check console logs untuk errors

---

## Support & Next Steps

### Untuk Development Lanjutan:
1. Implement superadmin approval logic
2. Add email notifications
3. Complete admin dashboard
4. Add search & filters
5. Optimize for production

### Resources:
- Neon DB: Console untuk manage database
- Midtrans: Dashboard untuk payment testing
- Better Auth: Docs di better-auth.js.org
- Tailwind: tailwindcss.com untuk styling

---

**Happy Testing! 🎉**

Untuk pertanyaan atau issues, review file CHANGES.md atau SUMMARY_UPDATE.md
