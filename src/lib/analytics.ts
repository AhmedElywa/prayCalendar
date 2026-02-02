import { getRedis } from 'lib/redis';

interface TrackParams {
  location: string;
  method: string;
  lang: string;
  l1Status: 'hit' | 'miss' | 'partial';
  l2Status: 'hit' | 'miss';
  apiCalls: number;
  apiErrors: number;
  country: string;
  ip: string;
}

const TTL_48H = 48 * 60 * 60;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function trackRequest(params: TrackParams): void {
  // Fire-and-forget — don't await
  doTrack(params).catch(() => {});
}

async function doTrack(params: TrackParams): Promise<void> {
  const redis = await getRedis();
  if (!redis) return;

  const date = today();
  const dailyKey = `stats:daily:${date}`;
  const locKey = `stats:locations:${date}`;
  const countryKey = `stats:countries:${date}`;
  const methodKey = `stats:methods:${date}`;
  const langKey = `stats:langs:${date}`;

  const multi = redis.multi();

  // Daily counters
  multi.hIncrBy(dailyKey, 'requests', 1);
  multi.hIncrBy(dailyKey, `l1:${params.l1Status}`, 1);
  multi.hIncrBy(dailyKey, `l2:${params.l2Status}`, 1);
  if (params.apiCalls > 0) multi.hIncrBy(dailyKey, 'api_calls', params.apiCalls);
  if (params.apiErrors > 0) multi.hIncrBy(dailyKey, 'api_errors', params.apiErrors);
  multi.expire(dailyKey, TTL_48H);

  // Sorted sets
  multi.zIncrBy(locKey, 1, params.location);
  multi.expire(locKey, TTL_48H);
  multi.zIncrBy(countryKey, 1, params.country);
  multi.expire(countryKey, TTL_48H);
  multi.zIncrBy(methodKey, 1, params.method);
  multi.expire(methodKey, TTL_48H);
  multi.zIncrBy(langKey, 1, params.lang);
  multi.expire(langKey, TTL_48H);

  // All-time
  multi.hIncrBy('stats:total', 'requests', 1);

  // HyperLogLog for unique IPs
  multi.pfAdd('stats:ips', params.ip);

  await multi.exec();
}

async function getDayStats(date: string) {
  const redis = await getRedis();
  if (!redis) return null;

  const daily = await redis.hGetAll(`stats:daily:${date}`);
  const topLocations = await redis.zRangeWithScores(`stats:locations:${date}`, 0, 9, { REV: true });
  const topCountries = await redis.zRangeWithScores(`stats:countries:${date}`, 0, 9, { REV: true });
  const topMethods = await redis.zRangeWithScores(`stats:methods:${date}`, 0, 9, { REV: true });
  const topLangs = await redis.zRangeWithScores(`stats:langs:${date}`, 0, 9, { REV: true });

  const n = (key: string) => Number(daily[key] || 0);

  return {
    requests: n('requests'),
    cache: {
      l1: { hit: n('l1:hit'), miss: n('l1:miss'), partial: n('l1:partial') },
      l2: { hit: n('l2:hit'), miss: n('l2:miss') },
    },
    apiCalls: n('api_calls'),
    apiErrors: n('api_errors'),
    topLocations: topLocations.map((e) => [e.value, e.score]),
    topCountries: topCountries.map((e) => [e.value, e.score]),
    topMethods: topMethods.map((e) => [e.value, e.score]),
    topLangs: topLangs.map((e) => [e.value, e.score]),
  };
}

export async function getAnalytics() {
  const redis = await getRedis();
  if (!redis) return null;

  const [todayStats, yesterdayStats, total, uniqueUsers] = await Promise.all([
    getDayStats(today()),
    getDayStats(yesterday()),
    redis.hGetAll('stats:total'),
    redis.pfCount('stats:ips'),
  ]);

  return {
    today: todayStats,
    yesterday: yesterdayStats,
    allTime: {
      requests: Number(total.requests || 0),
      uniqueUsers: uniqueUsers,
    },
  };
}
