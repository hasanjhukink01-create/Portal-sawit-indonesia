import { Bell, UserCircle, Sun, Moon, Globe, ChevronDown, Check, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [isDark, setIsDark] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useI18n();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const langMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    // Check system preference or localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const languages = [
    { code: 'id', label: '🇮🇩 ' + t('lang_id') },
    { code: 'en', label: '🇬🇧 ' + t('lang_en') },
    { code: 'ja', label: '🇯🇵 ' + t('lang_ja') },
    { code: 'ar', label: '🇸🇦 ' + t('lang_ar') },
    { code: 'pt', label: '🇵🇹 ' + t('lang_pt') },
    { code: 'jv', label: '🏝️ ' + t('lang_jv') },
  ];

  const currentLangLabel = languages.find(l => l.code === language)?.label || 'Bahasa';

  return (
    <header className="topbar">
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>PORTAL SAWIT</h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Smart Plantation Management</p>
      </div>
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <div style={{ position: 'relative', paddingRight: '0.5rem' }} ref={langMenuRef}>
          <button 
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--color-text-main)', 
              fontWeight: 600, 
              fontSize: '0.875rem',
              cursor: 'pointer',
              outline: 'none',
              padding: '0.25rem'
            }}
          >
            <Globe size={18} color="var(--color-text-muted)" />
            {currentLangLabel}
            <ChevronDown size={14} color="var(--color-text-muted)" />
          </button>
          
          {langMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              [isRTL ? 'left' : 'right']: '0',
              marginTop: '0.5rem',
              width: '180px',
              backgroundColor: '#172235',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setLangMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: language === lang.code ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                    border: 'none',
                    color: language === lang.code ? '#4ade80' : '#F5F7FA',
                    fontSize: '0.875rem',
                    fontWeight: language === lang.code ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (language !== lang.code) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseOut={(e) => {
                    if (language !== lang.code) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{lang.label}</span>
                  {language === lang.code && <Check size={16} color="#4ade80" />}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button className="btn-icon" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {isDark ? <Sun size={20} color="var(--color-accent)" /> : <Moon size={20} />}
        </button>
        <button className="btn-icon" title="Notifikasi">
          <Bell size={20} />
        </button>
        
        {/* Profile & Logout */}
        <div style={{ position: 'relative', borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem', marginLeft: '0.5rem' }} ref={profileMenuRef}>
          <button 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-3" 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none' }}
          >
            <UserCircle size={32} color="var(--color-primary)" />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1.2 }}>Admin Kebun</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Administrator</p>
            </div>
            <ChevronDown size={14} color="var(--color-text-muted)" style={{ marginLeft: '0.25rem' }} />
          </button>

          {profileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              [isRTL ? 'left' : 'right']: '0',
              marginTop: '0.5rem',
              width: '150px',
              backgroundColor: 'var(--color-background)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left'
                }}
              >
                <UserCircle size={16} /> {t('profile_btn')}
              </button>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--color-danger)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                }}
              >
                <LogOut size={16} /> {t('logout_btn')}
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default TopBar;
