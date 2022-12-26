import express from 'express';
import { getPrayerTimes } from './prayerTimes';
import ical, { ICalAlarmType } from 'ical-generator'
import moment from 'moment';

const router = express.Router();

router.get('/prayer-times.ics', async (req, res) => {
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
				trigger: moment(startDate).subtract(15, 'minutes').toDate(),
			})
		}
	}

	res.set('Content-Type', 'text/calendar');
	res.send(calendar.toString());
});

const app = express();
const port = process.env.PORT || 3000;

app.use(router);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
