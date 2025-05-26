import React from 'react';
import { translations } from '../constants/translations';
import { alarmOptionsData } from '../constants/prayerData';
import type { Lang } from '../hooks/useLanguage';

interface AdvancedOptionsProps {
  lang: Lang;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  alarms: number[];
  handleAlarmToggle: (value: number) => void;
  allEvents: string[];
  selectedEvents: number[];
  handleEventToggle: (index: number) => void;
}

export default function AdvancedOptions({
  lang,
  showAdvanced,
  setShowAdvanced,
  alarms,
  handleAlarmToggle,
  allEvents,
  selectedEvents,
  handleEventToggle,
}: AdvancedOptionsProps) {
  return (
    <details
      open={showAdvanced}
      onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}
      className="rounded-md border border-sky-400 bg-white p-4 dark:bg-gray-800"
    >
      <summary className="cursor-pointer font-semibold">{translations[lang].advanced}</summary>
      <div className="mt-4 space-y-4">
        {/* alarm selection */}
        <div className="space-y-2">
          <div className="font-medium">{translations[lang].selectAlarms}</div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {alarmOptionsData.map((o) => (
              <label key={o.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={alarms.includes(o.value)}
                  onChange={() => handleAlarmToggle(o.value)}
                  className="h-4 w-4"
                />
                <span>{o.label[lang]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* events selection */}
        <div className="space-y-2">
          <div className="font-medium">{translations[lang].selectEvents}</div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {allEvents.map((ev, i) => (
              <label key={ev} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(i)}
                  onChange={() => handleEventToggle(i)}
                  className="h-4 w-4"
                />
                <span>{ev}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}
