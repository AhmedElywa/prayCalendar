'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PublicStats {
  totalRequests: number;
  uniqueUsers: number;
  status: string;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function TrustBanner({ lang }: { lang: string }) {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats || stats.totalRequests === 0) return null;

  const isAr = lang === 'ar';

  return (
    <div className="border-t border-border-subtle">
      <div className="mx-auto max-w-[1200px] px-6 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {/* Stat items */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
            </span>
            <span className="text-[12px] text-text-muted">{isAr ? 'النظام يعمل' : 'Systems Operational'}</span>
          </div>

          <span className="text-border-subtle">|</span>

          <span className="text-[12px] text-text-muted">
            <span className="font-semibold tabular-nums text-text-secondary">{formatCompact(stats.totalRequests)}</span>{' '}
            {isAr ? 'تقويم تم إنشاؤه' : 'calendars generated'}
          </span>

          <span className="text-border-subtle">|</span>

          <span className="text-[12px] text-text-muted">
            <span className="font-semibold tabular-nums text-text-secondary">{formatCompact(stats.uniqueUsers)}</span>{' '}
            {isAr ? 'مستخدم حول العالم' : 'users worldwide'}
          </span>

          <span className="text-border-subtle">|</span>

          <Link
            href="/status"
            className="text-[12px] font-medium text-gold no-underline transition hover:text-gold-light"
          >
            {isAr ? 'عرض الحالة' : 'Live status'} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
