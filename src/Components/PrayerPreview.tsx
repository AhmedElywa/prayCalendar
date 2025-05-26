import React from 'react';
import { translations } from '../constants/translations';
import { eventNames } from '../constants/prayerData';
import type { Lang } from '../hooks/useLanguage';

interface PrayerPreviewProps {
  lang: Lang;
  loadingNext: boolean;
  nextPrayer: { name: string; diffMs: number } | null;
  todayTimings: Record<string, string> | null;
}

export default function PrayerPreview({ lang, loadingNext, nextPrayer, todayTimings }: PrayerPreviewProps) {
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

  return (
    <>
      {/* live preview */}
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

      {/* today's timings */}
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
    </>
  );
}
