import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Integrations',
    template: '%s | PrayCalendar Integrations',
  },
  description: 'Integrate PrayCalendar prayer times with your favorite tools and platforms.',
};

export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
