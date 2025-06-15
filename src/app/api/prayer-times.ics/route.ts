import { NextRequest, NextResponse } from 'next/server';
import { getPrayerTimes } from '../../../prayerTimes';
import ical, { ICalAlarmType } from 'ical-generator';
import moment from 'moment/moment';

/**
 * Generates a cache tag for this request based on all parameters
 */
function generateCacheTag(allRequestParams: Record<string, string>): string {
  const date = moment().format('YYYY-MM-DD');

  // Include all parameters that affect the output
  const paramHash = Buffer.from(
    JSON.stringify({
      ...allRequestParams,
      date,
    }),
  )
    .toString('base64')
    .substring(0, 20);

  return `prayer-times-${paramHash}-${date}`;
}

/**
 * Calculates appropriate cache duration based on current time
 * Shorter cache near midnight to ensure fresh data for new day
 */
function calculateCacheDuration(): { maxAge: number; swr: number } {
  const now = moment();
  const midnight = moment().add(1, 'day').startOf('day');
  const hoursUntilMidnight = midnight.diff(now, 'hours');

  if (hoursUntilMidnight <= 2) {
    // Near midnight: shorter cache to ensure fresh data
    return { maxAge: 3600, swr: 1800 }; // 1 hour cache, 30 min SWR
  } else if (hoursUntilMidnight <= 6) {
    // Morning: medium cache
    return { maxAge: 14400, swr: 3600 }; // 4 hour cache, 1 hour SWR
  } else {
    // Rest of day: full cache
    return { maxAge: 86400, swr: 3600 }; // 24 hour cache, 1 hour SWR
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Extract query parameters
  const alarm = searchParams.get('alarm');
  const duration = searchParams.get('duration');
  const events = searchParams.get('events');
  const lang = searchParams.get('lang') || 'en';
  const months = searchParams.get('months');

  // Collect ALL request parameters for cache key generation
  const allRequestParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    allRequestParams[key] = value;
  }
  // Ensure lang has a value for cache key consistency
  allRequestParams.lang = lang;

  // Build query params object for getPrayerTimes (excluding UI-specific params)
  const queryParams: any = {};
  for (const [key, value] of searchParams.entries()) {
    if (!['alarm', 'duration', 'events', 'lang', 'months'].includes(key)) {
      queryParams[key] = value;
    }
  }

  // Validate required parameters
  if (!queryParams.address && (!queryParams.latitude || !queryParams.longitude)) {
    return NextResponse.json({ message: 'Either address or latitude/longitude is required' }, { status: 400 });
  }

  try {
    // Fetch calendar data – now accepts address OR latitude/longitude
    // Pass all request parameters for comprehensive cache key generation
    const days = await getPrayerTimes(queryParams, months ? +months : 3, allRequestParams);
    if (!days) {
      return NextResponse.json({ message: 'Invalid address or coordinates' }, { status: 400 });
    }

    /* ------------------------------------------------------------------ */
    /* build calendar                                                     */
    /* ------------------------------------------------------------------ */

    const allEvents = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
    const arabicNames: Record<string, string> = {
      Fajr: 'الفجر',
      Sunrise: 'الشروق',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء',
      Midnight: 'منتصف الليل',
    };

    const allowedEvents = events
      ? events
          .split(',')
          .map((index) => allEvents[parseInt(index, 10)])
          .filter(Boolean)
      : allEvents;

    const calendar = ical({
      name: lang === 'ar' ? 'مواقيت الصلاة' : 'Prayer Times',
      timezone: days[0].meta.timezone,
    });

    for (const day of days) {
      if (moment(day.date.gregorian.date, 'DD-MM-YYYY').isBefore(moment(), 'day')) continue;

      for (const [name, time] of Object.entries(day.timings)) {
        if (!allowedEvents.includes(name)) continue;

        const startDate = moment(`${day.date.gregorian.date} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
        const defaultDuration = name === 'Sunrise' ? 10 : name === 'Midnight' ? 1 : duration ? +duration : 25;

        const event = calendar.createEvent({
          start: startDate,
          end: moment(startDate).add(defaultDuration, 'minute').toDate(),
          summary: lang === 'ar' ? arabicNames[name] || name : name,
          timezone: day.meta.timezone,
        });

        if (alarm) {
          const alarmValues = alarm
            .split(',')
            .map((a) => parseInt(a, 10))
            .filter((a) => !isNaN(a));

          for (const a of alarmValues) {
            if (a > 0) {
              event.createAlarm({ type: ICalAlarmType.audio, triggerBefore: a * 60 });
            } else if (a < 0) {
              event.createAlarm({ type: ICalAlarmType.audio, triggerAfter: Math.abs(a) * 60 });
            } else {
              event.createAlarm({ type: ICalAlarmType.audio, trigger: 0 });
            }
          }
        }
      }
    }

    // Calculate dynamic cache duration
    const { maxAge, swr } = calculateCacheDuration();
    const cacheTag = generateCacheTag(allRequestParams);

    // Generate cache control header
    const cacheControl = [`s-maxage=${maxAge}`, `stale-while-revalidate=${swr}`, 'public', 'must-revalidate'].join(
      ', ',
    );

    return new NextResponse(calendar.toString(), {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': cacheControl,
        'Cache-Tag': cacheTag,
        Vary: 'Accept-Encoding',
        // Add ETag for better cache validation
        ETag: `"${Buffer.from(cacheTag).toString('base64')}"`,
        // Add last modified header
        'Last-Modified': moment().startOf('day').utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]'),
        // CORS headers for better browser caching
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age': '86400',
      },
    });
  } catch (error) {
    console.error('Error generating prayer times calendar:', error);
    return NextResponse.json({ message: 'Internal server error while generating calendar' }, { status: 500 });
  }
}
