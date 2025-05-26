import React from 'react';
import { translations } from '../constants/translations';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { MethodSelectFields } from './MethodSelect';
import { useAppContext } from '../contexts/AppContext';

interface MethodAndSettingsProps {
  method: string;
  setMethod: (method: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  months: number;
  setMonths: (months: number) => void;
}

export default function MethodAndSettings({
  method,
  setMethod,
  duration,
  setDuration,
  months,
  setMonths,
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
      </div>
    </div>
  );
}
