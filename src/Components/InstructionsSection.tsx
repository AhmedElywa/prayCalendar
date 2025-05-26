import React from 'react';
import { translations } from '../constants/translations';
import { InformationCircleIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

export default function InstructionsSection() {
  const { lang } = useAppContext();
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between bg-gray-50 px-6 py-4 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
      >
        <span className="flex items-center gap-2">{translations[lang].instructionsLabel}</span>
        {collapsed ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronUpIcon className="h-5 w-5" />}
      </button>
      {!collapsed && (
        <div className="space-y-8 p-6">
          {/* Hint about editing */}
          <div className="rounded-lg bg-sky-50 p-4 dark:bg-sky-900/20">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
              </div>
              <div className="ms-3">
                <p className="text-sm text-sky-700 dark:text-sky-300">
                  {translations[lang].editHint}{' '}
                  <a
                    className="font-medium text-sky-700 underline hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200"
                    href="https://aladhan.com/prayer-times-api#get-/timingsByAddress/-date-"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {translations[lang].docsAnchor}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Instructions for different calendar services */}
          <div className="space-y-6">
            {/* Google Calendar */}
            <div>
              <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <DocumentTextIcon className="me-2 h-5 w-5 text-sky-600 dark:text-sky-400" />
                {translations[lang].googleTitle}{' '}
                <a
                  className="ms-2 text-sm font-normal text-sky-600 hover:underline dark:text-sky-400"
                  href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DDesktop"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translations[lang].docsLinkText}
                </a>
              </h2>
              <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
                {translations[lang].googleSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Outlook Instructions */}
            <div>
              <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <DocumentTextIcon className="me-2 h-5 w-5 text-sky-600 dark:text-sky-400" />
                {translations[lang].outlookTitle}{' '}
                <a
                  className="ms-2 text-sm font-normal text-sky-600 hover:underline dark:text-sky-400"
                  href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translations[lang].docsLinkText}
                </a>
              </h2>
              <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
                {translations[lang].outlookSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Apple Calendar Instructions */}
            <div>
              <h2 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                <DocumentTextIcon className="me-2 h-5 w-5 text-sky-600 dark:text-sky-400" />
                {translations[lang].appleTitle}{' '}
                <a
                  className="ms-2 text-sm font-normal text-sky-600 hover:underline dark:text-sky-400"
                  href="https://support.apple.com/en-eg/102301"
                  target="_blank"
                  rel="noreferrer"
                >
                  {translations[lang].docsLinkText}
                </a>
              </h2>
              <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm leading-6 text-gray-700 dark:text-gray-300">
                {translations[lang].appleSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
