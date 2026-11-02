# Smartbook

Smartbook adalah website toko buku online sederhana untuk tugas **UTS Pemrograman Web 1**. Website ini dibuat menggunakan HTML, CSS, dan JavaScript. Data yang digunakan adalah data dummy di file JavaScript dan penyimpanan browser, sehingga belum membutuhkan server atau database.

## 1. Cara Menjalankan Website

1. Ekstrak file `Smartbook.zip`.
2. Buka folder `Smartbook` melalui Visual Studio Code.
3. Pastikan struktur folder dan file tidak dipisahkan.
4. Jalankan file `login.html` menggunakan ekstensi **Live Server**.
5. Login menggunakan salah satu akun demo pada bagian **Akun Demo**.

Disarankan menggunakan Live Server agar perpindahan halaman dan pemuatan file berjalan lebih konsisten.

## 2. Struktur Folder

```text
Smartbook/
├── index.html             # Halaman awal yang mengarah ke login
├── login.html             # Halaman login dan modal daftar/lupa password
├── dashboard.html         # Dashboard dan ringkasan data
├── stok.html              # Katalog buku dan pengelolaan stok
├── checkout.html          # Keranjang dan formulir pemesanan
├── tracking.html          # Pencarian dan status pengiriman
├── laporan.html           # Ringkasan laporan pemesanan
├── transaksi.html         # Riwayat serta detail transaksi
├── README.md              # Dokumentasi proyek
├── css/
│   └── style.css          # Gaya tampilan seluruh halaman
├── js/
│   ├── data.js            # Data awal pengguna, katalog, dan tracking
│   ├── app.js             # Fungsi umum dan penyimpanan browser
│   ├── login.js           # Logika login, daftar, dan lupa password
│   ├── dashboard.js       # Greeting dan statistik dashboard
│   ├── stok.js            # Pencarian, tambah buku, dan tambah stok
│   ├── checkout.js        # Keranjang dan pembuatan pesanan
│   ├── tracking.js        # Pencarian nomor DO dan riwayat pengiriman
│   ├── laporan.js         # Data laporan, filter, dan cetak
│   └── transaksi.js       # Riwayat transaksi dan modal detail
└── img/
    ├── smartbook-logo.svg
    ├── pengantar_komunikasi.jpg
    ├── manajemen_keuangan.jpg
    ├── kepemimpinan.jpg
    ├── mikrobiologi.jpg
    └── paud_perkembangan.jpg
```

## 3. Penjelasan HTML, CSS, dan JavaScript

### A. HTML: struktur halaman

HTML dipakai untuk menyusun konten dan komponen yang tampil di browser, seperti judul, menu navigasi, formulir, kartu buku, tabel, modal, dan tombol.

- `login.html` menyediakan input email dan password, tombol login, serta modal untuk pendaftaran dan lupa password.
- `dashboard.html` menyediakan menu utama dan ringkasan jumlah buku, total stok, pesanan, dan pengiriman.
- `stok.html` menampilkan katalog buku dan formulir untuk menambahkan buku.
- `checkout.html` menyediakan pilihan buku, keranjang, informasi pemesan, alamat, ekspedisi, dan metode pembayaran.
- `tracking.html` menyediakan formulir pencarian berdasarkan nomor Delivery Order (DO).
- `laporan.html` menampilkan statistik dan tabel laporan yang dapat dicari, difilter, dan dicetak.
- `transaksi.html` menampilkan riwayat transaksi dan detail pesanan dalam modal.
- `index.html` berfungsi sebagai halaman masuk yang mengarahkan pengguna ke `login.html`.

File HTML juga memanggil file CSS dan JavaScript yang dibutuhkan oleh masing-masing halaman.

### B. CSS: desain tampilan

File `css/style.css` mengatur warna, jenis dan ukuran teks, jarak, tombol, form, tabel, kartu buku, sidebar, modal, notifikasi, serta tampilan responsif untuk ukuran layar yang lebih kecil. Sebagian besar desain dipusatkan dalam satu file agar mudah diperbarui dan konsisten ant halaman.

Pada beberapa elemen, atribut `style` juga digunakan untuk pengaturan kecil yang khusus pada elemen tersebut. Namun, aturan desain utama tetap berada di file CSS eksternal.

### C. `js/data.js`: data awal

File ini berisi tiga variabel utama dalam bentuk array dan object JavaScript:

- `dataPengguna`: daftar akun demo dengan nama, email, password, dan role.
- `dataKatalogBuku`: daftar buku berisi kode, nama, jenis, edisi, stok, harga, dan lokasi gambar sampul.
- `dataTracking`: data pengiriman contoh berdasarkan nomor DO, seperti nama pemesan, status, ekspedisi, tanggal kirim, jenis paket, total pembayaran, dan riwayat perjalanan.

Contoh struktur data buku:

```javascript
{
    kodeBarang: "ASIP4301",
    namaBarang: "Pengantar Ilmu Komunikasi",
    jenisBarang: "Buku Ajar",
    edisi: "2",
    stok: 548,
    harga: "Rp 180.000",
    cover: "img/pengantar_komunikasi.jpg"
}
```

