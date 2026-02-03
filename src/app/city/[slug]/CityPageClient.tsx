'use client';

import Link from 'next/link';
import PageLayout from '../../../Components/PageLayout';
import { type City, cities } from '../../../constants/cities';
import { translations } from '../../../constants/translations';
import { useAppContext } from '../../../contexts/AppContext';

interface Props {
  city: City;
  timings: Record<string, string> | null;
  hijriDate: { day: string; month: { en: string; ar: string }; year: string } | null;
}

const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
const prayerNamesAr: Record<string, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
  Midnight: 'منتصف الليل',
};

export default function CityPageClient({ city, timings, hijriDate }: Props) {
  const { lang } = useAppContext();
  const t = translations[lang];
  const cityName = city.name[lang] || city.name.en;
  const countryName = city.country[lang] || city.country.en;

  const subscribeUrl = `webcal://pray.ahmedelywa.com/api/prayer-times.ics?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}&lang=${lang}`;

  const nearbyCities = cities.filter((c) => c.country.en === city.country.en && c.slug !== city.slug).slice(0, 4);

  const otherCities = cities
    .filter((c) => c.country.en !== city.country.en)
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, 6);

  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-lg px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-text-muted">
          <Link href="/" className="hover:text-gold">
            {t.homeLink}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-text-secondary">{cityName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-3xl">📍</span>
            <div>
              <h1
                className="text-2xl font-bold md:text-3xl"
                style={{
                  background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--gold-light) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {lang === 'ar' ? `مواقيت الصلاة في ${cityName}` : `Prayer Times in ${cityName}`}
              </h1>
              <p className="text-text-secondary">{countryName}</p>
            </div>
          </div>

          {hijriDate && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-bg-secondary px-4 py-2">
              <span className="text-sm">📅</span>
              <span className="text-sm font-medium text-text-primary">
                {hijriDate.day} {lang === 'ar' ? hijriDate.month.ar : hijriDate.month.en} {hijriDate.year}
              </span>
            </div>
          )}
        </div>

        {/* Today's Prayer Times */}
        {timings && (
          <div className="mb-8 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card">
            <div className="flex items-center gap-2 border-b border-border-subtle p-4">
              <span className="text-sm">🕐</span>
              <h2 className="text-lg font-semibold text-text-primary">{t.eventsToday}</h2>
            </div>
            <div className="divide-y divide-border-subtle/50">
              {prayerOrder.map((ev) => (
                <div key={ev} className="flex items-center justify-between p-4 transition hover:bg-bg-secondary">
                  <span className="text-sm font-medium text-text-secondary">
                    {lang === 'ar' ? prayerNamesAr[ev] || ev : ev}
                  </span>
                  <span className="font-mono text-sm font-semibold text-text-primary">{timings[ev]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe CTA */}
        <div className="mb-8 rounded-[var(--radius-lg)] border border-border-accent bg-gold-glow p-6 text-center">
          <h2 className="mb-2 text-lg font-semibold text-gold-light">
            {lang === 'ar' ? `اشترك في مواقيت الصلاة لـ ${cityName}` : `Subscribe to ${cityName} Prayer Times`}
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            {lang === 'ar'
              ? 'أضف أوقات الصلاة مباشرة إلى تقويمك'
              : 'Add prayer times directly to your calendar with auto-updates'}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={subscribeUrl}
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-gold px-6 py-3 text-sm font-semibold text-bg-primary shadow-sm hover:bg-gold-light"
            >
              📅 {t.addToDevice}
            </a>
            <Link
              href={`/?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}`}
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-card px-6 py-3 text-sm font-medium text-text-secondary hover:border-border-accent hover:text-text-primary"
            >
              {lang === 'ar' ? 'تخصيص الإعدادات' : 'Customize Settings'}
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            {lang === 'ar' ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-3">
            <details className="rounded-[var(--radius-sm)] border border-border-subtle bg-bg-card">
              <summary className="cursor-pointer p-4 text-sm font-medium text-text-secondary">
                {lang === 'ar'
                  ? `كيف أضيف مواقيت الصلاة لـ ${cityName} إلى تقويمي؟`
                  : `How do I add ${cityName} prayer times to my calendar?`}
              </summary>
              <p className="border-t border-border-subtle p-4 text-sm text-text-muted">
                {lang === 'ar'
                  ? 'اضغط على زر "إضافة إلى جهازك" أعلاه لإضافة مواقيت الصلاة مباشرة. يمكنك أيضاً تخصيص الإعدادات مثل التنبيهات ومدة الصلاة من الصفحة الرئيسية.'
                  : 'Click the "Add to your current device" button above to subscribe directly. You can also customize settings like alarms, prayer duration, and more from the home page.'}
              </p>
            </details>
            <details className="rounded-[var(--radius-sm)] border border-border-subtle bg-bg-card">
              <summary className="cursor-pointer p-4 text-sm font-medium text-text-secondary">
                {lang === 'ar' ? 'ما هي طريقة حساب مواقيت الصلاة المستخدمة؟' : 'What calculation method is used?'}
              </summary>
              <p className="border-t border-border-subtle p-4 text-sm text-text-muted">
                {lang === 'ar'
                  ? `نستخدم طريقة الحساب الافتراضية لـ ${countryName}. يمكنك تغييرها من صفحة التخصيص.`
                  : `We use the default calculation method for ${countryName}. You can change it on the customization page.`}
              </p>
            </details>
          </div>
        </div>

        {/* Nearby Cities */}
        {nearbyCities.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">
              {lang === 'ar' ? `مدن أخرى في ${countryName}` : `Other Cities in ${countryName}`}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {nearbyCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="rounded-[var(--radius-sm)] border border-border-subtle bg-bg-card p-3 text-center text-sm font-medium text-text-secondary transition hover:border-border-accent hover:text-gold"
                >
                  {c.name[lang] || c.name.en}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Popular Cities */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            {lang === 'ar' ? 'مدن شائعة' : 'Popular Cities'}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/city/${c.slug}`}
                className="rounded-[var(--radius-sm)] border border-border-subtle bg-bg-card p-3 text-sm transition hover:border-border-accent hover:text-gold"
              >
                <span className="font-medium text-text-secondary">{c.name[lang] || c.name.en}</span>
                <span className="block text-xs text-text-muted">{c.country[lang] || c.country.en}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
