import React from 'react';
import { translations } from '../constants/translations';
import defaultMethod from './defaultMethod';
import type { Lang } from '../hooks/useLanguage';
import { AdjustmentsHorizontalIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

interface MethodAndSettingsProps {
  lang: Lang;
  method: string;
  setMethod: (method: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  months: number;
  setMonths: (months: number) => void;
}

export default function MethodAndSettings({
  lang,
  method,
  setMethod,
  duration,
  setDuration,
  months,
  setMonths,
}: MethodAndSettingsProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      <div className="space-y-6">
        {/* method selection */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            {translations[lang].method}
          </label>
          <div className="relative">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 ps-3 pe-10 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
            >
              {defaultMethod.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label[lang]}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
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
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
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
                min={1}
                max={12}
                value={months}
                onChange={(e) => setMonths(+e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 ps-3 pe-12 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                <span className="text-gray-500 sm:text-sm dark:text-gray-400">months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
