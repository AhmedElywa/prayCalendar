import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Times by City - 40+ Cities Worldwide',
  description:
    'Find accurate prayer times for your city. Coverage includes Makkah, Madinah, Cairo, Istanbul, London, New York, Dubai and 40+ cities globally.',
  keywords: [
    'prayer times by city',
    'salah times cities',
    'namaz time locations',
    'prayer times makkah',
    'prayer times cairo',
    'prayer times london',
    'prayer times istanbul',
    'prayer times dubai',
    'أوقات الصلاة في المدن',
    'مواقيت الصلاة',
  ],
  openGraph: {
    title: 'Prayer Times by City - 40+ Cities Worldwide',
    description: 'Find accurate prayer times for your city. 40+ cities including Makkah, Cairo, Istanbul, London.',
    type: 'website',
    url: 'https://pray.ahmedelywa.com/cities',
  },
  twitter: {
    card: 'summary',
    title: 'Prayer Times by City',
    description: 'Find accurate prayer times for 40+ cities worldwide.',
  },
  alternates: {
    canonical: '/cities',
  },
};

// JSON-LD for ItemList of cities
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Prayer Times by City',
  description: 'List of cities with available prayer times',
  numberOfItems: 40,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Makkah Prayer Times', url: 'https://pray.ahmedelywa.com/city/makkah' },
    { '@type': 'ListItem', position: 2, name: 'Cairo Prayer Times', url: 'https://pray.ahmedelywa.com/city/cairo' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Istanbul Prayer Times',
      url: 'https://pray.ahmedelywa.com/city/istanbul',
    },
    { '@type': 'ListItem', position: 4, name: 'London Prayer Times', url: 'https://pray.ahmedelywa.com/city/london' },
    { '@type': 'ListItem', position: 5, name: 'Dubai Prayer Times', url: 'https://pray.ahmedelywa.com/city/dubai' },
  ],
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
