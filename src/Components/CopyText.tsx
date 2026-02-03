import { Transition } from '@headlessui/react';
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import copy from 'copy-to-clipboard';
import type { FC } from 'react';
import { memo, useState } from 'react';

interface CopyTextProps {
  text: string;
  copiedText?: string;
}

const CopyText: FC<CopyTextProps> = ({ text, copiedText = 'Copied!' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(text, { format: 'text/plain' });
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary">
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
        className="absolute end-4 top-4 z-10 flex items-center rounded-md bg-teal px-3 py-1.5 text-sm font-medium text-bg-primary shadow-sm"
      >
        <CheckIcon className="me-1.5 h-4 w-4" />
        <span>{copiedText}</span>
      </Transition>

      <div className="flex items-start p-4">
        <div className="me-4 flex-1 text-sm break-all text-text-secondary">{text}</div>
        <button
          type="button"
          aria-label="Copy to clipboard"
          onClick={handleCopy}
          className="ms-2 flex-shrink-0 rounded-[var(--radius-sm)] bg-gold-glow p-2 text-gold transition hover:bg-[rgba(212,175,105,0.25)] focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-bg-primary focus:outline-none"
        >
          {copied ? <CheckIcon className="h-5 w-5 text-teal" /> : <DocumentDuplicateIcon className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default memo(CopyText);
