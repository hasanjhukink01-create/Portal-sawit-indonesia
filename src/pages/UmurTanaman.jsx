import { Stethoscope, CheckCircle2 } from 'lucide-react';

const UmurTanaman = () => {
  const recommendations = [
    { fase: 'TBM (Tanaman Belum Menghasilkan)', umur: '0 - 3 Tahun', kegiatan: ['Pemeliharaan Piringan Bebas Gulma (Manual/Kimia Hati-hati)', 'Pemupukan NPK dosis bertahap', 'Pengendalian Hama Tikus & Babi Hutan', 'Kastrasi (Pembuangan Bunga Pasir)'] },
    { fase: 'TM Muda', umur: '4 - 8 Tahun', kegiatan: ['Penyemprotan Piringan & Gawangan', 'Pemupukan NPK Lengkap dosis penuh', 'Pengendalian Ulat Api (Ambangan Ekonomi)', 'Tunas Pasir & Pemangkasan Berkala'] },
    { fase: 'TM Dewasa', umur: '> 8 Tahun', kegiatan: ['Pemeliharaan Gawangan Mati', 'Aplikasi Pupuk Makro (Urea, MOP, Kiserit)', 'Pengendalian Penyakit Ganoderma', 'Pemangkasan Pelepah (Songgo Dua)'] },
  ];

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Rekomendasi Umur Tanaman</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Standar perawatan berdasarkan fase pertumbuhan kelapa sawit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((item, idx) => (
          <div key={idx} className="card flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-primary)', padding: '0.75rem', borderRadius: '50%' }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{item.fase}</h3>
                <span className="badge badge-success">{item.umur}</span>
              </div>
            </div>
            
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Fokus Kegiatan:</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {item.kegiatan.map((keg, kIdx) => (
                <li key={kIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{keg}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UmurTanaman;
