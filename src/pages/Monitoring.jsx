import { useState, useEffect } from 'react';
import { Activity, AlertCircle, X, Leaf, Bug, Stethoscope, ClipboardList, Edit } from 'lucide-react';

const MASTER_BLOK = [
  // AREA A
  { id: 'A01', luas: '30 Ha', umur: 'TM (8 Tahun)' },
  { id: 'A02', luas: '30 Ha', umur: 'TM (8 Tahun)' },
  { id: 'A03', luas: '30 Ha', umur: 'TM (7 Tahun)' },
  { id: 'A04', luas: '30 Ha', umur: 'TM (7 Tahun)' },
  { id: 'A05', luas: '30 Ha', umur: 'TM (6 Tahun)' },
  { id: 'A06', luas: '30 Ha', umur: 'TM (6 Tahun)' },
  { id: 'A07', luas: '30 Ha', umur: 'TM (6 Tahun)' },
  { id: 'A08', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'A09', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'A10', luas: '30 Ha', umur: 'TM (4 Tahun)' },
  { id: 'A11', luas: '30 Ha', umur: 'TM (4 Tahun)' },
  { id: 'A12', luas: '30 Ha', umur: 'TM (3 Tahun)' },
  { id: 'A13', luas: '30 Ha', umur: 'TM (3 Tahun)' },
  { id: 'A14', luas: '30 Ha', umur: 'TM (3 Tahun)' },
  // AREA B
  { id: 'B01', luas: '30 Ha', umur: 'TBM (2 Tahun)' },
  { id: 'B02', luas: '30 Ha', umur: 'TBM (2 Tahun)' },
  { id: 'B03', luas: '30 Ha', umur: 'TBM (2 Tahun)' },
  { id: 'B04', luas: '30 Ha', umur: 'TBM (2 Tahun)' },
  { id: 'B05', luas: '30 Ha', umur: 'TBM (2 Tahun)' },
  { id: 'B06', luas: '30 Ha', umur: 'TBM (1 Tahun)' },
  { id: 'B07', luas: '30 Ha', umur: 'TBM (1 Tahun)' },
  { id: 'B08', luas: '30 Ha', umur: 'TBM (1 Tahun)' },
  { id: 'B09', luas: '30 Ha', umur: 'TBM (1 Tahun)' },
  { id: 'B10', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'B11', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'B12', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'B13', luas: '30 Ha', umur: 'TM (4 Tahun)' },
  { id: 'B14', luas: '30 Ha', umur: 'TM (4 Tahun)' },
  // AREA C
  { id: 'C01', luas: '30 Ha', umur: 'TM (8 Tahun)' },
  { id: 'C02', luas: '30 Ha', umur: 'TM (8 Tahun)' },
  { id: 'C03', luas: '30 Ha', umur: 'TM (7 Tahun)' },
  { id: 'C04', luas: '30 Ha', umur: 'TM (7 Tahun)' },
  { id: 'C05', luas: '30 Ha', umur: 'TM (7 Tahun)' },
  { id: 'C06', luas: '30 Ha', umur: 'TM (6 Tahun)' },
  { id: 'C07', luas: '30 Ha', umur: 'TM (6 Tahun)' },
  { id: 'C08', luas: '30 Ha', umur: 'TM (6 Tahun)' },
  { id: 'C09', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'C10', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'C11', luas: '30 Ha', umur: 'TM (5 Tahun)' },
  { id: 'C12', luas: '30 Ha', umur: 'TM (4 Tahun)' },
  { id: 'C13', luas: '30 Ha', umur: 'TM (4 Tahun)' },
  { id: 'C14', luas: '30 Ha', umur: 'TM (4 Tahun)' }
];

