import { useState, useEffect } from 'react';
import { translations } from '../constants/translations';
import { alarmOptionsData } from '../constants/prayerData';
import { ChevronDownIcon, ChevronUpIcon, MoonIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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
  suhoorDuration: number;
  setSuhoorDuration: (duration: number) => void;
  onValidationChange?: (hasErrors: boolean) => void;
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
  suhoorDuration,
  setSuhoorDuration,
  onValidationChange,
}: AdvancedOptionsProps) {
  const { lang } = useAppContext();

  // Validation states
  const [iftarError, setIftarError] = useState('');
  const [traweehError, setTraweehError] = useState('');
  const [suhoorError, setSuhoorError] = useState('');
  const [iftarTouched, setIftarTouched] = useState(false);
  const [traweehTouched, setTraweehTouched] = useState(false);
  const [suhoorTouched, setSuhoorTouched] = useState(false);

  // Input values as strings to allow empty state
  const [iftarValue, setIftarValue] = useState(iftarDuration.toString());
  const [traweehValue, setTraweehValue] = useState(traweehDuration.toString());
  const [suhoorValue, setSuhoorValue] = useState(suhoorDuration.toString());

  // Validation functions
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

  // Handle input changes
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

  // Check if there are any validation errors (only when Ramadan mode is enabled)
  const hasValidationErrors = ramadanMode && (iftarError !== '' || traweehError !== '' || suhoorError !== '');

  // Notify parent component of validation changes
  useEffect(() => {
    onValidationChange?.(hasValidationErrors);
  }, [hasValidationErrors, onValidationChange]);

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
