import { useState, useEffect } from 'react';
import { translations } from '../constants/translations';
import { alarmOptionsData } from '../constants/prayerData';
import {
  CalendarDaysIcon,
  ClockIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
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
  // Advanced options props
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
  suhoorDuration: number;
  setSuhoorDuration: (duration: number) => void;
  onAdvancedValidationChange?: (hasErrors: boolean) => void;
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
  // Advanced options
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
  suhoorDuration,
  setSuhoorDuration,
  onAdvancedValidationChange,
}: MethodAndSettingsProps) {
  const { lang } = useAppContext();

  // Validation states for main settings
  const [durationError, setDurationError] = useState('');
  const [monthsError, setMonthsError] = useState('');
  const [durationTouched, setDurationTouched] = useState(false);
  const [monthsTouched, setMonthsTouched] = useState(false);

  // Input values as strings to allow empty state
  const [durationValue, setDurationValue] = useState(duration.toString());
  const [monthsValue, setMonthsValue] = useState(months.toString());

  // Advanced options validation states
  const [iftarError, setIftarError] = useState('');
  const [traweehError, setTraweehError] = useState('');
  const [suhoorError, setSuhoorError] = useState('');
  const [iftarTouched, setIftarTouched] = useState(false);
  const [traweehTouched, setTraweehTouched] = useState(false);
  const [suhoorTouched, setSuhoorTouched] = useState(false);

  // Advanced input values as strings to allow empty state
  const [iftarValue, setIftarValue] = useState(iftarDuration.toString());
  const [traweehValue, setTraweehValue] = useState(traweehDuration.toString());
  const [suhoorValue, setSuhoorValue] = useState(suhoorDuration.toString());

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

  const validateIftar = (value: string) => {
    if (value === '') return translations[lang].iftarRequired;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 15 || num > 60) {
      return translations[lang].iftarInvalid;
    }
    return '';
  };

  const validateTraweeh = (value: string) => {
    if (value === '') return translations[lang].traweehRequired;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > 180) {
      return translations[lang].traweehInvalid;
    }
    return '';
  };

  const validateSuhoor = (value: string) => {
    if (value === '') return translations[lang].suhoorRequired;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > 120) {
      return translations[lang].suhoorInvalid;
    }
    return '';
  };

  // Handle main settings changes
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

  // Handle advanced options changes
  const handleIftarChange = (value: string) => {
    setIftarValue(value);
    const error = validateIftar(value);
    setIftarError(error);

    if (!error && value !== '') {
      setIftarDuration(parseInt(value, 10));
    }
  };

  const handleIftarBlur = () => {
    setIftarTouched(true);
    const error = validateIftar(iftarValue);
    setIftarError(error);
  };

  const handleTraweehChange = (value: string) => {
    setTraweehValue(value);
    const error = validateTraweeh(value);
    setTraweehError(error);

    if (!error && value !== '') {
      setTraweehDuration(parseInt(value, 10));
    }
  };

  const handleTraweehBlur = () => {
    setTraweehTouched(true);
    const error = validateTraweeh(traweehValue);
    setTraweehError(error);
  };

  const handleSuhoorChange = (value: string) => {
    setSuhoorValue(value);
    const error = validateSuhoor(value);
    setSuhoorError(error);

    if (!error && value !== '') {
      setSuhoorDuration(parseInt(value, 10));
    }
  };

  const handleSuhoorBlur = () => {
    setSuhoorTouched(true);
    const error = validateSuhoor(suhoorValue);
    setSuhoorError(error);
  };

  // Check if there are any validation errors
  const hasValidationErrors = durationError !== '' || monthsError !== '';
  const hasAdvancedValidationErrors = ramadanMode && (iftarError !== '' || traweehError !== '' || suhoorError !== '');

  // Notify parent component of validation changes
  useEffect(() => {
    onValidationChange?.(hasValidationErrors);
  }, [hasValidationErrors, onValidationChange]);

  useEffect(() => {
    onAdvancedValidationChange?.(hasAdvancedValidationErrors);
  }, [hasAdvancedValidationErrors, onAdvancedValidationChange]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      {/* Section Title */}
      <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <HeartIcon className="h-6 w-6 text-sky-600 dark:text-sky-400" />
        {translations[lang].prayerSettings}
      </h3>

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

        {/* Advanced Options */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-zinc-800">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
          >
            <span className="flex items-center gap-2">{translations[lang].advanced}</span>
            {showAdvanced ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </button>

          {showAdvanced && (
            <div className="divide-y divide-gray-200 px-4 pb-4 dark:divide-gray-600">
              {/* Ramadan Mode Section */}
              <div className="pb-4">
                <div className="mb-4 flex items-center gap-2">
                  <MoonIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {translations[lang].ramadanMode}
                  </h4>
                </div>
                <p className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  {translations[lang].ramadanModeDescription}
                </p>

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
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {translations[lang].enableRamadanMode}
                  </span>
                </div>

                {/* Duration inputs - only show when Ramadan mode is enabled */}
                {ramadanMode && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                          value={iftarValue}
                          placeholder="15 - 60"
                          onChange={(e) => handleIftarChange(e.target.value)}
                          onBlur={handleIftarBlur}
                          className={`w-full rounded-md border py-2 ps-3 pe-12 shadow-sm transition focus:ring-1 focus:outline-none dark:bg-zinc-800 dark:text-white ${
                            iftarError && iftarTouched
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                              : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600'
                          }`}
                        />
                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                        </div>
                      </div>
                      {iftarError && iftarTouched && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          <span>{iftarError}</span>
                        </div>
                      )}
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
                          value={traweehValue}
                          placeholder="0 - 180"
                          onChange={(e) => handleTraweehChange(e.target.value)}
                          onBlur={handleTraweehBlur}
                          className={`w-full rounded-md border py-2 ps-3 pe-12 shadow-sm transition focus:ring-1 focus:outline-none dark:bg-zinc-800 dark:text-white ${
                            traweehError && traweehTouched
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                              : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600'
                          }`}
                        />
                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                        </div>
                      </div>
                      {traweehError && traweehTouched && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          <span>{traweehError}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-200">
                        {translations[lang].suhoorDuration}
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="number"
                          step={1}
                          min={0}
                          max={120}
                          value={suhoorValue}
                          placeholder="0 - 120"
                          onChange={(e) => handleSuhoorChange(e.target.value)}
                          onBlur={handleSuhoorBlur}
                          className={`w-full rounded-md border py-2 ps-3 pe-12 shadow-sm transition focus:ring-1 focus:outline-none dark:bg-zinc-800 dark:text-white ${
                            suhoorError && suhoorTouched
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                              : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500 dark:border-gray-600'
                          }`}
                        />
                        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">min</span>
                        </div>
                      </div>
                      {suhoorError && suhoorTouched && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          <span>{suhoorError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* alarm selection */}
              <div className="py-4">
                <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {translations[lang].selectAlarms}
                </h4>
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
              <div className="pt-4">
                <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                  {translations[lang].selectEvents}
                </h4>
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

        {/* Validation Summary Warning */}
        {(hasValidationErrors || hasAdvancedValidationErrors) && (
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
