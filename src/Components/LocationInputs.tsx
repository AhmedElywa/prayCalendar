import React from 'react';
import { translations } from '../constants/translations';
import type { Lang } from '../hooks/useLanguage';
import type { InputMode } from '../hooks/useLocationFields';

interface LocationInputsProps {
  lang: Lang;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  address: string;
  setAddress: (address: string) => void;
  latitude: number | '';
  setLatitude: (lat: number | '') => void;
  longitude: number | '';
  setLongitude: (lon: number | '') => void;
  locating: boolean;
  handleUseLocation: () => void;
}

export default function LocationInputs({
  lang,
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
}: LocationInputsProps) {
  return (
    <>
      {/* mode toggle */}
      <fieldset className="flex gap-6">
        <label className="flex cursor-pointer items-center gap-1">
          <input
            type="radio"
            name="locmode"
            value="address"
            checked={inputMode === 'address'}
            onChange={() => setInputMode('address')}
          />
          <span>{translations[lang].addressRadio}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-1">
          <input
            type="radio"
            name="locmode"
            value="coords"
            checked={inputMode === 'coords'}
            onChange={() => setInputMode('coords')}
          />
          <span>{translations[lang].coordsRadio}</span>
        </label>
      </fieldset>

      {/* location inputs */}
      {inputMode === 'address' && (
        <label className="flex flex-col gap-2 font-medium">
          <div className="flex items-center gap-2">
            {translations[lang].address}
            <span className="text-sm font-normal text-gray-500">{translations[lang].addressHint}</span>
          </div>
          <input
            placeholder={translations[lang].addressPlaceholder}
            className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            type="button"
            onClick={handleUseLocation}
            className="w-max rounded-md border border-sky-400 px-2 py-1 text-sm hover:bg-sky-50 dark:hover:bg-gray-700"
          >
            {locating ? translations[lang].locating : translations[lang].useLocation}
          </button>
        </label>
      )}

      {inputMode === 'coords' && (
        <div className="grid grid-cols-1 gap-2 font-medium md:grid-cols-2">
          <label className="flex flex-col gap-2">
            Latitude
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              placeholder="30.0444"
              className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
            />
          </label>
          <label className="flex flex-col gap-2">
            Longitude
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              placeholder="31.2357"
              className="rounded-md border border-sky-400 p-2 dark:bg-gray-800"
            />
          </label>
          <button
            type="button"
            onClick={handleUseLocation}
            className="col-span-full w-max rounded-md border border-sky-400 px-2 py-1 text-sm hover:bg-sky-50 dark:hover:bg-gray-700"
          >
            {locating ? translations[lang].locating : translations[lang].useLocation}
          </button>
        </div>
      )}
    </>
  );
}
