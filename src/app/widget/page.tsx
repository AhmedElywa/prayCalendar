import { Suspense } from 'react';
import WidgetContent from './WidgetContent';

export const metadata = {
  title: 'Prayer Times Widget',
  description: 'Embeddable prayer times widget',
  robots: 'noindex, nofollow',
};

interface WidgetPageProps {
  searchParams: Promise<{
    lat?: string;
    lng?: string;
    address?: string;
    method?: string;
    lang?: string;
    theme?: string;
    compact?: string;
  }>;
}

export default async function WidgetPage({ searchParams }: WidgetPageProps) {
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      }
    >
      <WidgetContent
        latitude={params.lat ? parseFloat(params.lat) : undefined}
        longitude={params.lng ? parseFloat(params.lng) : undefined}
        address={params.address}
        method={params.method || '5'}
        lang={(params.lang as 'en' | 'ar') || 'en'}
        theme={(params.theme as 'dark' | 'light') || 'dark'}
        compact={params.compact === 'true'}
      />
    </Suspense>
  );
}
