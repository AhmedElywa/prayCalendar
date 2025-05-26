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
    <div className="relative flex w-full items-center gap-2 rounded-lg bg-gray-200 p-2 text-gray-700 dark:bg-zinc-700 dark:text-gray-50">
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
        className="absolute -top-8 end-0 rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow"
      >
        <div className="flex items-center gap-1">
          <CheckIcon className="h-4 w-4" />
          <span>{copiedText}</span>
        </div>
      </Transition>

      {/* Link text */}
      <span className="flex-1 break-all text-sm">{text}</span>

      {/* Copy button */}
      <button
        type="button"
        aria-label="Copy to clipboard"
        onClick={handleCopy}
        className="rounded-md p-1 hover:bg-gray-300/50 focus:outline-none dark:hover:bg-zinc-600/50"
      >
        {copied ? (
          <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
        ) : (
          <DocumentDuplicateIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default React.memo(CopyText);
