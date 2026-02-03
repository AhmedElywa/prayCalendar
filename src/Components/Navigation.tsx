'use client';

import Link from 'next/link';
import { useState } from 'react';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import type { Lang } from '../hooks/useLanguage';
import ThemeMenu from './Theme';

export default function Navigation() {
  const { lang, setLang } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link
            href="/api-docs"
            className="rounded-full border border-transparent px-3.5 py-1.5 text-[13px] font-medium text-text-secondary no-underline transition hover:border-border-subtle hover:bg-bg-card hover:text-text-primary"
          >
            API
          </Link>
          <ThemeMenu />
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : ('en' as Lang))}
            className="rounded-full border border-border-accent bg-gold-glow px-3.5 py-1.5 text-[13px] font-medium text-gold transition hover:bg-[rgba(212,175,105,0.2)]"
          >
            {lang === 'en' ? 'AR' : 'EN'} | {lang === 'en' ? 'EN' : 'AR'}
          </button>
        </div>

        {/* Mobile: Theme + Lang + Hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeMenu />
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : ('en' as Lang))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-accent bg-gold-glow text-xs font-bold text-gold transition hover:bg-[rgba(212,175,105,0.2)]"
            title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            {lang === 'en' ? 'ع' : 'EN'}
          </button>
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
