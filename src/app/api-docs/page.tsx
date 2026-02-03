'use client';

import PageLayout from '../../Components/PageLayout';
import { useAppContext } from '../../contexts/AppContext';

const params = [
  {
    name: 'address',
    type: 'string',
    required: 'Yes*',
    default: '—',
    description: 'City or address to geocode (e.g. "Cairo, Egypt"). Provide either address OR latitude+longitude.',
  },
  { name: 'latitude', type: 'number', required: 'Yes*', default: '—', description: 'Latitude in decimal degrees.' },
  { name: 'longitude', type: 'number', required: 'Yes*', default: '—', description: 'Longitude in decimal degrees.' },
  {
    name: 'method',
    type: 'number',
    required: 'No',
    default: '5',
    description:
      'Calculation method ID from AlAdhan API (e.g. 1=University of Islamic Sciences Karachi, 2=ISNA, 3=MWL, 4=Umm al-Qura, 5=Egyptian General Authority).',
  },
  { name: 'duration', type: 'number', required: 'No', default: '25', description: 'Event duration in minutes.' },
  { name: 'months', type: 'number', required: 'No', default: '3', description: 'Number of months to generate (1-11).' },
  {
    name: 'alarm',
    type: 'string',
    required: 'No',
    default: '5',
    description: 'Comma-separated alarm offsets in minutes before the event (e.g. "5,10,15").',
  },
  {
    name: 'events',
    type: 'string',
    required: 'No',
    default: 'all',
    description:
      'Comma-separated indices of prayer events to include (0=Fajr, 1=Sunrise, 2=Dhuhr, 3=Asr, 4=Maghrib, 5=Isha, 6=Midnight). Omit to include all.',
  },
  {
    name: 'lang',
    type: 'string',
    required: 'No',
    default: 'en',
    description: 'Language for event names and descriptions ("en" or "ar").',
  },
  {
    name: 'color',
    type: 'string',
    required: 'No',
    default: '—',
    description: 'CSS color for calendar events (e.g. "#1e90ff"). URL-encode the # as %23.',
  },
  {
    name: 'traveler',
    type: 'boolean',
    required: 'No',
    default: 'false',
    description: "Enable travel/Qasr mode. Shortens 4-rak'at prayers to 2 rak'at with a note in the description.",
  },
  {
    name: 'jumuah',
    type: 'boolean',
    required: 'No',
    default: 'false',
    description: "Add a Jumu'ah (Friday prayer) event replacing Dhuhr on Fridays.",
  },
  {
    name: 'jumuahDuration',
    type: 'number',
    required: 'No',
    default: '60',
    description: "Duration of the Jumu'ah event in minutes. Only used when jumuah=true.",
  },
  {
    name: 'qibla',
    type: 'boolean',
    required: 'No',
    default: 'false',
    description: 'Include Qibla direction (bearing and compass) in event descriptions.',
  },
  {
    name: 'dua',
    type: 'boolean',
    required: 'No',
    default: 'false',
    description: "Include a rotating Du'a/Adhkar from Hisn al-Muslim in event descriptions.",
  },
  {
    name: 'iqama',
    type: 'string',
    required: 'No',
    default: '—',
    description:
      'Comma-separated iqama offsets in minutes for each prayer (Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha,Midnight). Creates separate "Iqama" events. Max 60 per prayer.',
  },
  {
    name: 'ramadanMode',
    type: 'boolean',
    required: 'No',
    default: 'false',
    description: 'Add Iftar, Taraweeh, and Suhoor events during Ramadan days.',
  },
  {
    name: 'iftarDuration',
    type: 'number',
    required: 'No',
    default: '30',
    description: 'Duration of Iftar event in minutes. Only used when ramadanMode=true.',
  },
  {
    name: 'traweehDuration',
    type: 'number',
    required: 'No',
    default: '60',
    description: 'Duration of Taraweeh event in minutes. Only used when ramadanMode=true.',
  },
  {
    name: 'suhoorDuration',
    type: 'number',
    required: 'No',
    default: '30',
    description: 'Duration of Suhoor event in minutes. Only used when ramadanMode=true.',
  },
];

const examples = [
  {
    title: 'Basic — Cairo, 3 months',
    url: '/api/prayer-times.ics?address=Cairo%2C%20Egypt&method=5',
  },
  {
    title: 'Coordinates with custom alarms',
    url: '/api/prayer-times.ics?latitude=30.0444&longitude=31.2357&method=5&alarm=5,10&duration=30',
  },
  {
    title: "Arabic + Qibla + Du'a",
    url: '/api/prayer-times.ics?address=Mecca&method=4&lang=ar&qibla=true&dua=true',
  },
  {
    title: 'Travel mode with Iqama offsets',
    url: '/api/prayer-times.ics?address=London&method=2&traveler=true&iqama=15,0,10,10,5,10,0',
  },
  {
    title: "Ramadan + Jumu'ah + color",
    url: '/api/prayer-times.ics?address=Istanbul&method=13&ramadanMode=true&jumuah=true&color=%231e90ff',
  },
];

