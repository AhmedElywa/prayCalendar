import React from 'react';
import CopyText from 'Components/CopyText';
import defaultMethod from 'Components/defaultMethod';
import ThemeMenu from 'Components/Theme';

type Lang = 'en' | 'ar';
type InputMode = 'address' | 'coords';

const translations = {
  en: {
    title: 'Generate Prayer Calendar Subscription Link',
    addressRadio: 'By address',
    coordsRadio: 'By coordinates (lat/lon)',
    address: 'Location',
    addressHint: '(City, State, Country - English)',
    useLocation: 'Use my location',
    locating: 'Locating…',
    addressPlaceholder: 'City, State, Country - eg. Cairo, Egypt',
    method: 'Method',
    duration: 'Alarm ring duration (min)',
    months: 'Calendar length (months)',
    selectAlarms: 'Select Alarms',
    selectEvents: 'Select Prayer Events',
    copy: 'Copy subscribe link',
    source: 'Source Code',
    creator: 'Creator',
    editHint: 'You can edit the subscribe link and add arguments from the docs',
    docsAnchor: 'Prayer Times Calendar by address',
    docsLinkText: 'Full Docs Here',
    googleTitle: 'To add a calendar subscription link to Google Calendar, follow these steps:',
    googleSteps: [
      'Open Google Calendar in a web browser.',
      'Click the "Add calendar" button in the left sidebar.',
      'Select "From URL" from the menu.',
      'Paste the calendar subscription link into the "URL" field.',
      'Click the "Add Calendar" button.',
      'The calendar should now appear in your list of calendars in Google Calendar.',
    ],
    outlookTitle: 'To add a calendar subscription link to Microsoft Outlook, follow these steps:',
    outlookSteps: [
      'Open Microsoft Outlook in a web browser.',
      'Click the "Calendar" button in the left sidebar.',
      'Click the "Open calendar" button in the top menu, and select "From Internet" from the menu.',
      'Paste the calendar subscription link into the "Link to the calendar" field.',
      'Click the "OK" button.',
      'The calendar should now appear in your list of calendars in Microsoft Outlook.',
    ],
    appleTitle: 'To add a calendar subscription link to Apple Calendar, follow these steps:',
    appleSteps: [
      'Open Apple Calendar.',
      'Click the "File" menu, and select "New Calendar Subscription" from the menu.',
      'Paste the calendar subscription link into the "Calendar URL" field.',
      'Click the "Subscribe" button.',
      'The calendar should now appear in your list of calendars in Apple Calendar.',
    ],
    advanced: 'Advanced options',
    copied: 'Copied!',
    nextPrayer: 'Next prayer',
    inLabel: 'in',
    loadingNext: 'Loading next prayer…',
    eventsToday: "Today's prayer times",
  },
  ar: {
    title: 'إنشاء رابط اشتراك تقويم الصلاة',
    addressRadio: 'عن طريق العنوان',
    coordsRadio: 'عن طريق الإحداثيات (خطّ العرض/خطّ الطول)',
    address: 'الموقع',
    addressHint: '(المدينة، الولاية، الدولة - بالإنجليزية)',
    useLocation: 'استخدم موقعي',
    locating: 'جارٍ تحديد الموقع…',
    addressPlaceholder: 'City, State, Country - eg. Cairo, Egypt',
    method: 'طريقة الحساب',
    duration: 'مدة تنبيه الأذان (دقيقة)',
    months: 'طول التقويم (أشهر)',
    selectAlarms: 'اختر التنبيهات',
    selectEvents: 'اختر الصلوات',
    copy: 'انسخ رابط الاشتراك',
    source: 'المصدر',
    creator: 'المطور',
    editHint: 'يمكنك تعديل رابط الاشتراك وإضافة معاملات من المستندات',
    docsAnchor: 'تقويم أوقات الصلاة حسب العنوان',
    docsLinkText: 'التوثيق الكامل هنا',
    googleTitle: 'لإضافة رابط اشتراك التقويم إلى تقويم جوجل، اتبع الخطوات التالية:',
    googleSteps: [
      'افتح تقويم جوجل في متصفح الويب.',
      'انقر على زر "إضافة تقويم" في الشريط الجانبي الأيسر.',
      'اختر "من رابط URL" من القائمة.',
      'الصق رابط اشتراك التقويم في حقل "URL".',
      'انقر على زر "إضافة تقويم".',
      'سيظهر التقويم الآن في قائمة تقاويمك في تقويم جوجل.',
    ],
    outlookTitle: 'لإضافة رابط اشتراك التقويم إلى مايكروسوفت أوتلوك، اتبع الخطوات التالية:',
    outlookSteps: [
      'افتح مايكروسوفت أوتلوك في متصفح الويب.',
      'انقر على زر "التقويم" في الشريط الجانبي الأيسر.',
      'انقر على زر "فتح تقويم" في القائمة العلوية، واختر "من الإنترنت" من القائمة.',
      'الصق رابط اشتراك التقويم في حقل "رابط التقويم".',
      'انقر على زر "موافق".',
      'سيظهر التقويم الآن في قائمة تقاويمك في مايكروسوفت أوتلوك.',
    ],
    appleTitle: 'لإضافة رابط اشتراك التقويم إلى تقويم آبل، اتبع الخطوات التالية:',
    appleSteps: [
      'افتح تقويم آبل.',
      'انقر على قائمة "ملف"، واختر "اشتراك تقويم جديد" من القائمة.',
      'الصق رابط اشتراك التقويم في حقل "URL التقويم".',
      'انقر على زر "اشتراك".',
      'سيظهر التقويم الآن في قائمة تقاويمك في تقويم آبل.',
    ],
    advanced: 'خيارات متقدمة',
    copied: 'تم النسخ!',
    nextPrayer: 'الصلاة التالية',
    inLabel: 'بعد',
    loadingNext: 'جارٍ تحميل الصلاة التالية…',
    eventsToday: 'مواقيت صلاة اليوم',
  },
};

