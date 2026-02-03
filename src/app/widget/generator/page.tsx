'use client';

import copy from 'copy-to-clipboard';
import { useCallback, useMemo, useState } from 'react';
import { AddressAutocomplete } from '../../../Components/AddressAutocomplete';
import PageLayout from '../../../Components/PageLayout';
import { translations } from '../../../constants/translations';
import { useAppContext } from '../../../contexts/AppContext';

const methods = [
  { id: '1', name: 'University of Islamic Sciences, Karachi' },
  { id: '2', name: 'Islamic Society of North America (ISNA)' },
  { id: '3', name: 'Muslim World League (MWL)' },
  { id: '4', name: 'Umm Al-Qura University, Makkah' },
  { id: '5', name: 'Egyptian General Authority of Survey' },
  { id: '7', name: 'Institute of Geophysics, University of Tehran' },
  { id: '8', name: 'Gulf Region' },
  { id: '9', name: 'Kuwait' },
  { id: '10', name: 'Qatar' },
  { id: '11', name: 'Majlis Ugama Islam Singapura' },
  { id: '12', name: 'Union Organization Islamic de France' },
  { id: '13', name: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: '14', name: 'Spiritual Administration of Muslims of Russia' },
];

export default function WidgetGeneratorPage() {
  const { lang } = useAppContext();

  // Location state
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Settings state
  const [method, setMethod] = useState('5');
  const [widgetLang, setWidgetLang] = useState<'en' | 'ar'>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [compact, setCompact] = useState(false);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(400);

  const [copied, setCopied] = useState(false);

  const handleAddressSelect = useCallback((addr: string, lat: number, lng: number) => {
    setAddress(addr);
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  // Generate widget URL
  const widgetUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams();

    if (latitude && longitude) {
      params.set('lat', latitude.toString());
      params.set('lng', longitude.toString());
    } else if (address) {
      params.set('address', address);
    }

    params.set('method', method);
    params.set('lang', widgetLang);
    params.set('theme', theme);
    if (compact) params.set('compact', 'true');

    return `${baseUrl}/widget?${params.toString()}`;
  }, [latitude, longitude, address, method, widgetLang, theme, compact]);

  // Generate embed code
  const iframeCode = useMemo(() => {
    const heightValue = compact ? 60 : height;
    return `<iframe src="${widgetUrl}" width="${width}" height="${heightValue}" frameborder="0" style="border-radius: 8px;"></iframe>`;
  }, [widgetUrl, width, height, compact]);

  // JavaScript embed code
  const jsCode = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `<div id="pray-calendar-widget" data-lat="${latitude || ''}" data-lng="${longitude || ''}" data-address="${address}" data-method="${method}" data-lang="${widgetLang}" data-theme="${theme}"${compact ? ' data-compact="true"' : ''}></div>
<script src="${baseUrl}/widget-loader.js" async></script>`;
  }, [latitude, longitude, address, method, widgetLang, theme, compact]);

  const handleCopy = useCallback((code: string) => {
    copy(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const hasLocation = (latitude && longitude) || address;

  return (
    <PageLayout>
      <div className="mx-auto max-w-screen-lg px-4 py-8">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-text-primary">
            <span className="text-2xl">🔧</span>
            {lang === 'ar' ? 'مولد الودجت' : 'Widget Generator'}
          </h1>
          <p className="mt-2 text-text-secondary">
            {lang === 'ar'
              ? 'أنشئ ودجت أوقات الصلاة لموقعك أو مسجدك'
              : 'Create a prayer times widget for your website or mosque'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Settings panel */}
          <div className="space-y-6">
            {/* Location */}
            <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">{lang === 'ar' ? 'الموقع' : 'Location'}</h2>
              <AddressAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleAddressSelect}
                placeholder={translations[lang].addressPlaceholder}
              />
              {latitude && longitude && (
                <p className="mt-2 text-xs text-text-muted">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </p>
              )}
            </div>

            {/* Settings */}
            <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">
                {lang === 'ar' ? 'الإعدادات' : 'Settings'}
              </h2>

              <div className="space-y-4">
                {/* Method */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    {lang === 'ar' ? 'طريقة الحساب' : 'Calculation Method'}
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-3 py-2 text-sm text-text-primary"
                  >
                    {methods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    {lang === 'ar' ? 'اللغة' : 'Language'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWidgetLang('en')}
                      className={`flex-1 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium ${
                        widgetLang === 'en'
                          ? 'bg-gold text-bg-primary'
                          : 'border border-border-subtle bg-bg-secondary text-text-secondary'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setWidgetLang('ar')}
                      className={`flex-1 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium ${
                        widgetLang === 'ar'
                          ? 'bg-gold text-bg-primary'
                          : 'border border-border-subtle bg-bg-secondary text-text-secondary'
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-secondary">
                    {lang === 'ar' ? 'المظهر' : 'Theme'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex-1 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium ${
                        theme === 'dark'
                          ? 'bg-gold text-bg-primary'
                          : 'border border-border-subtle bg-bg-secondary text-text-secondary'
                      }`}
                    >
                      {lang === 'ar' ? 'داكن' : 'Dark'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex-1 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-medium ${
                        theme === 'light'
                          ? 'bg-gold text-bg-primary'
                          : 'border border-border-subtle bg-bg-secondary text-text-secondary'
                      }`}
                    >
                      {lang === 'ar' ? 'فاتح' : 'Light'}
                    </button>
                  </div>
                </div>

                {/* Compact mode */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="compact"
                    checked={compact}
                    onChange={(e) => setCompact(e.target.checked)}
                    className="h-4 w-4 rounded border-border-subtle bg-bg-secondary"
                  />
                  <label htmlFor="compact" className="text-sm text-text-secondary">
                    {lang === 'ar' ? 'الوضع المضغوط (صف واحد)' : 'Compact mode (single row)'}
                  </label>
                </div>

                {/* Dimensions */}
                {!compact && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">
                        {lang === 'ar' ? 'العرض (px)' : 'Width (px)'}
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value, 10) || 300)}
                        className="w-full rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-3 py-2 text-sm text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text-secondary">
                        {lang === 'ar' ? 'الارتفاع (px)' : 'Height (px)'}
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value, 10) || 400)}
                        className="w-full rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-3 py-2 text-sm text-text-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Embed codes */}
            {hasLocation && (
              <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-text-primary">
                  {lang === 'ar' ? 'كود التضمين' : 'Embed Code'}
                </h2>

                {/* iframe code */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-text-secondary">
                      {lang === 'ar' ? 'كود iframe' : 'iframe Code'}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(iframeCode)}
                      className="text-xs text-gold hover:underline"
                    >
                      {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : lang === 'ar' ? 'نسخ' : 'Copy'}
                    </button>
                  </div>
                  <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-[var(--radius-sm)] bg-bg-secondary p-3 text-xs text-text-muted">
                    {iframeCode}
                  </pre>
                </div>

                {/* JS code */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-text-secondary">
                      {lang === 'ar' ? 'كود JavaScript' : 'JavaScript Code'}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(jsCode)}
                      className="text-xs text-gold hover:underline"
                    >
                      {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : lang === 'ar' ? 'نسخ' : 'Copy'}
                    </button>
                  </div>
                  <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-[var(--radius-sm)] bg-bg-secondary p-3 text-xs text-text-muted">
                    {jsCode}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Preview panel */}
          <div className="lg:sticky lg:top-4">
            <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">{lang === 'ar' ? 'المعاينة' : 'Preview'}</h2>

              {hasLocation ? (
                <div className="overflow-hidden rounded-lg">
                  <iframe
                    src={widgetUrl}
                    width={width}
                    height={compact ? 60 : height}
                    style={{ border: 'none', maxWidth: '100%' }}
                    title="Prayer Times Widget Preview"
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border-subtle bg-bg-secondary">
                  <p className="text-sm text-text-muted">
                    {lang === 'ar' ? 'أدخل موقعاً لمعاينة الودجت' : 'Enter a location to preview the widget'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
