'use client';
import React from 'react';
import { useLanguage, useLocationFields, type Lang } from '../hooks';

interface AppContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  locationFields: ReturnType<typeof useLocationFields>;
}

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('ar') ? 'ar' : 'en';
  const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('lang') as Lang | null) : null;
  const { lang, setLang } = useLanguage(savedLang ?? browserLang);

  const locationFields = useLocationFields();

  React.useEffect(() => {
    const saved = localStorage.getItem('location');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.inputMode === 'address') {
          locationFields.setInputMode('address');
          locationFields.setAddress(data.address || '');
        } else if (data.inputMode === 'coords') {
          locationFields.setInputMode('coords');
          locationFields.setLatitude(data.latitude || '');
          locationFields.setLongitude(data.longitude || '');
        }
      } catch {}
    }
  }, []);

  React.useEffect(() => {
    const { inputMode, address, latitude, longitude } = locationFields;
    localStorage.setItem('location', JSON.stringify({ inputMode, address, latitude, longitude }));
  }, [locationFields.inputMode, locationFields.address, locationFields.latitude, locationFields.longitude]);

  const value = { lang, setLang, locationFields };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
