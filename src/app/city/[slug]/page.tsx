import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cities, getCityBySlug } from '../../../constants/cities';
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

  return {
    title,
    description,
    alternates: {
      canonical: `/city/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  // Fetch today's prayer times server-side
  let timings: Record<string, string> | null = null;
  let hijriDate: { day: string; month: { en: string; ar: string }; year: string } | null = null;
  try {
    const url = `https://api.aladhan.com/v1/timings?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const j = await res.json();
    if (j.code === 200) {
      timings = j.data.timings;
      hijriDate = j.data.date?.hijri
        ? { day: j.data.date.hijri.day, month: j.data.date.hijri.month, year: j.data.date.hijri.year }
        : null;
    }
  } catch {
    // fail silently
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
