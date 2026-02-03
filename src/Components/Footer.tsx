import Link from 'next/link';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';

export default function Footer() {
  const { lang } = useAppContext();
  return (
    <footer className="border-t border-border-subtle py-10 mt-10">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-gold to-gold-dark text-sm shadow-[0_2px_8px_var(--gold-glow)]">
                ☽
              </div>
              <span className="text-base font-semibold text-text-primary">PrayCalendar</span>
            </div>
            <p className="text-[13px] leading-relaxed text-text-muted">
              {lang === 'ar'
                ? 'أداة اشتراك أوقات الصلاة مفتوحة المصدر. مجانية للأبد، بدون حسابات، بدون تتبع.'
                : 'The open-source prayer times calendar subscription tool. Free forever, no accounts, no tracking.'}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-secondary">
              {lang === 'ar' ? 'المنتج' : 'Product'}
            </h4>
            <div className="flex flex-col gap-1">
              <Link href="/" className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light">
                {translations[lang].homeLink}
              </Link>
              <Link
                href="/pwa"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {translations[lang].pwaLink}
              </Link>
              <Link
                href="/api-docs"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                API Docs
              </Link>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-secondary">
              {lang === 'ar' ? 'مدن شائعة' : 'Popular Cities'}
            </h4>
            <div className="flex flex-col gap-1">
              <Link
                href="/city/makkah"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {lang === 'ar' ? 'مكة' : 'Makkah'}
              </Link>
              <Link
                href="/city/cairo"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {lang === 'ar' ? 'القاهرة' : 'Cairo'}
              </Link>
              <Link
                href="/city/london"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {lang === 'ar' ? 'لندن' : 'London'}
              </Link>
              <Link
                href="/city/istanbul"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {lang === 'ar' ? 'اسطنبول' : 'Istanbul'}
              </Link>
              <Link
                href="/city/new-york"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {lang === 'ar' ? 'نيويورك' : 'New York'}
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-secondary">
              {lang === 'ar' ? 'الدعم' : 'Support'}
            </h4>
            <div className="flex flex-col gap-1">
              <a
                href="https://github.com/AhmedElywa/prayCalendar"
                target="_blank"
                rel="noreferrer"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {translations[lang].source}
              </a>
              <a
                href="https://ahmedelywa.com"
                className="py-1 text-[13px] text-text-muted no-underline transition hover:text-gold-light"
              >
                {translations[lang].creator}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
