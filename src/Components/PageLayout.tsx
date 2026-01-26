'use client';
import type { ReactNode } from 'react';
import Footer from './Footer';
import InstallPrompt from './InstallPrompt';
import Navigation from './Navigation';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      <Navigation />
      {children}
      <Footer />
      <InstallPrompt />
    </main>
  );
}
