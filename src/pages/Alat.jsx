import { useState } from 'react';
import { ShieldCheck, Wrench, X, Image as ImageIcon, Edit2, Plus, AlertTriangle, PenTool, RefreshCw, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';

const Alat = () => {
  const { stok, setStok, riwayat, setRiwayat } = useAppContext();
  const { t } = useI18n();

  const [apdState, setApdState] = useState([
    { id: 1, nama: 'Sarung tangan karet / Nitril', wajib: true, checked: true },
    { id: 2, nama: 'Masker Respirator (N95/Karbon aktif)', wajib: true, checked: true },
    { id: 3, nama: 'Kacamata Pelindung (Goggles)', wajib: true, checked: true },
    { id: 4, nama: 'Baju Pelindung Lengan Panjang', wajib: true, checked: true },
    { id: 5, nama: 'Sepatu Boot Karet', wajib: true, checked: true },
    { id: 6, nama: 'Helm / Topi', wajib: false, checked: false },
  ]);

  const [selectedAlat, setSelectedAlat] = useState(null);
  const [fotoMap, setFotoMap] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Lifecycle Modal State
  const [actionModal, setActionModal] = useState({ show: false, action: null, tool: null });
  const [actionForm, setActionForm] = useState({ jumlah: 1, catatan: '' });

  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    kategori: 'Alat',
    deskripsi: '',
    jumlah: 0,
    batasBawah: 5,
    lokasi: 'Gudang Alat'
  });

  const visibleTools = stok.filter(item => 
    (item.kategori === 'Alat' || item.kategori === 'Sparepart' || item.kategori === 'Alat Pendukung') &&
    item.nama !== 'Dodos' && item.nama !== 'Egrek' && item.nama !== 'Dodos / Egrek'
  );

  const toggleApd = (id) => {
    setApdState(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const recordRiwayat = (tool, actionName, qty, oldTotal, newTotal, reason) => {
    const tanggalHariIni = new Date().toLocaleDateString('en-CA');
    const riwayatItem = {
      id: riwayat.length > 0 ? Math.max(...riwayat.map(r => r.id)) + 1 : 1,
      tanggal: tanggalHariIni,
      kegiatan: actionName,
      blok: 'Gudang',
      operator: 'Admin Kebun',
      hasil: `Stok ${oldTotal} \u2192 ${newTotal}. Alasan: ${reason}`
    };
    const newRiwayat = [...riwayat, riwayatItem];
    setRiwayat(newRiwayat);
    localStorage.setItem('portal_sawit_history', JSON.stringify(newRiwayat));
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    const { action, tool } = actionModal;
    const qty = parseInt(actionForm.jumlah);
    if (qty <= 0) return;

    let newTotal = tool.totalStock || tool.jumlah;
    let newUsable = tool.usableStock !== undefined ? tool.usableStock : tool.jumlah;
    let newDamaged = tool.damagedStock || 0;
    let oldTotal = newTotal;
    let kondisi = tool.kondisi || 'BAIK';
    let catatan = tool.catatan || '';

    if (action === 'rusak') {
      if (qty > newUsable) return alert('Jumlah melebihi stok layak pakai');
      newUsable -= qty;
      newDamaged += qty;
      kondisi = newDamaged === newTotal ? 'RUSAK' : 'PERLU PERBAIKAN';
      catatan = actionForm.catatan || tool.catatan;
    } else if (action === 'perbaiki') {
      if (qty > newDamaged) return alert('Jumlah melebihi stok rusak');
      newUsable += qty;
      newDamaged -= qty;
      kondisi = newDamaged === 0 ? 'BAIK' : 'PERLU PERBAIKAN';
      catatan = actionForm.catatan || tool.catatan;
    } else if (action === 'ganti') {
      if (qty > newDamaged) return alert('Jumlah melebihi stok rusak');
      newTotal -= qty;
      newDamaged -= qty;
      kondisi = newDamaged === 0 ? 'BAIK' : 'PERLU PERBAIKAN';
      catatan = 'Alat telah diganti. ' + (actionForm.catatan || tool.catatan || '');
      recordRiwayat(tool, 'Penggantian Alat', qty, oldTotal, newTotal, actionForm.catatan || 'Diganti dengan yang baru');
    } else if (action === 'tarik') {
      if (qty > newDamaged) return alert('Jumlah melebihi stok rusak');
      newTotal -= qty;
      newDamaged -= qty;
      kondisi = newDamaged === 0 ? 'BAIK' : 'PERLU PERBAIKAN';
      catatan = 'Alat ditarik dari inventaris. ' + (actionForm.catatan || tool.catatan || '');
      recordRiwayat(tool, 'Penarikan Inventaris', qty, oldTotal, newTotal, actionForm.catatan || 'Rusak dan ditarik');
    }

    const newStok = stok.map(item => 
      item.id === tool.id ? { 
        ...item, 
        jumlah: newTotal, // sync with dashboard
        totalStock: newTotal, 
        usableStock: newUsable, 
        damagedStock: newDamaged,
        kondisi,
        catatan
      } : item
    );

    setStok(newStok);
    localStorage.setItem('portal_sawit_stok', JSON.stringify(newStok));
    setActionModal({ show: false, action: null, tool: null });
    setActionForm({ jumlah: 1, catatan: '' });
    setSelectedAlat(null); // Close detail view to refresh
  };

  const handleEditClick = (alat, e) => {
    e.stopPropagation();
    setFormData({
      id: alat.id,
      nama: alat.nama || '',
      kategori: alat.kategori || 'Alat',
      deskripsi: alat.deskripsi || alat.fungsi || '',
      jumlah: alat.totalStock || alat.jumlah || 0,
      batasBawah: alat.batasBawah || 5,
      lokasi: alat.lokasi || 'Gudang Alat'
    });
    setIsEditing(true);
    setSelectedAlat(null);
  };

  const handleAddClick = () => {
    setFormData({
      id: null,
      nama: '',
      kategori: 'Alat',
      deskripsi: '',
      jumlah: 0,
      batasBawah: 5,
      lokasi: 'Gudang Alat'
    });
    setIsAdding(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isAdding) {
      const newId = stok.length > 0 ? Math.max(...stok.map(s => s.id)) + 1 : 1;
      const qty = parseInt(formData.jumlah) || 0;
      const newItem = {
        ...formData,
        id: newId,
        satuan: 'Unit',
        jumlah: qty,
        totalStock: qty,
        usableStock: qty,
        damagedStock: 0,
        kondisi: 'BAIK',
        catatan: ''
      };
      const newStok = [...stok, newItem];
      setStok(newStok);
      localStorage.setItem('portal_sawit_stok', JSON.stringify(newStok));
    } else if (isEditing) {
      const qty = parseInt(formData.jumlah) || 0;
      const newStok = stok.map(item => {
        if(item.id === formData.id) {
          // Adjust usable based on difference in total
          const diff = qty - (item.totalStock || item.jumlah);
          let newUsable = (item.usableStock || item.jumlah) + diff;
          if(newUsable < 0) newUsable = 0;
          return { 
            ...item, 
            ...formData, 
            jumlah: qty,
            totalStock: qty,
            usableStock: newUsable
          };
        }
        return item;
      });
      setStok(newStok);
      localStorage.setItem('portal_sawit_stok', JSON.stringify(newStok));
    }
    setIsAdding(false);
    setIsEditing(false);
  };

  const openAction = (tool, actionStr, e) => {
    if(e) e.stopPropagation();
    setActionForm({ jumlah: 1, catatan: '' });
    setActionModal({ show: true, action: actionStr, tool });
  };

  const FormModal = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5rem 1rem 2rem 1rem' }}>
      <div className="card animate-fade-in" style={{ width: '90vw', maxWidth: '500px', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex justify-between items-start">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {isAdding ? t('btn_add_tool') : t('btn_edit')}
            </h2>
            <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="btn-icon">
              <X size={20} />
            </button>
          </div>
        </div>
        <form onSubmit={handleFormSubmit} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{t('lbl_tool_name')}</label>
            <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{t('lbl_category')}</label>
            <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }}>
              <option value="Alat">Alat</option>
              <option value="Sparepart">Sparepart</option>
              <option value="Alat Pendukung">Alat Pendukung</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{t('lbl_desc')}</label>
            <input type="text" value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{t('lbl_location')}</label>
            <input required type="text" value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Stok Awal (Unit)</label>
              <input type="number" required value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: parseInt(e.target.value) || 0})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Batas Minimum</label>
              <input type="number" required value={formData.batasBawah} onChange={e => setFormData({...formData, batasBawah: parseInt(e.target.value) || 0})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn" onClick={() => { setIsAdding(false); setIsEditing(false); }} style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}>{t('btn_cancel')}</button>
            <button type="submit" className="btn" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>{t('btn_save')}</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Manajemen {t('lbl_tools')} & APD</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Inventaris peralatan kerja dan standar keselamatan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={24} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Checklist APD Penyemprotan</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>SOP Keselamatan: APD Wajib dikenakan sebelum mencampur dan mengaplikasikan pestisida.</p>
          <div className="flex flex-col gap-3">
            {apdState.map((item) => (
              <label 
                key={item.id} 
                className="flex items-center gap-3 p-3 rounded-md cursor-pointer" 
                style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', transition: 'background-color 0.2s' }}
              >
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={() => toggleApd(item.id)}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)', cursor: 'pointer' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{item.nama}</span>
                  {item.wajib && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)', fontWeight: 600 }}>Wajib</span>}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wrench size={24} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t('lbl_tool_cond')}</h3>
            </div>
            <button onClick={handleAddClick} className="btn" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
              <Plus size={16} style={{ display: 'inline', marginRight: '4px' }} /> {t('btn_add_tool')}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {visibleTools.map((item) => {
              const total = item.totalStock !== undefined ? item.totalStock : item.jumlah;
              const usable = item.usableStock !== undefined ? item.usableStock : total;
              const damaged = item.damagedStock !== undefined ? item.damagedStock : 0;
              
              return (
              <div 
                key={item.id} 
                className="flex flex-col gap-1 rounded-md" 
                style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{item.nama}</h4>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => handleEditClick(item, e)} style={{ padding: '4px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-text-muted)' }} title={t('btn_edit')}>
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{item.deskripsi || item.kategori}</p>
                
                <div className="flex gap-4 mt-2 mb-2">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Total Stok</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{total}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>Layak Pakai</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-success)' }}>{usable}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)' }}>Rusak</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-danger)' }}>{damaged}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-1">
                  {usable > 0 && (
                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-danger-transparent)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-transparent)' }} onClick={(e) => openAction(item, 'rusak', e)}>
                      <AlertTriangle size={12} style={{ display: 'inline', marginRight: '2px' }}/> Tandai Rusak
                    </button>
                  )}
                  {damaged > 0 && (
                    <>
                      <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-info-transparent)', color: 'var(--color-info)', border: '1px solid var(--color-info-transparent)' }} onClick={(e) => openAction(item, 'perbaiki', e)}>
                        <PenTool size={12} style={{ display: 'inline', marginRight: '2px' }}/> Perbaiki
                      </button>
                      <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-warning-transparent)', color: 'var(--color-warning)', border: '1px solid var(--color-warning-transparent)' }} onClick={(e) => openAction(item, 'ganti', e)}>
                        <RefreshCw size={12} style={{ display: 'inline', marginRight: '2px' }}/> Ganti
                      </button>
                      <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }} onClick={(e) => openAction(item, 'tarik', e)}>
                        <LogOut size={12} style={{ display: 'inline', marginRight: '2px' }}/> Tarik
                      </button>
                    </>
                  )}
                </div>

                <span onClick={() => setSelectedAlat(item)} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '0.5rem', fontWeight: 500, cursor: 'pointer', display: 'inline-block' }}>{t('btn_view_detail')} &rarr;</span>
              </div>
            )})}
            {visibleTools.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '1rem 0' }}>Tidak ada peralatan.</p>
            )}
          </div>
        </div>
      </div>

      {(isAdding || isEditing) && <FormModal />}

      {actionModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ padding: '1.5rem', maxWidth: '400px', width: '90vw', backgroundColor: 'var(--color-surface)' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>
              {actionModal.action === 'rusak' ? 'Tandai Alat Rusak' : 
               actionModal.action === 'perbaiki' ? 'Perbaiki Alat' : 
               actionModal.action === 'ganti' ? 'Ganti Alat' : 'Tarik dari Inventaris'}
            </h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
              Produk: <strong>{actionModal.tool.nama}</strong><br/>
              {actionModal.action === 'rusak' ? `Stok layak pakai: ${actionModal.tool.usableStock || actionModal.tool.jumlah}` : `Stok rusak: ${actionModal.tool.damagedStock || 0}`}
            </p>
            <form onSubmit={handleActionSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Jumlah (Unit)</label>
                <input type="number" min="1" max={actionModal.action === 'rusak' ? (actionModal.tool.usableStock || actionModal.tool.jumlah) : (actionModal.tool.damagedStock || 0)} value={actionForm.jumlah} onChange={e => setActionForm({...actionForm, jumlah: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)' }} required />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Catatan / Alasan</label>
                <textarea value={actionForm.catatan} onChange={e => setActionForm({...actionForm, catatan: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', minHeight: '60px' }} required={actionModal.action !== 'perbaiki'}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn" onClick={() => setActionModal({ show: false, action: null, tool: null })} style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)' }}>{t('btn_cancel')}</button>
                <button type="submit" className="btn" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Konfirmasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAlat && !isEditing && !isAdding && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5rem 1rem 2rem 1rem' }}>
          <div className="card animate-fade-in" style={{ width: '90vw', maxWidth: '600px', maxHeight: '85vh', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex justify-between items-start">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Detail Peralatan</h2>
                <button onClick={() => setSelectedAlat(null)} className="btn-icon" style={{ padding: '0.5rem', background: 'var(--color-background)', borderRadius: '50%' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, backgroundColor: 'var(--color-background)' }}>
              <div className="flex flex-col gap-4 mb-6">
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{t('lbl_tool_name')}</p>
                      <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{selectedAlat.nama}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{t('lbl_category')}</p>
                      <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{selectedAlat.subkategori || selectedAlat.kategori}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Stok Tersedia</p>
                      <div className="flex gap-6 mt-1">
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>Total</span>
                          <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{selectedAlat.totalStock || selectedAlat.jumlah}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', display: 'block' }}>Layak Pakai</span>
                          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-success)' }}>{selectedAlat.usableStock !== undefined ? selectedAlat.usableStock : selectedAlat.jumlah}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', display: 'block' }}>Rusak</span>
                          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-danger)' }}>{selectedAlat.damagedStock || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{t('lbl_location')}</p>
                      <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{selectedAlat.lokasi}</p>
                    </div>
                    {selectedAlat.catatan && (
                      <div className="md:col-span-2">
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{t('lbl_notes')}</p>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--color-text-main)', padding: '0.5rem', backgroundColor: 'var(--color-danger-transparent)', borderRadius: '4px' }}>{selectedAlat.catatan}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn" onClick={(e) => handleEditClick(selectedAlat, e)} style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.5rem 1.5rem', fontWeight: 600 }}>
                {t('btn_edit')}
              </button>
              <button className="btn" onClick={() => setSelectedAlat(null)} style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', padding: '0.5rem 1.5rem', fontWeight: 600, border: '1px solid var(--color-border)' }}>
                {t('lbl_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alat;
