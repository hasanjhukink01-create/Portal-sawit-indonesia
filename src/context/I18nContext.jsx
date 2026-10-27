import React, { createContext, useState, useEffect, useContext } from 'react';
import translations from '../i18n';

export const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('portal_language') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('portal_language', language);
    // Jika AR (Arabic), ubah atribut dir pada document body/html agar layout LTR/RTL beradaptasi.
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key) => {
    // Membaca dictionary berdasarkan bahasa yang dipilih.
    // Jika translation key tidak ditemukan di bahasa terpilih, fallback ke 'id'.
    // Jika di 'id' juga tidak ada, kembalikan key-nya.
    const dictionary = translations[language] || translations['id'];
    if (dictionary[key] !== undefined) {
      return dictionary[key];
    }
    
    // Fallback ke bahasa Indonesia
    if (translations['id'][key] !== undefined) {
      return translations['id'][key];
    }
    
    return key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, isRTL: language === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
