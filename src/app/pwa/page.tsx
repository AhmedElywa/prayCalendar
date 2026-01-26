'use client';
import { useEffect, useState } from 'react';
import LocationInputs from '../../Components/LocationInputs';
import MethodSelect from '../../Components/MethodSelect';
import PageLayout from '../../Components/PageLayout';
import PrayerPreview from '../../Components/PrayerPreview';
import { translations } from '../../constants/translations';
import { useAppContext } from '../../contexts/AppContext';
import { useTimingsPreview } from '../../hooks';

export default function PrayApp() {
  const { lang, locationFields } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const [method, setMethod] = useState('5');

  useEffect(() => {
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
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
          {translations[lang].pwaPageTitle || 'Prayer View App'}
        </h1>
        {!collapsed && (
          <div className="space-y-4">
            <LocationInputs />
            <MethodSelect method={method} setMethod={setMethod} />
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white"
            >
              {translations[lang].saveSettings || 'Save settings'}
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
              {translations[lang].changeSettings || 'Change settings'}
            </button>
          </div>
        )}
        <PrayerPreview loadingNext={loadingNext} nextPrayer={nextPrayer} todayTimings={todayTimings} />
      </div>
    </PageLayout>
  );
}
