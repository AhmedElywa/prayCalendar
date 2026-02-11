'use client';

import { LANGUAGE_NAMES, type Lang } from '../hooks/useLanguage';

interface LanguageSelectorProps {
  currentLang: Lang;
  onChange: (lang: Lang) => void;
  className?: string;
}

const AVAILABLE_LANGUAGES: Lang[] = ['en', 'ar', 'tr', 'fr', 'ur', 'id'];

export function LanguageSelector({ currentLang, onChange, className = '' }: LanguageSelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={currentLang}
        onChange={(e) => onChange(e.target.value as Lang)}
        className="appearance-none rounded-[var(--radius-md)] border border-border-subtle bg-bg-secondary px-3 py-1.5 pe-8 text-sm text-text-primary focus:border-border-default focus:outline-none"
        aria-label="Select language"
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {LANGUAGE_NAMES[lang].native}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2">
        <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

// Compact version for mobile
export function LanguageSelectorCompact({ currentLang, onChange, className = '' }: LanguageSelectorProps) {
  const currentIndex = AVAILABLE_LANGUAGES.indexOf(currentLang);
  const nextLang = AVAILABLE_LANGUAGES[(currentIndex + 1) % AVAILABLE_LANGUAGES.length];

  return (
    <button
      onClick={() => onChange(nextLang)}
      className={`flex items-center gap-1 rounded-[var(--radius-md)] border border-border-subtle bg-bg-secondary px-2 py-1 text-sm text-text-primary hover:bg-bg-card ${className}`}
      title={`Switch to ${LANGUAGE_NAMES[nextLang].english}`}
      aria-label={`Current language: ${LANGUAGE_NAMES[currentLang].english}. Click to switch to ${LANGUAGE_NAMES[nextLang].english}`}
    >
      <span className="text-base">🌐</span>
      <span>{LANGUAGE_NAMES[currentLang].native}</span>
    </button>
  );
}

export default LanguageSelector;
