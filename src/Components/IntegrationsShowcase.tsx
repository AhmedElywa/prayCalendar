'use client';

import Link from 'next/link';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';

const integrationCards = [
  {
    icon: '🔧',
    titleKey: 'widgetGenerator' as const,
    descriptionKey: 'embedOnWebsite' as const,
    href: '/widget/generator',
    color: 'from-amber-500/20 to-orange-500/10',
  },
  {
    icon: '🏠',
    titleKey: 'homeAssistant' as const,
    descriptionKey: 'smartHomeIntegration' as const,
    href: '/integrations/home-assistant',
    color: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    icon: '🌍',
    titleKey: 'allCities' as const,
    descriptionKey: 'quickCityLinks' as const,
    href: '/cities',
    color: 'from-emerald-500/20 to-teal-500/10',
  },
];

export default function IntegrationsShowcase() {
  const { lang } = useAppContext();

  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-16">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-text-primary">{translations[lang].discoverMore}</h2>
        <p className="text-sm text-text-muted">{translations[lang].exploreIntegrations}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrationCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative overflow-hidden rounded-xl border border-border-subtle bg-bg-card p-5 no-underline transition-all hover:border-border-accent hover:shadow-lg"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity group-hover:opacity-100`}
            />

            <div className="relative">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-secondary text-2xl transition-transform group-hover:scale-110">
                {card.icon}
              </div>

              <h3 className="mb-1.5 text-base font-semibold text-text-primary transition-colors group-hover:text-gold-light">
                {translations[lang][card.titleKey]}
              </h3>

              <p className="text-sm text-text-muted">{translations[lang][card.descriptionKey]}</p>

              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                <span>{lang === 'ar' ? 'اكتشف' : 'Explore'}</span>
                <svg
                  className={`h-3.5 w-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
