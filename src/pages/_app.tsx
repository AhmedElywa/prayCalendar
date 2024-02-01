import Head from 'next/head';
import { AppProps } from 'next/app';
import * as React from 'react';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Prayer Calendar Time</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Prayer Time is a web application that provides accurate prayer times based on different calculation methods. It allows users to subscribe to a prayer calendar and set alarms for prayer times."
        />
        <meta
          name="keywords"
          content="Prayer Times, Prayer Calendar, Islamic Prayer Times, Prayer Alarms, Prayer Schedule, Islamic Calendar, Prayer Time Calculation, Prayer Subscription"
        />
        <meta name="og:title" property="og:title" content="Prayer Calendar Time" />
        <meta
          name="og:description"
          property="og:description"
          content="Prayer Time is a web application that provides accurate prayer times based on different calculation methods. It allows users to subscribe to a prayer calendar and set alarms for prayer times."
        />
        <meta name="og:image" property="og:image" content="/android-chrome-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
