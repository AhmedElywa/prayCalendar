'use client';
import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLanguage, useLocationFields, type Lang } from '../hooks';

interface AppContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  locationFields: ReturnType<typeof useLocationFields>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Always start with 'en' to avoid hydration mismatch
  // The useLanguage hook will handle client-side initialization
  const { lang, setLang } = useLanguage('en');

  const locationFields = useLocationFields();

  useEffect(() => {
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

  useEffect(() => {
    const { inputMode, address, latitude, longitude } = locationFields;
    localStorage.setItem('location', JSON.stringify({ inputMode, address, latitude, longitude }));
  }, [locationFields.inputMode, locationFields.address, locationFields.latitude, locationFields.longitude]);

  const value = { lang, setLang, locationFields };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
