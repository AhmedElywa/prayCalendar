import React from 'react';
import { translations } from '../constants/translations';
import { alarmOptionsData } from '../constants/prayerData';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  alarms: number[];
  handleAlarmToggle: (value: number) => void;
  allEvents: string[];
  selectedEvents: number[];
  handleEventToggle: (index: number) => void;
}

export default function AdvancedOptions({
  showAdvanced,
  setShowAdvanced,
  alarms,
  handleAlarmToggle,
  allEvents,
  selectedEvents,
  handleEventToggle,
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
          {/* alarm selection */}
          <div className="pb-6">
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
