import { createContext, useState, useEffect, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Global State for Stok
  const [stok, setStok] = useState(() => {
    const defaultStok = [
      // Pestisida & Pupuk Existing
      { id: 1, nama: 'Glifosat', kategori: 'Pestisida', subkategori: 'Herbisida', jumlah: 150, satuan: 'Liter', batasBawah: 50, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      { id: 2, nama: 'Paraquat', kategori: 'Pestisida', subkategori: 'Herbisida', jumlah: 20, satuan: 'Liter', batasBawah: 30, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      { id: 3, nama: 'Pupuk Urea', kategori: 'Pupuk', jumlah: 5000, satuan: 'Kg', batasBawah: 1000, lokasi: 'Gudang Pupuk', kondisi: 'Baik' },
      { id: 4, nama: 'NPK', kategori: 'Pupuk', jumlah: 50, satuan: 'Kg', batasBawah: 500, lokasi: 'Gudang Pupuk', kondisi: 'Baik' },
      { id: 5, nama: 'Deltametrin', kategori: 'Pestisida', subkategori: 'Insektisida', jumlah: 5, satuan: 'Liter', batasBawah: 2, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      
      // APD
      { id: 6, nama: 'Sarung Tangan Nitril', kategori: 'APD', satuan: 'Pasang', jumlah: 100, batasBawah: 30, lokasi: 'Gudang APD', kondisi: 'Baik' },
      { id: 7, nama: 'Masker/Respirator', kategori: 'APD', satuan: 'Unit', jumlah: 50, batasBawah: 15, lokasi: 'Gudang APD', kondisi: 'Baik' },
      { id: 8, nama: 'Kacamata Pelindung', kategori: 'APD', satuan: 'Unit', jumlah: 30, batasBawah: 10, lokasi: 'Gudang APD', kondisi: 'Baik' },
      { id: 9, nama: 'Sepatu Boot', kategori: 'APD', satuan: 'Pasang', jumlah: 20, batasBawah: 5, lokasi: 'Gudang APD', kondisi: 'Baik' },
      
      // Alat (UPDATED as requested)
      { id: 10, nama: 'Knapsack Sprayer (15L)', kategori: 'Alat', satuan: 'Unit', jumlah: 24, totalStock: 24, usableStock: 24, damagedStock: 0, batasBawah: 5, lokasi: 'Gudang Alat', kondisi: 'BAIK', deskripsi: 'Penyemprotan herbisida & pupuk daun', catatan: 'Siap digunakan untuk kegiatan penyemprotan.' },
      { id: 13, nama: 'Parang', kategori: 'Alat', satuan: 'Unit', jumlah: 20, totalStock: 20, usableStock: 20, damagedStock: 0, batasBawah: 5, lokasi: 'Gudang Alat', kondisi: 'Baik' },
      { id: 14, nama: 'Cangkul', kategori: 'Alat', satuan: 'Unit', jumlah: 15, totalStock: 15, usableStock: 15, damagedStock: 0, batasBawah: 5, lokasi: 'Gudang Alat', kondisi: 'Baik' },
      { id: 15, nama: 'Arit/Sabit', kategori: 'Alat', satuan: 'Unit', jumlah: 15, totalStock: 15, usableStock: 15, damagedStock: 0, batasBawah: 5, lokasi: 'Gudang Alat', kondisi: 'Baik' },
      { id: 22, nama: 'Cepuk Pupuk', kategori: 'Alat', subkategori: 'Alat Pemupukan', jumlah: 10, totalStock: 10, usableStock: 10, damagedStock: 0, satuan: 'Unit', batasBawah: 3, lokasi: 'Gudang Alat', kondisi: 'BAIK', deskripsi: 'Alat pemupukan', catatan: 'Alat dalam kondisi baik.' },
      
      // Sparepart
      { id: 16, nama: 'Nozzle Polijet (Kuning/Merah)', kategori: 'Sparepart', satuan: 'Unit', jumlah: 5, totalStock: 5, usableStock: 0, damagedStock: 5, batasBawah: 5, lokasi: 'Gudang Sparepart', kondisi: 'PERLU DIGANTI', deskripsi: 'Pengaturan butiran semprot', catatan: 'Nozzle pecah dan perlu diganti.' },
      { id: 17, nama: 'Selang Sprayer', kategori: 'Sparepart', satuan: 'Unit', jumlah: 10, totalStock: 10, usableStock: 10, damagedStock: 0, batasBawah: 3, lokasi: 'Gudang Sparepart', kondisi: 'Baik' },
      { id: 18, nama: 'Seal Sprayer', kategori: 'Sparepart', satuan: 'Unit', jumlah: 25, totalStock: 25, usableStock: 25, damagedStock: 0, batasBawah: 5, lokasi: 'Gudang Sparepart', kondisi: 'Baik' },
      { id: 19, nama: 'O-Ring Sprayer', kategori: 'Sparepart', satuan: 'Unit', jumlah: 30, totalStock: 30, usableStock: 30, damagedStock: 0, batasBawah: 5, lokasi: 'Gudang Sparepart', kondisi: 'Baik' },
      
      // Bahan Pendukung
      { id: 40, nama: 'Gelas Ukur Plastik', kategori: 'Alat Pendukung', satuan: 'Unit', jumlah: 10, totalStock: 10, usableStock: 10, damagedStock: 0, batasBawah: 2, lokasi: 'Gudang Pestisida', kondisi: 'BAIK', deskripsi: 'Menakar dosis pestisida', catatan: 'Bersih dan angka takaran masih terbaca jelas.' },
      { id: 20, nama: 'Oli Mesin', kategori: 'Bahan Pendukung', satuan: 'Liter', jumlah: 50, batasBawah: 10, lokasi: 'Gudang Teknik', kondisi: 'Baik' },
      { id: 21, nama: 'Grease', kategori: 'Bahan Pendukung', satuan: 'Kg', jumlah: 25, batasBawah: 5, lokasi: 'Gudang Teknik', kondisi: 'Baik' },

      // NEW PRODUCTS (Added for consistency)
      { id: 23, nama: 'Roundup 486 SL', kategori: 'Pestisida', subkategori: 'Herbisida', jumlah: 80, satuan: 'Liter', batasBawah: 20, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      { id: 24, nama: 'Gramoxone 276 SL', kategori: 'Pestisida', subkategori: 'Herbisida', jumlah: 60, satuan: 'Liter', batasBawah: 20, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      { id: 25, nama: 'Garlon 670 EC', kategori: 'Pestisida', subkategori: 'Herbisida', jumlah: 40, satuan: 'Liter', batasBawah: 10, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      { id: 26, nama: 'Decis 25 EC', kategori: 'Pestisida', subkategori: 'Insektisida', jumlah: 25, satuan: 'Liter', batasBawah: 5, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      { id: 27, nama: 'Amistar Top', kategori: 'Pestisida', subkategori: 'Fungisida', jumlah: 30, satuan: 'Liter', batasBawah: 5, lokasi: 'Gudang Pestisida', kondisi: 'Baik' },
      { id: 28, nama: 'Boron', kategori: 'Pupuk', subkategori: 'Pupuk Mikro', jumlah: 500, satuan: 'Kg', batasBawah: 100, lokasi: 'Gudang Pupuk', kondisi: 'Baik' },
      { id: 29, nama: 'RP / Rock Phosphate', kategori: 'Pupuk', jumlah: 1000, satuan: 'Kg', batasBawah: 200, lokasi: 'Gudang Pupuk', kondisi: 'Baik' },
      { id: 30, nama: 'KCL', kategori: 'Pupuk', jumlah: 1500, satuan: 'Kg', batasBawah: 300, lokasi: 'Gudang Pupuk', kondisi: 'Baik' },
      { id: 31, nama: 'TSP', kategori: 'Pupuk', jumlah: 1000, satuan: 'Kg', batasBawah: 200, lokasi: 'Gudang Pupuk', kondisi: 'Baik' }
    ];
    const saved = localStorage.getItem('portal_sawit_stok');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const missingItems = defaultStok.filter(d => !parsed.find(p => p.id === d.id));
        return [...parsed, ...missingItems];
      } catch(e) { console.error('Error parsing stok from localStorage', e); }
    }
    return defaultStok;
  });

  // Global State for Jadwal
  const [jadwal, setJadwal] = useState(() => {
    const defaultJadwal = [
      {"id":1001,"tanggal":"2026-08-11","blok":"C05","luas":"30","kegiatan":"Monitoring Hama & Penyakit","produk":"-","dosisDirencanakan":"-","operator":"Tim Pemeliharaan","status":"Terjadwal","alasan":"","catatan":""},
      {"id":1002,"tanggal":"2026-08-11","blok":"A04","luas":"30","kegiatan":"Monitoring Hama & Penyakit","produk":"-","dosisDirencanakan":"-","operator":"Tim Pemeliharaan","status":"Selesai","alasan":"","catatan":""},
      {"id":1003,"tanggal":"2026-08-11","blok":"B03","luas":"30","kegiatan":"Penyemprotan Gulma","produk":"Roundup 486 SL","dosisDirencanakan":"25","operator":"Tim Pemeliharaan","status":"Terjadwal","alasan":"","catatan":""},
      {"id":1004,"tanggal":"2026-08-11","blok":"A13","luas":"30","kegiatan":"Pemupukan Urea","produk":"Pupuk Urea","dosisDirencanakan":"300","operator":"Tim Pemeliharaan","status":"Selesai","alasan":"","catatan":""},
      {"id":1005,"tanggal":"2026-08-11","blok":"B02","luas":"30","kegiatan":"Pengendalian Gulma","produk":"Glifosat","dosisDirencanakan":"30","operator":"Tim Pemeliharaan","status":"Terjadwal","alasan":"","catatan":""},
      {"id":1006,"tanggal":"2026-08-12","blok":"B05","luas":"30","kegiatan":"Monitoring Hama & Penyakit","produk":"-","dosisDirencanakan":"-","operator":"Tim Pemeliharaan","status":"Terjadwal","alasan":"","catatan":""}
    ];
    
    // Auto-generate some schedule up to Dec to prevent errors if user checks schedule
    let nextId = 1007;
    const today = new Date('2026-08-12');
    for (let i = 0; i < 140; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        defaultJadwal.push({"id":nextId++,"tanggal":dateStr,"blok":"A01","luas":"30","kegiatan":"Monitoring Hama & Penyakit","produk":"-","dosisDirencanakan":"-","operator":"Tim Pemeliharaan","status":"Terjadwal","alasan":"","catatan":""});
    }

    const saved = localStorage.getItem('portal_sawit_jadwal');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const missingItems = defaultJadwal.filter(d => !parsed.find(p => p.id === d.id));
        return [...parsed, ...missingItems];
      } catch(e) { console.error('Error parsing jadwal from localStorage', e); }
    }
    return defaultJadwal;
  });

  // Global State for Riwayat
  const [riwayat, setRiwayat] = useState(() => {
    const saved = localStorage.getItem('portal_sawit_history');
    if (saved) {
      try { return JSON.parse(saved); }
      catch(e) { console.error('Error parsing history from localStorage', e); }
    }
    return [];
  });

  return (
    <AppContext.Provider value={{
      stok, setStok,
      jadwal, setJadwal,
      riwayat, setRiwayat
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
