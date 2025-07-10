import { NextRequest, NextResponse } from 'next/server';
import { getPrayerTimes } from '../../../prayerTimes';
import ical, { ICalAlarmType, ICalCalendarMethod } from 'ical-generator';
import moment from 'moment/moment';
import { translations } from '../../../constants/translations';

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

/**
 * Checks if a given day is in Ramadan based on Hijri calendar data
 * Ramadan is the 9th month in the Hijri calendar
 */
function isRamadan(day: any): boolean {
  return day.date?.hijri?.month?.number === 9;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Extract query parameters
  const alarm = searchParams.get('alarm');
  const duration = searchParams.get('duration');
  const events = searchParams.get('events');
  const lang = searchParams.get('lang') || 'en';
  const months = searchParams.get('months');

  // Extract Ramadan mode parameters
  const ramadanMode = searchParams.get('ramadanMode') === 'true';
  const iftarDuration = parseInt(searchParams.get('iftarDuration') || '30', 10);
  const traweehDuration = parseInt(searchParams.get('traweehDuration') || '60', 10);
  const suhoorDuration = parseInt(searchParams.get('suhoorDuration') || '30', 10);

  // Collect ALL request parameters for cache key generation
  const allRequestParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    allRequestParams[key] = value;
  }
  // Ensure lang has a value for cache key consistency
  allRequestParams.lang = lang;

  // Sanitize months parameter
  let monthsCount = 3;
  if (months !== null) {
    const parsed = parseInt(months, 10);
    if (!isNaN(parsed)) {
      monthsCount = Math.min(Math.max(parsed, 1), 11);
    }
    allRequestParams.months = monthsCount.toString();
  }

  // Build query params object for getPrayerTimes (excluding UI-specific params)
  const queryParams: any = {};
  for (const [key, value] of searchParams.entries()) {
    if (
      ![
        'alarm',
        'duration',
        'events',
        'lang',
        'months',
        'ramadanMode',
        'iftarDuration',
        'traweehDuration',
        'suhoorDuration',
      ].includes(key)
    ) {
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
    const days = await getPrayerTimes(queryParams, monthsCount, allRequestParams);
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
      Iftar: 'الإفطار',
      Tarawih: 'التراويح',
      Suhoor: 'السحور',
    };

    const allowedEvents = events
      ? events
          .split(',')
          .map((index) => allEvents[parseInt(index, 10)])
          .filter(Boolean)
      : allEvents;

    const calendarName = translations[lang as keyof typeof translations].calendarName;

    const calendar = ical({
      name: calendarName,
      timezone: days[0].meta.timezone,
      prodId: {
        company: 'PrayerCalendar',
        product: 'Prayer Calendar',
        language: 'EN',
      },
      method: ICalCalendarMethod.PUBLISH,
      scale: 'GREGORIAN',
    });

    // Add additional calendar properties for better calendar app compatibility
    calendar.x([
      {
        key: 'X-WR-CALNAME',
        value: calendarName,
      },
      {
        key: 'X-WR-TIMEZONE',
        value: days[0].meta.timezone,
      },
    ]);

    // Helper function to add alarms to an event
    const addAlarmsToEvent = (event: any, alarmString: string | null) => {
      if (!alarmString) return;

      const alarmValues = alarmString
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
    };

    for (const day of days) {
      if (moment(day.date.gregorian.date, 'DD-MM-YYYY').isBefore(moment(), 'day')) continue;

      // Check if current day is in Ramadan for Ramadan mode
      const isRamadanDay = ramadanMode && isRamadan(day);

      for (const [name, time] of Object.entries(day.timings)) {
        if (!allowedEvents.includes(name)) continue;

        const startDate = moment(`${day.date.gregorian.date} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
        let eventDuration = name === 'Sunrise' ? 10 : name === 'Midnight' ? 1 : duration ? +duration : 25;

        // Keep original prayer durations even in Ramadan mode
        // We'll create separate events for Iftar and Tarawih below

        const event = calendar.createEvent({
          start: startDate,
          end: moment(startDate).add(eventDuration, 'minute').toDate(),
          summary: lang === 'ar' ? arabicNames[name] || name : name,
          timezone: day.meta.timezone,
        });

        addAlarmsToEvent(event, alarm);

        // Create separate Iftar and Tarawih events during Ramadan
        if (isRamadanDay) {
          if (name === 'Fajr' && suhoorDuration > 0) {
            // Create Suhoor event before Fajr prayer
            const suhoorStartDate = moment(startDate).subtract(suhoorDuration, 'minute').toDate();
            const suhoorEvent = calendar.createEvent({
              start: suhoorStartDate,
              end: startDate,
              summary: lang === 'ar' ? arabicNames['Suhoor'] : 'Suhoor',
              timezone: day.meta.timezone,
            });

            addAlarmsToEvent(suhoorEvent, alarm);
          }

          if (name === 'Maghrib') {
            // Create Iftar event after Maghrib prayer
            const iftarStartDate = moment(startDate).add(eventDuration, 'minute').toDate();
            const iftarEvent = calendar.createEvent({
              start: iftarStartDate,
              end: moment(iftarStartDate).add(iftarDuration, 'minute').toDate(),
              summary: lang === 'ar' ? arabicNames['Iftar'] : 'Iftar',
              timezone: day.meta.timezone,
            });

            addAlarmsToEvent(iftarEvent, alarm);
          }

          if (name === 'Isha' && traweehDuration > 0) {
            // Create Tarawih event after Isha prayer (only if duration > 0)
            const tarawihStartDate = moment(startDate).add(eventDuration, 'minute').toDate();
            const tarawihEvent = calendar.createEvent({
              start: tarawihStartDate,
              end: moment(tarawihStartDate).add(traweehDuration, 'minute').toDate(),
              summary: lang === 'ar' ? arabicNames['Tarawih'] : 'Tarawih',
              timezone: day.meta.timezone,
            });

            addAlarmsToEvent(tarawihEvent, alarm);
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

    console.log('Generated prayer times calendar:', {
      location: queryParams.address || `${queryParams.latitude},${queryParams.longitude}`,
      events: allowedEvents.length,
      days: days.length,
      cacheTag,
      cacheControl,
    });

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
