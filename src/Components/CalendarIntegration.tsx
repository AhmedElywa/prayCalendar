import React from 'react';
import { translations } from '../constants/translations';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import InstructionsSection from './InstructionsSection';
import copy from 'copy-to-clipboard';

interface CalendarIntegrationProps {
  link: string;
}

export default function CalendarIntegration({ link }: CalendarIntegrationProps) {
  const { lang } = useAppContext();
  const [showManual, setShowManual] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    copy(link, { format: 'text/plain' });
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleCalendarClick = (calendarType: string) => {
    let calendarUrl = '';

    switch (calendarType) {
      case 'device':
        // Use webcal:// protocol for native calendar apps
        calendarUrl = link.replace('https://', 'webcal://');
        window.open(calendarUrl, '_blank');
        break;
      case 'google':
        // Google Calendar subscription URL
        calendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(link)}`;
        window.open(calendarUrl, '_blank');
        break;
      case 'outlook':
        // Outlook calendar subscription URL
        calendarUrl = `https://outlook.office.com/calendar/0/addcalendar?url=${encodeURIComponent(link)}`;
        window.open(calendarUrl, '_blank');
        break;
      case 'apple':
        // Apple Calendar uses webcal:// scheme directly
        calendarUrl = link.replace('https://', 'webcal://');
        window.open(calendarUrl, '_blank');
        break;
      default:
        break;
    }
  };

  // Don't render if no link is available
  if (!link) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <CalendarDaysIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            {translations[lang].addToCalendar}
          </h2>
        </div>

        {/* Primary calendar integration button */}
        <div className="mb-4">
          <button
            onClick={() => handleCalendarClick('device')}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700"
          >
            <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            {translations[lang].addToDevice}
          </button>
        </div>

        {/* Calendar service buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleCalendarClick('google')}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            title="Google Calendar"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="186 38 76 76">
              <path fill="#fff" d="M244 56h-40v40h40V56z"></path>
              <path fill="#EA4335" d="m244 114 18-18h-18v18z"></path>
              <path fill="#FBBC04" d="M262 56h-18v40h18V56z"></path>
              <path fill="#34A853" d="M244 96h-40v18h40V96z"></path>
              <path fill="#188038" d="M186 96v12c0 3.315 2.685 6 6 6h12V96h-18z"></path>
              <path fill="#1967D2" d="M262 56V44c0-3.315-2.685-6-6-6h-12v18h18z"></path>
              <path fill="#4285F4" d="M244 38h-52c-3.315 0-6 2.685-6 6v52h18V56h40V38z"></path>
              <path
                fill="#4285F4"
                d="M212.205 87.03c-1.495-1.01-2.53-2.485-3.095-4.435l3.47-1.43c.315 1.2.865 2.13 1.65 2.79.78.66 1.73.985 2.84.985 1.135 0 2.11-.345 2.925-1.035s1.225-1.57 1.225-2.635c0-1.09-.43-1.98-1.29-2.67-.86-.69-1.94-1.035-3.23-1.035h-2.005V74.13h1.8c1.11 0 2.045-.3 2.805-.9.76-.6 1.14-1.42 1.14-2.465 0-.93-.34-1.67-1.02-2.225-.68-.555-1.54-.835-2.585-.835-1.02 0-1.83.27-2.43.815a4.784 4.784 0 0 0-1.31 2.005l-3.435-1.43c.455-1.29 1.29-2.43 2.515-3.415 1.225-.985 2.79-1.48 4.69-1.48 1.405 0 2.67.27 3.79.815 1.12.545 2 1.3 2.635 2.26.635.965.95 2.045.95 3.245 0 1.225-.295 2.26-.885 3.11-.59.85-1.315 1.5-2.175 1.955v.205a6.605 6.605 0 0 1 2.79 2.175c.725.975 1.09 2.14 1.09 3.5 0 1.36-.345 2.575-1.035 3.64s-1.645 1.905-2.855 2.515c-1.215.61-2.58.92-4.095.92-1.755.005-3.375-.5-4.87-1.51zm21.315-17.22-3.81 2.755-1.905-2.89 6.835-4.93h2.62V88h-3.74V69.81z"
              ></path>
            </svg>
          </button>

          <button
            onClick={() => handleCalendarClick('outlook')}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            title="Microsoft Outlook"
          >
            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1831.085 1703.335" xmlSpace="preserve">
              <path
                fill="#0A2767"
                d="M1831.083 894.25a40.879 40.879 0 0 0-19.503-35.131h-.213l-.767-.426-634.492-375.585a86.175 86.175 0 0 0-8.517-5.067 85.17 85.17 0 0 0-78.098 0 86.37 86.37 0 0 0-8.517 5.067l-634.49 375.585-.766.426c-19.392 12.059-25.337 37.556-13.278 56.948a41.346 41.346 0 0 0 14.257 13.868l634.492 375.585a95.617 95.617 0 0 0 8.517 5.068 85.17 85.17 0 0 0 78.098 0 95.52 95.52 0 0 0 8.517-5.068l634.492-375.585a40.84 40.84 0 0 0 20.268-35.685z"
              ></path>
              <path
                fill="#0364B8"
                d="M520.453 643.477h416.38v381.674h-416.38V643.477zM1745.917 255.5V80.908c1-43.652-33.552-79.862-77.203-80.908H588.204C544.552 1.046 510 37.256 511 80.908V255.5l638.75 170.333L1745.917 255.5z"
              ></path>
              <path fill="#0078D4" d="M511 255.5h425.833v383.25H511V255.5z"></path>
              <path
                fill="#28A8EA"
                d="M1362.667 255.5H936.833v383.25L1362.667 1022h383.25V638.75l-383.25-383.25z"
              ></path>
              <path fill="#0078D4" d="M936.833 638.75h425.833V1022H936.833V638.75z"></path>
              <path fill="#0364B8" d="M936.833 1022h425.833v383.25H936.833V1022z"></path>
              <path fill="#14447D" d="M520.453 1025.151h416.38v346.969h-416.38v-346.969z"></path>
              <path fill="#0078D4" d="M1362.667 1022h383.25v383.25h-383.25V1022z"></path>
              <linearGradient
                id="a-outlook"
                gradientUnits="userSpaceOnUse"
                x1="1128.458"
                y1="811.083"
                x2="1128.458"
                y2="1.998"
                gradientTransform="matrix(1 0 0 -1 0 1705.333)"
              >
                <stop offset="0" stopColor="#35b8f1"></stop>
                <stop offset="1" stopColor="#28a8ea"></stop>
              </linearGradient>
              <path
                fill="url(#a-outlook)"
                d="m1811.58 927.593-.809.426-634.492 356.848c-2.768 1.703-5.578 3.321-8.517 4.769a88.437 88.437 0 0 1-34.407 8.517l-34.663-20.27a86.706 86.706 0 0 1-8.517-4.897L447.167 906.003h-.298l-21.036-11.753v722.384c.328 48.196 39.653 87.006 87.849 86.7h1230.914c.724 0 1.363-.341 2.129-.341a107.79 107.79 0 0 0 29.808-6.217 86.066 86.066 0 0 0 11.966-6.217c2.853-1.618 7.75-5.152 7.75-5.152a85.974 85.974 0 0 0 34.833-68.772V894.25a38.323 38.323 0 0 1-19.502 33.343z"
              ></path>
              <path
                opacity=".5"
                fill="#0A2767"
                d="M1797.017 891.397v44.287l-663.448 456.791-686.87-486.174a.426.426 0 0 0-.426-.426l-63.023-37.899v-31.938l25.976-.426 54.932 31.512 1.277.426 4.684 2.981s645.563 368.346 647.267 369.197l24.698 14.478c2.129-.852 4.258-1.703 6.813-2.555 1.278-.852 640.879-360.681 640.879-360.681l7.241.427z"
              ></path>
              <path
                fill="#1490DF"
                d="m1811.58 927.593-.809.468-634.492 356.848c-2.768 1.703-5.578 3.321-8.517 4.769a88.96 88.96 0 0 1-78.098 0 96.578 96.578 0 0 1-8.517-4.769l-634.49-356.848-.766-.468a38.326 38.326 0 0 1-20.057-33.343v722.384c.305 48.188 39.616 87.004 87.803 86.7H1743.277c48.188.307 87.5-38.509 87.807-86.696V894.25a38.33 38.33 0 0 1-19.504 33.343z"
              ></path>
              <path
                opacity=".1"
                d="m1185.52 1279.629-9.496 5.323a92.806 92.806 0 0 1-8.517 4.812 88.173 88.173 0 0 1-33.47 8.857l241.405 285.479 421.107 101.476a86.785 86.785 0 0 0 26.7-33.343l-637.729-372.604z"
              ></path>
              <path
                opacity=".05"
                d="m1228.529 1255.442-52.505 29.51a92.806 92.806 0 0 1-8.517 4.812 88.173 88.173 0 0 1-33.47 8.857l113.101 311.838 549.538 74.989a86.104 86.104 0 0 0 34.407-68.815v-9.326l-602.554-351.865z"
              ></path>
              <path
                fill="#28A8EA"
                d="M514.833 1703.333h1228.316a88.316 88.316 0 0 0 52.59-17.033l-697.089-408.331a86.706 86.706 0 0 1-8.517-4.897L447.125 906.088h-.298l-20.993-11.838v719.914c-.048 49.2 39.798 89.122 88.999 89.169-.001 0-.001 0 0 0z"
              ></path>
              <path
                opacity=".1"
                d="M1022 418.722v908.303c-.076 31.846-19.44 60.471-48.971 72.392a73.382 73.382 0 0 1-28.957 5.962H425.833V383.25H511v-42.583h433.073c43.019.163 77.834 35.035 77.927 78.055z"
              ></path>
              <path
                opacity=".2"
                d="M979.417 461.305v908.302a69.36 69.36 0 0 1-6.388 29.808c-11.826 29.149-40.083 48.273-71.54 48.417H425.833V383.25h475.656a71.493 71.493 0 0 1 35.344 8.943c26.104 13.151 42.574 39.883 42.584 69.112z"
              ></path>
              <path
                opacity=".2"
                d="M979.417 461.305v823.136c-.208 43-34.928 77.853-77.927 78.225H425.833V383.25h475.656a71.493 71.493 0 0 1 35.344 8.943c26.104 13.151 42.574 39.883 42.584 69.112z"
              ></path>
              <path
                opacity=".2"
                d="M936.833 461.305v823.136c-.046 43.067-34.861 78.015-77.927 78.225H425.833V383.250h433.072c43.062.023 77.951 34.951 77.927 78.013a.589.589 0 0 1 .001.042z"
              ></path>
              <linearGradient
                id="b-outlook"
                gradientUnits="userSpaceOnUse"
                x1="162.747"
                y1="1383.074"
                x2="774.086"
                y2="324.259"
                gradientTransform="matrix(1 0 0 -1 0 1705.333)"
              >
                <stop offset="0" stopColor="#1784d9"></stop>
                <stop offset=".5" stopColor="#107ad5"></stop>
                <stop offset="1" stopColor="#0a63c9"></stop>
              </linearGradient>
              <path
                fill="url(#b-outlook)"
                d="M78.055 383.25h780.723c43.109 0 78.055 34.947 78.055 78.055v780.723c0 43.109-34.946 78.055-78.055 78.055H78.055c-43.109 0-78.055-34.947-78.055-78.055V461.305c0-43.108 34.947-78.055 78.055-78.055z"
              ></path>
              <path
                fill="#FFF"
                d="M243.96 710.631a227.05 227.05 0 0 1 89.17-98.495 269.56 269.56 0 0 1 141.675-35.515 250.91 250.91 0 0 1 131.114 33.683 225.014 225.014 0 0 1 86.742 94.109 303.751 303.751 0 0 1 30.405 138.396 320.567 320.567 0 0 1-31.299 144.783 230.37 230.37 0 0 1-89.425 97.388 260.864 260.864 0 0 1-136.011 34.578 256.355 256.355 0 0 1-134.01-34.067 228.497 228.497 0 0 1-87.892-94.28 296.507 296.507 0 0 1-30.745-136.735 329.29 329.29 0 0 1 30.276-143.845zm95.046 231.227a147.386 147.386 0 0 0 50.163 64.812 131.028 131.028 0 0 0 78.353 23.591 137.244 137.244 0 0 0 83.634-24.358 141.156 141.156 0 0 0 48.715-64.812 251.594 251.594 0 0 0 15.543-90.404 275.198 275.198 0 0 0-14.649-91.554 144.775 144.775 0 0 0-47.182-67.537 129.58 129.58 0 0 0-82.91-25.55 135.202 135.202 0 0 0-80.184 23.804 148.626 148.626 0 0 0-51.1 65.365 259.759 259.759 0 0 0-.341 186.728l-.042-.085z"
              ></path>
              <path fill="#50D9FF" d="M1362.667 255.5h383.25v383.25h-383.25V255.5z"></path>
            </svg>
          </button>

          <button
            onClick={() => handleCalendarClick('apple')}
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white p-3 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            title="Apple Calendar"
          >
            <svg className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </button>
        </div>

        {/* Manual section toggle */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowManual(!showManual)}
            className="flex w-full items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <span>{translations[lang].manualInstructions}</span>
            {showManual ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </button>
        </div>

        {/* Manual section content */}
        {showManual && (
          <div className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-zinc-800">
            {/* Calendar URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                {translations[lang].calendarUrlLabel}
              </label>
              <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                {translations[lang].calendarUrlDescription}
              </p>
              <div className="relative">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-100"
                />
                <button
                  onClick={handleCopy}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Copy URL"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <InstructionsSection />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
