import { useEffect, useState } from 'react';

export type CalendarApp = 'apple' | 'google' | 'outlook' | 'generic';

interface CalendarDetectionResult {
  detected: CalendarApp;
  isIOS: boolean;
  isMac: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  loading: boolean;
}

/**
 * Detects the user's likely preferred calendar app based on their device/browser.
 * Uses user agent detection as protocol handler detection is unreliable.
 */
export function useCalendarDetection(): CalendarDetectionResult {
  const [result, setResult] = useState<CalendarDetectionResult>({
    detected: 'generic',
    isIOS: false,
    isMac: false,
    isAndroid: false,
    isWindows: false,
    loading: true,
  });

  useEffect(() => {
    // Skip detection on SSR
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      setResult((prev) => ({ ...prev, loading: false }));
      return;
    }

    const ua = navigator.userAgent.toLowerCase();

    // Detect platform
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isMac = /macintosh|mac os x/.test(ua) && !isIOS;
    const isAndroid = /android/.test(ua);
    const isWindows = /windows/.test(ua);

    // Determine most likely calendar app
    let detected: CalendarApp = 'generic';

    if (isIOS || isMac) {
      // Apple devices likely use Apple Calendar
      detected = 'apple';
    } else if (isAndroid) {
      // Android devices typically have Google Calendar
      detected = 'google';
    } else if (isWindows) {
      // Windows users might use Outlook
      detected = 'outlook';
    }

    setResult({
      detected,
      isIOS,
      isMac,
      isAndroid,
      isWindows,
      loading: false,
    });
  }, []);

  return result;
}

/**
 * Get the display name and icon for a calendar app
 */
export function getCalendarAppInfo(app: CalendarApp, lang: 'en' | 'ar' = 'en') {
  const names = {
    apple: { en: 'Apple Calendar', ar: 'تقويم Apple' },
    google: { en: 'Google Calendar', ar: 'تقويم Google' },
    outlook: { en: 'Outlook', ar: 'Outlook' },
    generic: { en: 'Calendar', ar: 'التقويم' },
  };

  const icons = {
    apple: '🍎',
    google: '📅',
    outlook: '📧',
    generic: '📆',
  };

  return {
    name: names[app][lang],
    icon: icons[app],
  };
}
