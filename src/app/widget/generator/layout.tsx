import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Embeddable Prayer Times Widget - Free for Mosques & Websites',
  description:
    'Create a customizable prayer times widget for your mosque or website. Shows Fajr, Dhuhr, Asr, Maghrib, Isha with dark/light themes.',
  keywords: [
    'prayer times widget',
    'mosque website widget',
    'embeddable salah times',
    'prayer times embed code',
    'islamic widget',
    'masjid prayer times display',
    'prayer times iframe',
  ],
  openGraph: {
    title: 'Embeddable Prayer Times Widget',
    description: 'Create a customizable prayer times widget for your mosque or website. Free to use.',
    type: 'website',
    url: 'https://pray.ahmedelywa.com/widget/generator',
  },
  twitter: {
    card: 'summary',
    title: 'Prayer Times Widget Generator',
    description: 'Create embeddable prayer times for your website or mosque.',
  },
  alternates: {
    canonical: '/widget/generator',
  },
};

export default function WidgetGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
