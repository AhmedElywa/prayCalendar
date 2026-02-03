import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer View App - Daily Salah Times Widget',
  description:
    'Install our prayer times app for instant access to Fajr, Dhuhr, Asr, Maghrib, Isha times. Works offline as a PWA.',
  keywords: [
    'prayer times app',
    'salah widget',
    'namaz app',
    'islamic prayer app',
    'prayer times pwa',
    'offline prayer times',
    'تطبيق أوقات الصلاة',
    'تطبيق الصلاة',
  ],
  openGraph: {
    title: 'Prayer View App - Daily Salah Times Widget',
    description: 'Install our prayer times app for instant access to daily prayer times. Works offline.',
    type: 'website',
    url: 'https://pray.ahmedelywa.com/pwa',
  },
  twitter: {
    card: 'summary',
    title: 'Prayer View App - Daily Salah Times',
    description: 'Install our prayer times app for instant access to daily prayer times.',
  },
  alternates: {
    canonical: '/pwa',
  },
};

export default function PWALayout({ children }: { children: React.ReactNode }) {
  return children;
}
