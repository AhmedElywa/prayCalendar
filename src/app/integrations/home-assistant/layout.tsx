import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prayer Times for Home Assistant - Smart Home Integration',
  description:
    'Automate your smart home with Islamic prayer times. RESTful sensors for Fajr, Dhuhr, Asr, Maghrib, Isha in Home Assistant with notifications.',
  keywords: [
    'home assistant prayer times',
    'smart home mosque',
    'islamic automation',
    'prayer times sensor',
    'home assistant muslim',
    'prayer notifications automation',
    'smart home adhan',
  ],
  openGraph: {
    title: 'Prayer Times for Home Assistant',
    description: 'Automate your smart home with Islamic prayer times using Home Assistant RESTful sensors.',
    type: 'article',
    url: 'https://pray.ahmedelywa.com/integrations/home-assistant',
  },
  twitter: {
    card: 'summary',
    title: 'Prayer Times for Home Assistant',
    description: 'Smart home automation with Islamic prayer times.',
  },
  alternates: {
    canonical: '/integrations/home-assistant',
  },
};

// JSON-LD for How-To guide
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Add Prayer Times to Home Assistant',
  description: 'Step-by-step guide to integrate Islamic prayer times into Home Assistant smart home system',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Add REST sensors',
      text: 'Add the REST sensor configuration to your configuration.yaml file',
    },
    {
      '@type': 'HowToStep',
      name: 'Create dashboard card',
      text: 'Add a Lovelace entities card to display prayer times',
    },
    {
      '@type': 'HowToStep',
      name: 'Set up automations',
      text: 'Create automations for prayer time notifications',
    },
  ],
};

export default function HomeAssistantLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
