import React from 'react';

// Simple client-side cache for preview data
const previewCache = new Map<
  string,
  {
    data: { timings: Record<string, string>; nextPrayer: { name: string; time: number } | null };
    timestamp: number;
  }
>();

const PREVIEW_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface UseTimingsPreviewDeps {
  inputMode: 'address' | 'coords';
  address: string;
  latitude: number | '';
  longitude: number | '';
  method: string;
  lang: string;
}

function generatePreviewCacheKey(deps: UseTimingsPreviewDeps): string {
  const location = deps.inputMode === 'address' ? deps.address : `${deps.latitude || 0},${deps.longitude || 0}`;
  const date = new Date().toISOString().split('T')[0];
  return `preview:${location}:${deps.method}:${date}`;
}

function isPreviewCacheValid(entry: { timestamp: number }): boolean {
  return Date.now() - entry.timestamp < PREVIEW_CACHE_TTL;
}

/** fetch next‑prayer & today's timetable */
export function useTimingsPreview(deps: UseTimingsPreviewDeps) {
  const { inputMode, address, latitude, longitude, method } = deps;
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

    // Check cache first
    const cacheKey = generatePreviewCacheKey(deps);
    const cachedEntry = previewCache.get(cacheKey);

    if (cachedEntry && isPreviewCacheValid(cachedEntry)) {
      console.log('Using cached preview data:', cacheKey);
      setTodayTimings(cachedEntry.data.timings);
      setNextPrayer(cachedEntry.data.nextPrayer);
      return;
    }

    setLoading(true);
    try {
      const url =
        inputMode === 'address'
          ? `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(address)}&method=${method}`
          : `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;

      console.log('Fetching fresh preview data:', cacheKey);
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

      // Cache the result
      previewCache.set(cacheKey, {
        data: { timings, nextPrayer: upcoming },
        timestamp: Date.now(),
      });

      // Clean old cache entries periodically
      if (Math.random() < 0.1) {
        // 10% chance
        for (const [key, entry] of previewCache.entries()) {
          if (!isPreviewCacheValid(entry)) {
            previewCache.delete(key);
          }
        }
      }
    } catch {
      setNextPrayer(null);
      setTodayTimings(null);
    } finally {
      setLoading(false);
    }
  }, [inputMode, address, latitude, longitude, method, deps]);

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
