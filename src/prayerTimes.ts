import axios from 'axios';
import moment from 'moment/moment';
const API_URL = `https://api.aladhan.com/v1/calendarByAddress/`;

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

// Helper functions to validate and convert string to expected enum values
interface Params {
  address: string;
  method: 0 | 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;
  x7xapikey: string;
  annual: boolean;
  shafaq: 'general' | 'ahmer' | 'abyad';
  tune: string;
  school: 0 | 1;
  midnightMode: 0 | 1;
  latitudeAdjustmentMethod: 1 | 2 | 3;
  adjustment: number;
  iso8601: boolean;
}

// Generalized function to check if a value is an enum value between two numbers
function isEnumValue<T extends number>(value: any, min: T, max: T): value is T {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

// Specific type guards for the Params interface
function toMethod(value: any): Params['method'] {
  return isEnumValue(value, 0, 23) ? (Number(value) as Params['method']) : 0; // Adjust default if needed
}

function toSchool(value: any): Params['school'] {
  return isEnumValue(value, 0, 1) ? (Number(value) as Params['school']) : 0; // Adjust default if needed
}

function toMidnightMode(value: any): Params['midnightMode'] {
  return isEnumValue(value, 0, 1) ? (Number(value) as Params['midnightMode']) : 0; // Adjust default if needed
}

function toLatitudeAdjustmentMethod(value: any): Params['latitudeAdjustmentMethod'] {
  return isEnumValue(value, 1, 3) ? (Number(value) as Params['latitudeAdjustmentMethod']) : 1; // Adjust default if needed
}

type Response = {
  code: number;
  status: string;
  data: Day[];
};

export async function getPrayerTimes(
  params: Record<keyof Params, string>,
  monthsCount: number = 3,
): Promise<Response['data'] | undefined> {
  // the params object coming from url query string will be passed to this function as an argument
  // we should convert the types from string to the correct types
  const convertedParams: Params = {
    ...params,
    method: toMethod(params.method),
    annual: params.annual === 'true',
    shafaq: (params.shafaq as Params['shafaq']) || 'general',
    school: toSchool(params.school),
    midnightMode: toMidnightMode(params.midnightMode),
    latitudeAdjustmentMethod: toLatitudeAdjustmentMethod(params.latitudeAdjustmentMethod),
    adjustment: params.adjustment ? Number(params.adjustment) : 0,
    iso8601: params.iso8601 === 'true',
  };
  try {
    const data: Day[] = [];
    for (let i = 0; i < monthsCount; i++) {
      const date = moment().add(i, 'month');
      const year = date.format('YYYY');
      const month = date.format('MM');
      const URL = `${API_URL}${year}/${month}`;
      const response = await axios.get<Response>(URL, {
        params: convertedParams,
      });
      data.push(...response.data.data);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

/*
* address
required
string
Example: address=1420 Austin Bluffs Parkway, Colorado Springs, CO
An address string

x7xapikey
string
Example: x7xapikey=40a1da1403f3fe1848f478e1299b7xc6
An API key from https://7x.ax to geocode the address, city and country. If you do not provide one the response will mask the geocoded co-ordinates.

annual
boolean
Default: false
Example: annual=false
If true, month parameter will be ignored and the calendar for the entire year will be returned

method
number
Default: 0
Enum: 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 99
Example: method=4
A prayer times calculation method. Methods identify various schools of thought about how to compute the timings. If not specified, it defaults to the closest authority based on the location or co-ordinates specified in the API call. This parameter accepts values from 0-23 and 99, as specified below:

Possible values:

0 - Jafari / Shia Ithna-Ashari
1 - University of Islamic Sciences, Karachi
2 - Islamic Society of North America
3 - Muslim World League
4 - Umm Al-Qura University, Makkah
5 - Egyptian General Authority of Survey
7 - Institute of Geophysics, University of Tehran
8 - Gulf Region
9 - Kuwait
10 - Qatar
12 - Majlis Ugama Islam Singapura, Singapore
12 - Union Organization islamic de France
13 - Diyanet İşleri Başkanlığı, Turkey
14 - Spiritual Administration of Muslims of Russia
15 - Moonsighting Committee Worldwide (also requires shafaq parameter)
16 - Dubai (experimental)
17 - Jabatan Kemajuan Islam Malaysia (JAKIM)
18 - Tunisia
19 - Algeria
20 - KEMENAG - Kementerian Agama Republik Indonesia
21 - Morocco
22 - Comunidade Islamica de Lisboa
23 - Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan
99 - Custom. See https://aladhan.com/calculation-methods
shafaq
string
Default: "general"
Enum: "general" "ahmer" "abyad"
Example: shafaq=general
Which Shafaq to use if the method is Moonsighting Commitee Worldwide. Acceptable options are '`general', 'ahmer' and 'abyad'

tune
string
Example: tune=5,3,5,7,9,-1,0,8,-6
Comma Separated String of integers to offset timings returned by the API in minutes. The order is Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight. See https://aladhan.com/calculation-methods for more details.

school
integer
Default: 0
Enum: 0 1
Shafi (or the standard way) or Hanafi.

Possible values:

0 - Shafi
1 - Hanafi
midnightMode
integer
Default: 0
Enum: 0 1
Determines the method for calculating midnight

Possible values:

0 - Standard (Mid Sunset to Sunrise)
1 - Jafari (Mid Sunset to Fajr)
latitudeAdjustmentMethod
integer
Enum: 1 2 3
Method for adjusting times at higher latitudes. For example, if you are checking timings in the UK or Sweden.

Possible values:

1 - Middle of the Night
2 - One Seventh
3 - Angle Based
adjustment
integer
Example: adjustment=-1
Number of days to adjust hijri date(s).

iso8601
boolean
Default: false
Whether to return the prayer times in the iso8601 format. Example: true will return 2020-07-01T02:56:00+01:00 instead of 02:56*/
