import React from 'react';
import type { InputMode } from './useLocationFields';
import type { Lang } from './useLanguage';

interface UseTimingsPreviewDeps {
  inputMode: InputMode;
  address: string;
  latitude: number | '';
  longitude: number | '';
  method: string;
  lang: Lang;
}

/** fetch next‑prayer & today's timetable */
export function useTimingsPreview(deps: UseTimingsPreviewDeps) {
  const { inputMode, address, latitude, longitude, method, lang } = deps;
  const [loading, setLoading] = React.useState(false);
  const [nextPrayer, setNextPrayer] = React.useState<{ name: string; time: number } | null>(null);
  const [todayTimings, setTodayTimings] = React.useState<Record<string, string> | null>(null);

  const refreshTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchToday = React.useCallback(async () => {
    if ((inputMode === 'address' && !address) || (inputMode === 'coords' && (latitude === '' || longitude === ''))) {
      setNextPrayer(null);
      setTodayTimings(null);
      return;
    }
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
      let upcoming: { name: string; time: number } | null = null;
      for (const ev of order) {
        const [h, m] = timings[ev].split(':').map(Number);
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        if (d > now) {
          upcoming = { name: ev, time: d.getTime() };
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
  }, [inputMode, address, latitude, longitude, method, lang]);

  React.useEffect(() => {
    fetchToday();
    return () => {
      if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    };
  }, [fetchToday]);

  React.useEffect(() => {
    if (refreshTimeout.current) clearTimeout(refreshTimeout.current);
    if (!nextPrayer) return;
    const diff = nextPrayer.time - Date.now();
    if (diff <= 0) {
      fetchToday();
      return;
    }
    refreshTimeout.current = setTimeout(() => {
      fetchToday();
    }, diff + 1000);
  }, [nextPrayer, fetchToday]);

  return { loading, nextPrayer, todayTimings };
}
