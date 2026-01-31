import { logger } from 'lib/axiom/server';
import { getCachedMonths, normalizeLocation, setCachedMonth } from 'lib/cache';
import moment from 'moment/moment';

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
/*  Fetch a single date range from AlAdhan API                        */
/* ------------------------------------------------------------------ */

async function fetchRange(
  convertedParams: Params,
  start: string,
  end: string,
  log: ReturnType<typeof logger.with>,
): Promise<Day[]> {
  const baseUrl = convertedParams.address
    ? `https://api.aladhan.com/v1/calendarByAddress/from/${start}/to/${end}`
    : `https://api.aladhan.com/v1/calendar/from/${start}/to/${end}`;

  const url = new URL(baseUrl);
  Object.entries(convertedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const maxRetries = 3;
  let lastError: Error | null = null;
  const fetchStart = Date.now();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log.info('AlAdhan API request', { attempt, maxRetries, url: url.toString() });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url.toString(), {
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

      log.info('AlAdhan API request succeeded', {
        attempt,
        daysReturned: data.data.length,
        durationMs: Date.now() - fetchStart,
        address: convertedParams.address,
        latitude: convertedParams.latitude,
        longitude: convertedParams.longitude,
      });

      return data.data;
    } catch (error) {
      lastError = error as Error;
      log.warn('AlAdhan API attempt failed', { attempt, maxRetries, error: lastError.message });

      if (attempt === maxRetries) break;

      const delayMs = 2 ** (attempt - 1) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError || new Error('Failed to fetch prayer times');
}

/* ------------------------------------------------------------------ */
/*  Group months into contiguous ranges for minimal API calls          */
/* ------------------------------------------------------------------ */

function groupContiguousMonths(months: string[]): { start: string; end: string }[] {
  if (months.length === 0) return [];

  const sorted = [...months].sort();
  const ranges: { start: string; end: string }[] = [];
  let rangeStart = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const expected = moment(prev, 'YYYY-MM').add(1, 'month').format('YYYY-MM');
    if (sorted[i] === expected) {
      prev = sorted[i];
    } else {
      ranges.push({ start: rangeStart, end: prev });
      rangeStart = sorted[i];
      prev = sorted[i];
    }
  }
  ranges.push({ start: rangeStart, end: prev });
  return ranges;
}

/* ------------------------------------------------------------------ */
/*  Main helper exposed to the API route                              */
/* ------------------------------------------------------------------ */

/**
 * Fetches prayer-time calendar for a span of months starting today.
 * Uses L1 Redis cache per month — only fetches missing months from AlAdhan.
 */
export async function getPrayerTimes(
  params: Record<keyof Params, string>,
  monthsCount: number = 3,
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

  const log = logger.with({ source: 'prayerTimes' });

  /* ---- determine needed months ---- */
  const startMoment = moment().subtract(1, 'day');
  const endMoment = moment()
    .add(monthsCount - 1, 'month')
    .endOf('month');

  const neededMonths: string[] = [];
  const cursor = startMoment.clone().startOf('month');
  while (cursor.isSameOrBefore(endMoment, 'month')) {
    neededMonths.push(cursor.format('YYYY-MM'));
    cursor.add(1, 'month');
  }

  /* ---- check L1 cache ---- */
  const location = normalizeLocation(params);
  const method = convertedParams.method;
  const school = convertedParams.school;

  const { cached, missing } = await getCachedMonths(location, method, school, neededMonths);

  log.info('L1 cache check', {
    neededMonths: neededMonths.length,
    cachedMonths: cached.size,
    missingMonths: missing.length,
    location,
  });

  /* ---- fetch missing months ---- */
  if (missing.length > 0) {
    const ranges = groupContiguousMonths(missing);

    for (const range of ranges) {
      const rangeStart = moment(range.start, 'YYYY-MM').startOf('month');
      const rangeEnd = moment(range.end, 'YYYY-MM').endOf('month');

      // Use the same 1-day-early trick for the first range if it includes today's month
      const fetchStart =
        range.start === neededMonths[0]
          ? moment().subtract(1, 'day').format('DD-MM-YYYY')
          : rangeStart.format('DD-MM-YYYY');
      const fetchEnd = rangeEnd.format('DD-MM-YYYY');

      try {
        const days = await fetchRange(convertedParams, fetchStart, fetchEnd, log);

        // Group fetched days by YYYY-MM and store each month in L1
        const byMonth = new Map<string, Day[]>();
        for (const day of days) {
          const ym = moment(day.date.gregorian.date, 'DD-MM-YYYY').format('YYYY-MM');
          if (!byMonth.has(ym)) byMonth.set(ym, []);
          byMonth.get(ym)!.push(day);
        }

        for (const [ym, monthDays] of byMonth) {
          cached.set(ym, monthDays);
          setCachedMonth(location, method, school, ym, monthDays); // fire-and-forget
        }
      } catch (error) {
        log.error('Failed to fetch prayer times range', {
          range,
          error: (error as Error).message,
        });
        await log.flush();
        return undefined;
      }
    }
  }

  await logger.flush();

  /* ---- merge all months and sort ---- */
  const allDays: Day[] = [];
  for (const ym of neededMonths) {
    const monthData = cached.get(ym);
    if (monthData) allDays.push(...monthData);
  }

  allDays.sort((a, b) => {
    const da = moment(a.date.gregorian.date, 'DD-MM-YYYY');
    const db = moment(b.date.gregorian.date, 'DD-MM-YYYY');
    return da.diff(db);
  });

  return allDays;
}
