import React from 'react';
import Link from 'next/link';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';

export default function Footer() {
  const { lang } = useAppContext();
  return (
    <footer className="border-t border-gray-200 bg-white py-4 dark:border-gray-700 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-screen-lg items-center justify-center gap-6 px-4">
        <Link
          href="/"
          className="text-sm font-medium text-gray-700 transition hover:text-sky-500 dark:text-gray-200 dark:hover:text-sky-400"
        >
          {translations[lang].homeLink}
        </Link>
        <Link
          href="/pwa"
          className="text-sm font-medium text-gray-700 transition hover:text-sky-500 dark:text-gray-200 dark:hover:text-sky-400"
        >
          {translations[lang].pwaLink}
        </Link>
      </div>
    </footer>
  );
}
