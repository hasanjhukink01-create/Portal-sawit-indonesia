import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CalendarDays, Filter, Edit2, Save, X } from 'lucide-react';

const Jadwal = () => {
  const { jadwal, setJadwal, stok, setStok, riwayat, setRiwayat } = useContext(AppContext);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    const oldItem = jadwal.find(i => i.id === editingId);
    
    if (editForm.status === 'Selesai' && oldItem.status !== 'Selesai' && !oldItem.stockProcessed) {
      editForm.stockProcessed = true;
      // 1 & 3. Cari barang dan Validasi Stok
      const barangIndex = stok.findIndex(i => 
        i.nama.toLowerCase().includes(editForm.produk.toLowerCase()) || 
        editForm.produk.toLowerCase().includes(i.nama.toLowerCase())
      );

      if (barangIndex !== -1) {
        const barangItem = stok[barangIndex];
        const dosis = parseFloat(editForm.dosisDirencanakan);
        const jumlahStok = parseFloat(barangItem.jumlah) || 0;
        const satuan = barangItem.satuan;
        const isReusable = ['Alat', 'Sparepart', 'Alat Pendukung'].includes(barangItem.kategori);

        if (!isReusable && jumlahStok < dosis) {
          alert(`Stok tidak mencukupi! Kebutuhan ${dosis} ${satuan}, sisa stok hanya ${jumlahStok} ${satuan}.`);
          return; // Batalkan proses simpan
        }

        // 4. Kurangi stok (hanya jika bahan habis pakai)
        const newStok = [...stok];
        if (!isReusable) {
          newStok[barangIndex] = { ...barangItem, jumlah: jumlahStok - dosis };
          setStok(newStok);
          localStorage.setItem('portal_sawit_stok', JSON.stringify(newStok));
        }
        
        // 5. Simpan Riwayat
        const tanggalHariIni = new Date().toLocaleDateString('en-CA');
        const riwayatItem = {
          id: riwayat.length > 0 ? Math.max(...riwayat.map(r => r.id)) + 1 : 1,
          tanggal: tanggalHariIni,
          kegiatan: editForm.kegiatan,
          blok: editForm.blok,
          operator: editForm.operator,
          hasil: isReusable ? 'Selesai (Alat digunakan)' : `Selesai (Terpakai ${dosis} ${satuan})`.trim()
        };
        const newRiwayat = [...riwayat, riwayatItem];
        setRiwayat(newRiwayat);
        localStorage.setItem('portal_sawit_history', JSON.stringify(newRiwayat));
      }

      alert(`Berhasil eksekusi kegiatan!\nStok otomatis dipotong dan tercatat di Riwayat Pekerjaan.`);
    }

    // 6 & 7. Update status kegiatan dan refresh aplikasi
    const newJadwal = jadwal.map(item => (item.id === editingId ? editForm : item));
    setJadwal(newJadwal);
    localStorage.setItem('portal_sawit_schedules', JSON.stringify(newJadwal));
    
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (e, field) => {
    setEditForm({ ...editForm, [field]: e.target.value });
  };

  const handleAdd = () => {
    const newId = jadwal.length > 0 ? Math.max(...jadwal.map(j => j.id)) + 1 : 1;
    const defaultDate = selectedDate !== 'Semua Tanggal' ? selectedDate : todayStr;
    const newItem = { id: newId, tanggal: defaultDate, blok: '', luas: '', kegiatan: '', produk: '', dosisDirencanakan: '0', operator: '', status: 'Terjadwal', stockProcessed: false };
    setJadwal([...jadwal, newItem]);
    setEditingId(newId);
    setEditForm(newItem);
  };

  const todayStr = new Date().toLocaleDateString('en-CA');

  const [selectedDate, setSelectedDate] = useState('Semua Tanggal');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');

  // Format YYYY-MM-DD ke Indonesia
  const formatTanggalIndo = (tgl) => {
    if (!tgl) return tgl;
    const parts = tgl.split('-');
    if (parts.length !== 3) return tgl;
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  };

  const MASTER_BLOKS = [
    'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12', 'A13', 'A14',
    'B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', 'B12', 'B13', 'B14',
    'C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11', 'C12', 'C13', 'C14'
  ];

  const KEGIATAN_OPTIONS = [
    'Pemupukan NPK', 'Pemupukan Urea', 'Pemupukan Boron', 'Pemupukan RP', 'Pemupukan KCL', 'Pemupukan TSP',
    'Pengendalian Gulma', 'Penyemprotan Gulma', 'Pengendalian Hama', 'Pengendalian Jamur', 
    'Monitoring Hama & Penyakit', 'Monitoring Kondisi Tanaman', 'Perawatan Piringan', 'Perawatan Alat', 'Lainnya'
  ];

  const getDisplayStatus = (item) => {
    if (!item.tanggal) return item.status;
    
    if (item.tanggal > todayStr) {
      return 'Terjadwal';
    } else if (item.tanggal < todayStr) {
      return item.status === 'Selesai' ? 'Selesai' : 'Terlambat';
    } else {
      return item.status;
    }
  };



  // Filter & Urutkan
  let filteredJadwal = jadwal.filter(item => {
    if (selectedDate !== 'Semua Tanggal' && item.tanggal !== selectedDate) return false;
    if (selectedStatus !== 'Semua Status' && getDisplayStatus(item) !== selectedStatus) return false;
    return true;
  });

  // Selalu urutkan berdasarkan tanggal ascending, lalu blok, lalu kegiatan
  filteredJadwal.sort((a, b) => {
    if (!a.tanggal) return 1;
    if (!b.tanggal) return -1;
    
    // 1. Urutkan berdasarkan tanggal ASCENDING
    const dateCompare = a.tanggal.localeCompare(b.tanggal);
    if (dateCompare !== 0) return dateCompare;
    
    // 2. Kemudian berdasarkan blok ASCENDING
    const blokA = a.blok || '';
    const blokB = b.blok || '';
    const blokCompare = blokA.localeCompare(blokB);
    if (blokCompare !== 0) return blokCompare;
    
    // 3. Kemudian berdasarkan kegiatan ASCENDING
    const kegA = a.kegiatan || '';
    const kegB = b.kegiatan || '';
    return kegA.localeCompare(kegB);
  });

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div className="flex justify-between items-center">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Jadwal Pemeliharaan</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Atur dan pantau jadwal kegiatan pemeliharaan perkebunan.</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <CalendarDays size={18} /> Tambah Jadwal
        </button>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <Filter size={18} color="var(--color-text-muted)" />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Tanggal:</span>
          <select 
            className="input" 
            style={{ padding: '0.35rem 1rem', fontSize: '0.875rem', width: 'auto' }} 
            value={selectedDate === 'Semua Tanggal' ? 'Semua Tanggal' : 'Pilih'} 
            onChange={(e) => {
              if (e.target.value === 'Semua Tanggal') setSelectedDate('Semua Tanggal');
              else setSelectedDate('2026-08-11');
            }}
          >
            <option value="Semua Tanggal">Semua Tanggal</option>
            <option value="Pilih">Pilih Tanggal 📅</option>
          </select>

          {selectedDate !== 'Semua Tanggal' && (
            <input 
              type="date" 
              className="input"
              style={{ padding: '0.35rem 1rem', fontSize: '0.875rem' }}
              min="2026-08-11"
              max="2026-12-31"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Status:</span>
          <select 
            className="input" 
            style={{ padding: '0.35rem 1rem', fontSize: '0.875rem', minWidth: '150px' }} 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Terjadwal">Terjadwal</option>
            <option value="Selesai">Selesai</option>
            <option value="Terlambat">Terlambat</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Blok</th>
                <th>Kegiatan</th>
                <th>Produk (Stok)</th>
                <th>Pemakaian (Vol/Kg)</th>
                <th>Operator</th>
                <th>Status & Alasan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredJadwal.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                    Belum ada kegiatan terjadwal pada tanggal ini.
                  </td>
                </tr>
              ) : (
              filteredJadwal.filter(item => 
                item.id === editingId || 
                (item.blok?.trim() && item.kegiatan?.trim() && item.produk?.trim() && item.operator?.trim())
              ).map((item) => {
                const statusBadge = getDisplayStatus(item);
                const isTerlambat = statusBadge === 'Terlambat';
                const isEditTerlambat = editForm.tanggal < todayStr && editForm.status !== 'Selesai';

                return (
                <tr key={item.id}>
                  {editingId === item.id ? (
                    <>
                      <td><input type="date" className="input" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={editForm.tanggal} onChange={(e) => handleChange(e, 'tanggal')} /></td>
                      <td>
                        <select className="input" style={{ padding: '0.25rem', fontSize: '0.75rem', width: '70px' }} value={editForm.blok} onChange={(e) => handleChange(e, 'blok')}>
                          <option value="">Pilih...</option>
                          {MASTER_BLOKS.map(b => <option key={b} value={b}>{b}</option>)}
                          {!MASTER_BLOKS.includes(editForm.blok) && editForm.blok && <option value={editForm.blok}>{editForm.blok}</option>}
                        </select>
                      </td>
                      <td>
                        <select className="input" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={editForm.kegiatan} onChange={(e) => handleChange(e, 'kegiatan')}>
                          <option value="">Pilih Kegiatan...</option>
                          {KEGIATAN_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                          {!KEGIATAN_OPTIONS.includes(editForm.kegiatan) && editForm.kegiatan && <option value={editForm.kegiatan}>{editForm.kegiatan}</option>}
                        </select>
                      </td>
                      <td><input type="text" className="input" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={editForm.produk} onChange={(e) => handleChange(e, 'produk')} placeholder="Cth: Urea" /></td>
                      <td><input type="number" className="input" style={{ padding: '0.25rem', fontSize: '0.75rem', width: '60px' }} value={editForm.dosisDirencanakan} onChange={(e) => handleChange(e, 'dosisDirencanakan')} /></td>
                      <td><input type="text" className="input" style={{ padding: '0.25rem', fontSize: '0.75rem' }} value={editForm.operator} onChange={(e) => handleChange(e, 'operator')} /></td>
                      <td style={{ minWidth: '180px' }}>
                        <select className="input" style={{ padding: '0.25rem', fontSize: '0.75rem', width: '100%' }} value={isEditTerlambat && editForm.status !== 'Selesai' && editForm.status !== 'Ditunda' ? 'Terlambat' : editForm.status} onChange={(e) => handleChange(e, 'status')}>
                          <option value="Terjadwal">Terjadwal</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Ditunda">Ditunda</option>
                          {isEditTerlambat && <option value="Terlambat">Terlambat</option>}
                        </select>
                        {isEditTerlambat && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <select className="input" style={{ padding: '0.25rem', fontSize: '0.7rem', width: '100%', borderColor: 'var(--color-danger)' }} value={editForm.alasan || ''} onChange={(e) => handleChange(e, 'alasan')}>
                              <option value="">Pilih Alasan...</option>
                              <option value="Hujan / Cuaca">Hujan / Cuaca</option>
                              <option value="Banjir / Genangan">Banjir / Genangan</option>
                              <option value="Stok Bahan Tidak Mencukupi">Stok Bahan Tidak Mencukupi</option>
                              <option value="Alat Tidak Tersedia">Alat Tidak Tersedia</option>
                              <option value="Alat Rusak">Alat Rusak</option>
                              <option value="Kekurangan Tenaga Kerja">Kekurangan Tenaga Kerja</option>
                              <option value="Akses Blok Tidak Memungkinkan">Akses Blok Tidak Memungkinkan</option>
                              <option value="Petugas Berhalangan">Petugas Berhalangan</option>
                              <option value="Perubahan Prioritas Pekerjaan">Perubahan Prioritas Pekerjaan</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                            {editForm.alasan && (
                              <input type="text" className="input" style={{ padding: '0.25rem', fontSize: '0.7rem', width: '100%' }} placeholder={editForm.alasan === 'Lainnya' ? "Jelaskan Alasan" : "Catatan Tambahan"} value={editForm.catatan || ''} onChange={(e) => handleChange(e, 'catatan')} />
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ minWidth: '80px' }}>
                        <div className="flex gap-2">
                          <button className="btn btn-success" style={{ padding: '0.25rem 0.5rem' }} onClick={handleSave}><Save size={14} /></button>
                          <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={handleCancel}><X size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{formatTanggalIndo(item.tanggal)}</td>
                      <td style={{ fontWeight: 600 }}>{item.blok}</td>
                      <td>{item.kegiatan}</td>
                      <td>{item.produk}</td>
                      <td>{item.dosisDirencanakan}</td>
                      <td>{item.operator}</td>
                      <td>
                        <span className={`status-badge ${statusBadge.toLowerCase()}`}>
                          {statusBadge}
                        </span>
                        {item.alasan && statusBadge === 'Terlambat' && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-danger)', marginTop: '0.25rem', fontWeight: 600 }}>
                            {item.alasan}
                          </div>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }} onClick={() => handleEdit(item)}>
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Jadwal;
