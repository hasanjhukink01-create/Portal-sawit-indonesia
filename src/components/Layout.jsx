import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useI18n } from '../context/I18nContext';

const Layout = () => {
  const { t, isRTL } = useI18n();
  return (
    <div className="layout-container" dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <main className="main-content">
        <TopBar />
        <div className="page-content">
          <Outlet />
          <footer className="footer">
            <p style={{ fontWeight: 600 }}>&copy; 2026 Portal Sawit. Smart Plantation Management System.</p>
            <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>{t('footer_motto')}</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
