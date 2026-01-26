import moment from 'moment/moment';
import { cacheMonitor, checkCacheHealth, estimateCacheSize, isValidCacheKey } from './utils/cacheUtils';

/* ------------------------------------------------------------------ */
/*  Types from AlAdhan "calendar" endpoint --------------------------- */
/* ------------------------------------------------------------------ */

type Day = {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
    Firstthird: string;
    Lastthird: string;
  };
  date: {
    readable: string;
    timestamp: string;
    gregorian: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string };
      month: { number: number; en: string };
      year: string;
      designation: { abbreviated: string; expanded: string };
    };
    hijri: {
      date: string;
      format: string;
      day: string;
      weekday: { en: string; ar: string };
      month: { number: number; en: string; ar: string };
      year: string;
      designation: { abbreviated: string; expanded: string };
      holidays: string[];
    };
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
      id: number;
      name: string;
      params: { Fajr: number; Isha: number };
      location: { latitude: number; longitude: number };
    };
    latitudeAdjustmentMethod: string;
    midnightMode: string;
    school: string;
    offset: {
      Imsak: number;
      Fajr: number;
      Sunrise: number;
      Dhuhr: number;
      Asr: number;
      Maghrib: number;
      Sunset: number;
      Isha: number;
      Midnight: number;
    };
  };
};

interface Params {
  /** free-text location (optional when latitude/longitude supplied) */
  address?: string;
  /** coordinate mode */
  latitude?: number;
  longitude?: number;

  method: 0 | 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
  x7xapikey: string;
  annual: boolean;
  shafaq: 'general' | 'ahmer' | 'abyad';
  tune: string;
  school: 0 | 1;
  midnightMode: 0 | 1;
  latitudeAdjustmentMethod: 1 | 2 | 3;
  adjustment: number;
  iso8601: boolean;
}

type Response = {
  code: number;
  status: string;
  data: Day[];
};

/* ------------------------------------------------------------------ */
/*  Type-guard helpers (unchanged)                                    */
/* ------------------------------------------------------------------ */

function isEnumValue<T extends number>(value: any, min: T, max: T): value is T {
  const num = Number(value);
  return !Number.isNaN(num) && num >= min && num <= max;
}

function toMethod(value: any): Params['method'] {
  return isEnumValue(value, 0, 23) ? (Number(value) as Params['method']) : 0;
}
function toSchool(value: any): Params['school'] {
  return isEnumValue(value, 0, 1) ? (Number(value) as Params['school']) : 0;
}
function toMidnightMode(value: any): Params['midnightMode'] {
  return isEnumValue(value, 0, 1) ? (Number(value) as Params['midnightMode']) : 0;
}
function toLatitudeAdjustmentMethod(value: any): Params['latitudeAdjustmentMethod'] {
  return isEnumValue(value, 1, 3) ? (Number(value) as Params['latitudeAdjustmentMethod']) : 1;
}

/* ------------------------------------------------------------------ */
/*  In-Memory Cache Implementation                                    */
/* ------------------------------------------------------------------ */

interface CacheEntry {
  data: Response['data'];
  timestamp: number;
  timezone: string;
}

// Simple in-memory cache - persists across function invocations in the same instance
const prayerTimesCache = new Map<string, CacheEntry>();

// Cache TTL: 1 day (86400 seconds)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Generates a cache key from parameters
 */
function generateCacheKey(params: Params, monthsCount: number, allRequestParams?: Record<string, string>): string {
  const keyParams = {
    // Location (either address or coordinates)
    address: params.address || '',
    latitude: params.latitude || 0,
    longitude: params.longitude || 0,
    // Prayer calculation parameters
    method: params.method,
    shafaq: params.shafaq,
    tune: params.tune || '',
    school: params.school,
    midnightMode: params.midnightMode,
    latitudeAdjustmentMethod: params.latitudeAdjustmentMethod,
    adjustment: params.adjustment,
    // Date range
    monthsCount,
    // Add current date to ensure daily cache invalidation
    date: moment().format('YYYY-MM-DD'),
    ...(allRequestParams || {}),
  };

  return JSON.stringify(keyParams);
}

/**
 * Checks if cache entry is still valid
 */
function isCacheValid(entry: CacheEntry): boolean {
  const now = Date.now();
  const age = now - entry.timestamp;

  // Check TTL
  if (age > CACHE_TTL_MS) {
    return false;
  }

  // Additional validation: ensure we haven't crossed midnight
  // Simple approach: if cache is older than 18 hours, consider it potentially stale
  // This accounts for timezone differences without requiring moment-timezone
  const CONSERVATIVE_TTL_MS = 18 * 60 * 60 * 1000; // 18 hours
  if (age > CONSERVATIVE_TTL_MS) {
    return false;
  }

  return true;
}

/**
 * Clean expired entries from cache
 */