export default function ApiDocsPage() {
  useAppContext();

  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-lg px-4 py-8">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-text-primary">
            <span className="text-2xl">📄</span>
            API Documentation
          </h1>
          <p className="mt-2 text-text-secondary">
            Generate ICS calendar feeds for prayer times using a simple HTTP GET endpoint.
          </p>
        </div>

        {/* Endpoint */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">Endpoint</h2>
          <code className="block rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-3 font-mono text-sm break-all text-teal">
            GET /api/prayer-times.ics?address=...&amp;method=...
          </code>
          <p className="mt-3 text-sm text-text-secondary">
            Returns an <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">text/calendar</code>{' '}
            ICS file. Subscribe to the URL in any calendar app (Google Calendar, Apple Calendar, Outlook) for
            auto-updating prayer times.
          </p>
        </section>

        {/* Parameters table */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-text-primary">Parameters</h2>
          <p className="mb-3 text-sm text-text-muted">
            * Provide either <code className="rounded bg-bg-secondary px-1 font-mono text-xs">address</code> or both{' '}
            <code className="rounded bg-bg-secondary px-1 font-mono text-xs">latitude</code>+
            <code className="rounded bg-bg-secondary px-1 font-mono text-xs">longitude</code>.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="py-2 pe-4 font-medium text-text-muted">Parameter</th>
                  <th className="py-2 pe-4 font-medium text-text-muted">Type</th>
                  <th className="py-2 pe-4 font-medium text-text-muted">Required</th>
                  <th className="py-2 pe-4 font-medium text-text-muted">Default</th>
                  <th className="py-2 font-medium text-text-muted">Description</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p) => (
                  <tr key={p.name} className="border-b border-border-subtle/50">
                    <td className="py-2 pe-4">
                      <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">{p.name}</code>
                    </td>
                    <td className="py-2 pe-4 text-text-muted">{p.type}</td>
                    <td className="py-2 pe-4 text-text-muted">{p.required}</td>
                    <td className="py-2 pe-4 text-text-muted">
                      <code className="font-mono text-xs">{p.default}</code>
                    </td>
                    <td className="py-2 text-text-secondary">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-text-primary">Examples</h2>
          <div className="space-y-4">
            {examples.map((ex) => (
              <div key={ex.title}>
                <p className="mb-1 text-sm font-medium text-text-secondary">{ex.title}</p>
                <code className="block rounded-[var(--radius-sm)] bg-bg-secondary px-3 py-2 font-mono text-xs break-all text-teal">
                  {ex.url}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* JSON API */}
        <section className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">JSON API</h2>
          <p className="mb-3 text-sm text-text-secondary">
            Get today&apos;s prayer times as JSON. Useful for webhooks, IFTTT, Home Assistant, or custom integrations.
          </p>
          <code className="mb-4 block rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-3 font-mono text-sm break-all text-teal">
            GET /api/prayer-times.json?address=...&amp;method=...
          </code>
          <p className="mb-2 text-sm font-medium text-text-secondary">
            Accepts the same location and method parameters as the ICS endpoint. Additional options:
          </p>
          <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-text-secondary">
            <li>
              <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">qibla=true</code> — include
              Qibla direction
            </li>
            <li>
              <code className="rounded bg-bg-secondary px-1 font-mono text-xs text-gold">lang=ar</code> — Arabic output
            </li>
          </ul>
          <p className="mb-2 text-sm font-medium text-text-secondary">Example response:</p>
          <pre className="overflow-x-auto rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-3 font-mono text-xs text-text-secondary">{`{
  "date": {
    "gregorian": "03-02-2026",
    "hijri": { "day": "15", "month": { "number": 8, "en": "Shaʿbān", "ar": "شَعْبَان" }, "year": "1447" }
  },
  "location": { "latitude": 30.0444, "longitude": 31.2357, "address": "Cairo, Egypt" },
  "method": "5",
  "timings": {
    "Fajr": "05:23", "Sunrise": "06:50", "Dhuhr": "12:12",
    "Asr": "15:17", "Maghrib": "17:34", "Isha": "18:53", "Midnight": "23:42"
  },
  "nextPrayer": { "name": "Dhuhr", "time": "12:12" }
}`}</pre>
          <p className="mt-3 text-sm text-text-muted">CORS is enabled. Responses are cached for 1 hour.</p>
        </section>

        {/* Rate limits */}
        <section className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-xl font-semibold text-text-primary">Rate Limits &amp; Caching</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-text-secondary">
            <li>Responses are cached for up to 24 hours (shorter near midnight for fresh data).</li>
            <li>
              The underlying AlAdhan API is called once per unique location+method per month and cached server-side.
            </li>
            <li>
              There are no strict rate limits, but please be reasonable. Calendar apps typically poll once every few
              hours.
            </li>
            <li>For high-traffic integrations, contact us first.</li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
