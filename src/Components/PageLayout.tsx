'use client';
import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { useAppContext } from '../contexts/AppContext';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useAppContext();
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-800">
      <Navigation lang={lang} setLang={setLang} />
      {children}
      <Footer lang={lang} />
    </main>
  );
}