function cleanCache(): void {
  for (const [key, entry] of prayerTimesCache.entries()) {
    if (!isCacheValid(entry)) {
      prayerTimesCache.delete(key);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Main helper exposed to the API route                              */
/* ------------------------------------------------------------------ */

/**
 * Fetches prayer-time calendar for a span of months starting today.
 * Uses address-based or coordinate-based "from / to" endpoints to minimise
 * network round-trips (1 request vs 12).
 *
 * @param params      Raw query object from API route
 * @param monthsCount Span in months (defaults to 3)
 * @param allRequestParams All original request parameters for cache key generation
 */
export async function getPrayerTimes(
  params: Record<keyof Params, string>,
  monthsCount: number = 3,
  allRequestParams?: Record<string, string>,
): Promise<Response['data'] | undefined> {
  /* ----------------------------- coercion -------------------------- */
  const convertedParams: Params = {
    ...params,
    latitude: params.latitude ? Number(params.latitude) : undefined,
    longitude: params.longitude ? Number(params.longitude) : undefined,
    method: toMethod(params.method),
    annual: params.annual === 'true',
    shafaq: (params.shafaq as Params['shafaq']) || 'general',
    school: toSchool(params.school),
    midnightMode: toMidnightMode(params.midnightMode),
    latitudeAdjustmentMethod: toLatitudeAdjustmentMethod(params.latitudeAdjustmentMethod),
    adjustment: params.adjustment ? Number(params.adjustment) : 0,
    iso8601: params.iso8601 === 'true',
  };

  /* ----------------------------- cache check ----------------------- */
  const cacheKey = generateCacheKey(convertedParams, monthsCount, allRequestParams);

  // Clean expired entries periodically
  if (Math.random() < 0.1) {
    // 10% chance to clean on each call
    cleanCache();
  }

  // Check if we have a valid cached response
  const cachedEntry = prayerTimesCache.get(cacheKey);
  if (cachedEntry && isCacheValid(cachedEntry)) {
    cacheMonitor.recordHit();
    console.log('Cache hit for prayer times:', {
      cacheKey: `${cacheKey.substring(0, 100)}...`,
      age: Date.now() - cachedEntry.timestamp,
      cacheSize: estimateCacheSize(prayerTimesCache),
    });
    return cachedEntry.data;
  }

  if (cachedEntry) {
    console.log('Cache entry found but invalid, fetching fresh data');
  }

  /* ----------------------------- range build ----------------------- */
  const start = moment().startOf('day').format('DD-MM-YYYY');
  const end = moment()
    .add(monthsCount - 1, 'month')
    .endOf('month')
    .format('DD-MM-YYYY');

  const baseUrl = convertedParams.address
    ? `https://api.aladhan.com/v1/calendarByAddress/from/${start}/to/${end}`
    : `https://api.aladhan.com/v1/calendar/from/${start}/to/${end}`;

  /* ----------------------------- fetch with retries --------- */
  try {
    cacheMonitor.recordMiss();
    console.log('Cache miss, fetching from AlAdhan API:', {
      cacheKey: `${cacheKey.substring(0, 100)}...`,
      url: baseUrl,
      cacheSize: estimateCacheSize(prayerTimesCache),
      cacheStats: cacheMonitor.getStats(),
    });

    // Build URL with parameters
    const url = new URL(baseUrl);
    Object.entries(convertedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    // Retry logic with exponential backoff
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`AlAdhan API request attempt ${attempt}/${maxRetries}:`, url.toString());

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(url.toString(), {
          // Next.js data cache - cache for 1 day
          next: { revalidate: 86400 },
          headers: {
            Accept: 'application/json',
            'User-Agent': 'PrayerCalendar/1.0',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: Response = await response.json();

        if (data.code !== 200 || !data.data) {
          throw new Error(`AlAdhan API error: ${data.status || 'Unknown error'}`);
        }

        console.log(`AlAdhan API request succeeded on attempt ${attempt}`);

        // Store in memory cache
        const timezone = data.data[0]?.meta?.timezone || 'UTC';
        if (isValidCacheKey(cacheKey)) {
          prayerTimesCache.set(cacheKey, {
            data: data.data,
            timestamp: Date.now(),
            timezone,
          });
        }

        console.log('Successfully cached prayer times:', {
          cacheKey: `${cacheKey.substring(0, 100)}...`,
          dataPoints: data.data.length,
          timezone,
          newCacheSize: estimateCacheSize(prayerTimesCache),
        });

        // Periodic cache health check
        if (Math.random() < 0.05) {
          // 5% chance
          const health = checkCacheHealth(prayerTimesCache);
          if (!health.isHealthy) {
            console.warn('Cache health issues detected:', health);
          }
        }

        return data.data;
      } catch (error) {
        lastError = error as Error;
        console.warn(`AlAdhan API attempt ${attempt}/${maxRetries} failed:`, {
          error: lastError.message,
          name: lastError.name,
        });

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff: wait 1s, 2s, 4s between retries
        const delayMs = 2 ** (attempt - 1) * 1000;
        console.log(`Waiting ${delayMs}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    // If we get here, all retries failed
    throw lastError || new Error('All retry attempts failed');
  } catch (error) {
    cacheMonitor.recordError();
    console.error('Failed to fetch prayer times:', error);

    // Fallback: return stale cache if available
    if (cachedEntry) {
      console.log('Returning stale cache due to fetch error');
      return cachedEntry.data;
    }
  }
}
