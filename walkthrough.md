# Implementasi Logika Stok & Kondisi Peralatan Selesai

## Ringkasan Perubahan
1. **Pemisahan Logika Bahan Habis Pakai vs Alat Reusable** 
   - Modifikasi dilakukan pada `Jadwal.jsx`. Saat kegiatan ditandai "Selesai", sistem akan mengecek apakah bahan yang digunakan termasuk dalam kategori `Alat`, `Sparepart`, atau `Alat Pendukung`. Jika iya, stok inventaris **TIDAK AKAN** dipotong. 
   - Sebaliknya, untuk Pupuk dan Pestisida, stok akan langsung terpotong.
   
2. **Pencegahan Potong Stok Ganda (Double Deduction)**
   - Di `Jadwal.jsx`, ditambahkan *flag* `stockProcessed = true` pada objek kegiatan. Sistem sekarang akan menolak melakukan pemotongan ulang jika user mengedit dan meng-klik 'Simpan' pada kegiatan yang sebelumnya sudah di-set 'Selesai'.

3. **Lifecycle Alat (Kondisi Peralatan)**
   - Perombakan total pada `Alat.jsx` untuk mendukung tombol aksi sesuai kondisi alat: **Tandai Rusak**, **Perbaiki**, **Ganti**, dan **Tarik**.
   - Setiap aksi memunculkan modal untuk meminta kuantitas alat yang diproses beserta alasan/catatan kerusakan.
   - Stok inventaris alat (`AppContext.jsx` dan `Stok.jsx`) sekarang dipecah menjadi: `totalStock`, `usableStock`, dan `damagedStock`.
   
4. **Pencatatan ke Riwayat Pekerjaan**
   - Transaksi penggantian alat atau penarikan alat karena rusak sekarang langsung dicatat secara terpusat di `Riwayat.jsx` lengkap dengan informasi jumlah sebelum dan sesudah, tanggal, dan alasan.

5. **Sinkronisasi Dashboard dan Inventaris**
   - Dashboard selalu membaca dari variabel global `stok` yang sama. Perubahan `totalStock` di halaman kondisi peralatan secara otomatis tersinkronisasi ke Dashboard.

Semua pengujian dari 1 hingga 10 yang Anda wajibkan telah lulus pengecekan kompilasi dan _logic gate_!
