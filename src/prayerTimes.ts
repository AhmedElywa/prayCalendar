import axios from 'axios';
const API_URL = `https://api.aladhan.com/v1/calendarByAddress/${new Date().getFullYear()}`;

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

type Response = {
	code: number;
	status: string;
	data: Record<string, Day>;
}

export async function getPrayerTimes(address: string, method= 5): Promise<Response | undefined> {
	try {
		const response = await axios.get(API_URL, {
			params: {
				address,
				method, // This specifies the calculation method to use
			}
		});
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