Setiap buku disimpan sebagai object. Beberapa object buku kemudian disusun dalam array `dataKatalogBuku`, sehingga JavaScript dapat menampilkan data secara berulang tanpa menulis kartu atau baris tabel satu per satu.

### D. `js/app.js`: fungsi umum

File ini berisi fungsi yang digunakan bersama oleh halaman lain. Fungsinya antara lain:

- **Membaca dan menyimpan data:** `readJSON()`, `getUsers()`, `saveUser()`, `getBooks()`, `saveBooks()`, `getOrders()`, dan `saveOrders()`.
- **Mencari pengiriman:** `getTrackingByCode()` mencari pesanan berdasarkan nomor DO.
- **Memproses uang:** `parseMoney()` mengubah nilai uang menjadi angka dan `money()` memformat angka ke format Rupiah.
- **Menampilkan pesan:** `toast()` menampilkan notifikasi singkat dan `statusClass()` menentukan kelas tampilan berdasarkan status pesanan.
- **Mengatur login:** `getCurrentUser()` dan `setCurrentUser()` membaca atau menyimpan sesi pengguna, sedangkan `logout()` menghapus sesi.
- **Mengisi informasi umum:** nama pengguna, role, inisial avatar, tanggal, tombol menu seluler, dan tombol logout diinisialisasi ketika halaman selesai dimuat.

Fungsi-fungsi tersebut dikumpulkan dalam `window.Smartbook`, agar dapat dipanggil dari file JavaScript halaman lainnya tanpa menulis ulang fungsi yang sama.

### E. `js/login.js`: login dan akun

File ini menangani pengiriman formulir login. JavaScript mengambil nilai email dan password dari input, lalu mencari kecocokan pada data pengguna. Jika tidak cocok, browser menampilkan pesan `email/password yang anda masukkan salah`. Jika cocok, data pengguna yang sedang login disimpan ke `localStorage` dan halaman dialihkan ke dashboard.

File ini juga menangani:

- Membuka dan menutup modal daftar serta lupa password.
- Mengisi formulir dengan akun demo jika tombol akun contoh ditekan.
- Memeriksa panjang nama dan password saat mendaftar.
- Menolak pendaftaran jika email sudah digunakan.
- Menyimpan akun baru untuk demo melalui fungsi `saveUser()`.

Fitur lupa password pada proyek ini hanya mengecek apakah email terdaftar. Fitur tersebut tidak mengirim email pemulihan sungguhan.

### F. `js/dashboard.js`: greeting dan statistik

File ini membaca jam lokal komputer melalui `new Date().getHours()`. Berdasarkan jam tersebut, website menampilkan sapaan pagi, siang, sore, atau malam. Nama pengguna yang sedang login ditampilkan pada sapaan.

Statistik dashboard dihitung dari data buku dan pesanan. Contohnya, `reduce()` menjumlahkan stok seluruh buku, sedangkan `filter()` menghitung pesanan yang sedang diproses atau dikirim. Beberapa pesanan terbaru kemudian ditampilkan sebagai daftar aktivitas.

### G. `js/stok.js`: katalog dan stok buku

File ini mengambil data menggunakan `getBooks()` lalu membangun tampilan kartu katalog dan tabel stok secara dinamis. `filter()` dipakai untuk pencarian berdasarkan kode, nama, atau jenis buku.

Fitur pada halaman stok:

- Menambahkan buku baru melalui formulir modal.
- Memeriksa agar kode buku tidak duplikat.
- Menambah jumlah stok melalui tombol **+ Stok**.
- Menyimpan perubahan dengan `saveBooks()`.
- Memperbarui tampilan katalog dan tabel setelah data berubah.

Proses penampilan ulang tersebut merupakan contoh manipulasi DOM, yaitu mengubah konten elemen HTML menggunakan JavaScript.

### H. `js/checkout.js`: keranjang dan pemesanan

File ini mengelola daftar buku yang dipilih pengguna, kuantitas, subtotal, ongkos kirim, dan total pembayaran. Pengguna dapat menambah buku ke keranjang, mengubah jumlah, atau menghapus item.

Saat formulir dikirim, JavaScript memeriksa apakah keranjang berisi buku, memvalidasi input, lalu memastikan stok mencukupi. Jika valid, sistem simulasi akan:

1. Mengurangi stok sesuai jumlah buku yang dipesan.
2. Membuat nomor Delivery Order (DO) baru.
3. Membentuk data pesanan yang berisi pemesan, alamat, metode pembayaran, item, total, status, dan riwayat awal.
4. Menyimpan pesanan melalui `saveOrders()` dan stok melalui `saveBooks()`.
5. Menampilkan modal konfirmasi berisi nomor DO dan tautan ke halaman tracking.

Pemesanan dan pembayaran di sini hanya simulasi front-end. Tidak ada transaksi uang sungguhan.

### I. `js/tracking.js`: pelacakan pengiriman

File ini mengambil nomor DO dari formulir pencarian, kemudian memanggil `getTrackingByCode()`. Jika nomor ditemukan, halaman menampilkan nama pemesan, status, tahapan progres, detail ekspedisi, jenis paket, total pembayaran, dan riwayat perjalanan.

