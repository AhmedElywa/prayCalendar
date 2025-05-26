import React from 'react';
import { translations } from '../constants/translations';
import type { Lang } from '../hooks/useLanguage';

interface InstructionsSectionProps {
  lang: Lang;
}

export default function InstructionsSection({ lang }: InstructionsSectionProps) {
  return (
    <>
      <div className="font-bold">
        <span className="animate-ping text-5xl">👉 </span>
        {translations[lang].editHint}{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://aladhan.com/prayer-times-api#tag/Monthly-Annual-Prayer-Times-Calendar/paths/~1v1~1calendarByAddress~1%7Byear%7D~1%7Bmonth%7D/get"
          target="_blank"
          rel="noreferrer"
        >
          {translations[lang].docsAnchor}
        </a>
      </div>

      {/* Google Calendar Instructions */}
      <h2 className="font-bold">
        {translations[lang].googleTitle}{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DDesktop"
          target="_blank"
          rel="noreferrer"
        >
          {translations[lang].docsLinkText}
        </a>
      </h2>
      <ul className="my-4 list-decimal pl-6 text-lg leading-7">
        {translations[lang].googleSteps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ul>

      {/* Outlook Instructions */}
      <h2 className="font-bold">
        {translations[lang].outlookTitle}{' '}
        <a
          className="text-blue-300 hover:underline"
          href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c"
          target="_blank"
          rel="noreferrer"
        >
          {translations[lang].docsLinkText}
        </a>
      </h2>
      <ul className="my-4 list-decimal pl-6 text-lg leading-7">
        {translations[lang].outlookSteps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ul>

      {/* Apple Calendar Instructions */}
      <div>
        <h2 className="font-bold">
          {translations[lang].appleTitle}{' '}
          <a
            className="text-blue-300 hover:underline"
            href="https://support.apple.com/en-eg/102301"
            target="_blank"
            rel="noreferrer"
          >
            {translations[lang].docsLinkText}
          </a>
        </h2>
        <ul className="my-4 list-decimal pl-6 text-lg leading-7">
          {translations[lang].appleSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
