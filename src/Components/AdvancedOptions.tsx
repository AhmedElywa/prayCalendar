import React from 'react';
import { translations } from '../constants/translations';
import { alarmOptionsData } from '../constants/prayerData';
import { ChevronDownIcon, ChevronUpIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  alarms: number[];
  handleAlarmToggle: (value: number) => void;
  allEvents: string[];
  selectedEvents: number[];
  handleEventToggle: (index: number) => void;
  ramadanMode: boolean;
  setRamadanMode: (enabled: boolean) => void;
  iftarDuration: number;
  setIftarDuration: (duration: number) => void;
  traweehDuration: number;
  setTraweehDuration: (duration: number) => void;
}

export default function AdvancedOptions({
  showAdvanced,
  setShowAdvanced,
  alarms,
  handleAlarmToggle,
  allEvents,
  selectedEvents,
  handleEventToggle,
  ramadanMode,
  setRamadanMode,
  iftarDuration,
  setIftarDuration,
  traweehDuration,
  setTraweehDuration,
}: AdvancedOptionsProps) {
  const { lang } = useAppContext();
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-between bg-gray-50 px-6 py-4 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
      >
        <span className="flex items-center gap-2">{translations[lang].advanced}</span>
        {showAdvanced ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </button>

      {showAdvanced && (
        <div className="divide-y divide-gray-200 p-6 dark:divide-gray-700">
          {/* Ramadan Mode Section */}
          <div className="pb-6">
            <div className="mb-4 flex items-center gap-2">
              <MoonIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">{translations[lang].ramadanMode}</h3>
            </div>
            <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">{translations[lang].ramadanModeDescription}</p>

            {/* Toggle switch */}
            <div className="mb-4 flex items-center gap-3" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={ramadanMode}
                  onChange={(e) => setRamadanMode(e.target.checked)}
                  className="peer sr-only"
                />
                <div
                  className={`peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-sky-600 peer-focus:ring-4 peer-focus:ring-sky-300 after:absolute after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-checked:bg-sky-600 dark:peer-focus:ring-sky-800 ${
                    lang === 'ar'
                      ? 'after:right-[2px] peer-checked:after:-translate-x-full'
                      : 'after:left-[2px] peer-checked:after:translate-x-full'
                  }`}
                ></div>
              </label>
              <span className="text-sm text-gray-700 dark:text-gray-300">{translations[lang].enableRamadanMode}</span>
            </div>

            {/* Duration inputs - only show when Ramadan mode is enabled */}
            {ramadanMode && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-200">
                    {translations[lang].iftarDuration}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step={1}
                      min={15}
                      max={60}
                      value={iftarDuration}
                      onChange={(e) => {
                        const value = +e.target.value;
                        if (value >= 15 && value <= 60) {
                          setIftarDuration(value);
                        }
                      }}
                      className="w-full rounded-md border border-gray-300 py-2 ps-3 pe-12 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-200">
                    {translations[lang].traweehDuration}
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step={1}
                      min={0}
                      max={180}
                      value={traweehDuration}
                      onChange={(e) => {
                        const value = +e.target.value;
                        if (value >= 0 && value <= 180) {
                          setTraweehDuration(value);
                        }
                      }}
                      className="w-full rounded-md border border-gray-300 py-2 ps-3 pe-12 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* alarm selection */}
          <div className="py-6">
            <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-200">
              {translations[lang].selectAlarms}
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {alarmOptionsData.map((o) => (
                <label key={o.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={alarms.includes(o.value)}
                    onChange={() => handleAlarmToggle(o.value)}
                    className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-zinc-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{o.label[lang]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* events selection */}
          <div className="pt-6">
            <h3 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-200">
              {translations[lang].selectEvents}
            </h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {allEvents.map((ev, i) => (
                <label key={ev} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(i)}
                    onChange={() => handleEventToggle(i)}
                    className="h-4 w-4 rounded border-gray-300 text-sky-500 focus:ring-sky-500 dark:border-gray-600 dark:bg-zinc-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{ev}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
