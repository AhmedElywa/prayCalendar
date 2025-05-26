import Head from 'next/head';
import { AppProps } from 'next/app';
import * as React from 'react';
import { Analytics } from '@vercel/analytics/next';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Prayer Calendar Time | تقويم أوقات الصلاة</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="keywords"
          content="Prayer Times, Prayer Calendar, Islamic Prayer Times, Prayer Alarms, Prayer Schedule, Islamic Calendar, Prayer Time Calculation, Prayer Subscription, أوقات الصلاة, تقويم الصلاة, مواعيد الصلاة الإسلامية, تنبيهات الصلاة, جدول الصلاة, التقويم الإسلامي, حساب أوقات الصلاة, اشتراك الصلاة"
        />
        {/* — new bilingual descriptions — */}
        <meta
          name="description"
          lang="en"
          content="Prayer Calendar Time generates accurate prayer times and a calendar-subscription link."
        />
        <meta
          name="description"
          lang="ar"
          content="يُنشئ تطبيق تقويم الصلاة أوقاتًا دقيقة للصلاة ورابط اشتراك للتقويم."
        />
        {/* — Open Graph refresh — */}
        <meta property="og:title" content="Prayer Calendar Time" />
        <meta property="og:description" content="Generate a calendar link for precise Islamic prayer times." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ar_EG" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pray.ahmedelywa.com/" />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Prayer Calendar Time" />
        <meta property="og:image:type" content="image/png" />
        <meta name="og:image" property="og:image" content="/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
