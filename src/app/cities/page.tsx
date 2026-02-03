'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import PageLayout from '../../Components/PageLayout';
import { type City, cities, getTranslatedText } from '../../constants/cities';
import { translations } from '../../constants/translations';
import { useAppContext } from '../../contexts/AppContext';

// Group cities by country
function groupCitiesByCountry(cityList: City[], lang: string) {
  const groups: Record<string, City[]> = {};
  for (const city of cityList) {
    const country = getTranslatedText(city.country, lang as 'en' | 'ar');
    if (!groups[country]) {
      groups[country] = [];
    }
    groups[country].push(city);
  }
  // Sort cities within each country by population
  for (const country in groups) {
    groups[country].sort((a, b) => (b.population || 0) - (a.population || 0));
  }
  return groups;
}

// Get unique regions for filtering
const regions = [
  { id: 'all', name: { en: 'All Regions', ar: 'جميع المناطق' } },
  {
    id: 'middle-east',
    name: { en: 'Middle East', ar: 'الشرق الأوسط' },
    countries: ['Egypt', 'Saudi Arabia', 'UAE', 'Iraq', 'Jordan', 'Kuwait', 'Qatar'],
  },
  {
    id: 'asia',
    name: { en: 'Asia', ar: 'آسيا' },
    countries: ['Indonesia', 'Malaysia', 'Pakistan', 'Bangladesh', 'India', 'Singapore', 'Turkey'],
  },
  { id: 'africa', name: { en: 'Africa', ar: 'أفريقيا' }, countries: ['Morocco', 'Tunisia', 'Algeria', 'Nigeria'] },
  { id: 'europe', name: { en: 'Europe', ar: 'أوروبا' }, countries: ['UK', 'Germany', 'France'] },
  { id: 'americas', name: { en: 'Americas', ar: 'الأمريكتين' }, countries: ['USA', 'Canada'] },
];

export default function CitiesPage() {
  const { lang } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Filter cities based on search and region
  const filteredCities = useMemo(() => {
    let result = cities;

    // Filter by region
    if (selectedRegion !== 'all') {
      const region = regions.find((r) => r.id === selectedRegion);
      if (region?.countries) {
        result = result.filter((city) => region.countries.includes(city.country.en));
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (city) =>
          city.name.en.toLowerCase().includes(query) ||
          city.name.ar?.includes(query) ||
          city.country.en.toLowerCase().includes(query) ||
          city.country.ar?.includes(query),
      );
    }

    return result;
  }, [searchQuery, selectedRegion]);

  // Group filtered cities by country
  const groupedCities = useMemo(() => groupCitiesByCountry(filteredCities, lang), [filteredCities, lang]);

  // Sort countries by total population
  const sortedCountries = useMemo(() => {
    return Object.keys(groupedCities).sort((a, b) => {
      const popA = groupedCities[a].reduce((sum, city) => sum + (city.population || 0), 0);
      const popB = groupedCities[b].reduce((sum, city) => sum + (city.population || 0), 0);
      return popB - popA;
    });
  }, [groupedCities]);

  return (
    <PageLayout>
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-text-primary">{translations[lang].allCities}</h1>
          <p className="mx-auto max-w-lg text-text-secondary">
            {lang === 'ar'
              ? 'اختر مدينتك للحصول على أوقات صلاة دقيقة ورابط اشتراك مخصص للتقويم'
              : 'Select your city for accurate prayer times and a customized calendar subscription link'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted ${lang === 'ar' ? 'right-3' : 'left-3'}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث عن مدينة...' : 'Search cities...'}
              className={`w-full rounded-lg border border-border-subtle bg-bg-card py-2.5 text-text-primary placeholder:text-text-muted focus:border-border-accent focus:outline-none ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>

          {/* Region Filter */}
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region.id}
                type="button"
                onClick={() => setSelectedRegion(region.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedRegion === region.id
                    ? 'bg-gold text-bg-primary'
                    : 'border border-border-subtle bg-bg-card text-text-secondary hover:border-border-accent hover:text-text-primary'
                }`}
              >
                {getTranslatedText(region.name, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-text-muted">
          {lang === 'ar' ? `${filteredCities.length} مدينة` : `${filteredCities.length} cities found`}
        </div>

        {/* Cities Grid by Country */}
        {filteredCities.length === 0 ? (
          <div className="rounded-xl border border-border-subtle bg-bg-card p-10 text-center">
            <p className="text-text-muted">{lang === 'ar' ? 'لم يتم العثور على مدن' : 'No cities found'}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedCountries.map((country) => (
              <div key={country}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
                  <span>{groupedCities[country][0].flag}</span>
                  {country}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {groupedCities[country].map((city) => (
                    <Link
                      key={city.slug}
                      href={`/city/${city.slug}`}
                      className="group flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-card px-4 py-3 no-underline transition hover:border-border-accent hover:bg-gold-glow"
                    >
                      <span className="text-lg">{city.flag}</span>
                      <span className="text-sm font-medium text-text-secondary transition group-hover:text-gold-light">
                        {getTranslatedText(city.name, lang)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 rounded-xl border border-border-subtle bg-bg-card p-6">
          <h2 className="mb-3 text-lg font-semibold text-text-primary">
            {lang === 'ar' ? 'أوقات الصلاة حول العالم' : 'Prayer Times Around the World'}
          </h2>
          <p className="text-sm leading-relaxed text-text-muted">
            {lang === 'ar'
              ? 'يوفر PrayCalendar أوقات صلاة دقيقة لأكثر من 40 مدينة حول العالم. اختر مدينتك للحصول على رابط اشتراك مخصص للتقويم يعمل مع تقويم جوجل وآبل وأوتلوك. يتم حساب أوقات الصلاة باستخدام أفضل طرق الحساب لكل منطقة.'
              : 'PrayCalendar provides accurate prayer times for over 40 cities worldwide. Select your city to get a customized calendar subscription link that works with Google Calendar, Apple Calendar, and Outlook. Prayer times are calculated using the best calculation methods for each region.'}
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
