import { Analytics } from '@vercel/analytics/next';
import '../styles/globals.css';
import ServiceWorkerRegister from '../Components/ServiceWorkerRegister';
import { AppProvider } from '../contexts/AppContext';

export const metadata = {
  metadataBase: new URL('https://pray.ahmedelywa.com'),
  title: {
    default: 'Prayer Times Calendar - Sync Salah to Google, Apple, Outlook',
    template: '%s | PrayCalendar',
  },
  description:
    'Subscribe once, get accurate prayer times synced to your calendar. Free tool for Fajr, Dhuhr, Asr, Maghrib, Isha with customizable alarms.',
  keywords: [
    // High-priority English keywords
    'prayer times',
    'salah times',
    'namaz time',
    'prayer times calendar',
    'islamic prayer times',
    'fajr time',
    'dhuhr time',
    'asr time',
    'maghrib time',
    'isha time',
    'prayer schedule',
    'prayer alarms',
    'muslim prayer times',
    'daily prayer times',
    // Arabic keywords
    'أوقات الصلاة',
    'مواقيت الصلاة',
    'تقويم الصلاة',
    'وقت الفجر',
    'وقت المغرب',
    'جدول الصلاة',
    // Turkish keywords
    'namaz vakitleri',
    'ezan vakti',
    // Urdu keywords
    'نماز کا وقت',
  ],
  authors: [{ name: 'Ahmed Elywa', url: 'https://ahmedelywa.com' }],
  creator: 'Ahmed Elywa',
  publisher: 'PrayCalendar',
  openGraph: {
    title: 'Prayer Times Calendar - Sync Salah to Google, Apple, Outlook',
    description:
      'Subscribe once, get accurate prayer times synced to your calendar. Free, open-source tool with customizable alarms.',
    locale: 'en_US',
    alternateLocale: ['ar_EG', 'tr_TR', 'ur_PK'],
    type: 'website',
    siteName: 'PrayCalendar',
    url: 'https://pray.ahmedelywa.com/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PrayCalendar - Prayer Times Calendar Subscription',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prayer Times Calendar - Sync Salah to Google, Apple, Outlook',
    description: 'Subscribe once, get accurate prayer times synced to your calendar. Free, open-source tool.',
    images: ['/og-image.png'],
  },
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://pray.ahmedelywa.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-code-here', // Add your Google Search Console verification
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

// JSON-LD Structured Data for the application
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://pray.ahmedelywa.com/#application',
      name: 'PrayCalendar',
      description: 'Free prayer times calendar subscription tool that syncs to Google, Apple, and Outlook calendars',
      url: 'https://pray.ahmedelywa.com',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web, iOS, Android',
      browserRequirements: 'Requires JavaScript',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Prayer times calendar subscription',
        'Google Calendar integration',
        'Apple Calendar integration',
        'Outlook Calendar integration',
        'Customizable prayer alarms',
        'Multiple calculation methods',
        'Ramadan mode with Iftar/Suhoor times',
        'Qibla direction',
        'Multi-language support',
      ],
      author: {
        '@type': 'Person',
        name: 'Ahmed Elywa',
        url: 'https://ahmedelywa.com',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://pray.ahmedelywa.com/#website',
      url: 'https://pray.ahmedelywa.com',
      name: 'PrayCalendar',
      description: 'Prayer Times Calendar Subscription Tool',
      publisher: {
        '@type': 'Person',
        name: 'Ahmed Elywa',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://pray.ahmedelywa.com/city/{search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://pray.ahmedelywa.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I add prayer times to Google Calendar?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Enter your location, choose a calculation method, then click "Subscribe" and select Google Calendar. The prayer times will automatically sync and update.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is PrayCalendar free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, PrayCalendar is completely free and open-source. There are no accounts required and no tracking.',
          },
        },
        {
          '@type': 'Question',
          name: 'How are prayer times calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Prayer times are calculated using established Islamic calculation methods from organizations like Egyptian General Authority, ISNA, Muslim World League, and Umm Al-Qura University.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I get prayer times for any city?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can get prayer times for any location worldwide by entering an address or coordinates. We have pre-configured pages for 40+ popular cities.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Amiri:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body style={{ fontFamily: 'var(--font-sans)' }} className="bg-bg-primary text-text-primary antialiased">
        <AppProvider>
          {children}
          <ServiceWorkerRegister />
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
