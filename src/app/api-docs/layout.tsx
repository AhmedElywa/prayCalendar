import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Times API - ICS Calendar & JSON Endpoints',
  description:
    'Free API for prayer times. Generate ICS calendar feeds or JSON data for Fajr, Dhuhr, Asr, Maghrib, Isha. Perfect for developers and integrations.',
  keywords: [
    'prayer times api',
    'islamic calendar api',
    'salah times api',
    'ics feed prayer times',
    'prayer times json',
    'muslim prayer api',
    'aladhan alternative',
    'prayer times webhook',
  ],
  openGraph: {
    title: 'Prayer Times API - ICS Calendar & JSON Endpoints',
    description: 'Free API for prayer times. Generate ICS feeds or JSON data for developers and integrations.',
    type: 'website',
    url: 'https://pray.ahmedelywa.com/api-docs',
  },
  twitter: {
    card: 'summary',
    title: 'Prayer Times API Documentation',
    description: 'Free API for prayer times with ICS and JSON endpoints.',
  },
  alternates: {
    canonical: '/api-docs',
  },
};

// JSON-LD for API documentation
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'Prayer Times API Documentation',
  description: 'Technical documentation for the PrayCalendar API endpoints',
  author: {
    '@type': 'Person',
    name: 'Ahmed Elywa',
  },
  publisher: {
    '@type': 'Organization',
    name: 'PrayCalendar',
  },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
