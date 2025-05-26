import { NextRequest, NextResponse } from 'next/server';
import { getPrayerTimes } from '../../../prayerTimes';
import ical, { ICalAlarmType } from 'ical-generator';
import moment from 'moment/moment';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Extract query parameters
  const alarm = searchParams.get('alarm');
  const duration = searchParams.get('duration');
  const events = searchParams.get('events');
  const lang = searchParams.get('lang') || 'en';
  const months = searchParams.get('months');

  // Build query params object for getPrayerTimes
  const queryParams: any = {};
  for (const [key, value] of searchParams.entries()) {
    if (!['alarm', 'duration', 'events', 'lang', 'months'].includes(key)) {
      queryParams[key] = value;
    }
  }

  // Fetch calendar data – now accepts address OR latitude/longitude
  const days = await getPrayerTimes(queryParams, months ? +months : 3);
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

  return new NextResponse(calendar.toString(), {
    headers: {
      'Content-Type': 'text/calendar',
    },
  });
}
