import React from 'react';
import CopyText from 'Components/CopyText';
import defaultMethod from 'Components/defaultMethod';
import ThemeMenu from 'Components/Theme';

type Lang = 'en' | 'ar';

const translations = {
  en: {
    title: 'Generate Pray Calendar Subscribe link',
    address: 'Address',
    addressHint: '(must be in English)',
    addressPlaceholder: 'City, State, Country - eg. Cairo, Egypt',
    method: 'Method',
    duration: 'Duration (minutes)',
    months: 'Number of months',
    selectAlarms: 'Select Alarms',
    selectEvents: 'Select Prayer Events',
    copy: 'Copy this link:',
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
  },
  ar: {
    title: 'إنشاء رابط تقويم الصلاة',
    address: 'العنوان',
    addressHint: '(يجب أن يكون الإدخال باللغة الإنجليزية)',
    addressPlaceholder: 'City, State, Country - eg. Cairo, Egypt',
    method: 'طريقة الحساب',
    duration: 'المدة (بالدقائق)',
    months: 'عدد الأشهر',
    selectAlarms: 'اختر التنبيهات',
    selectEvents: 'اختر الصلوات',
    copy: 'انسخ هذا الرابط:',
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

const Index: React.FC = () => {
  const browserLang = typeof navigator !== 'undefined' && navigator.language.startsWith('ar') ? 'ar' : 'en';
  const [lang, setLang] = React.useState<Lang>(browserLang);

  const [address, setAddress] = React.useState('');
  const [method, setMethod] = React.useState('5');
  React.useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored) setLang(stored);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('lang', lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const alarmOptions = alarmOptionsData;
  const alarmOrder = alarmOptions.map((o) => o.value);
  const [alarms, setAlarms] = React.useState<number[]>([5]);
  const [duration, setDuration] = React.useState(25);
  const [months, setMonths] = React.useState(3);

  const allEvents = React.useMemo(() => eventNames[lang], [lang]);
  const [selectedEvents, setSelectedEvents] = React.useState<number[]>(eventNames.en.map((_, index) => index));

  const handleEventToggle = (index: number) => {
    setSelectedEvents((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort((a, b) => a - b),
    );
  };

  const handleAlarmToggle = (value: number) => {
    setAlarms((prev) => {
      const exists = prev.includes(value);
      const updated = exists ? prev.filter((a) => a !== value) : [...prev, value];
      return updated.sort((a, b) => alarmOrder.indexOf(a) - alarmOrder.indexOf(b));
    });
  };

  const eventsParam = selectedEvents.length === allEvents.length ? '' : `&events=${selectedEvents.join(',')}`;
  const alarmParam = alarms.length ? `&alarm=${alarms.join(',')}` : '';
  const monthsParam = months !== 3 ? `&months=${months}` : '';

  const link = `https://pray.ahmedelywa.com/api/prayer-times.ics?address=${encodeURIComponent(
    address,
  )}&method=${method}${alarmParam}&duration=${duration}${monthsParam}${eventsParam}&lang=${lang}`;

  return (
    <div className="mx-auto mb-6 flex min-h-screen max-w-screen-lg flex-col space-y-8 bg-gray-50 px-4 text-gray-900 selection:bg-gray-800 selection:text-gray-100 dark:bg-zinc-800 dark:text-gray-100 dark:selection:bg-gray-100 dark:selection:text-gray-900">
      <nav id="home" className="relative w-full py-4 print:hidden">
        <div className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AhmedElywa/prayCalendar"
              target="_blank"
              className="cursor-pointer hover:underline"
              rel="noreferrer"
            >
              {translations[lang].source}
            </a>
            <a href="https://ahmedelywa.com" className="cursor-pointer hover:underline">
              {translations[lang].creator}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeMenu />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </nav>
      <h1 className="text-2xl font-bold">{translations[lang].title}</h1>
      <label htmlFor="address" className="flex flex-col gap-2 font-medium">
        <div className="flex items-center gap-2">
          {translations[lang].address}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{translations[lang].addressHint}</span>
        </div>
        <input
          id="address"
          name="address"
          placeholder={translations[lang].addressPlaceholder}
          className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <label className="flex flex-col gap-2 font-medium">
        {translations[lang].method}
        <select
          defaultValue={method}
          onChange={(event) => setMethod(event.target.value)}
          className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
        >
          {defaultMethod.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label[lang]}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <label className="flex flex-col gap-2 font-medium">
          {translations[lang].duration}
          <input
            id="duration"
            name="duration"
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
            value={duration}
            type="number"
            onChange={(event) => setDuration(+event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 font-medium">
          {translations[lang].months}
          <input
            id="months"
            name="months"
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
            value={months}
            type="number"
            min="1"
            max="12"
            onChange={(event) => setMonths(+event.target.value)}
          />
        </label>
      </div>

      <div className="space-y-2">
        <div className="font-medium">{translations[lang].selectAlarms}</div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {alarmOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={alarms.includes(option.value)}
                onChange={() => handleAlarmToggle(option.value)}
                className="h-4 w-4"
              />
              <span>{option.label[lang]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-medium">{translations[lang].selectEvents}</div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {allEvents.map((event, index) => (
            <label key={index} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={selectedEvents.includes(index)}
                onChange={() => handleEventToggle(index)}
                className="h-4 w-4"
              />
              <span>{event}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex max-w-full flex-col">
        <div className="font-semibold">{translations[lang].copy}</div>
        <CopyText text={link} />
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
