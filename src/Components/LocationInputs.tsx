import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import { AddressAutocomplete } from './AddressAutocomplete';

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
    handleAddressSelect,
  } = locationFields;
  return (
    <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6 transition hover:border-[rgba(255,255,255,0.1)]">
      {/* Card Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border-accent bg-gold-glow text-base">
          📍
        </div>
        <div>
          <div className="text-[15px] font-semibold text-text-primary">{translations[lang].locationSettings}</div>
          <div className="text-xs text-text-muted">{lang === 'ar' ? 'أين تصلي؟' : 'Where are you praying?'}</div>
        </div>
      </div>

      {/* Segmented control */}
      <div className="mb-4 flex rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary p-[3px]">
        <button
          type="button"
          onClick={() => setInputMode('address')}
          className={`flex-1 rounded-[6px] py-2 text-[13px] font-medium transition ${
            inputMode === 'address'
              ? 'bg-bg-card text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {translations[lang].addressRadio}
        </button>
        <button
          type="button"
          onClick={() => setInputMode('coords')}
          className={`flex-1 rounded-[6px] py-2 text-[13px] font-medium transition ${
            inputMode === 'coords'
              ? 'bg-bg-card text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {translations[lang].coordsRadio}
        </button>
      </div>

      {/* Address input with autocomplete */}
      {inputMode === 'address' && (
        <div>
          <div className="relative">
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleAddressSelect}
              placeholder={translations[lang].addressPlaceholder}
              className="pe-12"
            />
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="absolute end-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[var(--radius-sm)] border-none bg-gold-glow text-gold transition hover:bg-[rgba(212,175,105,0.25)] disabled:opacity-50"
              title={translations[lang].useLocation}
            >
              {locating ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                '📌'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Coordinate inputs */}
      {inputMode === 'coords' && (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                {translations[lang].latitude}
              </label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                placeholder="30.0444"
                className="w-full rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)]"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                {translations[lang].longitude}
              </label>
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                placeholder="31.2357"
                className="w-full rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)]"
                style={{ fontFamily: 'var(--font-sans)' }}
              />
            </div>
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-gold-glow px-4 py-2 text-sm font-medium text-gold transition hover:bg-[rgba(212,175,105,0.25)] disabled:opacity-50"
            >
              {locating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
