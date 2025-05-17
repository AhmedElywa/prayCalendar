import { NextApiRequest, NextApiResponse } from 'next';
import { getPrayerTimes } from 'prayerTimes';
import ical, { ICalAlarmType } from 'ical-generator';
import moment from 'moment/moment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  } else {
    const { alarm, duration, events, ...rest } = req.query;
    const days = await getPrayerTimes(rest as any);
    if (!days) {
      res.status(400).send({ message: 'Invalid address' });
      return;
    }
    const allEvents = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
    const allowedEvents = events
      ? (events as string)
          .split(',')
          .map((index) => allEvents[parseInt(index)])
          .filter(Boolean)
      : allEvents;

    const calendar = ical({
      name: 'Prayer Times',
      timezone: days[0].meta.timezone,
    });

    for (const day of days) {
      if (moment(day.date.gregorian.date, 'DD-MM-YYYY').isBefore(moment(), 'day')) continue;
      for (const [name, time] of Object.entries(day.timings)) {
        if (!allowedEvents.includes(name)) continue;
        const startDate = moment(`${day.date.gregorian.date} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
        const defaultDuration =
          name === 'Sunrise'
            ? 10
            : name === 'Midnight'
            ? 1
            : duration !== undefined
            ? +duration
            : 25;
        const event = calendar.createEvent({
          start: startDate,
          end: moment(startDate).add(defaultDuration, 'minute').toDate(),
          summary: name,
          timezone: day.meta.timezone,
        });
        if (alarm && +alarm > 0) {
          event.createAlarm({
            type: ICalAlarmType.audio,
            triggerBefore: +alarm * 60,
          });
        }
      }
    }
    res.setHeader('Content-Type', 'text/calendar');
    res.send(calendar.toString());
  }
}
