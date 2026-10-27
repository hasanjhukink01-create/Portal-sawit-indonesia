import { useContext } from 'react';
import { History as HistoryIcon, Download } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Riwayat = () => {
  const { riwayat } = useContext(AppContext);

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div className="flex justify-between items-center">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Riwayat Pekerjaan & Pemakaian</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Catatan historis kegiatan dan pemotongan stok.</p>
        </div>
        <button className="btn btn-outline">
          <Download size={18} /> Export Laporan (PDF)
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <HistoryIcon size={24} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Log Kegiatan (Otomatis Ter-update)</h3>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID Laporan</th>
                <th>Tanggal</th>
                <th>Blok</th>
                <th>Kegiatan</th>
                <th>Pelaksana</th>
                <th>Catatan / Hasil</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>{item.id}</td>
                  <td>{item.tanggal}</td>
                  <td style={{ fontWeight: 600 }}>{item.blok ? item.blok.toUpperCase().replace(/\s/g, '') : ''}</td>
                  <td>{item.kegiatan}</td>
                  <td>{item.pelaksana}</td>
                  <td style={{ color: item.hasil.includes('Terpakai') ? 'var(--color-danger)' : 'var(--color-text-main)' }}>{item.hasil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Riwayat;
