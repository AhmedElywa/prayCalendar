import React from 'react';
import copy from 'copy-to-clipboard';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';

interface CopyTextProps {
  text: string;
  copiedText?: string; // localised "Copied!" message
}

const CopyText: React.FC<CopyTextProps> = ({ text, copiedText = 'Copied!' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    copy(text, { format: 'text/plain' });
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-zinc-900">
      {/* Toast */}
      <Transition
        as="div"
        show={copied}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="absolute end-4 top-4 z-10 flex items-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm"
      >
        <CheckIcon className="me-1.5 h-4 w-4" />
        <span>{copiedText}</span>
      </Transition>

      <div className="flex items-start p-4">
        {/* Link text */}
        <div className="me-4 flex-1 text-sm break-all text-gray-700 dark:text-gray-200">{text}</div>

        {/* Copy button */}
        <button
          type="button"
          aria-label="Copy to clipboard"
          onClick={handleCopy}
          className="ms-2 flex-shrink-0 rounded-md bg-sky-100 p-2 text-sky-600 transition hover:bg-sky-200 hover:text-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none dark:bg-sky-900/30 dark:text-sky-400 dark:hover:bg-sky-900/50 dark:hover:text-sky-300"
        >
          {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <DocumentDuplicateIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default React.memo(CopyText);
