import React from 'react';
import { translations } from '../constants/translations';
import { eventNames } from '../constants/prayerData';
import type { Lang } from '../hooks/useLanguage';
import { BellAlertIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PrayerPreviewProps {
  lang: Lang;
  loadingNext: boolean;
  nextPrayer: { name: string; time: number } | null;
  todayTimings: Record<string, string> | null;
}

export default function PrayerPreview({ lang, loadingNext, nextPrayer, todayTimings }: PrayerPreviewProps) {
  const formatDiff = (ms: number) => {
    const diff = Math.max(0, ms);
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const parts = [] as string[];
    if (h) parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  const [remaining, setRemaining] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!nextPrayer) {
      setRemaining(null);
      return;
    }
    const update = () => setRemaining(nextPrayer.time - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [nextPrayer]);

  const localizePrayer = (name: string) => {
    const idx = eventNames.en.indexOf(name);
    return idx === -1 ? name : eventNames[lang][idx];
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      {/* Next prayer timer */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900">
          <BellAlertIcon className="h-5 w-5 text-sky-600 dark:text-sky-300" />
        </div>
        <div>
          {loadingNext ? (
            <div className="flex items-center">
              <div className="me-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{translations[lang].loadingNext}</span>
            </div>
          ) : nextPrayer ? (
            <div className="text-sm text-gray-700 dark:text-gray-200">
              <span className="font-medium">{translations[lang].nextPrayer}:</span>{' '}
              <span className="text-sky-600 dark:text-sky-400">{localizePrayer(nextPrayer.name)}</span>{' '}
              <span>{translations[lang].inLabel}</span>{' '}
              <span className="font-medium text-gray-900 dark:text-white">
                {remaining !== null ? formatDiff(remaining) : ''}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Today's timings */}
      {todayTimings && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{translations[lang].eventsToday}</h3>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
              {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'].map((ev, index) => (
                <div
                  key={ev}
                  className={`flex items-center justify-between p-3 ${
                    index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-800'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{localizePrayer(ev)}</span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">{todayTimings[ev]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
