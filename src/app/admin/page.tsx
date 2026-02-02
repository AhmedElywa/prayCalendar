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
  topCountries: [string, number][];
  topMethods: [string, number][];
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

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh && submittedKey) {
      intervalRef.current = setInterval(() => fetchData(submittedKey), 30_000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, submittedKey, fetchData]);

  // Password gate
  if (!analytics || !cacheStats) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter admin key"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
          </form>
        </div>
      </PageLayout>
    );
  }

  const { today, yesterday, allTime } = analytics;

  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-lg px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            Auto-refresh
            <button
              type="button"
              role="switch"
              aria-checked={autoRefresh}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${autoRefresh ? 'bg-sky-600' : 'bg-gray-300 dark:bg-zinc-600'}`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${autoRefresh ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </label>
        </div>

        {loading && <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Refreshing...</p>}

        {/* Request Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card title="All-Time">
            <Stat label="Requests" value={allTime.requests} />
            <Stat label="Unique IPs" value={allTime.uniqueUsers} />
          </Card>
          <Card title="Today">
            {today ? (
              <>
                <Stat label="Requests" value={today.requests} />
                <Stat label="L1 hits" value={today.cache.l1.hit} />
                <Stat label="L2 hits" value={today.cache.l2.hit} />
                <Stat label="API calls" value={today.apiCalls} />
                {today.apiErrors > 0 && <Stat label="API errors" value={today.apiErrors} className="text-red-500" />}
              </>
            ) : (
              <p className="text-sm text-gray-500">No data yet</p>
            )}
          </Card>
          <Card title="Yesterday">
            {yesterday ? (
              <>
                <Stat label="Requests" value={yesterday.requests} />
                <Stat label="L1 hits" value={yesterday.cache.l1.hit} />
                <Stat label="L2 hits" value={yesterday.cache.l2.hit} />
                <Stat label="API calls" value={yesterday.apiCalls} />
              </>
            ) : (
              <p className="text-sm text-gray-500">No data</p>
            )}
          </Card>
        </div>

        {/* Cache Status */}
        <div className="mb-6">
          <Card title="Cache Status">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <Stat label="Redis" value={cacheStats.status} />
              <Stat label="Memory" value={cacheStats.memory} />
              <Stat label="L1 keys" value={cacheStats.l1.keys} />
              <Stat label="Locations" value={cacheStats.l1.uniqueLocations} />
              <Stat label="L2 keys" value={cacheStats.l2.keys} />
            </div>
          </Card>
        </div>

        {/* Top Stats */}
        {today && (
          <div className="grid gap-4 sm:grid-cols-2">
            <RankList title="Top Countries" items={today.topCountries} />
            <RankList title="Top Locations" items={today.topLocations} />
            <RankList title="Top Methods" items={today.topMethods} />
            <RankList title="Top Languages" items={today.topLangs} />
          </div>
        )}
      </div>
    </PageLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h2>
      {children}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <p className={`text-sm ${className ?? 'text-gray-700 dark:text-gray-200'}`}>
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>{' '}
      <span className="font-medium">{typeof value === 'number' ? value.toLocaleString() : value}</span>
    </p>
  );
}

function RankList({ title, items }: { title: string; items: [string, number][] }) {
  if (!items.length) return null;
  return (
    <Card title={title}>
      <ul className="space-y-1">
        {items.map(([name, count]) => (
          <li key={name} className="flex justify-between text-sm text-gray-700 dark:text-gray-200">
            <span className="truncate">{name}</span>
            <span className="ml-2 font-medium">{count}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
