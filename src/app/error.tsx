'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Something went wrong!</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">An error occurred while loading the prayer calendar.</p>
        <button onClick={reset} className="mt-6 rounded-md bg-sky-400 px-4 py-2 text-white hover:bg-sky-500">
          Try again
        </button>
      </div>
    </div>
  );
}
