import React from 'react';
import { BellAlertIcon, ClockIcon, MoonIcon } from '@heroicons/react/24/outline';
import { eventNames } from '../constants/prayerData';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';

interface PrayerPreviewProps {
  loadingNext: boolean;
  nextPrayer: { name: string; time: number } | null;
  todayTimings: Record<string, string> | null;
  ramadanMode?: boolean;
  iftarDuration?: number;
  traweehDuration?: number;
}

export default function PrayerPreview({
  loadingNext,
  nextPrayer,
  todayTimings,
  ramadanMode = false,
  iftarDuration = 30,
  traweehDuration = 60,
}: PrayerPreviewProps) {
  const { lang } = useAppContext();
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

  // Check if today is in Ramadan (simplified check - in a real app you'd use the actual Hijri date)
  // For now, we'll show Ramadan mode if it's enabled, regardless of the actual date
  const isRamadanToday = ramadanMode;

  const getPrayerDuration = (prayerName: string) => {
    if (isRamadanToday) {
      if (prayerName === 'Maghrib') return iftarDuration;
      if (prayerName === 'Isha') return traweehDuration;
    }
    return null; // Use default duration
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      {/* Ramadan Mode Indicator */}
      {isRamadanToday && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
          <MoonIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <span className="text-sm font-medium text-sky-700 dark:text-sky-300">{translations[lang].ramadanMode}</span>
        </div>
      )}

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
              {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'].map((ev, index) => {
                const extendedDuration = getPrayerDuration(ev);
                return (
                  <div
                    key={ev}
                    className={`flex items-center justify-between p-3 ${
                      index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-800'
                    } ${extendedDuration ? 'border-l-4 border-sky-400' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{localizePrayer(ev)}</span>
                      {extendedDuration && (
                        <span className="text-xs text-sky-600 dark:text-sky-400">(+{extendedDuration}min)</span>
                      )}
                    </div>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">{todayTimings[ev]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
