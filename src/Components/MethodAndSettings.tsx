import React from 'react';
import { translations } from '../constants/translations';
import { CalendarDaysIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { MethodSelectFields } from './MethodSelect';
import { useAppContext } from '../contexts/AppContext';
import type { Lang } from '../hooks/useLanguage';

interface MethodAndSettingsProps {
  method: string;
  setMethod: (method: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  months: number;
  setMonths: (months: number) => void;
  prayerLanguage: Lang;
  setPrayerLanguage: (lang: Lang) => void;
}

export default function MethodAndSettings({
  method,
  setMethod,
  duration,
  setDuration,
  months,
  setMonths,
  prayerLanguage,
  setPrayerLanguage,
}: MethodAndSettingsProps) {
  const { lang } = useAppContext();
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      <div className="space-y-6">
        {/* method selection */}
        <div>
          <MethodSelectFields method={method} setMethod={setMethod} />
        </div>

        {/* duration and months */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              <ClockIcon className="h-5 w-5" />
              {translations[lang].duration}
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                step={1}
                min={5}
                max={60}
                value={duration}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (value >= 5 && value <= 60) {
                    setDuration(value);
                  }
                }}
                className="w-full rounded-md border border-gray-300 py-2 ps-3 pe-12 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                <span className="text-gray-500 sm:text-sm dark:text-gray-400">min</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              <CalendarDaysIcon className="h-5 w-5" />
              {translations[lang].months}
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                step={1}
                min={1}
                max={11}
                value={months}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (value <= 11) {
                    setMonths(value);
                  }
                }}
                className="w-full rounded-md border border-gray-300 py-2 ps-3 pe-12 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                <span className="text-gray-500 sm:text-sm dark:text-gray-400">months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Language Dropdown */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <GlobeAltIcon className="h-5 w-5" />
            {translations[lang].prayerLanguage}
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2">
              <GlobeAltIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <select
              value={prayerLanguage}
              onChange={(e) => setPrayerLanguage(e.target.value as Lang)}
              className="block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 ps-8 pe-3 text-sm shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              title={translations[lang].prayerLanguageDescription}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
