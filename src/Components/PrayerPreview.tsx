import { useEffect, useState } from 'react';
import { eventNames } from '../constants/prayerData';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import type { HijriDate } from '../hooks/useTimingsPreview';

interface PrayerPreviewProps {
  loadingNext: boolean;
  nextPrayer: { name: string; time: number } | null;
  todayTimings: Record<string, string> | null;
  hijriDate?: HijriDate | null;
  ramadanMode?: boolean;
  iftarDuration?: number;
  traweehDuration?: number;
  suhoorDuration?: number;
  qiblaDirection?: { bearing: number; compass: string } | null;
}

export default function PrayerPreview({
  loadingNext,
  nextPrayer,
  todayTimings,
  hijriDate,
  ramadanMode = false,
  iftarDuration = 30,
  traweehDuration = 60,
  suhoorDuration = 30,
  qiblaDirection,
}: PrayerPreviewProps) {
  const { lang, locationFields } = useAppContext();
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

  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
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

  const isRamadanToday = ramadanMode;

  const hasLocation =
    locationFields.inputMode === 'address'
      ? !!locationFields.address.trim()
      : !!(locationFields.latitude && locationFields.longitude);

  // Get current weekday
  const weekday = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long' });

  // Location display
  const locationDisplay =
    locationFields.inputMode === 'address'
      ? locationFields.address
      : locationFields.latitude && locationFields.longitude
        ? `${locationFields.latitude}, ${locationFields.longitude}`
        : '';

  return (
    <div className="sticky top-24 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
      {/* Header with icon */}
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border-accent bg-gold-glow text-base">
          🕐
        </div>
        <div>
          <div className="text-[15px] font-semibold text-text-primary">{translations[lang].eventsToday}</div>
          {hasLocation && locationDisplay && <div className="text-xs text-text-muted">{locationDisplay}</div>}
        </div>
      </div>

      {/* Ramadan Mode Indicator */}
      {isRamadanToday && (
        <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-gold-glow p-3">
          <span className="text-base">🌙</span>
          <span className="text-sm font-medium text-gold">{translations[lang].ramadanMode}</span>
        </div>
      )}

      {/* No location message */}
      {!hasLocation && !loadingNext && (
        <div className="py-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-secondary text-xl">📍</div>
          </div>
          <h3 className="mb-2 text-sm font-medium text-text-secondary">{translations[lang].enterLocationTitle}</h3>
          <p className="text-xs text-text-muted">{translations[lang].enterLocationDescription}</p>
        </div>
      )}

      {/* Next prayer banner */}
      {hasLocation && (
        <div className="mb-5">
          {loadingNext ? (
            <div className="flex items-center gap-3 rounded-[var(--radius-sm)] bg-bg-secondary p-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-border-subtle border-t-gold" />
              <span className="text-sm text-text-muted">{translations[lang].loadingNext}</span>
            </div>
          ) : nextPrayer ? (
            <div className="rounded-[var(--radius-sm)] border border-border-accent bg-gold-glow p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {translations[lang].nextPrayer}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold text-gold-light">{localizePrayer(nextPrayer.name)}</span>
                <span className="font-mono text-sm font-semibold text-gold">
                  {remaining !== null ? formatDiff(remaining) : ''}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Skeleton loading */}
      {hasLocation && loadingNext && !todayTimings && (
        <div className="space-y-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-[var(--radius-sm)] p-3">
              <div className="h-4 w-16 animate-pulse rounded bg-bg-elevated" />
              <div className="h-4 w-12 animate-pulse rounded bg-bg-elevated" />
            </div>
          ))}
        </div>
      )}

      {/* Today's timings */}
      {todayTimings && (
        <div>
          <div className="space-y-0.5">
            {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'].map((ev) => {
              const isNext = nextPrayer?.name === ev;
              const timeStr = todayTimings[ev];
              const isPassed = (() => {
                if (!timeStr || isNext) return false;
                const [h, m] = timeStr.split(':').map(Number);
                const now = new Date();
                const prayerTime = new Date(now);
                prayerTime.setHours(h, m, 0, 0);
                return prayerTime < now;
              })();

              return (
                <div
                  key={ev}
                  className={`flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2.5 transition ${
                    isNext
                      ? 'border border-border-accent bg-gold-glow'
                      : isPassed
                        ? 'opacity-40'
                        : 'hover:bg-bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        isNext ? 'bg-gold animate-pulse' : isPassed ? 'bg-text-muted' : 'bg-text-secondary'
                      }`}
                    />
                    <span className={`text-sm ${isNext ? 'font-semibold text-gold-light' : 'text-text-secondary'}`}>
                      {localizePrayer(ev)}
                    </span>
                    {isNext && (
                      <span className="rounded-full bg-[rgba(212,175,105,0.2)] px-2 py-0.5 text-[10px] font-semibold text-gold">
                        {translations[lang].nextPrayer}
                      </span>
                    )}
                  </div>
                  <span className={`font-mono text-sm ${isNext ? 'font-semibold text-gold' : 'text-text-primary'}`}>
                    {timeStr}
                  </span>
                </div>
              );
            })}

            {/* Ramadan events */}
            {isRamadanToday && (
              <>
                {suhoorDuration > 0 && (
                  <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border-accent bg-gold-glow px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                      <span className="text-sm font-medium text-text-primary">{translations[lang].suhoor}</span>
                      <span className="text-xs text-text-muted">({suhoorDuration}min)</span>
                    </div>
                    <span className="font-mono text-sm text-gold">{translations[lang].beforeFajr}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border-accent bg-gold-glow px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="text-sm font-medium text-text-primary">{translations[lang].iftar}</span>
                    <span className="text-xs text-text-muted">({iftarDuration}min)</span>
                  </div>
                  <span className="font-mono text-sm text-gold">{translations[lang].afterMaghrib}</span>
                </div>
                {traweehDuration > 0 && (
                  <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border-accent bg-gold-glow px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                      <span className="text-sm font-medium text-text-primary">{translations[lang].tarawih}</span>
                      <span className="text-xs text-text-muted">({traweehDuration}min)</span>
                    </div>
                    <span className="font-mono text-sm text-gold">{translations[lang].afterIsha}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer: Hijri date & Qibla */}
          <div className="mt-4 space-y-2 border-t border-border-subtle pt-4">
            {hijriDate && (
              <div className="text-center text-sm text-text-muted">
                {hijriDate.day} {lang === 'ar' ? hijriDate.month.ar : hijriDate.month.en} {hijriDate.year} AH ·{' '}
                {weekday}
              </div>
            )}
            {qiblaDirection && (
              <div className="text-center text-sm text-text-muted">
                🧭 {lang === 'ar' ? 'القبلة:' : 'Qibla:'} {qiblaDirection.bearing}° {qiblaDirection.compass}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
