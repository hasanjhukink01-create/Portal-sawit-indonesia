import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { Eye, EyeOff, Globe, ChevronDown, Check, Leaf, BarChart2, ShieldCheck, User, Lock, LogIn, Phone } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, t, isRTL } = useI18n();
  const langMenuRef = useRef(null);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError(t('err_req_username'));
      return;
    }
    if (!password.trim()) {
      setError(t('err_req_password'));
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError(t('err_invalid_cred'));
    }
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
    <>
      <style>
        {`
          .login-container {
            display: grid;
            grid-template-columns: 55% 45%;
            height: 100vh;
            min-height: 100vh;
            overflow: hidden;
            box-sizing: border-box;
            background-color: #0f172a;
          }
          .login-left {
            position: relative;
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.2) 100%), url(/banner.jpg);
            background-size: cover;
            background-position: center;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 70px 80px;
            box-sizing: border-box;
            height: 100%;
          }
          .login-right {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #0f172a;
            padding: 40px;
            box-sizing: border-box;
            height: 100%;
            overflow-y: auto;
          }
          .login-card {
            width: 100%;
            max-width: 540px;
            background-color: #1e293b;
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255,255,255,0.05);
            position: relative;
            box-sizing: border-box;
          }
          @media (max-width: 992px) {
            .login-container {
              display: flex;
              flex-direction: column;
              height: auto;
              overflow: visible;
            }
            .login-left {
              padding: 40px 30px;
              min-height: 50vh;
            }
            .login-right {
              padding: 30px 20px;
              min-height: 60vh;
            }
          }
        `}
      </style>
      
      <div className="login-container" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Background Panel (Left) */}
        <div className="login-left">
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
              <Leaf size={32} color="#4ade80" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '0.5px', margin: 0 }}>PT. SAWIT MAKMUR LESTARI</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.8, margin: 0 }}>Sustainable Growth, Better Future</p>
            </div>
          </div>

          {/* Center Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, margin: '0 0 8px 0' }}>
              PORTAL <span style={{ color: '#4ade80' }}>SAWIT</span>
            </h1>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 500, margin: '0 0 24px 0' }}>Smart Plantation Management</h2>
            <div style={{ width: '50px', height: '4px', backgroundColor: '#4ade80', marginBottom: '32px', borderRadius: '2px' }}></div>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '480px', opacity: 0.9, marginBottom: '48px', margin: '0 0 48px 0' }}>
              {t('login_desc')}
            </p>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '160px' }}>
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(74, 222, 128, 0.5)', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.1)' }}>
                  <Leaf size={24} color="#4ade80" />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{t('feat_efisien')}</h4>
                <p style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.4, margin: 0 }}>{t('feat_efisien_desc')}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '160px' }}>
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(74, 222, 128, 0.5)', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.1)' }}>
                  <BarChart2 size={24} color="#4ade80" />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{t('feat_realtime')}</h4>
                <p style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.4, margin: 0 }}>{t('feat_realtime_desc')}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '160px' }}>
                <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(74, 222, 128, 0.5)', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.1)' }}>
                  <ShieldCheck size={24} color="#4ade80" />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{t('feat_aman')}</h4>
                <p style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.4, margin: 0 }}>{t('feat_aman_desc')}</p>
              </div>
            </div>
          </div>

          {/* Footer Left */}
          <div>
            <p style={{ fontSize: '0.875rem', opacity: 0.6, margin: 0 }}>&copy; 2026 PT. Sawit Makmur Lestari. All rights reserved.</p>
          </div>
        </div>

        {/* Login Form Panel (Right) */}
        <div className="login-right">
          
          {/* Form Card */}
          <div className="login-card">
            
            {/* Language Switcher inside card at top right */}
            <div style={{ position: 'absolute', top: '24px', [isRTL ? 'left' : 'right']: '24px' }} ref={langMenuRef}>
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F7FA', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', padding: '6px 12px', borderRadius: '20px', transition: 'all 0.2s', outline: 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <Globe size={16} color="#94a3b8" />
                {currentLangLabel.split(' ')[1]}
                <ChevronDown size={14} color="#94a3b8" />
              </button>
              
              {langMenuOpen && (
                <div style={{
                  position: 'absolute', top: '100%', [isRTL ? 'left' : 'right']: '0', marginTop: '8px', width: '180px', backgroundColor: '#172235', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', zIndex: 50, display: 'flex', flexDirection: 'column'
                }}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 16px', background: language === lang.code ? 'rgba(74, 222, 128, 0.1)' : 'transparent', border: 'none', color: language === lang.code ? '#4ade80' : '#e2e8f0', fontSize: '0.875rem', fontWeight: language === lang.code ? 600 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', outline: 'none'
                      }}
                      onMouseOver={(e) => { if (language !== lang.code) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                      onMouseOut={(e) => { if (language !== lang.code) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <span>{lang.label}</span>
                      {language === lang.code && <Check size={16} color="#4ade80" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                <Lock size={32} color="#4ade80" />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', margin: 0 }}>
                {t('login_title').split(' ')[0]} <span style={{ color: '#4ade80' }}>{t('login_title').split(' ').slice(1).join(' ')}</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', textAlign: 'center', margin: 0 }}>{t('login_subtitle')}</p>
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>{t('login_username')}</label>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <User size={20} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRTL ? 'right' : 'left']: '16px' }} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('login_username_ph')}
                    style={{ width: '100%', padding: '12px 16px', paddingLeft: isRTL ? '16px' : '48px', paddingRight: isRTL ? '48px' : '16px', fontSize: '1rem', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '12px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = '#4ade80'}
                    onBlur={(e) => e.target.style.borderColor = '#334155'}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#e2e8f0', marginBottom: '8px' }}>{t('login_password')}</label>
                <div style={{ position: 'relative', display: 'flex' }}>
                  <Lock size={20} color="#64748b" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRTL ? 'right' : 'left']: '16px' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login_password_ph')}
                    style={{ width: '100%', padding: '12px 16px', paddingLeft: isRTL ? '48px' : '48px', paddingRight: isRTL ? '48px' : '48px', fontSize: '1rem', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '12px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = '#4ade80'}
                    onBlur={(e) => e.target.style.borderColor = '#334155'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isRTL ? 'left' : 'right']: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" id="remember" style={{ accentColor: '#4ade80', width: '18px', height: '18px', borderRadius: '4px', cursor: 'pointer' }} />
                  <label htmlFor="remember" style={{ fontSize: '0.875rem', color: '#cbd5e1', cursor: 'pointer' }}>{t('login_remember')}</label>
                </div>
                <a href="#" style={{ fontSize: '0.875rem', color: '#4ade80', textDecoration: 'none', fontWeight: 500 }}>{t('login_forgot_pwd')}</a>
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', fontSize: '1.125rem', fontWeight: 600, marginTop: '8px', borderRadius: '12px', backgroundColor: '#4ade80', color: '#064e3b', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background-color 0.2s', outline: 'none' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#22c55e'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4ade80'}>
                <LogIn size={22} />
                {t('login_btn')}
              </button>
            </form>
            
            <div style={{ marginTop: '40px', position: 'relative', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', backgroundColor: '#334155', zIndex: 1 }}></div>
              <span style={{ backgroundColor: '#1e293b', padding: '0 16px', color: '#64748b', fontSize: '0.875rem', position: 'relative', zIndex: 2 }}>
                {t('login_or')}
              </span>
            </div>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
                <Phone size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> 
                {t('login_help')} <a href="#" style={{ color: '#4ade80', textDecoration: 'none' }}>Administrator</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
