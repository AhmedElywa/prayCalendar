import React from 'react';
import copy from 'copy-to-clipboard';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';

const CopyText: React.FC<{ text: string }> = ({ text }) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  return (
    <div className="relative flex w-full items-center justify-between rounded-lg dark:selection:bg-gray-800 dark:selection:text-gray-100 bg-gray-200 p-2 text-gray-700">
      {copySuccess && (
        <div className="absolute left-0 top-0 w-full h-full bg-green-400/90 p-2 text-center text-white">Copied!</div>
      )}
      <span className="break-all">{text}</span>
      <button
        onClick={() => {
          copy(text, {
            format: 'text/plain',
          });
          setCopySuccess(true);
          setTimeout(() => {
            setCopySuccess(false);
          }, 1000);
        }}
        type="button"
        className="mr-2 hover:text-gray-500"
      >
        <DocumentDuplicateIcon className="h-8 w-8" />
      </button>
    </div>
  );
};

export default React.memo(CopyText);
