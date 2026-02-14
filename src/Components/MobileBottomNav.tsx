'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../contexts/AppContext';

const CalendarIcon = ({ active }: { active: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={active ? 2 : 1.5}
    stroke="currentColor"
    className="transition-all duration-200"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
    {active && (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="currentColor"
      />
    )}
  </svg>
);

const MosqueIcon = ({ active }: { active: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={active ? 2 : 1.5}
    stroke="currentColor"
    className="transition-all duration-200"
  >
    {/* Dome */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c-3 0-6 3-6 6v2h12v-5c0-3-3-6-6-6Z"
      fill={active ? 'currentColor' : 'none'}
      fillOpacity={active ? 0.15 : 0}
    />
    {/* Crescent on top */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3V2" />
    <circle cx="12" cy="1.5" r="0.5" fill="currentColor" />
    {/* Minarets */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 11v9M20 11v9" />
    {/* Base */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 20h18" />
    {/* Door */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-4a2 2 0 0 1 4 0v4" />
    {/* Walls */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 11v9M18 11v9" />
  </svg>
);

const GlobeIcon = ({ active }: { active: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={active ? 2 : 1.5}
    stroke="currentColor"
    className="transition-all duration-200"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z"
    />
  </svg>
);

const CodeIcon = ({ active }: { active: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={active ? 2 : 1.5}
    stroke="currentColor"
    className="transition-all duration-200"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m17.25 6.75 4.5 5.25-4.5 5.25m-10.5 0L2.25 12l4.5-5.25m7.5-3-4.5 16.5"
    />
  </svg>
);

const tabs = [
  { href: '/', icon: CalendarIcon, labelKey: 'homeLink' as const },
  { href: '/pwa', icon: MosqueIcon, labelKey: 'pwaLink' as const },
  { href: '/cities', icon: GlobeIcon, labelKey: 'allCities' as const },
  { href: '/api-docs', icon: CodeIcon, labelKey: 'apiDocs' as const },
] as const;

// Short labels for the bottom nav (keep them concise)
const shortLabels: Record<string, Record<string, string>> = {
  en: { homeLink: 'Home', pwaLink: 'Prayers', allCities: 'Cities', apiDocs: 'API' },
  ar: { homeLink: 'الرئيسية', pwaLink: 'الصلاة', allCities: 'المدن', apiDocs: 'API' },
  tr: { homeLink: 'Ana', pwaLink: 'Namaz', allCities: 'Şehirler', apiDocs: 'API' },
  fr: { homeLink: 'Accueil', pwaLink: 'Prières', allCities: 'Villes', apiDocs: 'API' },
  ur: { homeLink: 'ہوم', pwaLink: 'نماز', allCities: 'شہر', apiDocs: 'API' },
  id: { homeLink: 'Beranda', pwaLink: 'Shalat', allCities: 'Kota', apiDocs: 'API' },
};

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { lang } = useAppContext();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const labels = shortLabels[lang] || shortLabels.en;

  return (
    <nav
      className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle md:hidden"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      {/* Frosted glass background — extends 34px below to cover gap when browser chrome hides on scroll */}
      <div className="absolute inset-0 -bottom-[34px] bg-[rgba(12,15,20,0.92)] light:bg-[rgba(250,250,248,0.95)] backdrop-blur-2xl" />

      <div className="relative flex items-stretch justify-around px-2">
        {tabs.map(({ href, icon: Icon, labelKey }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-1 flex-col items-center gap-0.5 pb-1.5 pt-2 no-underline transition-colors duration-200 ${
                active ? 'text-gold' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {/* Active indicator dot */}
              {active && (
                <span className="absolute top-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-b-full bg-gold shadow-[0_0_8px_var(--gold-glow)]" />
              )}

              <span className="relative">
                <Icon active={active} />
              </span>
              <span
                className={`text-[10px] font-medium leading-tight transition-colors duration-200 ${
                  active ? 'text-gold' : 'text-text-muted'
                }`}
              >
                {labels[labelKey]}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