const DEFAULT_MONITORING = {
  'A01': {
    terakhir: '11/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Sedang', jenis: 'Pakis', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'A02': {
    terakhir: '10/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Tinggi', jenis: 'Alang-alang', catatan: '' },
    hama: { status: 'Serangan Ringan', jenis: 'Ulat Api', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'A04': {
    terakhir: '09/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Rendah', jenis: 'Gulma Daun Lebar', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'A07': {
    terakhir: '08/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Sedang', jenis: 'Mikania', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'B02': {
    terakhir: '10/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Sedang', jenis: 'Teki', catatan: '' },
    hama: { status: 'Serangan Sedang', jenis: 'Ulat Kantong', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'B05': {
    terakhir: '09/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Tinggi', jenis: 'Alang-alang', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'B08': {
    terakhir: '07/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Rendah', jenis: 'Pakis', catatan: '' },
    hama: { status: 'Serangan Sedang', jenis: 'Kumbang Tanduk', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'B11': {
    terakhir: '06/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Sedang', jenis: 'Gulma Daun Sempit', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'C01': {
    terakhir: '10/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Sedang', jenis: 'Teki', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'C04': {
    terakhir: '09/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Rendah', jenis: 'Anak Kayu', catatan: '' },
    hama: { status: 'Serangan Tinggi', jenis: 'Tikus', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'C07': {
    terakhir: '08/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Tinggi', jenis: 'Anak Kayu', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  },
  'C10': {
    terakhir: '05/08/2026', petugas: 'Tim Sensus',
    gulma: { status: 'Sedang', jenis: 'Campuran', catatan: '' },
    hama: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    penyakit: { status: 'Aman', jenis: 'Tidak ditemukan', catatan: '' },
    rekomendasi: ''
  }
};

const Monitoring = () => {
  const [selectedBlok, setSelectedBlok] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [monitoringDetails, setMonitoringDetails] = useState(() => {
    const saved = localStorage.getItem('monitoringHasan');
    if (saved) {
      try {
        return { ...DEFAULT_MONITORING, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return DEFAULT_MONITORING;
  });

  useEffect(() => {
    localStorage.setItem('monitoringHasan', JSON.stringify(monitoringDetails));
  }, [monitoringDetails]);

  // Hanya tampilkan blok yang memiliki temuan/data monitoring
  const monitoringData = MASTER_BLOK.filter(blok => monitoringDetails[blok.id]);

  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes('aman') || s.includes('rendah')) return 'var(--color-success)';
    if (s.includes('sedang') || s.includes('ringan')) return 'var(--color-warning)';
    if (s.includes('tinggi') || s.includes('berat')) return 'var(--color-danger)';
    return 'var(--color-text-main)';
  };

  const computeKondisiUtama = (det) => {
    const g = det.gulma.status.toLowerCase();
    const h = det.hama.status.toLowerCase();
    const p = det.penyakit.status.toLowerCase();

    if (g.includes('tinggi') || h.includes('berat') || p.includes('berat')) {
      return 'Perhatian Khusus';
    } else if (g.includes('sedang') || h.includes('ringan') || h.includes('sedang') || p.includes('ringan') || p.includes('sedang')) {
      return 'Perlu Tindakan';
    }
    return 'Baik';
  };

  const handleEditClick = () => {
    setEditForm(JSON.parse(JSON.stringify(monitoringDetails[selectedBlok.id])));
    setIsEditing(true);
  };

  const handleSave = () => {
    setMonitoringDetails(prev => ({
      ...prev,
      [selectedBlok.id]: editForm
    }));
    setIsEditing(false);
    alert('Data monitoring berhasil disimpan.');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setEditForm(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePhotoUpload = (e, blokId, tipe) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setMonitoringDetails(prev => ({
        ...prev,
        [blokId]: {
          ...prev[blokId],
          dokumentasi: {
            ...(prev[blokId].dokumentasi || {}),
            [tipe]: url
          }
        }
      }));
    }
    // Reset the input value so the same file can be selected again if needed
    e.target.value = null;
  };

  const handleRemovePhoto = (blokId, tipe) => {
    setMonitoringDetails(prev => ({
      ...prev,
      [blokId]: {
        ...prev[blokId],
        dokumentasi: {
          ...(prev[blokId].dokumentasi || {}),
          [tipe]: null
        }
      }
    }));
  };

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex', position: 'relative' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Monitoring Kondisi Blok</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Pemantauan intensitas serangan gulma, hama, dan penyakit per blok lahan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {monitoringData.map((blok, idx) => {
          const det = monitoringDetails[blok.id];
          const kondisi = computeKondisiUtama(det);
          return (
            <div 
              key={idx} 
              className="card" 
              onClick={() => setSelectedBlok(blok)}
              style={{ 
                borderTop: kondisi === 'Baik' ? '4px solid var(--color-success)' : kondisi === 'Perlu Tindakan' ? '4px solid var(--color-warning)' : '4px solid var(--color-danger)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Blok {blok.id}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Luas: {blok.luas} | {blok.umur}</p>
                </div>
                <Activity size={24} color={kondisi === 'Baik' ? 'var(--color-success)' : kondisi === 'Perlu Tindakan' ? 'var(--color-warning)' : 'var(--color-danger)'} />
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Status Gulma</span>
                  <span style={{ fontWeight: 600, color: getStatusColor(det.gulma.status) }}>{det.gulma.status}</span>
                </div>
                <div className="flex justify-between items-center" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Status Hama</span>
                  <span style={{ fontWeight: 600, color: getStatusColor(det.hama.status) }}>{det.hama.status}</span>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <AlertCircle size={14} />
                Kunjungan terakhir: {det.terakhir}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail Monitoring */}
      {selectedBlok && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, 
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', 
          padding: '5rem 1rem 2rem 1rem' 
        }}>
          <div className="card animate-fade-in" style={{ 
            width: '80vw', maxWidth: '1100px', maxHeight: '85vh',
            padding: 0, display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header Modal (Fixed) */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
              <div className="flex justify-between items-start mb-4">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  {isEditing ? `EDIT MONITORING BLOK ${selectedBlok.id}` : `DETAIL MONITORING BLOK ${selectedBlok.id}`}
                </h2>
                {!isEditing && (
                  <button 
                    onClick={() => setSelectedBlok(null)} 
                    className="btn-icon" 
                    style={{ padding: '0.5rem', background: 'var(--color-background)', borderRadius: '50%' }}
                  >
                    <X size={20} color="var(--color-text-main)" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Luas</p>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{selectedBlok.luas}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Umur</p>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{selectedBlok.umur}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tanggal Monitoring</p>
                  {isEditing ? (
                    <input type="text" className="input" style={{ padding: '0.25rem', fontSize: '0.875rem' }} value={editForm.terakhir} onChange={(e) => handleChange(null, 'terakhir', e.target.value)} />
                  ) : (
                    <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].terakhir}</p>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Petugas Monitoring</p>
                  {isEditing ? (
                    <input type="text" className="input" style={{ padding: '0.25rem', fontSize: '0.875rem' }} value={editForm.petugas} onChange={(e) => handleChange(null, 'petugas', e.target.value)} />
                  ) : (
                    <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].petugas}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, backgroundColor: 'var(--color-background)' }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                
                {/* Gulma */}
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <Leaf size={20} color="var(--color-success)" />
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>MONITORING GULMA</h4>
                  </div>
                  {isEditing ? (
                    <>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Status Gulma</p>
                        <select className="input" value={editForm.gulma.status} onChange={(e) => handleChange('gulma', 'status', e.target.value)}>
                          <option value="Rendah">Rendah</option>
                          <option value="Sedang">Sedang</option>
                          <option value="Tinggi">Tinggi</option>
                          <option value="Berat">Berat</option>
                        </select>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jenis Gulma</p>
                        <select className="input" value={editForm.gulma.jenis} onChange={(e) => handleChange('gulma', 'jenis', e.target.value)}>
                          <option value="Alang-alang">Alang-alang</option>
                          <option value="Pakis">Pakis</option>
                          <option value="Mikania">Mikania</option>
                          <option value="Teki">Teki</option>
                          <option value="Gulma Daun Lebar">Gulma Daun Lebar</option>
                          <option value="Gulma Daun Sempit">Gulma Daun Sempit</option>
                          <option value="Anak Kayu">Anak Kayu</option>
                          <option value="Campuran">Campuran</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan Gulma:</p>
                        <textarea className="input" style={{ width: '100%', minHeight: '60px' }} value={editForm.gulma.catatan} onChange={(e) => handleChange('gulma', 'catatan', e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Status</p>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: getStatusColor(monitoringDetails[selectedBlok.id].gulma.status) }}>
                          {monitoringDetails[selectedBlok.id].gulma.status}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jenis</p>
                        <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].gulma.jenis}</p>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan:</p>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].gulma.catatan}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Hama */}
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <Bug size={20} color="var(--color-warning)" />
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>MONITORING HAMA</h4>
                  </div>
                  {isEditing ? (
                    <>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Status Hama</p>
                        <select className="input" value={editForm.hama.status} onChange={(e) => handleChange('hama', 'status', e.target.value)}>
                          <option value="Aman">Aman</option>
                          <option value="Serangan Ringan">Serangan Ringan</option>
                          <option value="Serangan Sedang">Serangan Sedang</option>
                          <option value="Serangan Tinggi">Serangan Tinggi</option>
                          <option value="Serangan Berat">Serangan Berat</option>
                        </select>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jenis Hama</p>
                        <select className="input" value={editForm.hama.jenis} onChange={(e) => handleChange('hama', 'jenis', e.target.value)}>
                          <option value="Ulat Api">Ulat Api</option>
                          <option value="Ulat Kantong">Ulat Kantong</option>
                          <option value="Kumbang Tanduk">Kumbang Tanduk</option>
                          <option value="Tikus">Tikus</option>
                          <option value="Tidak Ditemukan">Tidak Ditemukan</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan Hama:</p>
                        <textarea className="input" style={{ width: '100%', minHeight: '60px' }} value={editForm.hama.catatan} onChange={(e) => handleChange('hama', 'catatan', e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Status</p>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: getStatusColor(monitoringDetails[selectedBlok.id].hama.status) }}>
                          {monitoringDetails[selectedBlok.id].hama.status}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jenis</p>
                        <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].hama.jenis}</p>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan:</p>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].hama.catatan}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Penyakit */}
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-2 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <Stethoscope size={20} color="var(--color-danger)" />
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>MONITORING PENYAKIT</h4>
                  </div>
                  {isEditing ? (
                    <>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Status Penyakit</p>
                        <select className="input" value={editForm.penyakit.status} onChange={(e) => handleChange('penyakit', 'status', e.target.value)}>
                          <option value="Aman">Aman</option>
                          <option value="Gejala Ringan">Gejala Ringan</option>
                          <option value="Gejala Sedang">Gejala Sedang</option>
                          <option value="Gejala Berat">Gejala Berat</option>
                        </select>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Nama Penyakit</p>
                        <select className="input" value={editForm.penyakit.jenis} onChange={(e) => handleChange('penyakit', 'jenis', e.target.value)}>
                          <option value="Busuk Pangkal Batang">Busuk Pangkal Batang</option>
                          <option value="Bercak Daun">Bercak Daun</option>
                          <option value="Busuk Pucuk">Busuk Pucuk</option>
                          <option value="Tidak Ditemukan">Tidak Ditemukan</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan Penyakit:</p>
                        <textarea className="input" style={{ width: '100%', minHeight: '60px' }} value={editForm.penyakit.catatan} onChange={(e) => handleChange('penyakit', 'catatan', e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Status</p>
                        <p style={{ fontWeight: 700, fontSize: '1.1rem', color: getStatusColor(monitoringDetails[selectedBlok.id].penyakit.status) }}>
                          {monitoringDetails[selectedBlok.id].penyakit.status}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Jenis</p>
                        <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].penyakit.jenis}</p>
                      </div>
                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Catatan:</p>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-main)' }}>{monitoringDetails[selectedBlok.id].penyakit.catatan}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Tindakan / Rekomendasi */}
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-info-transparent)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-info-transparent)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList size={20} color="var(--color-info)" />
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-info)' }}>TINDAKAN / REKOMENDASI</h4>
                </div>
                {isEditing ? (
                  <textarea className="input" style={{ width: '100%', minHeight: '60px', borderColor: 'var(--color-info)' }} value={editForm.rekomendasi} onChange={(e) => handleChange(null, 'rekomendasi', e.target.value)} />
                ) : (
                  <p style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: 1.6, fontWeight: 500 }}>
                    {monitoringDetails[selectedBlok.id].rekomendasi}
                  </p>
                )}
              </div>

              {/* Dokumentasi Lapangan */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>DOKUMENTASI LAPANGAN</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Foto kondisi lapangan saat monitoring.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['gulma', 'hama', 'penyakit'].map((tipe) => {
                    const fotoUrl = monitoringDetails[selectedBlok.id].dokumentasi?.[tipe];
                    const label = tipe.toUpperCase();
                    return (
                      <div key={tipe} style={{ padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', alignSelf: 'flex-start', color: 'var(--color-text-main)' }}>FOTO {label}</p>
                        
                        {fotoUrl ? (
                          <>
                            <div style={{ width: '100%', height: '160px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                              <img src={fotoUrl} alt={`Foto ${label}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div className="flex gap-2 w-full mt-auto">
                              <label className="btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', padding: '0.5rem', fontSize: '0.875rem' }}>
                                Ganti
                                <input type="file" accept="image/jpeg, image/png, image/webp" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, selectedBlok.id, tipe)} />
                              </label>
                              <button className="btn" style={{ flex: 1, backgroundColor: 'var(--color-danger-transparent)', color: 'var(--color-danger)', padding: '0.5rem', fontSize: '0.875rem', border: '1px solid var(--color-danger-transparent)' }} onClick={() => handleRemovePhoto(selectedBlok.id, tipe)}>
                                Hapus
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ width: '100%', height: '160px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-background)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                              Belum ada foto
                            </div>
                            <label className="btn" style={{ width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', padding: '0.5rem', fontSize: '0.875rem', marginTop: 'auto' }}>
                              + Tambah Foto
                              <input type="file" accept="image/jpeg, image/png, image/webp" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, selectedBlok.id, tipe)} />
                            </label>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Modal (Fixed) */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderBottomLeftRadius: 'var(--radius-lg)', borderBottomRightRadius: 'var(--radius-lg)' }}>
              {isEditing ? (
                <>
                  <button className="btn" onClick={handleCancel} style={{ backgroundColor: 'transparent', color: 'var(--color-text-main)', border: '1px solid var(--color-border)' }}>
                    Batal
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Simpan Monitoring
                  </button>
                </>
              ) : (
                <>
                  <button className="btn" onClick={handleEditClick} style={{ backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Edit size={16} /> Edit Monitoring
                  </button>
                  <button className="btn" onClick={() => setSelectedBlok(null)} style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-main)', padding: '0.5rem 1.5rem', fontWeight: 600 }}>
                    Tutup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;
