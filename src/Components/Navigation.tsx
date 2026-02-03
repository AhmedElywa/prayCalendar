'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import { LanguageSelector } from './LanguageSelector';
import ThemeMenu from './Theme';

export default function Navigation() {
  const { lang, setLang } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [mobileIntegrationsOpen, setMobileIntegrationsOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIntegrationsOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIntegrationsOpen(false);
    }, 150);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border-subtle bg-[rgba(12,15,20,0.85)] light:bg-[rgba(250,250,248,0.9)] backdrop-blur-xl print:hidden">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-text-primary no-underline md:gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-gradient-to-br from-gold to-gold-dark text-base shadow-[0_2px_12px_var(--gold-glow)] md:h-9 md:w-9 md:rounded-[10px] md:text-lg">
            ☽
          </div>
          <span className="text-base font-semibold tracking-tight md:text-lg">PrayCalendar</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            className="rounded-full border border-border-accent bg-bg-card px-3.5 py-1.5 text-[13px] font-medium text-gold-light no-underline transition hover:bg-bg-card-hover"
          >
            {translations[lang].homeLink}
          </Link>
          <Link
            href="/pwa"
            className="rounded-full border border-transparent px-3.5 py-1.5 text-[13px] font-medium text-text-secondary no-underline transition hover:border-border-subtle hover:bg-bg-card hover:text-text-primary"
          >
            {translations[lang].pwaLink}
          </Link>
          {/* Integrations Dropdown */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Dropdown menu with mouse hover */}
          <div className="relative" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
            <button
              type="button"
              onClick={() => setIntegrationsOpen(!integrationsOpen)}
              className="flex items-center gap-1 rounded-full border border-transparent px-3.5 py-1.5 text-[13px] font-medium text-text-secondary no-underline transition hover:border-border-subtle hover:bg-bg-card hover:text-text-primary"
            >
              {translations[lang].integrations}
              <svg
                className={`h-3.5 w-3.5 transition-transform ${integrationsOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {integrationsOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-lg border border-border-subtle bg-bg-card py-1 shadow-lg">
                <Link
                  href="/widget/generator"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
                  onClick={() => setIntegrationsOpen(false)}
                >
                  <span className="text-base">🔧</span>
                  {translations[lang].widgetGenerator}
                </Link>
                <Link
                  href="/integrations/home-assistant"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
                  onClick={() => setIntegrationsOpen(false)}
                >
                  <span className="text-base">🏠</span>
                  {translations[lang].homeAssistant}
                </Link>
                <Link
                  href="/cities"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
                  onClick={() => setIntegrationsOpen(false)}
                >
                  <span className="text-base">🌍</span>
                  {translations[lang].allCities}
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/api-docs"
            className="rounded-full border border-transparent px-3.5 py-1.5 text-[13px] font-medium text-text-secondary no-underline transition hover:border-border-subtle hover:bg-bg-card hover:text-text-primary"
          >
            API
          </Link>
          <ThemeMenu />
          <LanguageSelector currentLang={lang} onChange={setLang} />
        </div>

        {/* Mobile: Theme + Lang + Hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeMenu />
          <LanguageSelector currentLang={lang} onChange={setLang} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-bg-secondary text-text-secondary transition hover:border-border-accent hover:text-text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-border-subtle bg-bg-card px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gold-light no-underline transition hover:bg-bg-secondary"
            >
              <span className="text-base">🏠</span>
              {translations[lang].homeLink}
            </Link>
            <Link
              href="/pwa"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
            >
              <span className="text-base">📱</span>
              {translations[lang].pwaLink}
            </Link>
            {/* Mobile Integrations Section */}
            <button
              type="button"
              onClick={() => setMobileIntegrationsOpen(!mobileIntegrationsOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-secondary hover:text-text-primary"
            >
              <span className="flex items-center gap-3">
                <span className="text-base">⚡</span>
                {translations[lang].integrations}
              </span>
              <svg
                className={`h-4 w-4 transition-transform ${mobileIntegrationsOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {mobileIntegrationsOpen && (
              <div className="ml-6 flex flex-col gap-1 border-l border-border-subtle pl-4">
                <Link
                  href="/widget/generator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
                >
                  <span className="text-base">🔧</span>
                  {translations[lang].widgetGenerator}
                </Link>
                <Link
                  href="/integrations/home-assistant"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
                >
                  <span className="text-base">🏠</span>
                  {translations[lang].homeAssistant}
                </Link>
                <Link
                  href="/cities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
                >
                  <span className="text-base">🌍</span>
                  {translations[lang].allCities}
                </Link>
              </div>
            )}
            <Link
              href="/api-docs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
            >
              <span className="text-base">📄</span>
              API Documentation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