Jika nomor tidak ditemukan atau input kosong, website menampilkan pesan kesalahan. Halaman ini juga dapat langsung mencari nomor DO yang terdapat pada parameter URL, misalnya `tracking.html?do=20230012`.

Status dan perjalanan pengiriman merupakan data dummy, bukan pelacakan langsung dari perusahaan ekspedisi.

### J. `js/laporan.js`: laporan pesanan

File ini menghitung jumlah pesanan, total nilai pesanan, jumlah pesanan selesai, dan pesanan yang masih aktif. Data ditampilkan ke tabel. Kotak pencarian digunakan untuk mencari nomor DO, nama pemesan, atau status. Dropdown digunakan untuk memfilter status pesanan.

Tombol cetak memanggil `window.print()` agar laporan bisa dicetak atau disimpan menjadi PDF melalui dialog cetak browser.

### K. `js/transaksi.js`: riwayat transaksi

File ini menampilkan daftar transaksi dalam bentuk tabel, termasuk nomor transaksi, nomor DO, pemesan, tanggal, metode pembayaran, total, dan status. Pengguna dapat mencari transaksi, memfilter status, membuka detail pesanan melalui modal, atau membuka halaman tracking untuk melihat pengiriman.

## 4. Konsep JavaScript yang Digunakan

### Mengakses elemen HTML

```javascript
const email = document.getElementById('email').value;
```

`document.getElementById('email')` mencari elemen HTML yang memiliki `id="email"`. Properti `.value` mengambil nilai yang dimasukkan pengguna.

### Menangani interaksi pengguna

```javascript
document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    // Validasi dan proses login dilakukan di sini.
});
```

`addEventListener()` menjalankan fungsi ketika peristiwa terjadi, dalam contoh ini saat formulir dikirim. `preventDefault()` mencegah formulir berpindah halaman atau melakukan pengiriman bawaan browser sebelum diperiksa oleh JavaScript.

### Menampilkan data secara dinamis

```javascript
const daftarNamaBuku = dataKatalogBuku.map((buku) => buku.namaBarang);
```

`map()` mengolah setiap object di dalam array dan menghasilkan array baru yang berisi nama buku. Pada website, teknik sejenis dipakai untuk menghasilkan kartu katalog, baris tabel, dan riwayat pesanan.

### Menyimpan data di browser

```javascript
localStorage.setItem('smartbookBooks', JSON.stringify(books));
const books = JSON.parse(localStorage.getItem('smartbookBooks'));
```

`localStorage` menyimpan data pada browser. `JSON.stringify()` mengubah array/object menjadi teks agar dapat disimpan, sedangkan `JSON.parse()` mengubah teks yang tersimpan kembali menjadi data JavaScript.

## 5. Akun Demo

Gunakan salah satu akun berikut untuk masuk:

| Nama | Email | Password | Role |
|---|---|---|---|
| Rina Wulandari | `rina@gmail.com` | `rina123` | User |
| Agus Pranoto | `agus@gmail.com` | `agus123` | User |
| Siti Marlina | `siti@gmail.com` | `siti123` | Admin |

Nomor DO contoh yang tersedia sejak awal:

- `20230012`
- `20230013`

Setiap pemesanan baru akan menghasilkan nomor DO simulasi sendiri. Simpan nomor tersebut untuk mencoba halaman tracking.

## 6. Alur Penggunaan Website

1. Pengguna membuka `login.html` dan masuk menggunakan akun demo atau akun yang telah didaftarkan.
2. Dashboard menampilkan sapaan, ringkasan statistik, dan navigasi ke fitur lainnya.
3. Pada halaman stok, pengguna dapat mencari buku, menambah buku, atau menambah jumlah stok.
4. Pada checkout, pengguna memilih buku, menentukan jumlah, mengisi data pemesan, kemudian membuat pesanan.
5. Setelah pesanan dibuat, website menampilkan nomor DO yang dapat digunakan untuk melacak status pengiriman.
6. Halaman transaksi dan laporan menampilkan ringkasan serta riwayat pesanan yang tersimpan.

## 7. Penyimpanan Data dan Batasan Demo

Proyek ini tidak menggunakan backend atau database. Data awal berasal dari `js/data.js`, sedangkan akun baru, perubahan katalog, sesi login, dan pesanan simulasi disimpan di `localStorage` browser. Data ini biasanya tetap tersedia saat halaman ditutup dan dibuka lagi di browser yang sama, tetapi tidak otomatis dibagikan ke browser atau perangkat lain.

Karena aplikasi ini merupakan tugas front-end:

- Login bukan sistem autentikasi yang aman untuk penggunaan nyata.
- Password demo disimpan sebagai data JavaScript dan akun baru disimpan di browser.
- Pembayaran tidak terhubung ke bank atau payment gateway.
- Status pengiriman tidak diambil dari API ekspedisi.
- Data dapat dihapus ketika penyimpanan browser dibersihkan.

Jangan gunakan password pribadi atau data sensitif pada website demo ini.
