import React from 'react';

type Lang = 'en' | 'ar';

/** language (en/ar) + document dir */
export function useLanguage(initial: Lang) {
  const [lang, setLang] = React.useState<Lang>(initial);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Handle client-side initialization after hydration
  React.useEffect(() => {
    setIsHydrated(true);

    // Only check saved/browser language after hydration
    const savedLang = localStorage.getItem('lang') as Lang | null;
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    const preferredLang = savedLang ?? browserLang;

    if (preferredLang !== initial) {
      setLang(preferredLang);
    }
  }, [initial]);

  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('lang', lang);
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang, isHydrated]);

  return { lang, setLang };
}

export type { Lang };
