import { NextApiRequest, NextApiResponse } from 'next';
import { getPrayerTimes } from 'prayerTimes';
import ical, { ICalAlarmType } from 'ical-generator';
import moment from 'moment/moment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  } else {
    const { address, method, alarm, duration } = req.query;
    const prayerTimes = await getPrayerTimes(address as string, method ? +method : 5);
    if (!prayerTimes) {
      res.status(400).send({ message: 'Invalid address' });
      return;
    }
    const days = Object.values(prayerTimes.data).flatMap((month) => month);
    const allowedEvents = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const calendar = ical({
      name: 'Prayer Times',
      timezone: days[0].meta.timezone,
    });

    for (const day of days) {
      for (const [name, time] of Object.entries(day.timings)) {
        if (!allowedEvents.includes(name)) continue;
        const startDate = moment(`${day.date.gregorian.date} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
        const event = calendar.createEvent({
          start: startDate,
          end: moment(startDate)
            .add(duration ? +duration : 25, 'minute')
            .toDate(),
          summary: name,
        });
        if (alarm != 0) {
            event.createAlarm({
                type: ICalAlarmType.audio,
                triggerBefore: (alarm ? +alarm : 15) * 60,
            });
        }
      }
    }
    res.setHeader('Content-Type', 'text/calendar');
    res.send(calendar.toString());
  }
}
