import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import { getMethodRecommendation } from '../constants/methodRecommendations';
import { alarmOptionsData, eventNames, weekdayNames } from '../constants/prayerData';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import type { Lang } from '../hooks/useLanguage';
import { MethodSelectFields } from './MethodSelect';

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
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  alarms: number[];
  handleAlarmToggle: (value: number) => void;
  allEvents: string[];
  selectedEvents: number[];
  handleEventToggle: (index: number) => void;
  selectedWeekDays: number[];
  handleWeekDayToggle: (index: number) => void;
  qiblaMode: boolean;
  setQiblaMode: (enabled: boolean) => void;
  duaMode: boolean;
  setDuaMode: (enabled: boolean) => void;
  busyMode: boolean;
  setBusyMode: (enabled: boolean) => void;
  iqamaOffsets: number[];
  setIqamaOffsets: (offsets: number[]) => void;
  travelMode: boolean;
  setTravelMode: (enabled: boolean) => void;
  jumuahMode: boolean;
  setJumuahMode: (enabled: boolean) => void;
  jumuahDuration: number;
  setJumuahDuration: (duration: number) => void;
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

// Reusable toggle switch component
function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  lang,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description: string;
  lang: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center justify-between rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary p-3 text-left transition hover:border-[rgba(255,255,255,0.1)]"
      onClick={() => onChange(!checked)}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="text-xs text-text-muted">{description}</span>
      </div>
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-all ${
          checked ? 'border-gold bg-gold' : 'border-border-subtle bg-bg-elevated'
        }`}
      >
        <div
          className={`absolute top-[3px] h-4 w-4 rounded-full transition-all ${
            checked
              ? `${lang === 'ar' ? 'right-[23px]' : 'left-[23px]'} bg-bg-primary`
              : `${lang === 'ar' ? 'right-[3px]' : 'left-[3px]'} bg-text-muted`
          }`}
        />
      </div>
    </button>
  );
}

// Input field styling
const inputErrorClass =
  'w-full rounded-[var(--radius-sm)] border border-coral bg-bg-secondary px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-coral focus:shadow-[0_0_0_3px_var(--coral-dim)]';
const numInputClass =
  'w-[72px] rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-3 py-2.5 text-center text-[15px] font-medium text-text-primary outline-none transition focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)]';

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
  showAdvanced,
  setShowAdvanced,
  alarms,
  handleAlarmToggle,
  allEvents,
  selectedEvents,
  handleEventToggle,
  selectedWeekDays,
  handleWeekDayToggle,
  qiblaMode,
  setQiblaMode,
  duaMode,
  setDuaMode,
  busyMode,
  setBusyMode,
  iqamaOffsets,
  setIqamaOffsets,
  travelMode,
  setTravelMode,
  jumuahMode,
  setJumuahMode,
  jumuahDuration,
  setJumuahDuration,
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
  const { lang, locationFields } = useAppContext();

  // Get method recommendation based on selected location's country
  const methodRecommendation = useMemo(() => {
    return getMethodRecommendation(locationFields.countryCode);
  }, [locationFields.countryCode]);

  const [durationError, setDurationError] = useState('');
  const [monthsError, setMonthsError] = useState('');
  const [durationTouched, setDurationTouched] = useState(false);
  const [monthsTouched, setMonthsTouched] = useState(false);
  const [durationValue, setDurationValue] = useState(duration.toString());
  const [monthsValue, setMonthsValue] = useState(months.toString());

  const [iftarError, setIftarError] = useState('');
  const [traweehError, setTraweehError] = useState('');
  const [suhoorError, setSuhoorError] = useState('');
  const [iftarTouched, setIftarTouched] = useState(false);
  const [traweehTouched, setTraweehTouched] = useState(false);
  const [suhoorTouched, setSuhoorTouched] = useState(false);
  const [iftarValue, setIftarValue] = useState(iftarDuration.toString());
  const [traweehValue, setTraweehValue] = useState(traweehDuration.toString());
  const [suhoorValue, setSuhoorValue] = useState(suhoorDuration.toString());

  const validateDuration = (value: string) => {
    if (value === '') return translations[lang].durationRequired;
    const num = parseInt(value, 10);
    if (Number.isNaN(num) || num < 5 || num > 60) return translations[lang].durationInvalid;
    return '';
  };
  const validateMonths = (value: string) => {
    if (value === '') return translations[lang].monthsRequired;
    const num = parseInt(value, 10);
    if (Number.isNaN(num) || num < 1 || num > 11) return translations[lang].monthsInvalid;
    return '';
  };
  const validateIftar = (value: string) => {
    if (value === '') return translations[lang].iftarRequired;
    const num = parseInt(value, 10);
    if (Number.isNaN(num) || num < 15 || num > 60) return translations[lang].iftarInvalid;
    return '';
  };
  const validateTraweeh = (value: string) => {
    if (value === '') return translations[lang].traweehRequired;
    const num = parseInt(value, 10);
    if (Number.isNaN(num) || num < 0 || num > 180) return translations[lang].traweehInvalid;
    return '';
  };
  const validateSuhoor = (value: string) => {
    if (value === '') return translations[lang].suhoorRequired;
    const num = parseInt(value, 10);
    if (Number.isNaN(num) || num < 0 || num > 120) return translations[lang].suhoorInvalid;
    return '';
  };

  const handleDurationChange = (value: string) => {
    setDurationValue(value);
    const error = validateDuration(value);
    setDurationError(error);
    if (!error && value !== '') setDuration(parseInt(value, 10));
  };
  const handleMonthsChange = (value: string) => {
    setMonthsValue(value);
    const error = validateMonths(value);
    setMonthsError(error);
    if (!error && value !== '') setMonths(parseInt(value, 10));
  };
  const handleIftarChange = (value: string) => {
    setIftarValue(value);
    const error = validateIftar(value);
    setIftarError(error);
    if (!error && value !== '') setIftarDuration(parseInt(value, 10));
  };
  const handleTraweehChange = (value: string) => {
    setTraweehValue(value);
    const error = validateTraweeh(value);
    setTraweehError(error);
    if (!error && value !== '') setTraweehDuration(parseInt(value, 10));
  };
  const handleSuhoorChange = (value: string) => {
    setSuhoorValue(value);
    const error = validateSuhoor(value);
    setSuhoorError(error);
    if (!error && value !== '') setSuhoorDuration(parseInt(value, 10));
  };

  const hasValidationErrors = durationError !== '' || monthsError !== '';
  const hasAdvancedValidationErrors = ramadanMode && (iftarError !== '' || traweehError !== '' || suhoorError !== '');

  useEffect(() => {
    onValidationChange?.(hasValidationErrors);
  }, [hasValidationErrors, onValidationChange]);
  useEffect(() => {
    onAdvancedValidationChange?.(hasAdvancedValidationErrors);
  }, [hasAdvancedValidationErrors, onAdvancedValidationChange]);

  return (
    <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6 transition hover:border-[rgba(255,255,255,0.1)]">
      {/* Card Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(94,234,212,0.2)] bg-teal-dim text-base">
          ☰
        </div>
        <div>
          <div className="text-[15px] font-semibold text-text-primary">{translations[lang].prayerSettings}</div>
          <div className="text-xs text-text-muted">
            {lang === 'ar' ? 'طريقة الحساب والتفضيلات' : 'Calculation method & preferences'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Method selection */}
        <MethodSelectFields method={method} setMethod={setMethod} recommendation={methodRecommendation} />

        {/* Duration and months */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
              {translations[lang].duration}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={1}
                min={5}
                max={60}
                value={durationValue}
                placeholder="5 - 60"
                onChange={(e) => handleDurationChange(e.target.value)}
                onBlur={() => {
                  setDurationTouched(true);
                  setDurationError(validateDuration(durationValue));
                }}
                className={durationError && durationTouched ? inputErrorClass : numInputClass}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <span className="text-xs font-medium text-text-muted">{lang === 'ar' ? 'دقيقة' : 'min'}</span>
            </div>
            {durationError && durationTouched && (
              <div className="mt-1 flex items-center gap-1 text-xs text-coral">
                <ExclamationTriangleIcon className="h-3 w-3" />
                <span>{durationError}</span>
              </div>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
              {translations[lang].months}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={1}
                min={1}
                max={11}
                value={monthsValue}
                placeholder="1 - 11"
                onChange={(e) => handleMonthsChange(e.target.value)}
                onBlur={() => {
                  setMonthsTouched(true);
                  setMonthsError(validateMonths(monthsValue));
                }}
                className={monthsError && monthsTouched ? inputErrorClass : numInputClass}
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <span className="text-xs font-medium text-text-muted">{lang === 'ar' ? 'شهر' : 'months'}</span>
            </div>
            {monthsError && monthsTouched && (
              <div className="mt-1 flex items-center gap-1 text-xs text-coral">
                <ExclamationTriangleIcon className="h-3 w-3" />
                <span>{monthsError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Prayer Language */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
            {translations[lang].prayerLanguage}
          </label>
          <div className="flex rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary p-[3px]">
            <button
              type="button"
              onClick={() => setPrayerLanguage('en')}
              className={`flex-1 rounded-[6px] py-2 text-[13px] font-medium transition ${
                prayerLanguage === 'en'
                  ? 'bg-bg-card text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setPrayerLanguage('ar')}
              className={`flex-1 rounded-[6px] py-2 text-[13px] font-medium transition ${
                prayerLanguage === 'ar'
                  ? 'bg-bg-card text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              عربي
            </button>
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between border-t border-border-subtle pt-3 text-[13px] font-semibold tracking-wider text-text-secondary transition hover:text-text-primary"
        >
          {translations[lang].advanced}
          {showAdvanced ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
        </button>

        {showAdvanced && (
          <div className="space-y-2.5">
            {/* All toggle switches grouped together */}
            <ToggleSwitch
              checked={ramadanMode}
              onChange={setRamadanMode}
              lang={lang}
              label={`🌙 ${translations[lang].ramadanMode}`}
              description={translations[lang].ramadanModeDescription}
            />

            <ToggleSwitch
              checked={jumuahMode}
              onChange={setJumuahMode}
              lang={lang}
              label={`🕐 ${translations[lang].jumuahMode}`}
              description={translations[lang].jumuahModeDescription}
            />

            <ToggleSwitch
              checked={travelMode}
              onChange={setTravelMode}
              lang={lang}
              label={`✈️ ${translations[lang].travelMode}`}
              description={translations[lang].travelModeDescription}
            />

            <ToggleSwitch
              checked={qiblaMode}
              onChange={setQiblaMode}
              lang={lang}
              label={`🕋 ${translations[lang].qiblaDirection}`}
              description={translations[lang].qiblaDirectionDescription}
            />

            <ToggleSwitch
              checked={duaMode}
              onChange={setDuaMode}
              lang={lang}
              label={`📿 ${translations[lang].duaAdhkar}`}
              description={translations[lang].duaAdhkarDescription}
            />

            <ToggleSwitch
              checked={busyMode}
              onChange={setBusyMode}
              lang={lang}
              label={`🚫 ${translations[lang].busyStatus}`}
              description={translations[lang].busyStatusDescription}
            />

            {/* Duration inputs for enabled modes */}
            {(ramadanMode || jumuahMode) && (
              <div className="border-t border-border-subtle pt-4">
                <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                  {lang === 'ar' ? 'إعدادات المدة' : 'Duration Settings'}
                </div>

                {jumuahMode && (
                  <div className="mb-3">
                    <label className="mb-1 block text-[11px] text-text-muted">
                      {translations[lang].jumuahDuration}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={30}
                        max={120}
                        value={jumuahDuration}
                        onChange={(e) =>
                          setJumuahDuration(Math.min(120, Math.max(30, parseInt(e.target.value, 10) || 30)))
                        }
                        className={numInputClass}
                        style={{ fontFamily: 'var(--font-mono)' }}
                      />
                      <span className="text-xs text-text-muted">{lang === 'ar' ? 'دقيقة' : 'min'}</span>
                    </div>
                  </div>
                )}

                {ramadanMode && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      {
                        label: translations[lang].iftarDuration,
                        value: iftarValue,
                        onChange: handleIftarChange,
                        onBlur: () => {
                          setIftarTouched(true);
                          setIftarError(validateIftar(iftarValue));
                        },
                        error: iftarError,
                        touched: iftarTouched,
                      },
                      {
                        label: translations[lang].traweehDuration,
                        value: traweehValue,
                        onChange: handleTraweehChange,
                        onBlur: () => {
                          setTraweehTouched(true);
                          setTraweehError(validateTraweeh(traweehValue));
                        },
                        error: traweehError,
                        touched: traweehTouched,
                      },
                      {
                        label: translations[lang].suhoorDuration,
                        value: suhoorValue,
                        onChange: handleSuhoorChange,
                        onBlur: () => {
                          setSuhoorTouched(true);
                          setSuhoorError(validateSuhoor(suhoorValue));
                        },
                        error: suhoorError,
                        touched: suhoorTouched,
                      },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="mb-1 block text-[11px] text-text-muted">{f.label}</label>
                        <input
                          type="number"
                          value={f.value}
                          onChange={(e) => f.onChange(e.target.value)}
                          onBlur={f.onBlur}
                          className={f.error && f.touched ? inputErrorClass : numInputClass}
                          style={{ fontFamily: 'var(--font-mono)', width: '100%' }}
                        />
                        {f.error && f.touched && <div className="mt-0.5 text-[10px] text-coral">{f.error}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Iqama Offsets - All 5 prayers */}
            <div className="border-t border-border-subtle pt-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                {translations[lang].iqamaOffset}
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {[0, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="text-center">
                    <div className="mb-1 text-[11px] text-text-muted">{eventNames[lang][idx]}</div>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={iqamaOffsets[idx]}
                      onChange={(e) => {
                        const val = Math.min(60, Math.max(0, parseInt(e.target.value, 10) || 0));
                        const newOffsets = [...iqamaOffsets];
                        newOffsets[idx] = val;
                        setIqamaOffsets(newOffsets);
                      }}
                      className={numInputClass}
                      style={{ fontFamily: 'var(--font-mono)', width: '100%' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Alarms */}
            <div className="border-t border-border-subtle pt-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                {translations[lang].selectAlarms}
              </div>
              <div className="flex flex-wrap gap-2">
                {alarmOptionsData.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => handleAlarmToggle(o.value)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition select-none ${
                      alarms.includes(o.value)
                        ? 'border-gold bg-gold-glow text-gold-light'
                        : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-[rgba(255,255,255,0.15)] hover:text-text-primary'
                    }`}
                  >
                    {o.label[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="border-t border-border-subtle pt-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                {translations[lang].selectEvents}
              </div>
              <div className="flex flex-wrap gap-2">
                {allEvents.map((ev, i) => (
                  <button
                    key={ev}
                    type="button"
                    onClick={() => handleEventToggle(i)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition select-none ${
                      selectedEvents.includes(i)
                        ? 'border-gold bg-gold-glow text-gold-light'
                        : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-[rgba(255,255,255,0.15)] hover:text-text-primary'
                    }`}
                  >
                    {ev}
                  </button>
                ))}
              </div>
            </div>

            {/* Week Days */}
            <div className="border-t border-border-subtle pt-4">
              <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                {translations[lang].selectWeekDays}
              </div>
              <div className="flex flex-wrap gap-2">
                {weekdayNames[lang].map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleWeekDayToggle(i)}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition select-none ${
                      selectedWeekDays.includes(i)
                        ? 'border-gold bg-gold-glow text-gold-light'
                        : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-[rgba(255,255,255,0.15)] hover:text-text-primary'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Validation Summary */}
        {(hasValidationErrors || hasAdvancedValidationErrors) && (
          <div className="rounded-[var(--radius-sm)] border border-[rgba(251,113,133,0.2)] bg-coral-dim p-3">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-coral" />
              <span className="text-sm font-medium text-coral">{translations[lang].validationSummaryMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
