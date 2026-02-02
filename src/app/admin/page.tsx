'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from '../../Components/PageLayout';

interface DayStats {
  requests: number;
  cache: {
    l1: { hit: number; miss: number; partial: number };
    l2: { hit: number; miss: number };
  };
  apiCalls: number;
  apiErrors: number;
  topLocations: [string, number][];
  topTimezones: [string, number][];
  topLangs: [string, number][];
}

interface AnalyticsData {
  today: DayStats | null;
  yesterday: DayStats | null;
  allTime: { requests: number; uniqueUsers: number };
}

interface CacheStatsData {
  status: string;
  memory: string;
  l1: { keys: number; uniqueLocations: number; locations: string[] };
  l2: { keys: number };
  total: number;
}

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [submittedKey, setSubmittedKey] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [cacheExpanded, setCacheExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (apiKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, cacheRes] = await Promise.all([
        fetch(`/api/analytics?key=${encodeURIComponent(apiKey)}`),
        fetch(`/api/cache-stats?key=${encodeURIComponent(apiKey)}`),
      ]);

      if (analyticsRes.status === 401 || cacheRes.status === 401) {
        setError('Invalid key');
        setSubmittedKey('');
        setAnalytics(null);
        setCacheStats(null);
        localStorage.removeItem('admin_key');
        setLoading(false);
        return;
      }

      if (!analyticsRes.ok || !cacheRes.ok) {
        setError('Failed to fetch data');
        setLoading(false);
        return;
      }

      const [analyticsData, cacheData] = await Promise.all([analyticsRes.json(), cacheRes.json()]);
      setAnalytics(analyticsData);
      setCacheStats(cacheData);
      localStorage.setItem('admin_key', apiKey);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setSubmittedKey(key);
    fetchData(key);
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_key');
    if (saved) {
      setKey(saved);
      setSubmittedKey(saved);
      fetchData(saved).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh && submittedKey) {
      intervalRef.current = setInterval(() => fetchData(submittedKey), 30_000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, submittedKey, fetchData]);

  // ── Password Gate ──
  if (!analytics || !cacheStats) {
    if (!ready) {
      return <div className="min-h-screen bg-gray-50 dark:bg-zinc-800" />;
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-zinc-800">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950">
                <svg
                  className="h-5 w-5 text-sky-600 dark:text-sky-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h1 className="text-base font-semibold text-gray-900 dark:text-white">Admin</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter key"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-sky-500 dark:focus:bg-zinc-800"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Unlock'}
              </button>
            </form>
            {error && <p className="mt-3 text-center text-xs font-medium text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  const { today, yesterday, allTime } = analytics;

  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-lg px-4 py-10">
        {/* ── Header ── */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              {loading && ' · Refreshing...'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              autoRefresh
                ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${autoRefresh ? 'animate-pulse bg-sky-500' : 'bg-gray-300 dark:bg-zinc-600'}`}
            />
            {autoRefresh ? 'Live' : 'Auto-refresh'}
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          {/* All-Time */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500">All-Time</p>
            <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
              {allTime.requests.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
              requests · {allTime.uniqueUsers.toLocaleString()} unique IPs
            </p>
            {today && today.topLangs.length > 0 && (
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4 dark:border-zinc-800">
                {today.topLangs.map(([lang, count]) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1 text-xs dark:bg-zinc-800"
                  >
                    <span className="font-semibold text-gray-700 dark:text-zinc-200">{lang.toUpperCase()}</span>
                    <span className="text-gray-400 dark:text-zinc-500">{count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Today */}
          <DayCard title="Today" stats={today} />

          {/* Yesterday */}
          <DayCard title="Yesterday" stats={yesterday} />
        </div>

        {/* ── Cache Status ── */}
        <div className="mb-10">
          <button
            type="button"
            onClick={() => setCacheExpanded(!cacheExpanded)}
            className="group flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 text-left transition-colors hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${cacheStats.status === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Redis Cache</span>
              <span className="text-xs text-gray-400 dark:text-zinc-600">
                {cacheStats.total} keys · {cacheStats.memory}
              </span>
            </div>
            <svg
              className={`h-4 w-4 text-gray-300 transition-transform duration-200 group-hover:text-gray-400 dark:text-zinc-600 ${cacheExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {cacheExpanded && (
            <div className="mt-1 rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid gap-px sm:grid-cols-3">
                <CacheStat label="Memory" value={cacheStats.memory} />
                <CacheStat
                  label="L1 — Prayer Data"
                  value={`${cacheStats.l1.keys} keys · ${cacheStats.l1.uniqueLocations} locations`}
                />
                <CacheStat label="L2 — ICS Files" value={`${cacheStats.l2.keys} keys`} />
              </div>
              {cacheStats.l1.locations.length > 0 && (
                <div className="border-t border-gray-100 px-6 py-4 dark:border-zinc-800">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-300 dark:text-zinc-600">
                    Cached Locations
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cacheStats.l1.locations.map((loc) => (
                      <span
                        key={loc}
                        className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Rank Lists ── */}
        {today && (
          <div className="grid gap-5 sm:grid-cols-2">
            <RankList title="Timezones" items={today.topTimezones} max={30} />
            <RankList title="Locations" items={today.topLocations} max={30} />
          </div>
        )}
      </div>
    </PageLayout>
  );
}

// ── Sub-components ──

function DayCard({ title, stats }: { title: string; stats: DayStats | null }) {
  if (!stats) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500">{title}</p>
        <p className="mt-4 text-sm text-gray-300 dark:text-zinc-600">No data</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">
        {stats.requests.toLocaleString()}
      </p>
      <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">requests</p>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-zinc-800">
        {[
          { label: 'L1', value: stats.cache.l1.hit },
          { label: 'L2', value: stats.cache.l2.hit },
          { label: 'API', value: stats.apiCalls },
          ...(stats.apiErrors > 0 ? [{ label: 'ERR', value: stats.apiErrors, error: true }] : []),
        ].map((s) => (
          <span
            key={s.label}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ${
              'error' in s ? 'bg-red-50 dark:bg-red-950/40' : 'bg-gray-50 dark:bg-zinc-800'
            }`}
          >
            <span
              className={`font-semibold ${'error' in s ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-zinc-200'}`}
            >
              {s.label}
            </span>
            <span className={`${'error' in s ? 'text-red-400 dark:text-red-500' : 'text-gray-400 dark:text-zinc-500'}`}>
              {s.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CacheStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-6 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-300 dark:text-zinc-600">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-700 dark:text-zinc-300">{value}</p>
    </div>
  );
}

function RankList({ title, items, max = 10 }: { title: string; items: [string, number][]; max?: number }) {
  if (!items.length) return null;
  const display = items.slice(0, max);
  const topCount = display[0]?.[1] || 1;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          {title}
          <span className="ml-2 text-gray-300 dark:text-zinc-700">({items.length})</span>
        </h2>
      </div>
      <ul className="px-4 pb-4">
        {display.map(([name, count], i) => {
          const pct = Math.max((count / topCount) * 100, 4);
          return (
            <li
              key={name}
              className="group relative flex items-center gap-3 rounded-lg px-2 py-[9px] hover:bg-gray-50 dark:hover:bg-zinc-800/50"
            >
              {/* Bar background */}
              <div
                className="absolute inset-y-1 left-0 rounded-lg bg-sky-50 transition-all dark:bg-sky-950/30"
                style={{ width: `${pct}%` }}
              />
              {/* Content */}
              <span className="relative w-5 text-right text-[11px] tabular-nums text-gray-300 dark:text-zinc-600">
                {i + 1}
              </span>
              <span className="relative min-w-0 flex-1 truncate text-[13px] text-gray-700 dark:text-zinc-300">
                {name}
              </span>
              <span className="relative text-[13px] font-semibold tabular-nums text-gray-900 dark:text-white">
                {count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
