import ical, { ICalAlarmType, ICalCalendarMethod, ICalEventBusyStatus, ICalEventTransparency } from 'ical-generator';
import { trackRequest } from 'lib/analytics';
import { getCachedICS, getCoordinates, normalizeIcsParams, normalizeLocation, setCachedICS } from 'lib/cache';
import { formatQiblaText } from 'lib/qibla';
import moment from 'moment-timezone';
import { type NextRequest, NextResponse } from 'next/server';
import { getDuaForPrayer } from '../../../constants/duaData';
import { translations } from '../../../constants/translations';
import { getPrayerTimes } from '../../../prayerTimes';

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
  const color = searchParams.get('color');
  const months = searchParams.get('months');

  // Extract travel mode parameter
  const traveler = searchParams.get('traveler') === 'true';

  // Extract Jumu'ah mode parameters
  const jumuahMode = searchParams.get('jumuah') === 'true';
  const jumuahDurationParam = parseInt(searchParams.get('jumuahDuration') || '60', 10);

  // Extract Qibla direction parameter
  const qiblaMode = searchParams.get('qibla') === 'true';

  // Extract Du'a/Adhkar parameter
  const duaMode = searchParams.get('dua') === 'true';

  // Extract Iqama offset parameter (comma-separated per prayer: Fajr,Sunrise,Dhuhr,Asr,Maghrib,Isha,Midnight)
  const iqamaParam = searchParams.get('iqama');
  const iqamaOffsets = iqamaParam
    ? iqamaParam.split(',').map((v) => Math.min(60, Math.max(0, parseInt(v, 10) || 0)))
    : [];

  // Extract Ramadan mode parameters
  const ramadanMode = searchParams.get('ramadanMode') === 'true';
  const iftarDuration = parseInt(searchParams.get('iftarDuration') || '30', 10);
  const traweehDuration = parseInt(searchParams.get('traweehDuration') || '60', 10);
  const suhoorDuration = parseInt(searchParams.get('suhoorDuration') || '30', 10);

  // Extract Hijri display parameters
  // hijri: 'title' | 'desc' | 'both' | 'none' (default: 'desc')
  const hijriMode = (searchParams.get('hijri') || 'desc') as 'title' | 'desc' | 'both' | 'none';
  const hijriHolidays = searchParams.get('hijriHolidays') === 'true';

  // Extract busy status parameter
  const busy = searchParams.get('busy') === 'true';

  // Extract weekdays parameter (comma-separated indices: 0=Sun, 1=Mon, ..., 6=Sat)
  const weekdaysParam = searchParams.get('weekdays');
  const allowedWeekDays = weekdaysParam
    ? weekdaysParam
        .split(',')
        .map((v) => parseInt(v, 10))
        .filter((v) => !Number.isNaN(v) && v >= 0 && v <= 6)
    : [0, 1, 2, 3, 4, 5, 6]; // All days by default

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
    if (!Number.isNaN(parsed)) {
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
        'traveler',
        'jumuah',
        'jumuahDuration',
        'color',
        'qibla',
        'dua',
        'iqama',
        'busy',
        'weekdays',
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
    // Resolve address → coordinates for L2 cache normalization
    let resolvedCoords: string | null = null;
    if (queryParams.address) {
      const addressKey = normalizeLocation(queryParams);
      resolvedCoords = await getCoordinates(addressKey);
    }
    const normalizedParams = normalizeIcsParams(allRequestParams, resolvedCoords ?? undefined);

    // L2 cache: check for cached ICS string
    const cached = await getCachedICS(normalizedParams);
    if (cached) {
      const { maxAge, swr } = calculateCacheDuration();
      const cacheTag = generateCacheTag(allRequestParams);
      const cacheControl = [`s-maxage=${maxAge}`, `stale-while-revalidate=${swr}`, 'public', 'must-revalidate'].join(
        ', ',
      );

      const loc = allRequestParams.address || `${allRequestParams.latitude},${allRequestParams.longitude}`;

      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
      trackRequest({
        location: loc,

        lang,
        l1Status: 'hit',
        l2Status: 'hit',
        apiCalls: 0,
        apiErrors: 0,

        ip,
        timezone: cached.timezone,
      });

      return new NextResponse(cached.ics, {
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Cache-Control': cacheControl,
          'Cache-Tag': cacheTag,
          Vary: 'Accept-Encoding',
          ETag: `"${Buffer.from(cacheTag).toString('base64')}"`,
          'Last-Modified': moment().startOf('day').utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]'),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Fetch calendar data – now accepts address OR latitude/longitude
    const result = await getPrayerTimes(queryParams, monthsCount);
    if (!result) {
      return NextResponse.json({ message: 'Invalid address or coordinates' }, { status: 400 });
    }
    const { data: days, resolvedCoords: coordsFromApi, apiCalls, apiErrors } = result;

    // Update normalized params with coords from API if we didn't have them before
    if (coordsFromApi && !resolvedCoords) {
      Object.assign(normalizedParams, normalizeIcsParams(allRequestParams, coordsFromApi));
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
      Jumuah: 'الجمعة',
    };

    const allowedEvents = events
      ? events
          .split(',')
          .map((index) => allEvents[parseInt(index, 10)])
          .filter(Boolean)
      : allEvents;

    // Ensure lang is valid
    const validLang = ['en', 'ar'].includes(lang) ? lang : 'en';
    const calendarName = translations[validLang as keyof typeof translations].calendarName;

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

    // Add calendar color if valid hex
    if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
      calendar.x([{ key: 'X-APPLE-CALENDAR-COLOR', value: color }]);
    }

    // Helper function to add alarms to an event
    const addAlarmsToEvent = (event: any, alarmString: string | null) => {
      if (!alarmString) return;

      const alarmValues = alarmString
        .split(',')
        .map((a) => parseInt(a, 10))
        .filter((a) => !Number.isNaN(a));

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

    // Helper function to set busy status on an event
    const setBusyStatus = (event: any) => {
      if (busy) {
        event.transparency(ICalEventTransparency.OPAQUE);
        event.busystatus(ICalEventBusyStatus.BUSY);
      }
    };

    // Compute Qibla direction text once if enabled
    let qiblaText = '';
    if (qiblaMode) {
      const coords = resolvedCoords || coordsFromApi || `${queryParams.latitude},${queryParams.longitude}`;
      if (coords) {
        const [lat, lng] = coords.split(',').map(Number);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          const validLang = ['en', 'ar'].includes(lang) ? lang : 'en';
          qiblaText = formatQiblaText(lat, lng, validLang as 'en' | 'ar');
        }
      }
    }

    const userTimezone = days[0].meta.timezone;
    for (const day of days) {
      if (moment(day.date.gregorian.date, 'DD-MM-YYYY').isBefore(moment.utc().tz(userTimezone), 'day')) continue;

      // Check if current day is Friday for Jumu'ah mode
      const dayDate = moment(day.date.gregorian.date, 'DD-MM-YYYY');

      // Skip days not in allowedWeekDays
      if (!allowedWeekDays.includes(dayDate.day())) continue;

      // Check if current day is in Ramadan for Ramadan mode
      const isRamadanDay = ramadanMode && isRamadan(day);

      const isFriday = jumuahMode && dayDate.day() === 5;

      for (const [name, time] of Object.entries(day.timings)) {
        if (!allowedEvents.includes(name)) continue;

        // On Fridays with Jumu'ah mode, replace Dhuhr with Jumu'ah
        const isJumuah = isFriday && name === 'Dhuhr';
        const eventName = isJumuah
          ? lang === 'ar'
            ? arabicNames.Jumuah
            : "Jumu'ah"
          : lang === 'ar'
            ? arabicNames[name] || name
            : name;

        const startDate = moment(`${day.date.gregorian.date} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
        const isQasr = traveler && ['Dhuhr', 'Asr', 'Isha'].includes(name) && !isJumuah;
        const eventDuration = isJumuah
          ? jumuahDurationParam
          : isQasr
            ? 10
            : name === 'Sunrise'
              ? 10
              : name === 'Midnight'
                ? 1
                : duration
                  ? +duration
                  : 25;

        // Keep original prayer durations even in Ramadan mode
        // We'll create separate events for Iftar and Tarawih below

        // Build Hijri date string
        const hijri = day.date?.hijri;
        const hijriStr = hijri
          ? lang === 'ar'
            ? `${hijri.day} ${hijri.month?.ar || hijri.month?.en} ${hijri.year}`
            : `${hijri.day} ${hijri.month?.en} ${hijri.year}`
          : '';

        // Build event title with optional Hijri date
        const eventTitle =
          (hijriMode === 'title' || hijriMode === 'both') && hijriStr ? `${eventName} (${hijriStr})` : eventName;

        // Build description with optional hijri date, holidays, qasr info, etc.
        const descParts: string[] = [];
        if ((hijriMode === 'desc' || hijriMode === 'both') && hijriStr) {
          descParts.push(hijriStr);
        }
        // Add Hijri holidays if enabled and present
        if (hijriHolidays && hijri?.holidays && hijri.holidays.length > 0) {
          const holidayStr = hijri.holidays.join(', ');
          descParts.push(lang === 'ar' ? `🎉 ${holidayStr}` : `🎉 ${holidayStr}`);
        }
        if (qiblaText) descParts.push(qiblaText);
        if (isQasr) descParts.push(lang === 'ar' ? 'صلاة مقصورة (قصر) - ركعتان' : "Shortened prayer (Qasr) - 2 rak'at");
        if (duaMode) {
          const dayOfYear = moment(day.date.gregorian.date, 'DD-MM-YYYY').dayOfYear();
          const validLang = ['en', 'ar'].includes(lang) ? lang : 'en';
          const dua = getDuaForPrayer(name, dayOfYear, validLang as 'en' | 'ar');
          if (dua) descParts.push(dua);
        }

        const event = calendar.createEvent({
          start: startDate,
          end: moment(startDate).add(eventDuration, 'minute').toDate(),
          summary: eventTitle,
          timezone: day.meta.timezone,
          ...(descParts.length > 0 && { description: descParts.join('\n') }),
        });

        addAlarmsToEvent(event, alarm);
        setBusyStatus(event);

        // Create Iqama event if offset is set for this prayer
        const prayerIndex = allEvents.indexOf(name);
        const iqamaOffset = prayerIndex >= 0 && prayerIndex < iqamaOffsets.length ? iqamaOffsets[prayerIndex] : 0;
        if (iqamaOffset > 0) {
          const iqamaStart = moment(startDate).add(iqamaOffset, 'minute').toDate();
          const iqamaName = lang === 'ar' ? `إقامة ${arabicNames[name] || name}` : `Iqama ${eventName}`;
          const iqamaEvent = calendar.createEvent({
            start: iqamaStart,
            end: moment(iqamaStart).add(eventDuration, 'minute').toDate(),
            summary: iqamaName,
            timezone: day.meta.timezone,
          });
          addAlarmsToEvent(iqamaEvent, alarm);
          setBusyStatus(iqamaEvent);
        }

        // Create separate Iftar and Tarawih events during Ramadan
        if (isRamadanDay) {
          if (name === 'Fajr' && suhoorDuration > 0) {
            // Create Suhoor event before Fajr prayer
            const suhoorStartDate = moment(startDate).subtract(suhoorDuration, 'minute').toDate();
            const suhoorEvent = calendar.createEvent({
              start: suhoorStartDate,
              end: startDate,
              summary: lang === 'ar' ? arabicNames.Suhoor : 'Suhoor',
              timezone: day.meta.timezone,
            });

            addAlarmsToEvent(suhoorEvent, alarm);
            setBusyStatus(suhoorEvent);
          }

          if (name === 'Maghrib') {
            // Create Iftar event after Maghrib prayer
            const iftarStartDate = moment(startDate).add(eventDuration, 'minute').toDate();
            const iftarEvent = calendar.createEvent({
              start: iftarStartDate,
              end: moment(iftarStartDate).add(iftarDuration, 'minute').toDate(),
              summary: lang === 'ar' ? arabicNames.Iftar : 'Iftar',
              timezone: day.meta.timezone,
            });

            addAlarmsToEvent(iftarEvent, alarm);
            setBusyStatus(iftarEvent);
          }

          if (name === 'Isha' && traweehDuration > 0) {
            // Create Tarawih event after Isha prayer (only if duration > 0)
            const tarawihStartDate = moment(startDate).add(eventDuration, 'minute').toDate();
            const tarawihEvent = calendar.createEvent({
              start: tarawihStartDate,
              end: moment(tarawihStartDate).add(traweehDuration, 'minute').toDate(),
              summary: lang === 'ar' ? arabicNames.Tarawih : 'Tarawih',
              timezone: day.meta.timezone,
            });

            addAlarmsToEvent(tarawihEvent, alarm);
            setBusyStatus(tarawihEvent);
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

    const icsString = calendar.toString();

    // Store in L2 cache (fire-and-forget)
    setCachedICS(normalizedParams, icsString, days[0]?.meta.timezone);

    // Determine L1 status: if we had no API calls, L1 was a full hit
    const hadMissing = apiCalls > 0;
    const l1Status: 'hit' | 'miss' | 'partial' = hadMissing ? (resolvedCoords ? 'partial' : 'miss') : 'hit';
    const loc = queryParams.address || `${queryParams.latitude},${queryParams.longitude}`;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    trackRequest({
      location: loc,

      lang,
      l1Status,
      l2Status: 'miss',
      apiCalls,
      apiErrors,
      ip,
      timezone: days[0]?.meta.timezone,
    });

    return new NextResponse(icsString, {
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
