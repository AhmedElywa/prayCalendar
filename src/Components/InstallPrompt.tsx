'use client';
import { useCallback, useEffect, useState } from 'react';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const { lang } = useAppContext();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showNative, setShowNative] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < 30 * 24 * 60 * 60 * 1000) return;
    }

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    if (isStandalone) return;

    setDismissed(false);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowNative(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
    if (isIOS) {
      setShowIOS(true);
    }

    const installed = () => {
      setShowNative(false);
      setShowIOS(false);
    };
    window.addEventListener('appinstalled', installed);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowNative(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (dismissed || (!showNative && !showIOS)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center p-4">
      <div className="max-w-screen-sm flex-1 rounded-[var(--radius-lg)] border border-border-accent bg-bg-card p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-1 font-medium text-text-primary">{translations[lang].installTitle}</h3>
            {showIOS && !showNative && (
              <p className="text-sm text-text-secondary">{translations[lang].iosInstallText}</p>
            )}
            {showNative && (
              <button
                type="button"
                onClick={handleInstall}
                className="mt-2 rounded-[var(--radius-sm)] bg-gold px-4 py-2 text-sm font-medium text-bg-primary hover:bg-gold-light"
              >
                {translations[lang].installButton}
              </button>
            )}
            {!showNative && !showIOS && <p className="text-sm text-text-secondary">{translations[lang].installText}</p>}
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 rounded-[var(--radius-sm)] p-1 text-text-muted hover:bg-bg-elevated hover:text-text-secondary"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
