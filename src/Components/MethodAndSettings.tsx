import React from 'react';
import { translations } from '../constants/translations';
import { CalendarDaysIcon, ClockIcon, GlobeAltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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
  onValidationChange?: (hasErrors: boolean) => void;
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
  onValidationChange,
}: MethodAndSettingsProps) {
  const { lang } = useAppContext();

  // Validation states
  const [durationError, setDurationError] = React.useState('');
  const [monthsError, setMonthsError] = React.useState('');
  const [durationTouched, setDurationTouched] = React.useState(false);
  const [monthsTouched, setMonthsTouched] = React.useState(false);

  // Input values as strings to allow empty state
  const [durationValue, setDurationValue] = React.useState(duration.toString());
  const [monthsValue, setMonthsValue] = React.useState(months.toString());

  // Validation functions
  const validateDuration = (value: string) => {
    if (value === '') return translations[lang].durationRequired;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 5 || num > 60) {
      return translations[lang].durationInvalid;
    }
    return '';
  };

  const validateMonths = (value: string) => {
    if (value === '') return translations[lang].monthsRequired;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 11) {
      return translations[lang].monthsInvalid;
    }
    return '';
  };

  // Handle duration changes
  const handleDurationChange = (value: string) => {
    setDurationValue(value);
    const error = validateDuration(value);
    setDurationError(error);

    if (!error && value !== '') {
      setDuration(parseInt(value, 10));
    }
  };

  const handleDurationBlur = () => {
    setDurationTouched(true);
    const error = validateDuration(durationValue);
    setDurationError(error);
  };

  // Handle months changes
  const handleMonthsChange = (value: string) => {
    setMonthsValue(value);
    const error = validateMonths(value);
    setMonthsError(error);

    if (!error && value !== '') {
      setMonths(parseInt(value, 10));
    }
  };

  const handleMonthsBlur = () => {
    setMonthsTouched(true);
    const error = validateMonths(monthsValue);
    setMonthsError(error);
  };

  // Check if there are any validation errors
  const hasValidationErrors = durationError !== '' || monthsError !== '';

  // Notify parent component of validation changes
  React.useEffect(() => {
    onValidationChange?.(hasValidationErrors);
  }, [hasValidationErrors, onValidationChange]);

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
                value={durationValue}
                placeholder="5 - 60"
                onChange={(e) => handleDurationChange(e.target.value)}
                onBlur={handleDurationBlur}
                className={`w-full rounded-md border py-2 ps-3 pe-12 shadow-sm transition focus:ring-1 focus:outline-none dark:bg-zinc-800 dark:text-white ${
                  durationError && durationTouched
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                    : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600'
                }`}
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                <span className="text-gray-500 sm:text-sm dark:text-gray-400">min</span>
              </div>
            </div>
            {durationError && durationTouched && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span>{durationError}</span>
              </div>
            )}
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
                value={monthsValue}
                placeholder="1 - 11"
                onChange={(e) => handleMonthsChange(e.target.value)}
                onBlur={handleMonthsBlur}
                className={`w-full rounded-md border py-2 ps-3 pe-12 shadow-sm transition focus:ring-1 focus:outline-none dark:bg-zinc-800 dark:text-white ${
                  monthsError && monthsTouched
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                    : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600'
                }`}
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                <span className="text-gray-500 sm:text-sm dark:text-gray-400">months</span>
              </div>
            </div>
            {monthsError && monthsTouched && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span>{monthsError}</span>
              </div>
            )}
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

        {/* Validation Summary Warning */}
        {hasValidationErrors && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {translations[lang].validationSummaryMessage}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
