import axios from 'axios';
const API_URL = 'https://api.aladhan.com/v1/calendarByAddress';

export async function getPrayerTimes(address: string, method= 5) {
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
