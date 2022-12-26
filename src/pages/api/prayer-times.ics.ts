import { NextApiRequest, NextApiResponse } from 'next'
import { getPrayerTimes } from 'prayerTimes'
import ical, { ICalAlarmType } from 'ical-generator'
import moment from 'moment/moment'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.status(405).send({message: 'Only GET requests allowed'});
		return;
	} else {
		const { address } = req.query;
		const prayerTimes = await getPrayerTimes(address as string);
		const allowedEvents = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
		const calendar = ical({
			name: 'Prayer Times',
			timezone: prayerTimes.data[0].meta.timezone,
		});

		for (const day of prayerTimes.data) {
			for (const [name, time] of Object.entries(day.timings)) {
				if (!allowedEvents.includes(name)) continue;
				const startDate = moment(`${day.date.gregorian.date} ${time}`, 'DD-MM-YYYY HH:mm').toDate();
				const event = calendar.createEvent({
					start: startDate,
					end: moment(startDate).add(25, 'minute').toDate(),
					summary: name,
				});
				event.createAlarm({
					type: ICalAlarmType.audio,
					triggerBefore: 15 * 60
				})
			}
		}
		res.setHeader('Content-Type', 'text/calendar');
		res.send(calendar.toString());
	}
}