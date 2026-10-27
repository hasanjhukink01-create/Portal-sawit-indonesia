import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Package, Search, AlertTriangle, Edit2, Save, X, Plus } from 'lucide-react';

const SUBKATEGORI_OPTIONS = {
  'Pestisida': ['Herbisida', 'Insektisida', 'Fungisida', 'Adjuvant/Perekat'],
  'Pupuk': ['Urea', 'NPK', 'MOP/KCl', 'Dolomit', 'Kieserite', 'Rock Phosphate', 'ZA', 'Boron/Borate', 'Pupuk Mikro', 'Pupuk Organik'],
  'APD': ['Sarung Tangan', 'Masker/Respirator', 'Kacamata Pelindung', 'Face Shield', 'Coverall', 'Sepatu Boot', 'Helm', 'Lainnya'],
  'Alat': ['Sprayer', 'Alat Pemupukan', 'Dodos', 'Egrek', 'Parang', 'Cangkul', 'Arit/Sabit', 'Gunting Pangkas', 'Lainnya'],
  'Sparepart': ['Nozzle', 'Selang', 'Seal', 'O-Ring', 'Filter', 'Pompa', 'Klem', 'Lainnya'],
  'Bahan Pendukung': ['Oli', 'Grease', 'Lainnya']
};

const Stok = () => {
  const { stok, setStok } = useContext(AppContext);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('SEMUA');
  const [selectedJenis, setSelectedJenis] = useState('SEMUA');

  // Filter valid items to prevent ghost data rendering
  const isValidItem = (item) => {
    if (item.id === editingId) return true; // Keep edited row visible
    if (!item.nama || typeof item.nama !== 'string' || item.nama.trim() === '') return false;
    if (!item.kategori || item.kategori.trim() === '') return false;
    if (!item.satuan || item.satuan.trim() === '') return false;
    if (item.jumlah === undefined || item.jumlah === null || String(item.jumlah).trim() === '') return false;
    if (item.batasBawah === undefined || item.batasBawah === null || String(item.batasBawah).trim() === '') return false;
    return true;
  };
  
  const validStok = stok.filter(isValidItem);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    setStok(stok.map(item => (item.id === editingId ? editForm : item)));
    setEditingId(null);
  };

  const handleCancel = () => {
    // Jika membatalkan penambahan barang baru (nama kosong), hapus dari list
    if (editForm.nama === '') {
      setStok(stok.filter(item => item.id !== editingId));
    }
    setEditingId(null);
  };

  const handleChange = (e, field) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };

  const handleAdd = () => {
    const newId = stok.length > 0 ? Math.max(...stok.map(s => s.id)) + 1 : 1;
    const newItem = { id: newId, nama: '', kategori: '', subkategori: '', jumlah: '0', satuan: '', batasBawah: '0', kondisi: 'Baik', lokasi: '' };
    setStok([newItem, ...stok]);
    setEditingId(newId);
    setEditForm(newItem);
  };

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Inventaris Stok Gudang</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Pantau sisa barang. Pemotongan stok terjadi otomatis saat jadwal selesai.</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <select 
            className="input" 
            style={{ width: '150px' }} 
            value={selectedKategori} 
            onChange={(e) => { setSelectedKategori(e.target.value); setSelectedJenis('SEMUA'); }}
          >
            <option value="SEMUA">Semua Kategori</option>
            <option value="Pestisida">Pestisida</option>
            <option value="Pupuk">Pupuk</option>
            <option value="APD">APD</option>
            <option value="Alat">Alat</option>
            <option value="Sparepart">Sparepart</option>
            <option value="Bahan Pendukung">Bahan Pendukung</option>
          </select>

          {(selectedKategori === 'Pestisida' || selectedKategori === 'Pupuk') && (
            <select 
              className="input" 
              style={{ width: '160px' }} 
              value={selectedJenis} 
              onChange={(e) => setSelectedJenis(e.target.value)}
            >
              <option value="SEMUA">Semua Jenis</option>
              {selectedKategori === 'Pestisida' && (
                <>
                  <option value="Herbisida">Herbisida</option>
                  <option value="Insektisida">Insektisida</option>
                  <option value="Fungisida">Fungisida</option>
                </>
              )}
              {selectedKategori === 'Pupuk' && (
                <>
                  <option value="Urea">Urea</option>
                  <option value="NPK">NPK</option>
                  <option value="Boron">Boron</option>
                  <option value="KCL">KCL</option>
                  <option value="TSP">TSP</option>
                  <option value="Rock Phosphate">RP / Rock Phosphate</option>
                </>
              )}
            </select>
          )}

          <div className="relative">
            <input 
              type="text" 
              className="input" 
              placeholder="Cari barang..." 
              style={{ paddingLeft: '2.5rem', width: '220px' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '0.65rem', color: '#9CA3AF' }} />
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <Plus size={18} /> Tambah Stok
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <div className="card text-center">
          <Package size={24} color="var(--color-primary)" className="mx-auto mb-2" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{validStok.length}</h3>
          <p className="label">Total Item</p>
        </div>
        <div className="card text-center" style={{ borderTop: '4px solid var(--color-danger)' }}>
          <AlertTriangle size={24} color="var(--color-danger)" className="mx-auto mb-2" />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-danger)' }}>
            {validStok.filter(s => parseFloat(s.jumlah) <= parseFloat(s.batasBawah)).length}
          </h3>
          <p className="label">Stok Kritis</p>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>NAMA PRODUK</th>
                <th>KATEGORI</th>
                <th>SATUAN</th>
                <th>SISA STOK</th>
                <th>BATAS MINIMUM</th>
                <th>INFO PENYIMPANAN (Kondisi/Lokasi)</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredStok = validStok.filter(item => {
                  // 1. Kategori Filter
                  if (selectedKategori !== 'SEMUA' && item.kategori !== selectedKategori) {
                    return false;
                  }

                  // 2. Jenis Filter
                  if (selectedJenis !== 'SEMUA') {
                    const jenisUpper = selectedJenis.toUpperCase();
                    const subUpper = (item.subkategori || '').toUpperCase();
                    const nameUpper = (item.nama || '').toUpperCase();
                    
                    if (!subUpper.includes(jenisUpper) && !nameUpper.includes(jenisUpper)) {
                      return false;
                    }
                  }

                  // 3. Search Query Filter
                  if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    const nama = (item.nama || '').toLowerCase();
                    const kategori = (item.kategori || '').toLowerCase();
                    const subkategori = (item.subkategori || '').toLowerCase();
                    const satuan = (item.satuan || '').toLowerCase();
                    const lokasi = (item.lokasi || '').toLowerCase();
                    
                    if (!nama.includes(query) && 
                        !kategori.includes(query) && 
                        !subkategori.includes(query) && 
                        !satuan.includes(query) && 
                        !lokasi.includes(query)) {
                      return false;
                    }
                  }
                  
                  return true;
                });

                if (filteredStok.length === 0) {
                  return (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search size={32} style={{ color: 'var(--color-border)' }} />
                          <p style={{ fontWeight: 500, fontSize: '1rem' }}>Barang tidak ditemukan.</p>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return filteredStok.map((item) => {
                  const isKritis = parseFloat(item.jumlah) <= parseFloat(item.batasBawah);
                  return (
                <tr key={item.id} style={{ backgroundColor: isKritis && editingId !== item.id ? 'var(--color-danger-transparent)' : 'transparent' }}>
                  {editingId === item.id ? (
                    <>
                      <td><input type="text" className="input" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={editForm.nama} onChange={(e) => handleChange(e, 'nama')} placeholder="Nama Barang" /></td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <select 
                            className="input" 
                            style={{ padding: '0.25rem', fontSize: '0.75rem' }} 
                            value={editForm.kategori || ''} 
                            onChange={(e) => setEditForm({ ...editForm, kategori: e.target.value, subkategori: '' })}
                          >
                            <option value="">Pilih Kategori</option>
                            <option value="Pestisida">Pestisida</option>
                            <option value="Pupuk">Pupuk</option>
                            <option value="APD">APD</option>
                            <option value="Alat">Alat</option>
                            <option value="Sparepart">Sparepart</option>
                            <option value="Bahan Pendukung">Bahan Pendukung</option>
                          </select>
                          
                          {editForm.kategori && SUBKATEGORI_OPTIONS[editForm.kategori] && (
                            <select 
                              key={editForm.kategori}
                              className="input" 
                              style={{ padding: '0.25rem', fontSize: '0.75rem' }} 
                              value={editForm.subkategori || ''} 
                              onChange={(e) => handleChange(e, 'subkategori')}
                            >
                              <option value="">Pilih Subkategori</option>
                              {SUBKATEGORI_OPTIONS[editForm.kategori].map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td>
                        <select className="input" style={{ padding: '0.25rem', fontSize: '0.75rem', width: '90px' }} value={editForm.satuan || ''} onChange={(e) => handleChange(e, 'satuan')}>
                          <option value="">Pilih Satuan</option>
                          <option value="Liter">Liter</option>
                          <option value="Kg">Kg</option>
                          <option value="Ton">Ton</option>
                          <option value="Unit">Unit</option>
                          <option value="Pasang">Pasang</option>
                          <option value="Set">Set</option>
                        </select>
                      </td>
                      <td>
                        <input type="number" className="input" style={{ padding: '0.25rem', fontSize: '0.75rem', width: '80px' }} value={editForm.jumlah} onChange={(e) => handleChange(e, 'jumlah')} />
                      </td>
                      <td>
                        <input type="number" className="input" style={{ padding: '0.25rem', fontSize: '0.75rem', width: '80px' }} value={editForm.batasBawah} onChange={(e) => handleChange(e, 'batasBawah')} />
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <select className="input" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={editForm.kondisi || 'Baik'} onChange={(e) => handleChange(e, 'kondisi')}>
                            <option value="Baik">BAIK</option>
                            <option value="Rusak Ringan">RUSAK RINGAN</option>
                            <option value="Rusak Berat">RUSAK BERAT</option>
                            <option value="Tidak Layak">TIDAK LAYAK</option>
                            {(editForm.kategori === 'Pestisida' || editForm.kategori === 'Pupuk') && (
                              <option value="Kedaluwarsa">KEDALUWARSA</option>
                            )}
                          </select>
                          <select className="input" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={editForm.lokasi || ''} onChange={(e) => handleChange(e, 'lokasi')}>
                            <option value="">Pilih Lokasi</option>
                            <option value="Gudang Pestisida">Gudang Pestisida</option>
                            <option value="Gudang Pupuk">Gudang Pupuk</option>
                            <option value="Gudang APD">Gudang APD</option>
                            <option value="Gudang Alat">Gudang Alat</option>
                            <option value="Gudang Sparepart">Gudang Sparepart</option>
                            <option value="Gudang Teknik">Gudang Teknik</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                      </td>
                      <td>-</td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={handleSave} className="btn-icon" style={{ color: 'var(--color-success)' }} title="Simpan"><Save size={18} /></button>
                          <button onClick={handleCancel} className="btn-icon" style={{ color: 'var(--color-danger)' }} title="Batal"><X size={18} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 600 }}>{item.nama}</td>
                      <td>
                        <span style={{ fontWeight: 500 }}>{item.kategori}</span>
                        {item.subkategori && (
                          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{item.subkategori}</div>
                        )}
                      </td>
                      <td>{item.satuan}</td>
                      <td style={{ fontWeight: 700, color: isKritis ? 'var(--color-danger)' : 'var(--color-text-main)' }}>
                        {['Alat', 'Sparepart', 'Alat Pendukung'].includes(item.kategori) ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.75rem', minWidth: '100px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total:</span> <span>{item.totalStock !== undefined ? item.totalStock : item.jumlah}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}><span>Layak Pakai:</span> <span>{item.usableStock !== undefined ? item.usableStock : item.jumlah}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-danger)' }}><span>Rusak:</span> <span>{item.damagedStock || 0}</span></div>
                          </div>
                        ) : (
                          item.jumlah
                        )}
                      </td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{item.batasBawah}</td>
                      <td>
                        <div className="flex flex-col">
                          {item.kondisi && (
                            <span className={`badge ${
                              item.kondisi?.toLowerCase() === 'baik' ? 'badge-success' : 
                              item.kondisi?.toLowerCase() === 'rusak ringan' ? 'badge-warning' : 
                              ['rusak berat', 'tidak layak', 'kedaluwarsa'].includes(item.kondisi?.toLowerCase()) ? 'badge-danger' : 'badge-info'
                            }`} style={{ width: 'fit-content', marginBottom: '0.25rem', fontSize: '0.65rem' }}>
                              {item.kondisi?.toUpperCase()}
                            </span>
                          )}
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Lokasi: {item.lokasi || '-'}</span>
                        </div>
                      </td>
                      <td>
                        {isKritis ? (
                          <span className="badge badge-danger flex items-center gap-1" style={{ width: 'fit-content' }}><AlertTriangle size={12} /> KRITIS</span>
                        ) : (
                          <span className="badge badge-success">AMAN</span>
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleEdit(item)} className="btn-icon" title="Edit Stok">
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
                );
              })
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stok;
