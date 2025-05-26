import React from 'react';
import ThemeMenu from './Theme';
import { translations } from '../constants/translations';
import type { Lang } from '../hooks/useLanguage';

interface NavigationProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export default function Navigation({ lang, setLang }: NavigationProps) {
  return (
    <nav className="py-4 print:hidden">
      <div className="flex items-center justify-between text-lg font-semibold">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/AhmedElywa/prayCalendar"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {translations[lang].source}
          </a>
          <a href="https://ahmedelywa.com" className="hover:underline">
            {translations[lang].creator}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeMenu />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
