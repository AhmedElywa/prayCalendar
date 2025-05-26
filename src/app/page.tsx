'use client';

import React from 'react';
import CopyText from '../Components/CopyText';
import Navigation from '../Components/Navigation';
import LocationInputs from '../Components/LocationInputs';
import MethodAndSettings from '../Components/MethodAndSettings';
import AdvancedOptions from '../Components/AdvancedOptions';
import PrayerPreview from '../Components/PrayerPreview';
import InstructionsSection from '../Components/InstructionsSection';
import { useLanguage, useLocationFields, useTimingsPreview } from '../hooks';
import { translations } from '../constants/translations';
import { eventNames, alarmOptionsData } from '../constants/prayerData';

export default function HomePage() {
  /* ---------- language ---------- */
  const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('ar') ? 'ar' : 'en';
  const { lang, setLang } = useLanguage(browserLang);

  /* ---------- location fields ---------- */
  const locationFields = useLocationFields();

  /* ---------- other form state ---------- */
  const [method, setMethod] = React.useState('5');
  const [alarms, setAlarms] = React.useState<number[]>([5]);
  const [duration, setDuration] = React.useState(25);
  const [months, setMonths] = React.useState(3);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  /* ---------- events selection ---------- */
  const alarmOrder = alarmOptionsData.map((o) => o.value);
  const allEvents = React.useMemo(() => eventNames[lang], [lang]);
  const [selectedEvents, setSelectedEvents] = React.useState<number[]>(eventNames.en.map((_, i) => i));

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
  const eventsParam = selectedEvents.length === allEvents.length ? '' : `&events=${selectedEvents.join(',')}`;
  const alarmParam = alarms.length ? `&alarm=${alarms.join(',')}` : '';
  const monthsParam = months !== 3 ? `&months=${months}` : '';
  const locationParam =
    locationFields.inputMode === 'address'
      ? `address=${encodeURIComponent(locationFields.address)}`
      : `latitude=${locationFields.latitude}&longitude=${locationFields.longitude}`;

  const link = `https://pray.ahmedelywa.com/api/prayer-times.ics?${locationParam}&method=${method}${alarmParam}&duration=${duration}${monthsParam}${eventsParam}&lang=${lang}`;

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
    <div className="mx-auto mb-6 flex min-h-screen max-w-screen-lg flex-col space-y-8 bg-gray-50 px-4 text-gray-900 dark:bg-zinc-800 dark:text-gray-100">
      {/* Navigation */}
      <Navigation lang={lang} setLang={setLang} />

      {/* Title */}
      <h1 className="text-2xl font-bold">{translations[lang].title}</h1>

      {/* Location Inputs */}
      <LocationInputs lang={lang} {...locationFields} />

      {/* Method and Settings */}
      <MethodAndSettings
        lang={lang}
        method={method}
        setMethod={setMethod}
        duration={duration}
        setDuration={setDuration}
        months={months}
        setMonths={setMonths}
      />

      {/* Advanced Options */}
      <AdvancedOptions
        lang={lang}
        showAdvanced={showAdvanced}
        setShowAdvanced={setShowAdvanced}
        alarms={alarms}
        handleAlarmToggle={handleAlarmToggle}
        allEvents={allEvents}
        selectedEvents={selectedEvents}
        handleEventToggle={handleEventToggle}
      />

      {/* Prayer Preview */}
      <PrayerPreview lang={lang} loadingNext={loadingNext} nextPrayer={nextPrayer} todayTimings={todayTimings} />

      {/* Copy Link */}
      <div className="flex max-w-full flex-col">
        <div className="font-semibold">{translations[lang].copy}</div>
        <CopyText text={link} copiedText={translations[lang].copied} />
      </div>

      {/* Instructions */}
      <InstructionsSection lang={lang} />
    </div>
  );
}
