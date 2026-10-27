import { useState } from 'react';
import { Search, Filter, Inbox } from 'lucide-react';

const Pestisida = () => {
  const [db] = useState([
    { merk: 'Roundup 486 SL', bahanAktif: 'Glifosat', kategori: 'Herbisida Sistemik', sasaran: 'Gulma Berdaun Sempit (Lalang)', dosis: '2–3 L/Ha' },
    { merk: 'Gramoxone 276 SL', bahanAktif: 'Paraquat', kategori: 'Herbisida Kontak', sasaran: 'Gulma Berdaun Lebar', dosis: '1.5–2 L/Ha' },
    { merk: 'Garlon 670 EC', bahanAktif: 'Triklopir', kategori: 'Herbisida', sasaran: 'Anak Kayu / Pakis', dosis: '1.5 L/Ha' },
    { merk: 'Decis 25 EC', bahanAktif: 'Deltametrin', kategori: 'Insektisida', sasaran: 'Ulat Api / Ulat Kantong', dosis: '250 ml/Ha' },
    { merk: 'Amistar Top', bahanAktif: 'Azoksistrobin', kategori: 'Fungisida', sasaran: 'Penyakit Bercak Daun', dosis: '1 L/Ha' },
    { merk: 'Pupuk Urea', bahanAktif: 'Nitrogen', kategori: 'Pupuk', sasaran: 'Pertumbuhan vegetatif tanaman', dosis: '100–200 kg/Ha' },
    { merk: 'NPK', bahanAktif: 'Nitrogen, Fosfor, Kalium', kategori: 'Pupuk', sasaran: 'Pemupukan tanaman', dosis: '200–300 kg/Ha' },
    { merk: 'Pupuk KCl', bahanAktif: 'Kalium', kategori: 'Pupuk', sasaran: 'Pemenuhan unsur kalium', dosis: '100–150 kg/Ha' },
    { merk: 'Pupuk TSP', bahanAktif: 'Fosfor', kategori: 'Pupuk', sasaran: 'Pemenuhan unsur fosfor', dosis: '100–150 kg/Ha' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  // Filter Data
  const filteredDb = db.filter((item) => {
    // Kategori Filter
    if (filterKategori !== 'Semua') {
      if (!item.kategori.toLowerCase().includes(filterKategori.toLowerCase())) {
        return false;
      }
    }

    // Search Query Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const merk = item.merk.toLowerCase();
      const bahanAktif = item.bahanAktif.toLowerCase();
      const kategori = item.kategori.toLowerCase();
      const sasaran = item.sasaran.toLowerCase();

      if (!merk.includes(query) && !bahanAktif.includes(query) && !kategori.includes(query) && !sasaran.includes(query)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Database Bahan & Produk</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Katalog bahan dan produk yang digunakan dalam kegiatan pemeliharaan perkebunan.</p>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2 relative">
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              className="input" 
              placeholder="Cari bahan atau produk..." 
              style={{ paddingLeft: '2.5rem', width: '300px' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} color="var(--color-text-muted)" />
            <select 
              className="input" 
              style={{ width: 'auto', padding: '0.5rem 1rem', cursor: 'pointer' }} 
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Herbisida">Herbisida</option>
              <option value="Insektisida">Insektisida</option>
              <option value="Fungisida">Fungisida</option>
              <option value="Pupuk">Pupuk</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>NAMA PRODUK</th>
                <th>JENIS</th>
                <th>BAHAN AKTIF</th>
                <th>SASARAN</th>
                <th>DOSIS / REKOMENDASI</th>
              </tr>
            </thead>
            <tbody>
              {filteredDb.length > 0 ? (
                filteredDb.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{item.merk}</td>
                    <td>
                      <span className={`badge ${
                        item.kategori.includes('Herbisida') ? 'badge-success' : 
                        item.kategori.includes('Insektisida') ? 'badge-danger' : 
                        item.kategori.includes('Fungisida') ? 'badge-warning' :
                        item.kategori.includes('Pupuk') ? 'badge-info' : 'badge-info'
                      }`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-main)' }}>{item.bahanAktif}</td>
                    <td style={{ color: 'var(--color-text-main)' }}>{item.sasaran}</td>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{item.dosis}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="flex flex-col items-center justify-center gap-2 text-muted" style={{ color: 'var(--color-text-muted)' }}>
                      <Inbox size={48} opacity={0.3} />
                      <p style={{ fontWeight: 500, fontSize: '1rem', marginTop: '0.5rem' }}>Data tidak ditemukan.</p>
                      <p style={{ fontSize: '0.875rem' }}>Coba ubah kata kunci atau kategori pencarian Anda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pestisida;
