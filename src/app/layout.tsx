import { Analytics } from '@vercel/analytics/next';
import '../styles/globals.css';
import ServiceWorkerRegister from '../Components/ServiceWorkerRegister';
import { AppProvider } from '../contexts/AppContext';

export const metadata = {
  metadataBase: new URL('https://pray.ahmedelywa.com'),
  title: 'Prayer Calendar Time | تقويم أوقات الصلاة',
  description:
    'Prayer Calendar Time generates accurate prayer times and a calendar-subscription link. يُنشئ تطبيق تقويم الصلاة أوقاتًا دقيقة للصلاة ورابط اشتراك للتقويم.',
  keywords:
    'Prayer Times, Prayer Calendar, Islamic Prayer Times, Prayer Alarms, Prayer Schedule, Islamic Calendar, Prayer Time Calculation, Prayer Subscription, أوقات الصلاة, تقويم الصلاة, مواعيد الصلاة الإسلامية, تنبيهات الصلاة, جدول الصلاة, التقويم الإسلامي, حساب أوقات الصلاة, اشتراك الصلاة',
  openGraph: {
    title: 'Prayer Calendar Time',
    description: 'Generate a calendar link for precise Islamic prayer times.',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
    type: 'website',
    url: 'https://pray.ahmedelywa.com/',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Prayer Calendar Time',
        type: 'image/png',
      },
    ],
  },
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: `'Nunito', sans-serif` }} className="dark:bg-zinc-800">
        <AppProvider>
          {children}
          <ServiceWorkerRegister />
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
