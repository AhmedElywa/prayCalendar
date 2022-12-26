import React from 'react';
import copy from 'copy-to-clipboard';
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';

const CopyText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex w-full items-center justify-between rounded-lg text-gray-700 p-2 bg-gray-200">
      <span>{text}</span>
      <button
        onClick={() =>
          copy(text, {
            format: 'text/plain',
          })
        }
        type="button"
        className="mr-2 hover:text-gray-500"
      >
        <DocumentDuplicateIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default React.memo(CopyText);
