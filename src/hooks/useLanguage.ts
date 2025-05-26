import React from 'react';

type Lang = 'en' | 'ar';

/** language (en/ar) + document dir */
export function useLanguage(initial: Lang) {
  const [lang, setLang] = React.useState<Lang>(initial);

  React.useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return { lang, setLang };
}

export type { Lang };
