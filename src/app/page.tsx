'use client';

import { useEffect, useMemo, useState } from 'react';
import CalendarIntegration from '../Components/CalendarIntegration';
import LocationInputs from '../Components/LocationInputs';
import MethodAndSettings from '../Components/MethodAndSettings';
import PageLayout from '../Components/PageLayout';
import PrayerPreview from '../Components/PrayerPreview';
import { alarmOptionsData, eventNames } from '../constants/prayerData';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import { useTimingsPreview } from '../hooks';
import type { Lang } from '../hooks/useLanguage';

export default function HomePage() {
  const { lang, locationFields } = useAppContext();

  /* ---------- other form state ---------- */
  const [method, setMethod] = useState('5');
  const [alarms, setAlarms] = useState<number[]>([5]);
  const [duration, setDuration] = useState(25);
  const [months, setMonths] = useState(3);
  const [prayerLanguage, setPrayerLanguage] = useState<Lang>(lang); // Default to app language
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Validation states
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [methodValidationErrors, setMethodValidationErrors] = useState(false);
  const [advancedValidationErrors, setAdvancedValidationErrors] = useState(false);

  // Combine validation errors from both components
  useEffect(() => {
    setHasValidationErrors(methodValidationErrors || advancedValidationErrors);
  }, [methodValidationErrors, advancedValidationErrors]);

  // Update prayer language when app language changes (unless user has explicitly set a different prayer language)
  const [userSetPrayerLanguage, setUserSetPrayerLanguage] = useState(false);
  useEffect(() => {
    if (!userSetPrayerLanguage) {
      setPrayerLanguage(lang);
    }
  }, [lang, userSetPrayerLanguage]);

  const handlePrayerLanguageChange = (newLang: Lang) => {
    setPrayerLanguage(newLang);
    setUserSetPrayerLanguage(true);
  };

  /* ---------- Ramadan mode state ---------- */
  const [ramadanMode, setRamadanMode] = useState(false);
  const [iftarDuration, setIftarDuration] = useState(30);
  const [traweehDuration, setTraweehDuration] = useState(60);
  const [suhoorDuration, setSuhoorDuration] = useState(30);

  /* ---------- events selection ---------- */
  const alarmOrder = alarmOptionsData.map((o) => o.value);
  const allEvents = useMemo(() => eventNames[lang], [lang]);
  const [selectedEvents, setSelectedEvents] = useState<number[]>(eventNames.en.map((_, i) => i));

  const handleAlarmToggle = (v: number) =>
    setAlarms((prev) =>
      (prev.includes(v) ? prev.filter((a) => a !== v) : [...prev, v]).sort(
        (a, b) => alarmOrder.indexOf(a) - alarmOrder.indexOf(b),
      ),
    );
  const handleEventToggle = (idx: number) =>
    setSelectedEvents((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx].sort((a, b) => a - b),
    );

  /* ---------- build ICS link ---------- */
  const [baseUrl, setBaseUrl] = useState('');

  // Get current domain and protocol from browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const eventsParam = selectedEvents.length === allEvents.length ? '' : `&events=${selectedEvents.join(',')}`;
  const alarmParam = alarms.length ? `&alarm=${alarms.join(',')}` : '';
  const monthsParam = months !== 3 ? `&months=${months}` : '';
  const ramadanParam = ramadanMode
    ? `&ramadanMode=true&iftarDuration=${iftarDuration}&traweehDuration=${traweehDuration}&suhoorDuration=${suhoorDuration}`
    : '';
  const locationParam =
    locationFields.inputMode === 'address'
      ? `address=${encodeURIComponent(locationFields.address)}`
      : `latitude=${locationFields.latitude}&longitude=${locationFields.longitude}`;

  const link = baseUrl
    ? `${baseUrl}/api/prayer-times.ics?${locationParam}&method=${method}${alarmParam}&duration=${duration}${monthsParam}${eventsParam}${ramadanParam}&lang=${prayerLanguage}`
    : '';

  // timings preview hook
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

  /* ================================================================== */
  /*  Render                                                            */
  /* ================================================================== */
  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-lg px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{translations[lang].title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Generate accurate prayer times and subscribe to your calendar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Location Inputs */}
            <LocationInputs />

            {/* method and settings with advanced options */}
            <MethodAndSettings
              method={method}
              setMethod={setMethod}
              duration={duration}
              setDuration={setDuration}
              months={months}
              setMonths={setMonths}
              prayerLanguage={prayerLanguage}
              setPrayerLanguage={handlePrayerLanguageChange}
              onValidationChange={setMethodValidationErrors}
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              alarms={alarms}
              handleAlarmToggle={handleAlarmToggle}
              allEvents={allEvents}
              selectedEvents={selectedEvents}
              handleEventToggle={handleEventToggle}
              ramadanMode={ramadanMode}
              setRamadanMode={setRamadanMode}
              iftarDuration={iftarDuration}
              setIftarDuration={setIftarDuration}
              traweehDuration={traweehDuration}
              setTraweehDuration={setTraweehDuration}
              suhoorDuration={suhoorDuration}
              setSuhoorDuration={setSuhoorDuration}
              onAdvancedValidationChange={setAdvancedValidationErrors}
            />

            {/* Calendar Integration */}
            <CalendarIntegration link={link} hasValidationErrors={hasValidationErrors} />
          </div>

          <div className="space-y-6">
            {/* Prayer Preview */}
            <PrayerPreview
              loadingNext={loadingNext}
              nextPrayer={nextPrayer}
              todayTimings={todayTimings}
              ramadanMode={ramadanMode}
              iftarDuration={iftarDuration}
              traweehDuration={traweehDuration}
              suhoorDuration={suhoorDuration}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
