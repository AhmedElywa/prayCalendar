'use client';
import React from 'react';
import LocationInputs from '../../Components/LocationInputs';
import PrayerPreview from '../../Components/PrayerPreview';
import MethodSelect from '../../Components/MethodSelect';
import PageLayout from '../../Components/PageLayout';
import { useAppContext } from '../../contexts/AppContext';
import { useTimingsPreview } from '../../hooks';
import { translations } from '../../constants/translations';

export default function PrayApp() {
  const { lang, setLang, locationFields } = useAppContext();
  const [collapsed, setCollapsed] = React.useState(false);
  const [method, setMethod] = React.useState('5');

  React.useEffect(() => {
    const savedLoc = localStorage.getItem('location');
    if (savedLoc) setCollapsed(true);
    const savedMethod = localStorage.getItem('pwaMethod');
    if (savedMethod) setMethod(savedMethod);
  }, []);

  const handleSave = () => {
    localStorage.setItem('pwaMethod', method);
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
    method,
    lang,
  });

  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-sm space-y-6 px-4 py-8">
        {!collapsed && (
          <div className="space-y-4">
            <LocationInputs lang={lang} {...locationFields} />
            <MethodSelect lang={lang} method={method} setMethod={setMethod} />
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
        {collapsed && <MethodSelect lang={lang} method={method} setMethod={setMethod} />}
        <PrayerPreview lang={lang} loadingNext={loadingNext} nextPrayer={nextPrayer} todayTimings={todayTimings} />
      </div>
    </PageLayout>
  );
}
