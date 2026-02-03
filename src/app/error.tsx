'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary">Something went wrong!</h2>
        <p className="mt-4 text-text-secondary">An error occurred while loading the prayer calendar.</p>
        <button
          onClick={reset}
          className="mt-6 rounded-[var(--radius-sm)] bg-gold px-4 py-2 font-medium text-bg-primary hover:bg-gold-light"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
