'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CalendarIntegration from '../Components/CalendarIntegration';
import LocationInputs from '../Components/LocationInputs';
import MethodAndSettings from '../Components/MethodAndSettings';
import PageLayout from '../Components/PageLayout';
import PrayerPreview from '../Components/PrayerPreview';
import { cities } from '../constants/cities';
import { alarmOptionsData, eventNames } from '../constants/prayerData';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import { useTimingsPreview } from '../hooks';
import type { Lang } from '../hooks/useLanguage';
import { decodePreset, encodePreset, type PresetData } from '../lib/preset';
import { bearingToCompass, calculateQiblaBearing } from '../lib/qibla';

const popularCities = cities.sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 10);

export default function HomePage() {
  const { lang, locationFields } = useAppContext();

  /* ---------- other form state ---------- */
  const [method, setMethod] = useState('5');
  const [alarms, setAlarms] = useState<number[]>([5]);
  const [duration, setDuration] = useState(25);
  const [months, setMonths] = useState(3);
  const [prayerLanguage, setPrayerLanguage] = useState<Lang>(lang);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [calendarColor, setCalendarColor] = useState('');

  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [methodValidationErrors, setMethodValidationErrors] = useState(false);
  const [advancedValidationErrors, setAdvancedValidationErrors] = useState(false);

  useEffect(() => {
    setHasValidationErrors(methodValidationErrors || advancedValidationErrors);
  }, [methodValidationErrors, advancedValidationErrors]);

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

  const [travelMode, setTravelMode] = useState(false);
  const [qiblaMode, setQiblaMode] = useState(false);
  const [duaMode, setDuaMode] = useState(false);
  const [iqamaOffsets, setIqamaOffsets] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [jumuahMode, setJumuahMode] = useState(true);
  const [jumuahDuration, setJumuahDuration] = useState(60);
  const [ramadanMode, setRamadanMode] = useState(false);
  const [iftarDuration, setIftarDuration] = useState(30);
  const [traweehDuration, setTraweehDuration] = useState(60);
  const [suhoorDuration, setSuhoorDuration] = useState(30);

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

  const [baseUrl, setBaseUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const presetStr = params.get('preset');
    if (!presetStr) return;
    const p = decodePreset(presetStr);
    if (!p) return;
    if (p.address) locationFields.setAddress(p.address);
    if (p.latitude !== undefined) locationFields.setLatitude(p.latitude);
    if (p.longitude !== undefined) locationFields.setLongitude(p.longitude);
    if (p.method) setMethod(p.method);
    if (p.duration) setDuration(p.duration);
    if (p.months) setMonths(p.months);
    if (p.alarms) setAlarms(p.alarms);
    if (p.events) setSelectedEvents(p.events);
    if (p.travelMode !== undefined) setTravelMode(p.travelMode);
    if (p.jumuahMode !== undefined) setJumuahMode(p.jumuahMode);
    if (p.jumuahDuration) setJumuahDuration(p.jumuahDuration);
    if (p.ramadanMode !== undefined) setRamadanMode(p.ramadanMode);
    if (p.iftarDuration) setIftarDuration(p.iftarDuration);
    if (p.traweehDuration !== undefined) setTraweehDuration(p.traweehDuration);
    if (p.suhoorDuration !== undefined) setSuhoorDuration(p.suhoorDuration);
    if (p.qiblaMode !== undefined) setQiblaMode(p.qiblaMode);
    if (p.duaMode !== undefined) setDuaMode(p.duaMode);
    if (p.iqamaOffsets) setIqamaOffsets(p.iqamaOffsets);
    if (p.calendarColor) setCalendarColor(p.calendarColor);
    if (p.prayerLanguage) setPrayerLanguage(p.prayerLanguage as Lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationFields.setAddress, locationFields.setLatitude, locationFields.setLongitude]);

  const generatePresetUrl = useCallback(() => {
    const preset: PresetData = {
      ...(locationFields.inputMode === 'address'
        ? { address: locationFields.address }
        : { latitude: locationFields.latitude as number, longitude: locationFields.longitude as number }),
      method,
      duration,
      months,
      alarms,
      events: selectedEvents,
      travelMode,
      jumuahMode,
      jumuahDuration,
      ramadanMode,
      iftarDuration,
      traweehDuration,
      suhoorDuration,
      qiblaMode,
      duaMode,
      iqamaOffsets: iqamaOffsets.some((v) => v > 0) ? iqamaOffsets : undefined,
      calendarColor: calendarColor || undefined,
      prayerLanguage,
    };
    const encoded = encodePreset(preset);
    return `${baseUrl}/?preset=${encoded}`;
  }, [
    locationFields,
    method,
    duration,
    months,
    alarms,
    selectedEvents,
    travelMode,
    jumuahMode,
    jumuahDuration,
    ramadanMode,
    iftarDuration,
    traweehDuration,
    suhoorDuration,
    qiblaMode,
    duaMode,
    iqamaOffsets,
    calendarColor,
    prayerLanguage,
    baseUrl,
  ]);

  const eventsParam = selectedEvents.length === allEvents.length ? '' : `&events=${selectedEvents.join(',')}`;
  const alarmParam = alarms.length ? `&alarm=${alarms.join(',')}` : '';
  const monthsParam = months !== 3 ? `&months=${months}` : '';
  const colorParam = calendarColor ? `&color=${encodeURIComponent(calendarColor)}` : '';
  const qiblaParam = qiblaMode ? '&qibla=true' : '';
  const duaParam = duaMode ? '&dua=true' : '';
  const iqamaParam = iqamaOffsets.some((v) => v > 0) ? `&iqama=${iqamaOffsets.join(',')}` : '';
  const travelParam = travelMode ? '&traveler=true' : '';
  const jumuahParam = jumuahMode ? `&jumuah=true&jumuahDuration=${jumuahDuration}` : '';
  const ramadanParam = ramadanMode
    ? `&ramadanMode=true&iftarDuration=${iftarDuration}&traweehDuration=${traweehDuration}&suhoorDuration=${suhoorDuration}`
    : '';
  const locationParam =
    locationFields.inputMode === 'address'
      ? `address=${encodeURIComponent(locationFields.address)}`
      : `latitude=${locationFields.latitude}&longitude=${locationFields.longitude}`;

  const link = baseUrl
    ? `${baseUrl}/api/prayer-times.ics?${locationParam}&method=${method}${alarmParam}&duration=${duration}${monthsParam}${eventsParam}${ramadanParam}${travelParam}${jumuahParam}${qiblaParam}${duaParam}${iqamaParam}${colorParam}&lang=${prayerLanguage}`
    : '';

  const {
    loading: loadingNext,
    nextPrayer,
    todayTimings,
    hijriDate,
  } = useTimingsPreview({
    inputMode: locationFields.inputMode,
    address: locationFields.address,
    latitude: locationFields.latitude,
    longitude: locationFields.longitude,
    method,
    lang,
  });

  // Calculate Qibla direction (needs coordinates)
  const qiblaDirection = useMemo(() => {
    const lat = typeof locationFields.latitude === 'number' ? locationFields.latitude : null;
    const lng = typeof locationFields.longitude === 'number' ? locationFields.longitude : null;
    if (lat === null || lng === null) return null;
    const bearing = calculateQiblaBearing(lat, lng);
    return {
      bearing: Math.round(bearing),
      compass: bearingToCompass(bearing, lang),
    };
  }, [locationFields.latitude, locationFields.longitude, lang]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border-accent bg-gold-glow px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            ☆ {lang === 'ar' ? 'مجاني ومفتوح المصدر' : 'Free & Open Source'}
          </div>
          <h1
            className="mx-auto mb-3 text-[clamp(32px,5vw,48px)] font-bold leading-tight tracking-tight"
            style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--gold-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {translations[lang].title}
          </h1>
          <p className="mx-auto max-w-[520px] text-[17px] font-light text-text-secondary">
            {lang === 'ar'
              ? 'اشترك مرة واحدة. احصل على أوقات صلاة دقيقة متزامنة مع تقويم جوجل أو آبل أو أوتلوك — يتم تحديثها تلقائيًا.'
              : 'Subscribe once. Get accurate prayer times synced to Google, Apple, or Outlook — updated automatically.'}
          </p>

          {/* Popular cities */}
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="rounded-full border border-border-subtle bg-bg-card px-4 py-1.5 text-[13px] text-text-secondary no-underline transition hover:translate-y-[-1px] hover:border-border-accent hover:bg-gold-glow hover:text-gold-light"
              >
                {city.flag} {city.name[lang] || city.name.en}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="mx-auto max-w-[1200px] px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left column */}
          <div className="space-y-5">
            <LocationInputs />
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
              qiblaMode={qiblaMode}
              setQiblaMode={setQiblaMode}
              duaMode={duaMode}
              setDuaMode={setDuaMode}
              iqamaOffsets={iqamaOffsets}
              setIqamaOffsets={setIqamaOffsets}
              travelMode={travelMode}
              setTravelMode={setTravelMode}
              jumuahMode={jumuahMode}
              setJumuahMode={setJumuahMode}
              jumuahDuration={jumuahDuration}
              setJumuahDuration={setJumuahDuration}
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
            <CalendarIntegration
              link={link}
              hasValidationErrors={hasValidationErrors}
              calendarColor={calendarColor}
              setCalendarColor={setCalendarColor}
              generatePresetUrl={generatePresetUrl}
            />
          </div>

          {/* Right column */}
          <div>
            <PrayerPreview
              loadingNext={loadingNext}
              nextPrayer={nextPrayer}
              todayTimings={todayTimings}
              hijriDate={hijriDate}
              ramadanMode={ramadanMode}
              iftarDuration={iftarDuration}
              traweehDuration={traweehDuration}
              suhoorDuration={suhoorDuration}
              qiblaDirection={qiblaDirection}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
