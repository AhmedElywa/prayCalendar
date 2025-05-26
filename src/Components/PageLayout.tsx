'use client';
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import InstallPrompt from './InstallPrompt';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      <Navigation />
      {children}
      <Footer />
      <InstallPrompt />
    </main>
  );
}
