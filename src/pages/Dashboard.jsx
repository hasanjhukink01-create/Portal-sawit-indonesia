import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Leaf, Map, Sprout, Wrench, AlertTriangle, Package, CheckCircle2, Clock, ThermometerSun, Droplets, Wind, ArrowRight, Cloud } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';

const Dashboard = () => {
  const { stok, jadwal, riwayat } = useContext(AppContext);
  const { t } = useI18n();
  const [currentDate, setCurrentDate] = useState('');

  // 1. Dapatkan todayStr secara sinkron (konsisten YYYY-MM-DD lokal)
  const getTodayStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const todayStr = getTodayStr();

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('id-ID', options));
  }, []);

  // Validasi data
  const isValidJadwal = (j) => {
    return j.tanggal?.trim() && j.blok?.trim() && j.kegiatan?.trim() && j.operator?.trim();
  };

  // Stats calculation
  const jadwalHariIni = jadwal.filter(j => isValidJadwal(j) && j.tanggal === todayStr);
  const totalHariIni = jadwalHariIni.length;
  const selesaiHariIni = jadwalHariIni.filter(j => j.status === 'Selesai').length;
  const persenSelesai = totalHariIni > 0 ? Math.round((selesaiHariIni / totalHariIni) * 100) : 0;

  const jadwalTerlewat = jadwal.filter(j => isValidJadwal(j) && j.tanggal < todayStr && j.status !== 'Selesai');
  const jadwalHariIniTable = jadwalHariIni;

  const stats = [
    { label: t('stat_luas'), value: '1.250 Ha', icon: <Map size={24} />, color: 'var(--color-primary)' },
    { label: t('stat_blok'), value: '42 Blok', icon: <Leaf size={24} />, color: 'var(--color-success)' },
    { label: t('stat_tanaman'), value: '162.500', icon: <Sprout size={24} />, color: 'var(--color-info)' },
    { label: t('stat_alat'), value: '95%', icon: <Wrench size={24} />, color: 'var(--color-warning)' },
    { label: t('stat_kegiatan_hari_ini'), value: totalHariIni, icon: <Clock size={24} />, color: 'var(--color-accent)' },
    { 
      label: t('stat_kegiatan_selesai'), 
      value: `${selesaiHariIni} / ${totalHariIni}`, 
      subValue: `${persenSelesai}%`,
      icon: <CheckCircle2 size={24} />, 
      color: 'var(--color-primary-dark)' 
    },
  ];

  // Helper aman untuk parse selisih hari & format tanggal
  const getSafeDateParts = (d) => {
    if (!d) return null;
    const parts = d.split('-');
    if (parts.length !== 3) return null;
    return parts; // [YYYY, MM, DD]
  };

  const calcHariTerlambat = (tgl) => {
    const parts1 = getSafeDateParts(todayStr);
    const parts2 = getSafeDateParts(tgl);
    if (!parts1 || !parts2) return 0;
    
    const d1 = Date.UTC(parts1[0], parts1[1] - 1, parts1[2]);
    const d2 = Date.UTC(parts2[0], parts2[1] - 1, parts2[2]);
    return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
  };

  const formatTanggalIndo = (tgl) => {
    const parts = getSafeDateParts(tgl);
    if (!parts) return tgl || '-';
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  };

  const getDisplayStatus = (item) => {
    if (!item.tanggal) return t(`status_${item.status.toLowerCase().replace(/ /g, '_')}`) || item.status;
    
    if (item.tanggal > todayStr) {
      return t('status_terjadwal');
    } else if (item.tanggal < todayStr) {
      return item.status === 'Selesai' ? t('status_selesai') : t('status_terlambat');
    } else {
      return t(`status_${item.status.toLowerCase().replace(/ /g, '_')}`) || item.status;
    }
  };

  // Helper Pemakaian (parsing Riwayat atau fallback)
  const getPemakaian = () => {
    let data = { 'NPK': 0, 'Pupuk Urea': 0, 'Paraquat': 0, 'Glifosat': 0, 'Deltametrin': 0 };
    riwayat.forEach(item => {
      if(item.hasil.includes('Terpakai')) {
        const matches = item.hasil.match(/Terpakai ([\d.,]+)/);
        if(matches) {
          const val = parseFloat(matches[1].replace(/\./g, '').replace(/,/g, '.'));
          const kegiatanUpper = item.kegiatan.toUpperCase();
          if(kegiatanUpper.includes('NPK')) data['NPK'] += val;
          else if(kegiatanUpper.includes('UREA')) data['Pupuk Urea'] += val;
          else if(kegiatanUpper.includes('PARAQUAT')) data['Paraquat'] += val;
          else if(kegiatanUpper.includes('GLIFOSAT')) data['Glifosat'] += val;
          else if(kegiatanUpper.includes('DELTAMETRIN')) data['Deltametrin'] += val;
        }
      }
    });
    // Fallback static data if empty so UI looks complete as requested
    if(data['NPK'] === 0) data['NPK'] = 3000;
    if(data['Pupuk Urea'] === 0) data['Pupuk Urea'] = 1000;
    if(data['Paraquat'] === 0) data['Paraquat'] = 10;
    if(data['Glifosat'] === 0) data['Glifosat'] = 15;
    return data;
  };
  const pemakaian = getPemakaian();

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex', paddingBottom: '2rem' }}>
      
      {/* Header Section */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t('dashboard_title')}</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{t('dashboard_subtitle')}</p>
        <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>{t('welcome_back')}, Admin Kebun 👋 <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>{currentDate}</span></p>
      </div>

      {/* Hero Banner */}
      <div style={{ 
        height: '200px', 
        borderRadius: 'var(--radius-2xl)', 
        backgroundImage: 'linear-gradient(to right, rgba(2, 44, 34, 0.85), rgba(21, 128, 61, 0.4)), url(/banner.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '0 3rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ color: 'white', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{t('hero_title')}</h2>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '1.5rem', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{t('hero_subtitle')}</p>
          <NavLink to="/riwayat" className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary-dark)' }}>
            {t('view_activity')} <ArrowRight size={16} />
          </NavLink>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="card flex-col gap-2" style={{ padding: '1.25rem' }}>
            <div className="flex justify-between items-start">
              <div style={{ backgroundColor: `${stat.color}15`, color: stat.color, padding: '0.75rem', borderRadius: '12px' }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <p className="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</h3>
                {stat.subValue && <span style={{ color: 'var(--color-success)', fontWeight: 700, marginBottom: '0.35rem' }}>{stat.subValue}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Jadwal & Kegiatan */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('schedule_today')}</h3>
              <NavLink to="/jadwal" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '99px' }}>{t('see_all')}</NavLink>
            </div>
            
            {jadwalHariIniTable.length > 0 ? (
              <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t('table_blok')}</th>
                      <th>{t('table_kegiatan')}</th>
                      <th>{t('table_operator')}</th>
                      <th>{t('table_status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalHariIniTable.map((item) => {
                      const statusBadge = getDisplayStatus(item);
                      return (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.blok}</td>
                        <td style={{ fontWeight: 500 }}>{item.kegiatan}</td>
                        <td>{item.operator}</td>
                        <td>
                          <span className={`badge ${
                            item.status === 'Selesai' ? 'badge-success' : 
                            item.status === 'Terjadwal' ? 'badge-info' : 'badge-warning'
                          }`}>
                            {statusBadge}
                          </span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>{t('no_schedule_today')}</p>
              </div>
            )}
          </div>

          {/* Jadwal Terlewat */}
          {jadwalTerlewat.length > 0 ? (
            <div className="card" style={{ border: '1px solid var(--color-danger)' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-danger)' }}>{t('schedule_overdue')}</h3>
              </div>
              <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t('table_tanggal')}</th>
                      <th>{t('table_blok')}</th>
                      <th>{t('table_kegiatan')}</th>
                      <th>{t('table_operator')}</th>
                      <th>{t('table_keterlambatan')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jadwalTerlewat.map((item) => {
                      const hariTerlambat = calcHariTerlambat(item.tanggal);
                      return (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 500 }}>{formatTanggalIndo(item.tanggal)}</td>
                          <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.blok}</td>
                          <td style={{ fontWeight: 500 }}>{item.kegiatan} <br/><span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.produk} ({item.dosisDirencanakan})</span></td>
                          <td>{item.operator}</td>
                          <td>
                            <span className="badge badge-danger">
                              {t('overdue_days').replace('{days}', hariTerlambat > 0 ? hariTerlambat : 0)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card" style={{ border: '1px solid var(--color-border)' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-danger)' }}>{t('schedule_overdue')}</h3>
              </div>
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>{t('no_overdue')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Stok & Peringatan */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('stock_status')}</h3>
            <Package size={20} color="var(--color-text-muted)" />
          </div>
          <div className="flex flex-col gap-4">
            {stok.filter(item => item && item.nama && typeof item.nama === 'string' && item.nama.trim() !== "").map((item, idx) => {
              const numJumlah = parseFloat(item.jumlah);
              const numBatas = parseFloat(item.batasBawah);
              
              let statusLabel = t('status_aman');
              let badgeClass = 'badge-success';
              
              if (numJumlah === 0) {
                statusLabel = t('status_habis');
                badgeClass = 'badge-danger';
              } else if (numJumlah <= numBatas) {
                statusLabel = t('status_kritis');
                badgeClass = 'badge-warning';
              }

              return (
                <div key={idx} className="flex justify-between items-center" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.nama}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {item.jumlah} {item.satuan} <span style={{ opacity: 0.6 }}>(Min. {item.batasBawah})</span>
                    </p>
                  </div>
                  <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem' }}>{statusLabel}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Progress Pemeliharaan */}
        <div className="card lg:col-span-1">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>{t('progress_title')}</h3>
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between mb-1"><span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('progress_gulma')}</span><span style={{ fontSize: '0.85rem', fontWeight: 700 }}>78%</span></div>
              <div className="progress-container"><div className="progress-bar" style={{ width: '78%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('progress_pupuk')}</span><span style={{ fontSize: '0.85rem', fontWeight: 700 }}>65%</span></div>
              <div className="progress-container"><div className="progress-bar" style={{ width: '65%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('progress_hama')}</span><span style={{ fontSize: '0.85rem', fontWeight: 700 }}>82%</span></div>
              <div className="progress-container"><div className="progress-bar" style={{ width: '82%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t('progress_alat')}</span><span style={{ fontSize: '0.85rem', fontWeight: 700 }}>90%</span></div>
              <div className="progress-container"><div className="progress-bar" style={{ width: '90%' }}></div></div>
            </div>
          </div>
        </div>

        {/* Aktivitas Terakhir */}
        <div className="card lg:col-span-1">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>{t('recent_activity')}</h3>
          <div className="flex flex-col gap-4">
            {riwayat.slice().reverse().slice(0, 3).map((item, i) => (
              <div key={i} style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '1rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.kegiatan}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t('table_blok')} {item.blok} &bull; {item.pelaksana}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--color-success)' }}>{item.hasil}</p>
              </div>
            ))}
            {riwayat.length === 0 && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem 0' }}>{t('no_activity')}</p>
            )}
          </div>
        </div>

        {/* Pemakaian Bahan */}
        <div className="card lg:col-span-1">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>{t('material_usage')}</h3>
          <div className="flex flex-col gap-3">
            {Object.keys(pemakaian).map((key, i) => (
              <div key={i} className="flex justify-between items-center" style={{ padding: '0.5rem', backgroundColor: 'var(--color-background)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{key}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{pemakaian[key].toLocaleString('id-ID')} {key.includes('Liter') || key === 'Paraquat' || key === 'Glifosat' ? 'Liter' : 'Kg'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cuaca Hari Ini */}
        <div className="card lg:col-span-1" style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', border: 'none' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>{t('weather_today')}</h3>
          <div className="flex flex-col items-center justify-center gap-2 h-full" style={{ paddingBottom: '2rem' }}>
            <Cloud size={48} color="rgba(255,255,255,0.9)" />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>28°C</h2>
            <p style={{ fontWeight: 500, opacity: 0.9 }}>{t('weather_sunny_cloudy')}</p>
            <div className="flex gap-4 mt-2 opacity-80" style={{ fontSize: '0.75rem' }}>
              <span className="flex items-center gap-1"><Droplets size={14} /> {t('weather_humidity')} 75%</span>
              <span className="flex items-center gap-1"><Wind size={14} /> {t('weather_wind')} 10 km/j</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
