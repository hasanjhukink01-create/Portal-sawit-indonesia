import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calculator, Sprout, Droplet, Wrench, Calendar, Activity, Clock, PackageSearch, History, Leaf } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

const Sidebar = () => {
  const { t } = useI18n();
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="flex items-center gap-3">
          <div style={{ padding: '0.4rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            <Leaf size={24} color="#4ade80" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.05em' }}>PORTAL SAWIT</h2>
          </div>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.5rem', lineHeight: 1.4 }}>Smart Plantation Management</p>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-group-title">OPERASIONAL</div>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><LayoutDashboard size={18} /><span>{t('menu_dashboard')}</span></NavLink>
        <NavLink to="/jadwal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Calendar size={18} /><span>{t('menu_jadwal')}</span></NavLink>
        <NavLink to="/riwayat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><History size={18} /><span>{t('menu_riwayat')}</span></NavLink>

        <div className="nav-group-title">PEMELIHARAAN</div>
        <NavLink to="/pemeliharaan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Sprout size={18} /><span>{t('menu_pemeliharaan')}</span></NavLink>
        <NavLink to="/monitoring" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Activity size={18} /><span>{t('menu_monitoring')}</span></NavLink>
        <NavLink to="/umur-tanaman" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Clock size={18} /><span>{t('menu_umur')}</span></NavLink>

        <div className="nav-group-title">MATERIAL</div>
        <NavLink to="/pestisida" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Droplet size={18} /><span>{t('menu_database')}</span></NavLink>
        <NavLink to="/stok" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><PackageSearch size={18} /><span>{t('menu_inventaris')}</span></NavLink>
        <NavLink to="/alat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Wrench size={18} /><span>{t('menu_alat')}</span></NavLink>

        <div className="nav-group-title">TOOLS</div>
        <NavLink to="/kalkulator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Calculator size={18} /><span>{t('menu_kalkulator')}</span></NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
