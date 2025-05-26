import React from 'react';
import CopyText from 'Components/CopyText';
import defaultMethod from 'Components/defaultMethod';
import ThemeMenu from 'Components/Theme';

type Lang = 'en' | 'ar';

const translations = {
  en: {
    title: 'Generate Pray Calendar Subscribe link',
    address: 'Address (City, State, Country) eg. Cairo, Egypt',
    method: 'Method',
    duration: 'Duration (minutes)',
    selectAlarms: 'Select Alarms',
    selectEvents: 'Select Prayer Events',
    copy: 'Copy this link:',
    source: 'Source Code',
    creator: 'Creator',
  },
  ar: {
    title: 'إنشاء رابط تقويم الصلاة',
    address: 'العنوان (المدينة، الولاية، الدولة) مثال: القاهرة، مصر',
    method: 'طريقة الحساب',
    duration: 'المدة (بالدقائق)',
    selectAlarms: 'اختر التنبيهات',
    selectEvents: 'اختر الصلوات',
    copy: 'انسخ هذا الرابط:',
    source: 'المصدر',
    creator: 'المطور',
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
  }, [lang]);

  const alarmOptions = alarmOptionsData;
  const alarmOrder = alarmOptions.map((o) => o.value);
  const [alarms, setAlarms] = React.useState<number[]>([5]);
  const [duration, setDuration] = React.useState(25);

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

  const link = `https://pray.ahmedelywa.com/api/prayer-times.ics?address=${encodeURIComponent(
    address,
  )}&method=${method}${alarmParam}&duration=${duration}${eventsParam}&lang=${lang}`;

  return (
    <div className="mx-auto mb-6 flex min-h-screen max-w-screen-lg flex-col space-y-8 bg-gray-50 px-4 text-gray-900 selection:bg-gray-800 selection:text-gray-100 dark:bg-zinc-800 dark:text-gray-100 dark:selection:bg-gray-100 dark:selection:text-gray-900">
      <nav id="home" className="relative w-full py-4 print:hidden">
        <div className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center space-x-4">
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
          <div className="flex items-center">
            <ThemeMenu />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="ml-2 rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </nav>
      <h1 className="text-2xl font-bold">{translations[lang].title}</h1>
      <label htmlFor="address" className="space-2-8 flex flex-col font-medium">
        {translations[lang].address}
        <input
          id="address"
          name="address"
          className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <label className="space-2-8 flex flex-col font-medium">
        {translations[lang].method}
        <select
          defaultValue={method}
          onChange={(event) => setMethod(event.target.value)}
          className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
        >
          {defaultMethod.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <label className="space-2-8 flex flex-col font-medium">
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
      </div>

      <div className="space-y-2">
        <div className="font-medium">{translations[lang].selectAlarms}</div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {alarmOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center space-x-2">
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
            <label key={index} className="flex cursor-pointer items-center space-x-2">
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
        <span className="animate-ping text-5xl">👉 </span> You can edit the subscribe link and add arguments from the
        docs{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://aladhan.com/prayer-times-api#tag/Monthly-Annual-Prayer-Times-Calendar/paths/~1v1~1calendarByAddress~1%7Byear%7D~1%7Bmonth%7D/get"
          target="_blank"
          rel="noreferrer"
        >
          Prayer Times Calendar by address
        </a>
      </div>
      <h2 className="font-bold">
        To add a calendar subscription link to Google Calendar, follow these steps:{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DDesktop"
          target="_blank"
          rel="noreferrer"
        >
          Full Docs Here
        </a>
      </h2>
      <ul className="my-4 list-decimal pl-6 text-lg leading-7">
        <li>Open Google Calendar in a web browser.</li>
        <li>Click the "Add calendar" button in the left sidebar.</li>
        <li>Select "From URL" from the menu.</li>
        <li>Paste the calendar subscription link into the "URL" field.</li>
        <li>Click the "Add Calendar" button.</li>
        <li>The calendar should now appear in your list of calendars in Google Calendar.</li>
      </ul>
      <h2 className="font-bold">
        To add a calendar subscription link to Microsoft Outlook, follow these steps:{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
          target="_blank"
          rel="noreferrer"
        >
          Full Docs Here
        </a>
      </h2>
      <ul className="my-4 list-decimal pl-6 text-lg leading-7">
        <li>Open Microsoft Outlook in a web browser.</li>
        <li>Click the "Calendar" button in the left sidebar.</li>
        <li>Click the "Open calendar" button in the top menu, and select "From Internet" from the menu.</li>
        <li>Paste the calendar subscription link into the "Link to the calendar" field.</li>
        <li>Click the "OK" button.</li>
        <li>The calendar should now appear in your list of calendars in Microsoft Outlook.</li>
      </ul>
      <div>
        <h2 className="font-bold">
          To add a calendar subscription link to Apple Calendar, follow these steps:{' '}
          <a
            className="text-blue-300 hover:underline"
            href="https://support.apple.com/en-eg/102301"
            target="_blank"
            rel="noreferrer"
          >
            Full Docs Here
          </a>
        </h2>
        <ul className="my-4 list-decimal pl-6 text-lg leading-7">
          <li>Open Apple Calendar.</li>
          <li>Click the "File" menu, and select "New Calendar Subscription" from the menu.</li>
          <li>Paste the calendar subscription link into the "Calendar URL" field.</li>
          <li>Click the "Subscribe" button.</li>
          <li>The calendar should now appear in your list of calendars in Apple Calendar.</li>
        </ul>
      </div>
    </div>
  );
};

export default Index;
