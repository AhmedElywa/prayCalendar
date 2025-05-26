import axios from 'axios';
import moment from 'moment/moment';

/* ------------------------------------------------------------------ */
/*  Types from AlAdhan “calendar” endpoint --------------------------- */
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
  return !isNaN(num) && num >= min && num <= max;
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
/*  Main helper exposed to the API route                              */
/* ------------------------------------------------------------------ */

/**
 * Fetches prayer-time calendar for a span of months starting today.
 * Uses address-based or coordinate-based “from / to” endpoints to minimise
 * network round-trips (1 request vs 12).
 *
 * @param params      Raw query object from API route
 * @param monthsCount Span in months (defaults to 3)
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

  /* ----------------------------- range build ----------------------- */
  const start = moment().startOf('day').format('DD-MM-YYYY');
  const end = moment()
    .add(monthsCount - 1, 'month')
    .endOf('month')
    .format('DD-MM-YYYY');

  const baseUrl = convertedParams.address
    ? `https://api.aladhan.com/v1/calendarByAddress/from/${start}/to/${end}`
    : `https://api.aladhan.com/v1/calendar/from/${start}/to/${end}`;

  /* ----------------------------- fetch ----------------------------- */
  try {
    const { data } = await axios.get<Response>(baseUrl, { params: convertedParams });
    return data.data;
  } catch (error) {
    console.error(error);
  }
}
