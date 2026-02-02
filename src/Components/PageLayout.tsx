'use client';
import type { ReactNode } from 'react';
import Footer from './Footer';
import InstallPrompt from './InstallPrompt';
import Navigation from './Navigation';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-zinc-800">
      <Navigation />
      <div className="flex-1">{children}</div>
      <Footer />
      <InstallPrompt />
    </main>
  );
}
