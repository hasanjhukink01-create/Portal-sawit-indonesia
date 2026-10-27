import { useState } from 'react';
import { Sprout, Bug, CloudRain, Wind } from 'lucide-react';

const Pemeliharaan = () => {
  const [activeTab, setActiveTab] = useState('gulma');

  const tabs = [
    { id: 'gulma', label: 'Pengendalian Gulma', icon: <Sprout size={18} /> },
    { id: 'hama', label: 'Hama & Penyakit', icon: <Bug size={18} /> },
    { id: 'pupuk', label: 'Pemupukan', icon: <CloudRain size={18} /> },
  ];

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Jadwal Pemeliharaan & SOP</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Prosedur standar operasional kebun kelapa sawit.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
            style={{ 
              background: 'none', border: 'none', fontWeight: 600, fontSize: '0.875rem', 
              padding: '0.5rem 1rem', cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'gulma' && (
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Pengendalian Gulma (Chemist)</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>Rotasi standar: 3-4 kali setahun untuk piringan dan pasar pikul.</p>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Jenis Gulma</th>
                    <th>Metode / Rekomendasi</th>
                    <th>Dosis Standar</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Lalang (Imperata cylindrica)</td>
                    <td>Wiping / Spray (Glifosat)</td>
                    <td>2.5 - 3 L/Ha</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Anak Kayu & Pakis</td>
                    <td>Spray Kontak (Parakuat/Triklopir)</td>
                    <td>1.5 - 2 L/Ha</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Gulma Lunak Berdaun Lebar</td>
                    <td>Spray (Glifosat + Metil Metsulfuron)</td>
                    <td>1.5 L + 75g / Ha</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Mikania (Mikania micrantha)</td>
                    <td>Spray (Triklopir / Fluroksipir)</td>
                    <td>1 - 1.5 L/Ha</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Asystasia (Asystasia gangetica)</td>
                    <td>Spray (Parakuat / Glifosat)</td>
                    <td>1.5 - 2 L/Ha</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Suket / Rumput Umum</td>
                    <td>Spray (Glifosat)</td>
                    <td>2 - 3 L/Ha</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'hama' && (
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Pengendalian Hama & Penyakit</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>Gunakan pestisida berdasarkan sensus / *Early Warning System*.</p>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Hama Sasaran</th>
                    <th>Pestisida Rekomendasi</th>
                    <th>Ambang Ekonomi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Ulat Api / Kantong</td>
                    <td>Deltametrin (Semprot/Fogging)</td>
                    <td>5 - 10 ulat / pelepah</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Tikus (Rattus tiomanicus)</td>
                    <td>Kumatetralil (Umpan Beracun)</td>
                    <td>5% pohon baru diserang</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Kumbang Tanduk (Oryctes)</td>
                    <td>Karbosulfan / Feromon</td>
                    <td>5% pohon muda diserang</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Kumbang Sasak</td>
                    <td>Sipermetrin</td>
                    <td>Berdasarkan hasil monitoring</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Tungau</td>
                    <td>Akarisida / Dikofol</td>
                    <td>Berdasarkan hasil monitoring</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Belalang</td>
                    <td>Deltametrin / Lamdasihalotrin</td>
                    <td>Berdasarkan hasil monitoring</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pupuk' && (
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Rekomendasi Pemupukan (TM)</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>Panduan kasar pemupukan Tanaman Menghasilkan per pokok per tahun.</p>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Jenis Pupuk</th>
                    <th>Kandungan Utama</th>
                    <th>Dosis (Kg/Pokok/Tahun)</th>
                    <th>Waktu Aplikasi Terbaik</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Urea / ZA</td>
                    <td>Nitrogen (N)</td>
                    <td>2.0 - 2.5 Kg</td>
                    <td>Awal musim hujan</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>MOP / KCl</td>
                    <td>Kalium (K)</td>
                    <td>2.5 - 3.0 Kg</td>
                    <td>Pertengahan musim hujan</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>Kieserite / Dolomit</td>
                    <td>Magnesium (Mg)</td>
                    <td>1.0 - 1.5 Kg</td>
                    <td>Akhir musim hujan</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>NPK</td>
                    <td>Nitrogen, Fosfor, Kalium</td>
                    <td>2.5 - 3.0 Kg</td>
                    <td>Awal / Pertengahan musim hujan</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 500 }}>TSP / SP-36</td>
                    <td>Fosfor (P)</td>
                    <td>1.0 - 1.5 Kg</td>
                    <td>Awal musim hujan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pemeliharaan;
