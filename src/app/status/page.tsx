'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from '../../Components/PageLayout';

interface PublicStats {
  totalRequests: number;
  uniqueUsers: number;
  todayRequests: number;
  topTimezones: { name: string; count: number }[];
  topLanguages: { code: string; count: number }[];
  status: 'operational' | 'degraded';
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  ar: 'Arabic',
  tr: 'Turkish',
  fr: 'French',
  ur: 'Urdu',
  id: 'Indonesian',
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 1200;
    const start = performance.now();
    const from = prevValue.current > value ? 0 : prevValue.current;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    prevValue.current = value;
  }, [value]);

  return (
    <div className="text-center">
      <span ref={ref} className="block text-4xl font-bold tabular-nums tracking-tight text-text-primary sm:text-5xl">
        {formatNumber(display)}
      </span>
      <span className="mt-2 block text-xs font-medium uppercase tracking-widest text-text-muted">{label}</span>
    </div>
  );
}

export default function StatusPage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [error, setError] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) {
        setError(true);
        return;
      }
      setStats(await res.json());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60_000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const isOperational = stats?.status === 'operational' && !error;

  return (
    <PageLayout>
      <div className="mx-auto max-w-[800px] px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">System Status</h1>
          <p className="mt-2 text-sm text-text-muted">Live usage statistics for PrayCalendar</p>
        </div>

        {/* Status Badge */}
        <div className="mb-12 flex justify-center">
          <div
            className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium ${
              isOperational ? 'border-teal/20 bg-teal-dim text-teal' : 'border-coral/20 bg-coral-dim text-coral'
            }`}
          >
            <span className={`relative flex h-2 w-2`}>
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  isOperational ? 'bg-teal' : 'bg-coral'
                }`}
              />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isOperational ? 'bg-teal' : 'bg-coral'}`} />
            </span>
            {isOperational ? 'All Systems Operational' : 'Service Disruption'}
          </div>
        </div>

        {/* Loading skeleton */}
        {!stats && !error && (
          <div className="grid grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="skeleton mx-auto h-10 w-24 sm:h-12" />
                <div className="skeleton mx-auto mt-3 h-3 w-20" />
              </div>
            ))}
          </div>
        )}

        {stats && (
          <>
            {/* Main Counters */}
            <div className="mb-14 grid grid-cols-3 gap-6 sm:gap-8">
              <AnimatedCounter value={stats.totalRequests} label="Calendars Generated" />
              <AnimatedCounter value={stats.uniqueUsers} label="Users Worldwide" />
              <AnimatedCounter value={stats.todayRequests} label="Today's Requests" />
            </div>

            {/* Divider */}
            <div className="mb-14 flex items-center gap-4">
              <div className="h-px flex-1 bg-border-subtle" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Global Reach</span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            {/* Top Cities & Languages */}
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Timezones */}
              {stats.topTimezones.length > 0 && (
                <div className="rounded-xl border border-border-subtle bg-bg-card p-6">
                  <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-text-muted">Regions Today</h2>
                  <ul className="space-y-0">
                    {stats.topTimezones.slice(0, 10).map((tz, i) => {
                      const maxCount = stats.topTimezones[0].count;
                      const pct = Math.max((tz.count / maxCount) * 100, 6);
                      // Show friendly name: "Africa/Cairo" → "Cairo"
                      const label = tz.name.includes('/') ? tz.name.split('/').pop()!.replace(/_/g, ' ') : tz.name;
                      return (
                        <li key={tz.name} className="group relative flex items-center gap-3 rounded-lg px-2 py-2.5">
                          <div
                            className="absolute inset-y-0.5 left-0 rounded-lg bg-gold-glow transition-all"
                            style={{ width: `${pct}%` }}
                          />
                          <span className="relative w-5 text-right text-[11px] tabular-nums text-text-muted">
                            {i + 1}
                          </span>
                          <span className="relative min-w-0 flex-1 truncate text-[13px] text-text-secondary">
                            {label}
                          </span>
                          <span className="relative text-[13px] font-semibold tabular-nums text-text-primary">
                            {tz.count.toLocaleString()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {stats.topLanguages.length > 0 && (
                <div className="rounded-xl border border-border-subtle bg-bg-card p-6">
                  <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-text-muted">Languages</h2>
                  <div className="space-y-3">
                    {stats.topLanguages.map((lang) => {
                      const maxCount = stats.topLanguages[0].count;
                      const pct = Math.max((lang.count / maxCount) * 100, 6);
                      return (
                        <div key={lang.code}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[13px] text-text-secondary">
                              {LANGUAGE_LABELS[lang.code] || lang.code.toUpperCase()}
                            </span>
                            <span className="text-[13px] font-semibold tabular-nums text-text-primary">
                              {lang.count.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-bg-elevated">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="mt-14 text-center">
              <p className="text-xs text-text-muted">Statistics update every 60 seconds &middot; Data resets daily</p>
              <Link
                href="/"
                className="mt-2 inline-block text-xs font-medium text-gold no-underline transition hover:text-gold-light"
              >
                &larr; Back to PrayCalendar
              </Link>
            </div>
          </>
        )}

        {error && !stats && (
          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">Unable to load statistics. Please try again later.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
