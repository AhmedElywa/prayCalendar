import React from 'react';
import { translations } from '../constants/translations';
import defaultMethod from './defaultMethod';
import type { Lang } from '../hooks/useLanguage';

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
    <>
      {/* method selection */}
      <label className="flex flex-col gap-2 font-medium">
        {translations[lang].method}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
        >
          {defaultMethod.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label[lang]}
            </option>
          ))}
        </select>
      </label>

      {/* duration and months */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <label className="flex flex-col gap-2 font-medium">
          {translations[lang].duration}
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(+e.target.value)}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
          />
        </label>
        <label className="flex flex-col gap-2 font-medium">
          {translations[lang].months}
          <input
            type="number"
            min={1}
            max={12}
            value={months}
            onChange={(e) => setMonths(+e.target.value)}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
          />
        </label>
      </div>
    </>
  );
}
