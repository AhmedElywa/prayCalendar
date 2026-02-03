import { formatQiblaText } from 'lib/qibla';
import moment from 'moment-timezone';
import { type NextRequest, NextResponse } from 'next/server';
import { getPrayerTimes } from '../../../prayerTimes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const method = searchParams.get('method') || '5';
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const qiblaMode = searchParams.get('qibla') === 'true';

  // Build query params for getPrayerTimes (same as ICS route)
  const queryParams: any = {};
  for (const [key, value] of searchParams.entries()) {
    if (!['lang', 'qibla'].includes(key)) {
      queryParams[key] = value;
    }
  }

  if (!queryParams.address && !(queryParams.latitude && queryParams.longitude)) {
    return NextResponse.json({ error: 'Provide address or latitude+longitude' }, { status: 400 });
  }

  try {
    const result = await getPrayerTimes(queryParams, 1);
    if (!result || !result.data || result.data.length === 0) {
      return NextResponse.json({ error: 'No prayer times data available' }, { status: 500 });
    }

    // Find today
    const now = moment();
    const todayStr = now.format('DD-MM-YYYY');
    const today = result.data.find((d: any) => d.date.gregorian.date === todayStr) || result.data[0];

    const timings: Record<string, string> = {};
    const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
    for (const key of prayerKeys) {
      const raw = today.timings[key as keyof typeof today.timings];
      timings[key] = raw ? raw.replace(/\s*\(.*\)/, '') : '';
    }

    // Find next prayer
    let nextPrayer: { name: string; time: string } | null = null;
    for (const key of prayerKeys) {
      const [h, m] = timings[key].split(':').map(Number);
      const prayerTime = moment().startOf('day').add(h, 'hours').add(m, 'minutes');
      if (prayerTime.isAfter(now)) {
        nextPrayer = { name: key, time: timings[key] };
        break;
      }
    }

    const lat = today.meta?.latitude || parseFloat(queryParams.latitude || '0');
    const lng = today.meta?.longitude || parseFloat(queryParams.longitude || '0');

    const response: any = {
      date: {
        gregorian: today.date.gregorian.date,
        hijri: {
          day: today.date.hijri.day,
          month: today.date.hijri.month,
          year: today.date.hijri.year,
        },
      },
      location: {
        latitude: lat,
        longitude: lng,
        ...(queryParams.address ? { address: queryParams.address } : {}),
      },
      method,
      timings,
      nextPrayer,
    };

    if (qiblaMode && lat && lng) {
      response.qibla = formatQiblaText(lat, lng, lang);
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
