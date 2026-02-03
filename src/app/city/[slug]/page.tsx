import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cities, getCityBySlug } from '../../../constants/cities';
import { getCachedMonths, type L1KeyParams, normalizeLocation } from '../../../lib/cache';
import CityPageClient from './CityPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Prayer Times in ${city.name.en}, ${city.country.en} | Prayer Calendar`;
  const description = `Accurate prayer times for ${city.name.en}, ${city.country.en}. Subscribe to Fajr, Dhuhr, Asr, Maghrib, Isha times directly in your calendar. Updated daily.`;

  // City-specific keywords in English and Arabic
  const keywords = [
    // English keywords
    `prayer times ${city.name.en}`,
    `${city.name.en} prayer times`,
    `salah times ${city.name.en}`,
    `fajr time ${city.name.en}`,
    `maghrib time ${city.name.en}`,
    `${city.name.en} ${city.country.en} prayer`,
    `islamic prayer times ${city.name.en}`,
    `namaz time ${city.name.en}`,
    // Arabic keywords
    `مواقيت الصلاة ${city.name.ar}`,
    `أوقات الصلاة في ${city.name.ar}`,
    `موعد الفجر ${city.name.ar}`,
    `موعد المغرب ${city.name.ar}`,
    `صلاة ${city.name.ar}`,
    `مواقيت الصلاة ${city.country.ar}`,
  ].join(', ');

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/city/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://pray.ahmedelywa.com/city/${slug}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  // Fetch today's prayer times - try Redis cache first, then API fallback
  let timings: Record<string, string> | null = null;
  let hijriDate: { day: string; month: { en: string; ar: string }; year: string } | null = null;

  try {
    const location = normalizeLocation({ latitude: city.latitude, longitude: city.longitude });
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const today = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

    // Build L1 cache key params with defaults for city pages
    const l1Params: Omit<L1KeyParams, 'yearMonth'> = {
      location,
      method: city.method,
      school: 0, // Standard school (Shafi'i)
      shafaq: 'general',
      tune: '',
      midnightMode: 0,
      latitudeAdjustmentMethod: 1,
      adjustment: 0,
    };

    // Try to get from Redis cache first
    const { cached } = await getCachedMonths(l1Params, [currentMonth]);
    const monthData = cached.get(currentMonth);

    if (monthData) {
      // Find today's data in the cached month
      const todayData = monthData.find(
        (d: { date: { gregorian: { date: string } } }) => d.date.gregorian.date === today,
      );
      if (todayData) {
        timings = todayData.timings;
        hijriDate = todayData.date?.hijri
          ? { day: todayData.date.hijri.day, month: todayData.date.hijri.month, year: todayData.date.hijri.year }
          : null;
      }
    }

    // Fallback to API if cache miss
    if (!timings) {
      const url = `https://api.aladhan.com/v1/timings/${today}?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const j = await res.json();
        if (j.code === 200) {
          timings = j.data.timings;
          hijriDate = j.data.date?.hijri
            ? { day: j.data.date.hijri.day, month: j.data.date.hijri.month, year: j.data.date.hijri.year }
            : null;
        }
      }
    }
  } catch {
    // Silently fail - page will render without prayer times
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Prayer Times in ${city.name.en}`,
    description: `Daily prayer times for ${city.name.en}, ${city.country.en}`,
    url: `https://pray.ahmedelywa.com/city/${slug}`,
    about: {
      '@type': 'Place',
      name: city.name.en,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: city.latitude,
        longitude: city.longitude,
      },
    },
  };

  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CityPageClient city={city} timings={timings} hijriDate={hijriDate} />
    </>
  );
}
