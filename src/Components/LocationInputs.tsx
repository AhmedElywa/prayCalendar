import React from 'react';
import { translations } from '../constants/translations';
import { MapIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

export default function LocationInputs() {
  const { lang, locationFields } = useAppContext();
  const {
    inputMode,
    setInputMode,
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    locating,
    handleUseLocation,
  } = locationFields;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      {/* Section Title */}
      <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <MapIcon className="h-6 w-6 text-sky-600 dark:text-sky-400" />
        {translations[lang].locationSettings}
      </h3>

      {/* mode toggle */}
      <div className="mb-6">
        <div className="flex w-full rounded-md border border-gray-300 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setInputMode('address')}
            className={`flex-1 rounded-s-md py-2 text-sm font-medium transition ${
              inputMode === 'address'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            {translations[lang].addressRadio}
          </button>
          <button
            type="button"
            onClick={() => setInputMode('coords')}
            className={`flex-1 rounded-e-md py-2 text-sm font-medium transition ${
              inputMode === 'coords'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700'
            }`}
          >
            {translations[lang].coordsRadio}
          </button>
        </div>
      </div>

      {/* location inputs */}
      {inputMode === 'address' && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {translations[lang].address}
              <span className="ms-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                {translations[lang].addressHint}
              </span>
            </label>
          </div>
          <div className="relative mb-4">
            <input
              placeholder={translations[lang].addressPlaceholder}
              className="w-full rounded-md border border-gray-300 bg-white py-2 ps-3 pe-10 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={locating}
            className="inline-flex items-center rounded-md border border-transparent bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            {locating ? (
              <>
                <svg className="me-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {translations[lang].locating}
              </>
            ) : (
              translations[lang].useLocation
            )}
          </button>
        </div>
      )}

      {inputMode === 'coords' && (
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {translations[lang].latitude}
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  placeholder="30.0444"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {translations[lang].longitude}
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  placeholder="31.2357"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none dark:border-gray-600 dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="inline-flex items-center rounded-md border border-transparent bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {locating ? (
                <>
                  <svg className="me-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {translations[lang].locating}
                </>
              ) : (
                translations[lang].useLocation
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
