import { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Calculator as CalcIcon, AlertCircle, CheckCircle2, Droplet, Sprout, Search } from 'lucide-react';

const Kalkulator = () => {
  const { stok, setStok, riwayat, setRiwayat } = useContext(AppContext);
  
  const [activeTab, setActiveTab] = useState('pestisida'); // 'pestisida' atau 'pupuk'
  const [pupukMethod, setPupukMethod] = useState('luas'); // 'luas', 'pokok', 'cair'
  
  // Inputs umum
  const [luas, setLuas] = useState('');
  const [dosis, setDosis] = useState(''); // L/ha atau kg/ha
  const [volume, setVolume] = useState(''); // L/ha
  const [kapasitas, setKapasitas] = useState('15'); // L
  
  // Inputs khusus pupuk per pokok
  const [jumlahPokok, setJumlahPokok] = useState(''); // pokok/ha
  const [dosisPokok, setDosisPokok] = useState(''); // kg/pokok

  // Inputs eksekusi
  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [searchBarang, setSearchBarang] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [kegiatan, setKegiatan] = useState('');
  const [blok, setBlok] = useState('');
  const [pelaksana, setPelaksana] = useState('');
  
  const [hasil, setHasil] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const dropdownRef = useRef(null);

  // Filter stok untuk combobox
  const filteredStok = stok.filter(item => {
    const kat = (item.kategori || '').toLowerCase();
    
    // Jangan tampilkan alat, sparepart, apd, dll
    if (kat.includes('alat') || kat.includes('apd') || kat.includes('sparepart') || kat.includes('pendukung')) {
      return false;
    }
    
    // Filter berdasarkan tab aktif
    if (activeTab === 'pestisida' && !kat.includes('pestisida') && !kat.includes('herbisida') && !kat.includes('insektisida') && !kat.includes('fungisida')) {
      return false;
    }
    if (activeTab === 'pupuk' && !kat.includes('pupuk')) {
      return false;
    }

    // Filter berdasarkan input pencarian
    if (searchBarang) {
      return item.nama.toLowerCase().includes(searchBarang.toLowerCase());
    }
    
    return true;
  });

  // Handle klik di luar dropdown untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hitungPestisida = () => {
    if (luas && dosis && volume && kapasitas) {
      const kebutuhanTotal = parseFloat(luas) * parseFloat(dosis);
      const totalVolume = parseFloat(luas) * parseFloat(volume);
      const jmlTangki = Math.ceil(totalVolume / parseFloat(kapasitas));
      
      setHasil({
        tipe: 'sprayer',
        kebutuhanTotal: kebutuhanTotal,
        totalVolume: totalVolume,
        jmlTangki: jmlTangki,
        satuanProduk: 'Liter'
      });
      setIsSaved(false);
    }
  };

  const hitungPupukLuas = () => {
    if (luas && dosis) {
      const kebutuhanTotal = parseFloat(luas) * parseFloat(dosis);
      setHasil({
        tipe: 'tabur',
        kebutuhanTotal: kebutuhanTotal,
        satuanProduk: 'Kg'
      });
      setIsSaved(false);
    }
  };

  const hitungPupukPokok = () => {
    if (luas && jumlahPokok && dosisPokok) {
      const totalPokokVal = parseFloat(luas) * parseFloat(jumlahPokok);
      const kebutuhanTotal = totalPokokVal * parseFloat(dosisPokok);
      
      setHasil({
        tipe: 'tabur',
        totalPokok: totalPokokVal,
        kebutuhanTotal: kebutuhanTotal,
        satuanProduk: 'Kg'
      });
      setIsSaved(false);
    }
  };

  const hitungPupukCair = () => {
    if (luas && dosis && volume && kapasitas) {
      const kebutuhanTotal = parseFloat(luas) * parseFloat(dosis);
      const totalVolume = parseFloat(luas) * parseFloat(volume);
      const jmlTangki = Math.ceil(totalVolume / parseFloat(kapasitas));
      
      setHasil({
        tipe: 'sprayer',
        kebutuhanTotal: kebutuhanTotal,
        totalVolume: totalVolume,
        jmlTangki: jmlTangki,
        satuanProduk: 'Liter'
      });
      setIsSaved(false);
    }
  };

  const handleHitung = () => {
    if (activeTab === 'pestisida') hitungPestisida();
    else if (activeTab === 'pupuk') {
      if (pupukMethod === 'luas') hitungPupukLuas();
      else if (pupukMethod === 'pokok') hitungPupukPokok();
      else if (pupukMethod === 'cair') hitungPupukCair();
    }
  };

  const handlePotongStok = () => {
    if (!selectedBarangId || !hasil || !kegiatan || !blok || !pelaksana) {
      alert("Harap lengkapi semua data (Barang, Kegiatan, Blok, Pelaksana) sebelum memotong stok!");
      return;
    }

    const barangItem = stok.find(i => i.id === selectedBarangId);
    if (!barangItem) return;

    // Validasi stok
    if (parseFloat(barangItem.jumlah) < hasil.kebutuhanTotal) {
      alert(`Stok tidak mencukupi. Kebutuhan ${hasil.kebutuhanTotal.toLocaleString('id-ID')} ${barangItem.satuan}, sedangkan stok tersedia hanya ${barangItem.jumlah} ${barangItem.satuan}.`);
      return;
    }
    
    // Potong Stok
    const barangIndex = stok.findIndex(i => i.id === selectedBarangId);
    if (barangIndex !== -1) {
      const newStok = [...stok];
      newStok[barangIndex] = { ...barangItem, jumlah: barangItem.jumlah - hasil.kebutuhanTotal };
      setStok(newStok);
      localStorage.setItem('portal_sawit_inventory', JSON.stringify(newStok));
      
      // Catat Riwayat
      const tanggalHariIni = new Date().toLocaleDateString('en-CA');
      const riwayatItem = {
        id: riwayat.length > 0 ? Math.max(...riwayat.map(r => r.id)) + 1 : 1,
        tanggal: tanggalHariIni,
        kegiatan: kegiatan,
        blok: blok,
        operator: pelaksana,
        hasil: `Selesai (Terpakai ${hasil.kebutuhanTotal.toLocaleString('id-ID')} ${barangItem.satuan})`
      };
      
      const newRiwayat = [...riwayat, riwayatItem];
      setRiwayat(newRiwayat);
      localStorage.setItem('portal_sawit_history', JSON.stringify(newRiwayat));
    }
    
    setIsSaved(true);
    alert(`Berhasil!\nStok ${barangItem.nama} terpotong ${hasil.kebutuhanTotal.toLocaleString('id-ID')} ${barangItem.satuan}.\nRiwayat kegiatan telah ditambahkan.`);
  };

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Kalkulator Takaran & Eksekusi</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Hitung kebutuhan material secara akurat dan potong stok otomatis.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => { 
            setActiveTab('pestisida'); 
            setHasil(null); 
            setSelectedBarangId(''); 
            setSearchBarang(''); 
          }}
          className="flex items-center gap-2"
          style={{ 
            background: 'none', border: 'none', fontWeight: 600, fontSize: '1rem', 
            padding: '0.75rem 1rem', cursor: 'pointer',
            color: activeTab === 'pestisida' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'pestisida' ? '3px solid var(--color-primary)' : '3px solid transparent'
          }}
        >
          <Droplet size={20} /> PESTISIDA / HERBISIDA
        </button>
        <button 
          onClick={() => { 
            setActiveTab('pupuk'); 
            setHasil(null); 
            setSelectedBarangId(''); 
            setSearchBarang(''); 
          }}
          className="flex items-center gap-2"
          style={{ 
            background: 'none', border: 'none', fontWeight: 600, fontSize: '1rem', 
            padding: '0.75rem 1rem', cursor: 'pointer',
            color: activeTab === 'pupuk' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'pupuk' ? '3px solid var(--color-primary)' : '3px solid transparent'
          }}
        >
          <Sprout size={20} /> PUPUK
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Input */}
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalcIcon size={20} color="var(--color-primary)" /> Parameter Input
          </h3>

          <div className="flex flex-col gap-4">
            
            {activeTab === 'pupuk' && (
              <div className="mb-4">
                <label className="label">Metode Pemupukan</label>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pupukMethod" checked={pupukMethod === 'luas'} onChange={() => {setPupukMethod('luas'); setHasil(null);}} />
                    Berdasarkan Luas (kg/ha)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pupukMethod" checked={pupukMethod === 'pokok'} onChange={() => {setPupukMethod('pokok'); setHasil(null);}} />
                    Berdasarkan Pokok
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pupukMethod" checked={pupukMethod === 'cair'} onChange={() => {setPupukMethod('cair'); setHasil(null);}} />
                    Pupuk Cair / Semprot
                  </label>
                </div>
              </div>
            )}

            {(activeTab === 'pestisida' || (activeTab === 'pupuk' && (pupukMethod === 'luas' || pupukMethod === 'cair'))) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Luas Lahan (Ha)</label>
                  <input type="number" className="input" placeholder="Cth: 5" value={luas} onChange={(e) => setLuas(e.target.value)} />
                </div>
                <div>
                  <label className="label">Dosis Produk ({activeTab === 'pupuk' && pupukMethod === 'luas' ? 'kg/ha' : 'L/ha atau kg/ha'})</label>
                  <input type="number" className="input" placeholder="Cth: 2" value={dosis} onChange={(e) => setDosis(e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === 'pupuk' && pupukMethod === 'pokok' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Luas Lahan (Ha)</label>
                    <input type="number" className="input" placeholder="Cth: 5" value={luas} onChange={(e) => setLuas(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Jml Pokok per Hektare</label>
                    <input type="number" className="input" placeholder="Cth: 140" value={jumlahPokok} onChange={(e) => setJumlahPokok(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Dosis per Pokok (Kg)</label>
                  <input type="number" className="input" placeholder="Cth: 2" value={dosisPokok} onChange={(e) => setDosisPokok(e.target.value)} />
                </div>
              </>
            )}

            {(activeTab === 'pestisida' || (activeTab === 'pupuk' && pupukMethod === 'cair')) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Volume Semprot (L/Ha)</label>
                  <input type="number" className="input" placeholder="Cth: 200" value={volume} onChange={(e) => setVolume(e.target.value)} />
                </div>
                <div>
                  <label className="label">Kapasitas Tangki (L)</label>
                  <input type="number" className="input" placeholder="Cth: 15" value={kapasitas} onChange={(e) => setKapasitas(e.target.value)} />
                </div>
              </div>
            )}

            <button className="btn btn-primary mt-2" onClick={handleHitung} style={{ width: '100%' }}>Hitung Kebutuhan</button>

            <div className="mt-4 flex gap-2 items-start" style={{ padding: '0.75rem', backgroundColor: 'var(--color-info-transparent)', borderRadius: 'var(--radius-md)', color: 'var(--color-info)' }}>
              <AlertCircle size={16} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
              <p style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
                {activeTab === 'pestisida' ? 
                  "Dosis harus mengikuti label resmi produk dan SOP perusahaan. Sistem hanya melakukan perhitungan berdasarkan angka yang dimasukkan pengguna." :
                  "Gunakan konsentrasi dan dosis sesuai label resmi produk pupuk. Jangan mengarang dosis. Kalkulator hanya menghitung berdasarkan data yang dimasukkan pengguna."}
              </p>
            </div>
          </div>
        </div>

        {/* Hasil Perhitungan */}
        {hasil && (
          <div className="card" style={{ backgroundColor: 'var(--color-background)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-primary-dark)' }}>Hasil Perhitungan</h3>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              
              <div className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <p className="label">TOTAL KEBUTUHAN PRODUK</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                  {hasil.kebutuhanTotal.toLocaleString('id-ID')} {hasil.satuanProduk}
                </h4>
                {hasil.tipe === 'tabur' && (
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {(hasil.kebutuhanTotal / 1000).toLocaleString('id-ID')} Ton
                  </h4>
                )}
              </div>

              {hasil.tipe === 'sprayer' && (
                <>
                  <div className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <p className="label">TOTAL VOLUME LARUTAN</p>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {hasil.totalVolume.toLocaleString('id-ID')} L
                    </h4>
                  </div>

                  <div className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <p className="label">JUMLAH TANGKI</p>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {hasil.jmlTangki} TANGKI &times; {kapasitas} L
                    </h4>
                  </div>
                  
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    * Jumlah tangki terakhir dapat berisi kurang dari kapasitas penuh. Jangan menambahkan produk melebihi dosis total yang dihitung.
                  </p>
                </>
              )}

              {hasil.totalPokok && (
                <div className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                  <p className="label">TOTAL POKOK SAWIT</p>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {hasil.totalPokok.toLocaleString('id-ID')} Pokok
                  </h4>
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg mb-6 shadow-sm border" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>Eksekusi ke Riwayat & Pemotongan Stok</h4>
              <div className="flex flex-col gap-3">
                
                {/* Searchable Combobox */}
                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center">
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      className="input"
                      placeholder="Cari atau pilih barang dari gudang..."
                      style={{ paddingLeft: '2.25rem' }}
                      value={searchBarang}
                      onChange={(e) => {
                        setSearchBarang(e.target.value);
                        setIsDropdownOpen(true);
                        setSelectedBarangId('');
                      }}
                      onClick={() => setIsDropdownOpen(true)}
                    />
                  </div>
                  
                  {isDropdownOpen && searchBarang.trim().length > 0 && (
                    <div 
                      style={{ 
                        position: 'absolute', top: '100%', left: 0, right: 0, 
                        marginTop: '0.25rem', zIndex: 50, 
                        backgroundColor: 'var(--color-surface)', 
                        border: '1px solid var(--color-border)', 
                        borderRadius: 'var(--radius-md)', 
                        boxShadow: 'var(--shadow-lg)', 
                        maxHeight: '200px', overflowY: 'auto' 
                      }}
                    >
                      {filteredStok.length > 0 ? (
                        filteredStok.map(item => (
                          <div 
                            key={item.id} 
                            style={{ 
                              padding: '0.5rem 1rem', cursor: 'pointer', 
                              borderBottom: '1px solid var(--color-border)',
                              display: 'flex', flexDirection: 'column'
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault(); // Mencegah onBlur input
                              setSelectedBarangId(item.id);
                              setSearchBarang(item.nama);
                              setIsDropdownOpen(false);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{item.nama}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sisa: {item.jumlah} {item.satuan}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                          Barang tidak ditemukan.
                        </div>
                      )}
                    </div>
                  )}
                  
                </div>

                <input type="text" className="input" placeholder="Nama Kegiatan (Cth: Semprot Lalang)" value={kegiatan} onChange={e => setKegiatan(e.target.value)} />
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Kode Blok (Cth: A01)" 
                  value={blok} 
                  onChange={e => {
                    const normalized = e.target.value.toUpperCase().replace(/\s/g, '');
                    setBlok(normalized);
                  }} 
                />
                <input type="text" className="input" placeholder="Nama Operator / Tim" value={pelaksana} onChange={e => setPelaksana(e.target.value)} />
              </div>
            </div>

            {isSaved ? (
              <div className="flex items-center justify-center gap-2" style={{ color: 'var(--color-success)', fontWeight: 600, padding: '0.75rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={20} /> Transaksi Tersimpan
              </div>
            ) : (
              <button className="btn" onClick={handlePotongStok} style={{ width: '100%', backgroundColor: 'var(--color-danger)', color: 'white', fontWeight: 700 }}>
                Potong Stok & Simpan Riwayat
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Kalkulator;
