'use client';
import React from 'react';
import Navigation from '../../Components/Navigation';
import LocationInputs from '../../Components/LocationInputs';
import PrayerPreview from '../../Components/PrayerPreview';
import { useLanguage, useLocationFields, useTimingsPreview } from '../../hooks';
import { translations } from '../../constants/translations';

export default function PrayApp() {
  const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('ar') ? 'ar' : 'en';
  const { lang, setLang } = useLanguage(browserLang);

  const locationFields = useLocationFields();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('pwaLocation');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.inputMode === 'address') {
          locationFields.setInputMode('address');
          locationFields.setAddress(data.address || '');
        } else {
          locationFields.setInputMode('coords');
          locationFields.setLatitude(data.latitude || '');
          locationFields.setLongitude(data.longitude || '');
        }
        setCollapsed(true);
      } catch {}
    }
  }, []);

  const handleSave = () => {
    const { inputMode, address, latitude, longitude } = locationFields;
    localStorage.setItem('pwaLocation', JSON.stringify({ inputMode, address, latitude, longitude }));
    setCollapsed(true);
  };

  const {
    loading: loadingNext,
    nextPrayer,
    todayTimings,
  } = useTimingsPreview({
    inputMode: locationFields.inputMode,
    address: locationFields.address,
    latitude: locationFields.latitude,
    longitude: locationFields.longitude,
    method: '5',
    lang,
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      <Navigation lang={lang} setLang={setLang} />
      <div className="mx-auto max-w-screen-sm space-y-6 px-4 py-8">
        {!collapsed && (
          <div className="space-y-4">
            <LocationInputs lang={lang} {...locationFields} />
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white"
            >
              {translations[lang].saveLocation || 'Save location'}
            </button>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="text-sm text-sky-600 dark:text-sky-400"
            >
              {translations[lang].changeLocation || 'Change location'}
            </button>
          </div>
        )}
        <PrayerPreview lang={lang} loadingNext={loadingNext} nextPrayer={nextPrayer} todayTimings={todayTimings} />
      </div>
    </main>
  );
}
