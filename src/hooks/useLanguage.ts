import React from 'react';

// Supported languages
export type Lang = 'en' | 'ar' | 'tr' | 'fr' | 'ur' | 'id';

// RTL languages
const RTL_LANGUAGES: Lang[] = ['ar', 'ur'];

// Language display names
export const LANGUAGE_NAMES: Record<Lang, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  ar: { native: 'العربية', english: 'Arabic' },
  tr: { native: 'Türkçe', english: 'Turkish' },
  fr: { native: 'Français', english: 'French' },
  ur: { native: 'اردو', english: 'Urdu' },
  id: { native: 'Bahasa Indonesia', english: 'Indonesian' },
};

// Check if a language is RTL
export function isRTL(lang: Lang): boolean {
  return RTL_LANGUAGES.includes(lang);
}

// Detect browser language
function detectBrowserLanguage(): Lang {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('tr')) return 'tr';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('ur')) return 'ur';
  if (browserLang.startsWith('id')) return 'id';
  return 'en';
}

/** language hook with RTL support */
export function useLanguage(initial: Lang) {
  const [lang, setLang] = React.useState<Lang>(initial);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Handle client-side initialization after hydration
  React.useEffect(() => {
    setIsHydrated(true);

    // Only check saved/browser language after hydration
    const savedLang = localStorage.getItem('lang') as Lang | null;
    const validLanguages: Lang[] = ['en', 'ar', 'tr', 'fr', 'ur', 'id'];
    const browserLang = detectBrowserLanguage();

    let preferredLang: Lang = browserLang;
    if (savedLang && validLanguages.includes(savedLang)) {
      preferredLang = savedLang;
    }

    if (preferredLang !== initial) {
      setLang(preferredLang);
    }
  }, [initial]);

  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('lang', lang);
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    if (isRTL(lang)) {
      document.documentElement.classList.add('arabic-font');
    } else {
      document.documentElement.classList.remove('arabic-font');
    }
  }, [lang, isHydrated]);

  return { lang, setLang, isRTL: isRTL(lang) };
}
