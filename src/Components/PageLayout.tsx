'use client';
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      <Navigation />
      {children}
      <Footer />
    </main>
  );
}
