import Head from 'next/head';
import { AppProps } from 'next/app';
import * as React from 'react';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Prayer Calendar Time</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
