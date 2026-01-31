import { createHash } from 'node:crypto';
import moment from 'moment/moment';
import { getRedis } from './redis';

const L1_TTL = 7 * 24 * 60 * 60; // 7 days

type Day = any;

/* ---- Location normalization ---- */

export function normalizeLocation(params: {
  address?: string;
  latitude?: string | number;
  longitude?: string | number;
}): string {
  if (params.address) {
    return String(params.address).toLowerCase().trim().replace(/\s+/g, '-');
  }
  return `${Number(params.latitude).toFixed(2)},${Number(params.longitude).toFixed(2)}`;
}

/* ---- Key builders ---- */

function prayerDataKey(location: string, method: number, school: number, yearMonth: string): string {
  return `pt:${location}:${method}:${school}:${yearMonth}`;
}

function icsKey(allParams: Record<string, string>): string {
  const date = moment().format('YYYY-MM-DD');
  const sorted = Object.keys(allParams)
    .sort()
    .reduce(
      (acc, k) => {
        acc[k] = allParams[k];
        return acc;
      },
      {} as Record<string, string>,
    );
  const hash = createHash('sha256').update(JSON.stringify(sorted)).digest('hex').slice(0, 16);
  return `ics:${hash}:${date}`;
}

/* ---- L1: Prayer data per month ---- */

export async function getCachedMonths(
  location: string,
  method: number,
  school: number,
  months: string[],
): Promise<{ cached: Map<string, Day[]>; missing: string[] }> {
  const cached = new Map<string, Day[]>();
  const missing: string[] = [];

  const redis = await getRedis();
  if (!redis) return { cached, missing: months };

  try {
    const keys = months.map((m) => prayerDataKey(location, method, school, m));
    const values = await redis.mGet(keys);
    for (let i = 0; i < months.length; i++) {
      if (values[i]) {
        cached.set(months[i], JSON.parse(values[i] as string));
      } else {
        missing.push(months[i]);
      }
    }
  } catch {
    return { cached, missing: months };
  }

  return { cached, missing };
}

export async function setCachedMonth(
  location: string,
  method: number,
  school: number,
  yearMonth: string,
  days: Day[],
): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  try {
    await redis.set(prayerDataKey(location, method, school, yearMonth), JSON.stringify(days), { EX: L1_TTL });
  } catch {
    /* skip */
  }
}

/* ---- L2: Full ICS string ---- */

export async function getCachedICS(allParams: Record<string, string>): Promise<string | null> {
  const redis = await getRedis();
  if (!redis) return null;
  try {
    return await redis.get(icsKey(allParams));
  } catch {
    return null;
  }
}

export async function setCachedICS(allParams: Record<string, string>, icsString: string): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;
  try {
    const midnight = moment().add(1, 'day').startOf('day');
    const ttl = Math.max(midnight.diff(moment(), 'seconds'), 60);
    await redis.set(icsKey(allParams), icsString, { EX: ttl });
  } catch {
    /* skip */
  }
}
