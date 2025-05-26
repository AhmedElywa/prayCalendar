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
import { LinkIcon } from '@heroicons/react/24/outline';

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
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      {/* Navigation */}
      <Navigation lang={lang} setLang={setLang} />

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

            {/* Copy Link */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
              <div className="mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">{translations[lang].copy}</h3>
              </div>
              <CopyText text={link} copiedText={translations[lang].copied} />
            </div>
          </div>

          <div className="space-y-6">
            {/* Prayer Preview */}
            <PrayerPreview lang={lang} loadingNext={loadingNext} nextPrayer={nextPrayer} todayTimings={todayTimings} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-10">
          <InstructionsSection lang={lang} />
        </div>
      </div>
    </main>
  );
}
