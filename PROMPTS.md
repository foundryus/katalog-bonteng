# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat helper koneksi Supabase server-side di `lib/supabase/server.js` dan `lib/supabase/index.js` menggunakan `@supabase/supabase-js` dengan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- Halaman `app/page.jsx` diubah menjadi Server Component async yang mengambil semua data produk dari tabel `produk` di Supabase.
- Daftar produk ditampilkan menggunakan komponen `KartuProduk` tanpa mengubah styling.
- Ditangani kondisi error dengan menampilkan pesan error yang jelas di halaman, dan jika tabel produk kosong menampilkan tulisan "Belum ada produk".
- Komponen `CatatanBelumAktif` dan data contoh dari `lib/data-contoh.js` dihapus dari halaman.

**Perbaikan:**
- Memperbaiki nilai `SUPABASE_URL` di `.env.local` dan menambahkan pembersihan otomatis pada URL di helper koneksi agar menghapus akhiran `/rest/v1/` untuk menghindari error 404 (PGRST125).

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Halaman `app/produk/[id]/page.jsx` diubah untuk mengambil data satu produk dari tabel `produk` di Supabase berdasarkan parameter `id` di sisi server.
- Jika data produk tidak ditemukan atau id tidak valid, memanggil `notFound()` bawaan Next.js untuk menampilkan halaman 404.
- Komponen `CatatanBelumAktif` dan impor data contoh dihapus dari halaman.
- Komponen `TombolWhatsApp` dipertahankan dan tampilan detail produk tidak diubah.

**Perbaikan:**
- Menggunakan query `.eq("id", id).maybeSingle()` serta memvalidasi jika terjadi error query agar langsung mengarah ke `notFound()`.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Komponen `components/TombolWhatsApp.jsx` diubah menjadi tautan `<a>` dengan target format `https://wa.me/<nomor>?text=<pesan>`.
- Nomor tujuan diambil dari `lib/toko.js`.
- Pesan otomatis memuat nama produk dan harga dalam format rupiah (`formatRupiah`), serta di-encode dengan `encodeURIComponent`.
- Dibuka di tab baru dengan atribut `target="_blank"` dan `rel="noopener noreferrer"`.
- Seluruh kelas gaya tampilan tombol tetap dipertahankan.
- `CatatanBelumAktif` yang menyebut US-03 di halaman detail produk telah dibersihkan.

**Perbaikan:**
- Menambahkan sanitasi pada nomor WhatsApp dari `lib/toko.js` agar hanya menyertakan karakter digit sehingga link `wa.me` selalu valid.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Ditambahkan helper `createSessionClient` di `lib/supabase/server.js` menggunakan `@supabase/ssr` dan cookies untuk mengelola sesi admin.
- Dibuat Server Action `login` dan `logout` di `app/admin/actions.js`.
- Form login di `app/admin/login/page.jsx` dihubungkan ke Server Action `login` via `useActionState`.
- Menampilkan pesan error yang jelas jika login gagal, dan mengarahkan ke `/admin` jika berhasil.
- Tombol "Keluar" di `components/NavAdmin.jsx` difungsikan dengan membungkusnya dalam form Server Action `logout` yang mengakhiri sesi dan kembali ke `/admin/login`.
- `CatatanBelumAktif` dihapus dari halaman login tanpa mengubah tampilan.

**Perbaikan:**
- Mendukung pemanggilan Server Action baik melalui `useActionState` maupun submit form langsung, serta memetakan pesan error `invalid_credentials` ke bahasa Indonesia yang ramah pengguna.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat Server Action `gantiPassword` di `app/admin/actions.js`.
- Dilakukan validasi di sisi server: memastikan admin login via `supabase.auth.getUser()`, panjang password baru minimal 8 karakter, dan kecocokan password baru dengan konfirmasi.
- Memperbarui password menggunakan `supabase.auth.updateUser({ password })`.
- Form di `app/admin/password/page.jsx` disambungkan ke Server Action via `useActionState`.
- Menampilkan pesan berhasil atau pesan error yang jelas di atas form.
- `CatatanBelumAktif` dihapus dari halaman ganti password tanpa mengubah tampilan form.

