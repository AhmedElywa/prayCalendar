import React from 'react';
import ThemeMenu from './Theme';
import { translations } from '../constants/translations';
import { GlobeAltIcon, CodeBracketIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import type { Lang } from '../hooks/useLanguage';

export default function Navigation() {
  const { lang, setLang } = useAppContext();
  return (
    <nav className="relative z-10 border-b border-gray-200 bg-white py-4 shadow-sm dark:border-gray-700 dark:bg-zinc-900 print:hidden">
      <div className="mx-auto max-w-screen-lg px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/AhmedElywa/prayCalendar"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-sky-500 dark:text-gray-200 dark:hover:text-sky-400"
            >
              <CodeBracketIcon className="h-4 w-4" />
              {translations[lang].source}
            </a>
            <a
              href="https://ahmedelywa.com"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-sky-500 dark:text-gray-200 dark:hover:text-sky-400"
            >
              <UserCircleIcon className="h-4 w-4" />
              {translations[lang].creator}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeMenu />
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2">
                <GlobeAltIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 ps-8 pe-3 text-sm shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
