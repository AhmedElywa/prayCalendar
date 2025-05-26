'use client';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { translations } from '../constants/translations';

export default function InstallPrompt() {
  const { lang } = useAppContext();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const dismissed = localStorage.getItem('installPromptDismissed');
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('installPromptDismissed', '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center p-4">
      <div className="max-w-screen-sm flex-1 rounded-lg bg-sky-50 p-4 shadow-lg dark:bg-sky-900/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-1 font-medium text-gray-900 dark:text-white">{translations[lang].installTitle}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">{translations[lang].installText}</p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 rounded-md bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600"
          >
            {translations[lang].dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
