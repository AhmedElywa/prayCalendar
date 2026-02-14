'use client';
import type { ReactNode } from 'react';
import Footer from './Footer';
import InstallPrompt from './InstallPrompt';
import MobileBottomNav from './MobileBottomNav';
import Navigation from './Navigation';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative z-[1] flex min-h-screen flex-col">
      <div className="geo-pattern" />
      <Navigation />
      <div className="flex-1">{children}</div>
      <Footer />
      <InstallPrompt />
      <MobileBottomNav />
    </main>
  );
}