const eventNames = {
  en: ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'],
  ar: ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء', 'منتصف الليل'],
};

const alarmOptionsData = [
  { value: 5, label: { en: '5 minutes before', ar: 'قبل 5 دقائق' } },
  { value: 10, label: { en: '10 minutes before', ar: 'قبل 10 دقائق' } },
  { value: 15, label: { en: '15 minutes before', ar: 'قبل 15 دقيقة' } },
  { value: 30, label: { en: '30 minutes before', ar: 'قبل 30 دقيقة' } },
  { value: 0, label: { en: 'In the time', ar: 'في الموعد' } },
  { value: -5, label: { en: '5 minutes after', ar: 'بعد 5 دقائق' } },
  { value: -10, label: { en: '10 minutes after', ar: 'بعد 10 دقائق' } },
];

/* ------------------------------------------------------------------ */
/*  Custom hooks                                                      */
/* ------------------------------------------------------------------ */

/** language (en/ar) + document dir */
function useLanguage(initial: Lang) {
  const [lang, setLang] = React.useState<Lang>(initial);
  React.useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  return { lang, setLang };
}

/** location mode & fields + geolocation helper */
function useLocationFields() {
  const [inputMode, setInputMode] = React.useState<InputMode>('address');
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState<number | ''>('');
  const [longitude, setLongitude] = React.useState<number | ''>('');
  const [locating, setLocating] = React.useState(false);

  // reset opposite fields when mode toggles
  React.useEffect(() => {
    if (inputMode === 'address') {
      setLatitude('');
      setLongitude('');
    } else {
      setAddress('');
    }
  }, [inputMode]);

  const handleUseLocation = React.useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        if (inputMode === 'coords') {
          setLatitude(lat);
          setLongitude(lon);
        } else {
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
              headers: { 'User-Agent': 'pray-calendar-app' },
            });
            const j = await r.json();
            const a = j.address || {};
            // Prefer city → town → village; then state & country
            const city = a.city || a.town || a.village || '';
            const state = a.state || a.county || '';
            const country = a.country || '';
            const formatted = [city, state, country].filter(Boolean).join(', ');
            setAddress(formatted || `${lat},${lon}`);
          } catch {
            setAddress(`${lat},${lon}`);
          }
        }
        setLocating(false);
      },
      () => setLocating(false),
    );
  }, [inputMode]);

  return {
    inputMode,
    setInputMode,
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    locating,
    handleUseLocation,
  };
}