**Perbaikan:**
- Mengembalikan struktur objek `{ error, success, message }` agar pesan sukses dan error dapat ditampilkan secara spesifik dengan styling token desain yang sesuai (`text-utama` dan `text-bahaya`).

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat file `proxy.js` di root proyek yang memproteksi rute `/admin` dan seluruh sub-rutenya (`matcher: ["/admin", "/admin/:path*"]`).
- Memeriksa sesi login menggunakan `@supabase/ssr` dan cookie. Pengunjung yang belum login otomatis dialihkan ke `/admin/login`.
- Rute `/admin/login` tetap dapat diakses tanpa login (dan dialihkan ke `/admin` jika sudah login).
- Server Action yang mengubah data (`gantiPassword`) dipastikan memeriksa status login di server.
- `CatatanBelumAktif` dihapus dari halaman `/admin` (`app/admin/page.jsx`).

**Perbaikan:**
- Memastikan konfigurasi matcher mencakup `/admin` dan `/admin/:path*` serta menangani penyalinan cookie permintaan dan respons secara akurat pada Next.js 16 proxy/middleware.

## Debugging dan fitur bonus

### US-07 List Produk

**Prompt:**
Baca docs/user-stories.md bagian US-07.

isikan sesuai saran anda

**Hasil:**
- Mengubah `app/admin/page.jsx` menjadi Server Component async yang mengambil daftar produk langsung dari tabel `produk` di Supabase, bukan lagi dari `lib/data-contoh.js`.
- Mengambil seluruh produk dari database dengan pengurutan `id` ascending dan meneruskannya ke komponen `TabelProduk`.
- Menambahkan penanganan tampilan bila belum ada produk di tabel database.
- Impor data contoh dari `lib/data-contoh.js` dihapus sepenuhnya dari halaman admin.

**Perbaikan:**
- Menggunakan `createSessionClient` dengan fallback ke `createServerClient` agar daftar produk dapat dimuat dengan andal baik dalam sesi admin aktif maupun saat rendering sisi server.

### US-08 Tambah produk

**Prompt:**
Baca docs/user-stories.md bagian US-08.

isikan sesuai saran anda

**Hasil:**
- Dibuat Server Action `tambahProduk` di `app/admin/actions.js` yang menyimpan produk baru ke tabel `produk` di Supabase.
- Memverifikasi otentikasi login admin di server sebelum menyimpan (`supabase.auth.getUser()`).
- Melakukan validasi input di server (nama produk wajib, harga angka valid >= 0).
- Setelah berhasil menyimpan, merevalidasi cache (`revalidatePath`) dan mengalihkan halaman kembali ke `/admin`.
- Memperbarui `components/FormProduk.jsx` agar mendukung pemrosesan form dengan Server Action dan menampilkan pesan error jika terjadi kegagalan.
- Menghubungkan form di `app/admin/produk/baru/page.jsx` ke Server Action `tambahProduk` dan menghapus `CatatanBelumAktif`.

**Perbaikan:**
- Menyesuaikan penanganan argumen Server Action `tambahProduk` agar fleksibel saat dipanggil via `useActionState` maupun form action standar.

### US-09 Ubah produk

**Prompt:**
Baca docs/user-stories.md bagian US-09 Sampai US-50.

isikan sesuai saran anda

**Hasil:**
- Dibuat Server Action `ubahProduk` di `app/admin/actions.js` untuk memperbarui data produk di tabel `produk` di Supabase.
- Memeriksa sesi login admin di sisi server (`supabase.auth.getUser()`) sebelum data dapat diperbarui.
- Memvalidasi input (nama wajib, harga valid) dan memperbarui kolom di database berdasarkan `id`.
- Halaman `app/admin/produk/[id]/ubah/page.jsx` mengambil data produk dari database untuk mengisi form dengan data lama (`defaultValue`).
- Jika produk tidak ditemukan, memanggil `notFound()`.
- Menghubungkan form ke Server Action `ubahProduk` dan menghapus `CatatanBelumAktif`.
- Setelah update berhasil, merevalidasi cache rute dan mengalihkan kembali ke `/admin`.

**Perbaikan:**
- Menambahkan input hidden `id` pada `components/FormProduk.jsx` agar ID produk otomatis terkirim saat form di-submit ke Server Action.
