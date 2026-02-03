import { useState } from 'react';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';

export default function InstructionsSection() {
  const { lang } = useAppContext();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="overflow-hidden rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-5 py-3 text-left text-sm font-medium text-text-secondary transition hover:bg-bg-elevated"
      >
        <span>{translations[lang].instructionsLabel}</span>
        <svg
          className={`h-4 w-4 text-text-muted transition ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {!collapsed && (
        <div className="space-y-6 border-t border-border-subtle p-5">
          {/* Hint */}
          <div className="rounded-[var(--radius-sm)] bg-gold-glow p-3">
            <p className="text-sm text-gold">
              {translations[lang].editHint}{' '}
              <a
                className="font-medium underline hover:text-gold-light"
                href="https://aladhan.com/prayer-times-api#get-/timingsByAddress/-date-"
                target="_blank"
                rel="noreferrer"
              >
                {translations[lang].docsAnchor}
              </a>
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-5">
            {/* Google */}
            <div>
              <h2 className="flex items-center text-sm font-semibold text-text-primary">
                {translations[lang].googleTitle}{' '}
                <a
                  className="ms-2 text-xs font-normal text-gold hover:underline"
                  href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DDesktop"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translations[lang].docsLinkText}
                </a>
              </h2>
              <ol className="mt-2 list-decimal space-y-1.5 ps-5 text-sm leading-6 text-text-secondary">
                {translations[lang].googleSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Outlook */}
            <div>
              <h2 className="flex items-center text-sm font-semibold text-text-primary">
                {translations[lang].outlookTitle}{' '}
                <a
                  className="ms-2 text-xs font-normal text-gold hover:underline"
                  href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translations[lang].docsLinkText}
                </a>
              </h2>
              <ol className="mt-2 list-decimal space-y-1.5 ps-5 text-sm leading-6 text-text-secondary">
                {translations[lang].outlookSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Apple */}
            <div>
              <h2 className="flex items-center text-sm font-semibold text-text-primary">
                {translations[lang].appleTitle}{' '}
                <a
                  className="ms-2 text-xs font-normal text-gold hover:underline"
                  href="https://support.apple.com/en-eg/102301"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translations[lang].docsLinkText}
                </a>
              </h2>
              <ol className="mt-2 list-decimal space-y-1.5 ps-5 text-sm leading-6 text-text-secondary">
                {translations[lang].appleSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Unsubscribe */}
          <div className="rounded-[var(--radius-sm)] border border-[rgba(251,113,133,0.2)] bg-[rgba(251,113,133,0.08)] p-4">
            <h2 className="mb-3 flex items-center text-sm font-semibold text-coral">
              🗑️ {translations[lang].removeCalendarTitle}
            </h2>
            <div className="space-y-3 text-sm text-text-secondary">
              <div>
                <p className="font-medium text-text-primary">Google Calendar:</p>
                <ul className="mt-1 list-disc space-y-1 ps-5">
                  {translations[lang].googleUnsubSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-text-primary">Apple Calendar:</p>
                <ul className="mt-1 list-disc space-y-1 ps-5">
                  {translations[lang].appleUnsubSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-text-primary">Microsoft Outlook:</p>
                <ul className="mt-1 list-disc space-y-1 ps-5">
                  {translations[lang].outlookUnsubSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
