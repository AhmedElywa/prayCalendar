import React from 'react';
import CopyText from 'Components/CopyText';
import defaultMethod from 'Components/defaultMethod';

const Index: React.FC = () => {
  const [address, setAddress] = React.useState('');
  const [method, setMethod] = React.useState('5');
  const [alarm, setAlarm] = React.useState('5');
  const [duration, setDuration] = React.useState(25);
  const link = `https://pray.ahmedelywa.com/api/prayer-times.ics?address=${encodeURIComponent(
    address,
  )}&method=${method}&alarm=${alarm}&duration=${duration}`;
  return (
    <div className="w-full text-gray-700 flex justify-center py-8 px-4 flex-col max-w-3xl mx-auto space-y-8">
      <h1 className="font-bold text-2xl">Generate Pray Calendar Subscribe link</h1>
      <label htmlFor="address" className="flex flex-col font-medium text-gray-700 space-2-8">
        Address (City, State, Country) eg. Cairo, Egypt
        <input
          id="address"
          name="address"
          className="border p-2 rounded-md border-sky-400"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <label className="flex flex-col font-medium text-gray-700 space-2-8">
        Method
        <select
          defaultValue={method}
          onChange={(event) => setMethod(event.target.value)}
          className="border p-2 rounded-md border-sky-400"
        >
          {defaultMethod.map((method) => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-2 md:grid-cols-2 grid-cols-1">
        <label className="flex flex-col font-medium text-gray-700 space-2-8">
          Alarm (minutes before)
          <select
            defaultValue={alarm}
            onChange={(event) => setAlarm(event.target.value)}
            className="border p-2 rounded-md border-sky-400"
          >
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
          </select>
        </label>
        <label className="flex flex-col font-medium text-gray-700 space-2-8">
          Duration (minutes)
          <input
            id="duration"
            name="duration"
            className="border p-2 rounded-md border-sky-400"
            value={duration}
            type="number"
            onChange={(event) => setDuration(+event.target.value)}
          />
        </label>
      </div>

      <a href={link} className="bg-blue-500 text-center text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600">
        Subscribe to Calendar
      </a>
      <div className="flex flex-col">
        <div className="font-semibold">Or copy this link:</div>
        <CopyText text={link} />
      </div>
      <h2 className="font-bold">To add a calendar subscription link to Google Calendar, follow these steps:</h2>
      <ul className="list-decimal pl-6 my-4 text-lg leading-7">
        <li>Open Google Calendar in a web browser.</li>
        <li>Click the "Add calendar" button in the left sidebar.</li>
        <li>Select "From URL" from the menu.</li>
        <li>Paste the calendar subscription link into the "URL" field.</li>
        <li>Click the "Add Calendar" button.</li>
        <li>The calendar should now appear in your list of calendars in Google Calendar.</li>
      </ul>
      <h2 className="font-bold">To add a calendar subscription link to Microsoft Outlook, follow these steps:</h2>
      <ul className="list-decimal pl-6 my-4 text-lg leading-7">
        <li>Open Microsoft Outlook in a web browser.</li>
        <li>Click the "Calendar" button in the left sidebar.</li>
        <li>Click the "Open calendar" button in the top menu, and select "From Internet" from the menu.</li>
        <li>Paste the calendar subscription link into the "Link to the calendar" field.</li>
        <li>Click the "OK" button.</li>
        <li>The calendar should now appear in your list of calendars in Microsoft Outlook.</li>
      </ul>
      <h2 className="font-bold">To add a calendar subscription link to Apple Calendar, follow these steps:</h2>
      <ul className="list-decimal pl-6 my-4 text-lg leading-7">
        <li>Open Apple Calendar in a web browser.</li>
        <li>Click the "File" menu, and select "New Calendar Subscription" from the menu.</li>
        <li>Paste the calendar subscription link into the "Calendar URL" field.</li>
        <li>Click the "Subscribe" button.</li>
        <li>The calendar should now appear in your list of calendars in Apple Calendar.</li>
      </ul>
    </div>
  );
};

export default Index;