/** fetch next‑prayer & today's timetable */
function useTimingsPreview(deps: {
  inputMode: InputMode;
  address: string;
  latitude: number | '';
  longitude: number | '';
  method: string;
  lang: Lang;
}) {
  const { inputMode, address, latitude, longitude, method, lang } = deps;
  const [loading, setLoading] = React.useState(false);
  const [nextPrayer, setNextPrayer] = React.useState<{ name: string; diffMs: number } | null>(null);
  const [todayTimings, setTodayTimings] = React.useState<Record<string, string> | null>(null);

  React.useEffect(() => {
    if ((inputMode === 'address' && !address) || (inputMode === 'coords' && (latitude === '' || longitude === ''))) {
      setNextPrayer(null);
      setTodayTimings(null);
      return;
    }
    const fetchToday = async () => {
      setLoading(true);
      try {
        const url =
          inputMode === 'address'
            ? `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(address)}&method=${method}`
            : `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;
        const j = await (await fetch(url)).json();
        if (j.code !== 200) throw new Error();
        const timings: Record<string, string> = j.data.timings;
        setTodayTimings(timings);

        const order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
        const now = new Date();
        let upcoming: { name: string; diffMs: number } | null = null;
        for (const ev of order) {
          const [h, m] = timings[ev].split(':').map(Number);
          const d = new Date(now);
          d.setHours(h, m, 0, 0);
          if (d > now) {
            upcoming = { name: ev, diffMs: d.getTime() - now.getTime() };
            break;
          }
        }
        setNextPrayer(upcoming);
      } catch {
        setNextPrayer(null);
        setTodayTimings(null);
      } finally {
        setLoading(false);
      }
    };
    fetchToday();
  }, [inputMode, address, latitude, longitude, method, lang]);

  return { loading, nextPrayer, todayTimings };
}

const Index: React.FC = () => {
  /* ---------- language ---------- */
  const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('ar') ? 'ar' : 'en';
  const { lang, setLang } = useLanguage(browserLang);
  const {
    inputMode,
    setInputMode,
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    locating,
    handleUseLocation,
  } = useLocationFields();

  /* ---------- location mode & fields ---------- */

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
    inputMode === 'address' ? `address=${encodeURIComponent(address)}` : `latitude=${latitude}&longitude=${longitude}`;

  const link = `https://pray.ahmedelywa.com/api/prayer-times.ics?${locationParam}&method=${method}${alarmParam}&duration=${duration}${monthsParam}${eventsParam}&lang=${lang}`;

  /* ---------- helpers ---------- */
  const formatDiff = (ms: number) => {
    const mins = Math.round(ms / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h ? `${h}h ` : ''}${m}m`;
  };
  const localizePrayer = (name: string) => {
    const idx = eventNames.en.indexOf(name);
    return idx === -1 ? name : eventNames[lang][idx];
  };

  // timings preview hook
  const {
    loading: loadingNext,
    nextPrayer,
    todayTimings,
  } = useTimingsPreview({
    inputMode,
    address,
    latitude,
    longitude,
    method,
    lang,
  });

  /* ================================================================== */
  /*  Render                                                            */
  /* ================================================================== */
  return (
    <div className="mx-auto mb-6 flex min-h-screen max-w-screen-lg flex-col space-y-8 bg-gray-50 px-4 text-gray-900 dark:bg-zinc-800 dark:text-gray-100">
      {/* nav ---------------------------------------------------------- */}
      <nav className="py-4 print:hidden">
        <div className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AhmedElywa/prayCalendar"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {translations[lang].source}
            </a>
            <a href="https://ahmedelywa.com" className="hover:underline">
              {translations[lang].creator}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeMenu />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </nav>

      {/* title & mode toggle ----------------------------------------- */}
      <h1 className="text-2xl font-bold">{translations[lang].title}</h1>
      <fieldset className="flex gap-6">
        <label className="flex cursor-pointer items-center gap-1">
          <input
            type="radio"
            name="locmode"
            value="address"
            checked={inputMode === 'address'}
            onChange={() => setInputMode('address')}
          />
          <span>{translations[lang].addressRadio}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-1">
          <input
            type="radio"
            name="locmode"
            value="coords"
            checked={inputMode === 'coords'}
            onChange={() => setInputMode('coords')}
          />
          <span>{translations[lang].coordsRadio}</span>
        </label>
      </fieldset>

      {/* location inputs --------------------------------------------- */}
      {inputMode === 'address' && (
        <label className="flex flex-col gap-2 font-medium">
          <div className="flex items-center gap-2">
            {translations[lang].address}
            <span className="text-sm font-normal text-gray-500">{translations[lang].addressHint}</span>
          </div>
          <input
            placeholder={translations[lang].addressPlaceholder}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="button"
            onClick={handleUseLocation}
            className="w-max rounded-md border border-sky-400 px-2 py-1 text-sm hover:bg-sky-50 dark:hover:bg-gray-700"
          >
            {locating ? translations[lang].locating : translations[lang].useLocation}
          </button>
        </label>
      )}

      {inputMode === 'coords' && (
        <div className="grid grid-cols-1 gap-2 font-medium md:grid-cols-2">
          <label className="flex flex-col gap-2">
            Latitude
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              placeholder="30.0444"
              className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
            />
          </label>
          <label className="flex flex-col gap-2">
            Longitude
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              placeholder="31.2357"
              className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
            />
          </label>
          <button
            type="button"
            onClick={handleUseLocation}
            className="col-span-full w-max rounded-md border border-sky-400 px-2 py-1 text-sm hover:bg-sky-50 dark:hover:bg-gray-700"
          >
            {locating ? translations[lang].locating : translations[lang].useLocation}
          </button>
        </div>
      )}

      {/* method & misc inputs ---------------------------------------- */}
      <label className="flex flex-col gap-2 font-medium">
        {translations[lang].method}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
        >
          {defaultMethod.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label[lang]}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <label className="flex flex-col gap-2 font-medium">
          {translations[lang].duration}
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(+e.target.value)}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
          />
        </label>
        <label className="flex flex-col gap-2 font-medium">
          {translations[lang].months}
          <input
            type="number"
            min={1}
            max={12}
            value={months}
            onChange={(e) => setMonths(+e.target.value)}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
          />
        </label>
      </div>

      {/* advanced accordion ----------------------------------------- */}
      <details
        open={showAdvanced}
        onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}
        className="rounded-md border border-sky-400 bg-white p-4 dark:bg-gray-800"
      >
        <summary className="cursor-pointer font-semibold">{translations[lang].advanced}</summary>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="font-medium">{translations[lang].selectAlarms}</div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {alarmOptionsData.map((o) => (
                <label key={o.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={alarms.includes(o.value)}
                    onChange={() => handleAlarmToggle(o.value)}
                    className="h-4 w-4"
                  />
                  <span>{o.label[lang]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">{translations[lang].selectEvents}</div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {allEvents.map((ev, i) => (
                <label key={ev} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(i)}
                    onChange={() => handleEventToggle(i)}
                    className="h-4 w-4"
                  />
                  <span>{ev}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* live preview ------------------------------------------------- */}
      <div className="mt-2 font-medium">
        {loadingNext
          ? translations[lang].loadingNext
          : nextPrayer && (
              <>
                {translations[lang].nextPrayer}: {localizePrayer(nextPrayer.name)} {translations[lang].inLabel}{' '}
                {formatDiff(nextPrayer.diffMs)}
              </>
            )}
      </div>

      {/* copy link & today timings ----------------------------------- */}
      <div className="flex max-w-full flex-col">
        <div className="font-semibold">{translations[lang].copy}</div>
        <CopyText text={link} copiedText={translations[lang].copied} />

        {todayTimings && (
          <div className="mt-4 rounded-md border border-sky-400 p-4 dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold">{translations[lang].eventsToday}</h3>
            <ul className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
              {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'].map((ev) => (
                <li key={ev} className="flex justify-between border-b border-gray-200 px-6 py-2">
                  <span>{localizePrayer(ev)}</span>
                  <span className="font-mono">{todayTimings[ev]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="font-bold">
        <span className="animate-ping text-5xl">👉 </span>
        {translations[lang].editHint}{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://aladhan.com/prayer-times-api#tag/Monthly-Annual-Prayer-Times-Calendar/paths/~1v1~1calendarByAddress~1%7Byear%7D~1%7Bmonth%7D/get"
          target="_blank"
          rel="noreferrer"
        >
          {translations[lang].docsAnchor}
        </a>
      </div>
      <h2 className="font-bold">
        {translations[lang].googleTitle}{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DDesktop"
          target="_blank"
          rel="noreferrer"
        >
          {translations[lang].docsLinkText}
        </a>
      </h2>
      <ul className="my-4 list-decimal pl-6 text-lg leading-7">
        {translations[lang].googleSteps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ul>
      <h2 className="font-bold">
        {translations[lang].outlookTitle}{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
          target="_blank"
          rel="noreferrer"
        >
          {translations[lang].docsLinkText}
        </a>
      </h2>
      <ul className="my-4 list-decimal pl-6 text-lg leading-7">
        {translations[lang].outlookSteps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ul>
      <div>
        <h2 className="font-bold">
          {translations[lang].appleTitle}{' '}
          <a
            className="text-blue-300 hover:underline"
            href="https://support.apple.com/en-eg/102301"
            target="_blank"
            rel="noreferrer"
          >
            {translations[lang].docsLinkText}
          </a>
        </h2>
        <ul className="my-4 list-decimal pl-6 text-lg leading-7">
          {translations[lang].appleSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;
