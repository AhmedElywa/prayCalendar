import { formatQiblaText } from 'lib/qibla';
import moment from 'moment-timezone';
import { type NextRequest, NextResponse } from 'next/server';
import { getPrayerTimes } from '../../../prayerTimes';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const method = searchParams.get('method') || '5';
  const lang = (searchParams.get('lang') || 'en') as 'en' | 'ar';
  const qiblaMode = searchParams.get('qibla') === 'true';
  const format = searchParams.get('format') || 'standard'; // standard, webhook, slack, discord

  // Build query params for getPrayerTimes (same as ICS route)
  const queryParams: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    if (!['lang', 'qibla', 'format'].includes(key)) {
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
    const timezone = today.meta?.timezone || 'UTC';

    const lat = today.meta?.latitude || parseFloat(queryParams.latitude || '0');
    const lng = today.meta?.longitude || parseFloat(queryParams.longitude || '0');

    // Parse date from API response
    const [day, month, year] = today.date.gregorian.date.split('-').map(Number);
    const dateBase = moment.tz({ year, month: month - 1, day }, timezone);

    const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
    const timings: Record<string, string> = {};
    const timingsDetailed: Record<string, { time: string; iso: string; timestamp: number }> = {};

    for (const key of prayerKeys) {
      const raw = today.timings[key as keyof typeof today.timings];
      const timeStr = raw ? raw.replace(/\s*\(.*\)/, '') : '';
      timings[key] = timeStr;

      if (timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        const prayerMoment = dateBase.clone().hour(h).minute(m).second(0);
        timingsDetailed[key] = {
          time: timeStr,
          iso: prayerMoment.toISOString(),
          timestamp: prayerMoment.unix(),
        };
      }
    }

    // Find next prayer with detailed info
    let nextPrayer: {
      name: string;
      time: string;
      iso: string;
      timestamp: number;
      minutesUntil: number;
    } | null = null;

    const nowTz = moment.tz(timezone);
    for (const key of prayerKeys) {
      const detail = timingsDetailed[key];
      if (detail) {
        const prayerMoment = moment.unix(detail.timestamp);
        if (prayerMoment.isAfter(nowTz)) {
          const minutesUntil = Math.ceil(prayerMoment.diff(nowTz, 'minutes', true));
          nextPrayer = {
            name: key,
            time: detail.time,
            iso: detail.iso,
            timestamp: detail.timestamp,
            minutesUntil,
          };
          break;
        }
      }
    }

    // Build response based on format
    if (format === 'slack') {
      return NextResponse.json(
        formatSlackMessage(today, timings, nextPrayer, lang, qiblaMode ? formatQiblaText(lat, lng, lang) : null),
        {
          headers: getCorsHeaders(),
        },
      );
    }

    if (format === 'discord') {
      return NextResponse.json(
        formatDiscordMessage(today, timings, nextPrayer, lang, qiblaMode ? formatQiblaText(lat, lng, lang) : null),
        {
          headers: getCorsHeaders(),
        },
      );
    }

    const response: Record<string, unknown> = {
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
        timezone,
        ...(queryParams.address ? { address: queryParams.address } : {}),
      },
      method,
      timings: format === 'webhook' ? timingsDetailed : timings,
      nextPrayer,
      ...(format === 'webhook' ? { serverTime: { iso: nowTz.toISOString(), timestamp: nowTz.unix() } } : {}),
    };

    if (qiblaMode && lat && lng) {
      response.qibla = formatQiblaText(lat, lng, lang);
    }

    return NextResponse.json(response, {
      headers: getCorsHeaders(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function getCorsHeaders() {
  return {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    'Access-Control-Allow-Origin': '*',
  };
}

interface NextPrayerInfo {
  name: string;
  time: string;
  iso: string;
  timestamp: number;
  minutesUntil: number;
}

// Slack Block Kit types
type SlackBlock = Record<string, unknown>;

function formatSlackMessage(
  today: { date: { gregorian: { date: string }; hijri: { day: string; month: { en: string }; year: string } } },
  timings: Record<string, string>,
  nextPrayer: NextPrayerInfo | null,
  lang: 'en' | 'ar',
  qibla: string | null,
) {
  const prayerEmoji: Record<string, string> = {
    Fajr: '🌙',
    Sunrise: '🌅',
    Dhuhr: '☀️',
    Asr: '🌤️',
    Maghrib: '🌇',
    Isha: '🌃',
    Midnight: '🕛',
  };

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text:
          lang === 'ar'
            ? `🕌 مواقيت الصلاة - ${today.date.gregorian.date}`
            : `🕌 Prayer Times - ${today.date.gregorian.date}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: Object.entries(timings)
          .map(([name, time]) => `${prayerEmoji[name] || '🕐'} *${name}*: ${time}`)
          .join('\n'),
      },
    },
  ];

  if (nextPrayer) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          lang === 'ar'
            ? `⏰ *الصلاة القادمة:* ${nextPrayer.name} في ${nextPrayer.time} (بعد ${nextPrayer.minutesUntil} دقيقة)`
            : `⏰ *Next Prayer:* ${nextPrayer.name} at ${nextPrayer.time} (in ${nextPrayer.minutesUntil} min)`,
      },
    });
  }

  if (qibla) {
    blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `🧭 ${qibla}` }],
    });
  }

  return { blocks };
}

function formatDiscordMessage(
  today: {
    date: { gregorian: { date: string }; hijri: { day: string; month: { en: string; ar?: string }; year: string } };
  },
  timings: Record<string, string>,
  nextPrayer: NextPrayerInfo | null,
  lang: 'en' | 'ar',
  qibla: string | null,
) {
  const prayerEmoji: Record<string, string> = {
    Fajr: '🌙',
    Sunrise: '🌅',
    Dhuhr: '☀️',
    Asr: '🌤️',
    Maghrib: '🌇',
    Isha: '🌃',
    Midnight: '🕛',
  };

  const fields = Object.entries(timings).map(([name, time]) => ({
    name: `${prayerEmoji[name] || '🕐'} ${name}`,
    value: time,
    inline: true,
  }));

  const hijriDate = `${today.date.hijri.day} ${today.date.hijri.month.en} ${today.date.hijri.year}`;

  const embed = {
    title: lang === 'ar' ? '🕌 مواقيت الصلاة' : '🕌 Prayer Times',
    description: `📅 ${today.date.gregorian.date} | ${hijriDate}`,
    color: 0x1e90ff,
    fields,
    footer: nextPrayer
      ? {
          text:
            lang === 'ar'
              ? `⏰ الصلاة القادمة: ${nextPrayer.name} في ${nextPrayer.time} (بعد ${nextPrayer.minutesUntil} دقيقة)`
              : `⏰ Next: ${nextPrayer.name} at ${nextPrayer.time} (in ${nextPrayer.minutesUntil} min)`,
        }
      : undefined,
  };

  if (qibla) {
    fields.push({ name: '🧭 Qibla', value: qibla, inline: false });
  }

  return { embeds: [embed] };
}
