import React from 'react';
import CopyText from 'Components/CopyText';
import defaultMethod from 'Components/defaultMethod';
import ThemeMenu from 'Components/Theme';

const Index: React.FC = () => {
  const [address, setAddress] = React.useState('');
  const [method, setMethod] = React.useState('5');
  const [alarm, setAlarm] = React.useState('5');
  const [duration, setDuration] = React.useState(25);

  const allEvents = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
  const [selectedEvents, setSelectedEvents] = React.useState<number[]>(allEvents.map((_, index) => index));

  const handleEventToggle = (index: number) => {
    setSelectedEvents((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort((a, b) => a - b),
    );
  };

  const eventsParam = selectedEvents.length === allEvents.length ? '' : `&events=${selectedEvents.join(',')}`;

  const link = `https://pray.ahmedelywa.com/api/prayer-times.ics?address=${encodeURIComponent(
    address,
  )}&method=${method}&alarm=${alarm}&duration=${duration}${eventsParam}`;

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
              Source Code
            </a>
            <a href="https://ahmedelywa.com" className="cursor-pointer hover:underline">
              Creator
            </a>
          </div>
          <div className="flex items-center">
            <ThemeMenu />
          </div>
        </div>
      </nav>
      <h1 className="text-2xl font-bold">Generate Pray Calendar Subscribe link</h1>
      <label htmlFor="address" className="space-2-8 flex flex-col font-medium">
        Address (City, State, Country) eg. Cairo, Egypt
        <input
          id="address"
          name="address"
          className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <label className="space-2-8 flex flex-col font-medium">
        Method
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
          Alarm (minutes before)
          <select
            defaultValue={alarm}
            onChange={(event) => setAlarm(event.target.value)}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="0">No alarm</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </label>
        <label className="space-2-8 flex flex-col font-medium">
          Duration (minutes)
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
        <div className="font-medium">Select Prayer Events</div>
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
        <div className="font-semibold">Copy this link:</div>
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
