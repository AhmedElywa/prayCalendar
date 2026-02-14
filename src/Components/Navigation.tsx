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

      {/* Mobile Menu Dropdown — secondary links only (main pages are in the bottom nav) */}
      {mobileMenuOpen && (
        <div className="border-t border-border-subtle bg-bg-card px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/widget/generator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
            >
              <svg
                className="h-5 w-5 text-gold"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              {translations[lang].widgetGenerator}
            </Link>
            <Link
              href="/integrations/home-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
            >
              <svg
                className="h-5 w-5 text-teal"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              {translations[lang].homeAssistant}
            </Link>
            <a
              href="https://github.com/AhmedElywa/prayCalendar"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary no-underline transition hover:bg-bg-secondary hover:text-text-primary"
            >
              <svg className="h-5 w-5 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z" />
              </svg>
              {translations[lang].source}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
