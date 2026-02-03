'use client';

import { useEffect, useState } from 'react';

interface WidgetContentProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  method: string;
  lang: 'en' | 'ar';
  theme: 'dark' | 'light';
  compact: boolean;
}

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const prayerNames = {
  en: { Fajr: 'Fajr', Sunrise: 'Sunrise', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' },
  ar: { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' },
};

const prayerOrder: (keyof PrayerTimes)[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function WidgetContent({
  latitude,
  longitude,
  address,
  method,
  lang,
  theme,
  compact,
}: WidgetContentProps) {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] = useState<keyof PrayerTimes | null>(null);

  useEffect(() => {
    async function fetchTimes() {
      // Early exit if no location provided
      if (!latitude && !longitude && !address) {
        setError('No location provided');
        setLoading(false);
        return;
      }

      try {
        let url: string;
        if (latitude && longitude) {
          url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;
        } else if (address) {
          url = `https://api.aladhan.com/v1/timingsByAddress?address=${encodeURIComponent(address)}&method=${method}`;
        } else {
          throw new Error('No location');
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.code !== 200) {
          throw new Error('Failed to fetch prayer times');
        }

        const timings: PrayerTimes = {
          Fajr: data.data.timings.Fajr,
          Sunrise: data.data.timings.Sunrise,
          Dhuhr: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha: data.data.timings.Isha,
        };

        setTimes(timings);

        // Calculate next prayer
        const now = new Date();
        for (const prayer of prayerOrder) {
          const [h, m] = timings[prayer].split(':').map(Number);
          const prayerTime = new Date(now);
          prayerTime.setHours(h, m, 0, 0);
          if (prayerTime > now) {
            setNextPrayer(prayer);
            break;
          }
        }
      } catch {
        setError('Unable to load prayer times');
      } finally {
        setLoading(false);
      }
    }

    fetchTimes();
  }, [latitude, longitude, address, method]);

  // Notify parent frame of height changes for responsive iframe
  useEffect(() => {
    const notifyHeight = () => {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'pray-calendar-widget-height', height: document.body.scrollHeight }, '*');
      }
    };

    notifyHeight();
    const observer = new ResizeObserver(notifyHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';
  const isRTL = lang === 'ar';

  const bgClass = isDark ? 'bg-[#1a1a2e]' : 'bg-white';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const mutedClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDark ? 'border-gray-700' : 'border-gray-200';
  const highlightBg = isDark ? 'bg-[#2a2a4a]' : 'bg-amber-50';

  if (loading) {
    return (
      <div className={`flex min-h-[200px] items-center justify-center ${bgClass}`}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !times) {
    return (
      <div className={`flex min-h-[200px] items-center justify-center ${bgClass} ${textClass}`}>
        <p className={mutedClass}>{error || 'No data'}</p>
      </div>
    );
  }

  if (compact) {
    // Compact single-line view
    return (
      <div
        className={`flex items-center justify-between gap-4 p-3 ${bgClass} ${textClass}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {prayerOrder.slice(0, 5).map((prayer) => (
          <div key={prayer} className={`text-center ${prayer === nextPrayer ? 'font-bold text-amber-500' : ''}`}>
            <div className={`text-xs ${mutedClass}`}>{prayerNames[lang][prayer]}</div>
            <div className="text-sm">{times[prayer]}</div>
          </div>
        ))}
      </div>
    );
  }

  // Full view
  return (
    <div className={`p-4 ${bgClass} ${textClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="mb-4 text-center text-lg font-semibold">{lang === 'ar' ? 'أوقات الصلاة' : 'Prayer Times'}</h2>

      <div className={`divide-y ${borderClass}`}>
        {prayerOrder.map((prayer) => (
          <div
            key={prayer}
            className={`flex items-center justify-between py-3 ${
              prayer === nextPrayer ? `${highlightBg} -mx-4 px-4 font-semibold` : ''
            }`}
          >
            <span className={prayer === nextPrayer ? 'text-amber-500' : ''}>{prayerNames[lang][prayer]}</span>
            <span className={prayer === nextPrayer ? 'text-amber-500' : mutedClass}>{times[prayer]}</span>
          </div>
        ))}
      </div>

      <p className={`mt-4 text-center text-xs ${mutedClass}`}>
        <a href="https://pray.ahmedelywa.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
          pray.ahmedelywa.com
        </a>
      </p>
    </div>
  );
}
