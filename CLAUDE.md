# PrayCalendar

Prayer times calendar subscription app that syncs to Google, Apple, or Outlook calendars.

**Live URL**: https://pray.ahmedelywa.com
**Production Port**: 3001 (via PM2 on deploy user)
**Dev Port**: 3300

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind CSS 4
- **Caching**: Redis (two-level: L1 in-memory + L2 Redis)
- **Testing**: Playwright (E2E), Bun test (unit)
- **Linting**: Biome
- **Analytics**: Vercel Analytics + custom Redis analytics
- **Calendar**: ical-generator for ICS file generation

## Commands

```bash
bun dev          # Start dev server on port 3300
bun build        # Generate service worker + Next.js build
bun test         # Run unit tests
bun test:watch   # Run tests in watch mode
bun lint         # Run Biome linter
bun format       # Format with Biome
bun check        # Check with Biome
bun check:fix    # Fix with Biome
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main calendar generator page
│   ├── layout.tsx            # Root layout with SEO/JSON-LD
│   ├── admin/                # Analytics dashboard (protected)
│   ├── api/
│   │   ├── prayer-times.ics/ # ICS calendar endpoint
│   │   ├── prayer-times.json/# JSON API endpoint
│   │   ├── prayer-times.pdf/ # PDF export
│   │   ├── analytics/        # Analytics API
│   │   └── cache-stats/      # Cache monitoring API
│   ├── api-docs/             # API documentation page
│   ├── cities/               # All cities listing page
│   ├── city/[slug]/          # Dynamic city pages (45+ cities)
│   ├── integrations/
│   │   └── home-assistant/   # Home Assistant integration guide
│   ├── pwa/                  # PWA prayer view app
│   └── widget/
│       ├── page.tsx          # Embeddable widget
│       └── generator/        # Widget code generator
├── Components/
│   ├── CalendarIntegration.tsx   # Calendar buttons & QR code
│   ├── LocationInputs.tsx        # Address/coordinates input
│   ├── MethodAndSettings.tsx     # Prayer method & advanced options
│   ├── PrayerPreview.tsx         # Live prayer times preview
│   ├── AddressAutocomplete.tsx   # Location autocomplete
│   └── ...
├── constants/
│   ├── translations.ts       # i18n (en, ar, tr, fr, ur, id)
│   ├── cities.ts             # 45+ pre-configured cities
│   ├── prayerData.ts         # Prayer events & alarms data
│   ├── duaData.ts            # Du'a and Adhkar content
│   └── methodRecommendations.ts
├── hooks/
│   ├── useTimingsPreview.ts  # Live prayer times fetching
│   ├── useGeolocation.ts     # Browser geolocation
│   ├── useLocationFields.ts  # Location form state
│   ├── useCalendarDetection.ts # Detect user's calendar app
│   └── useDebounce.ts
├── lib/
│   ├── cache.ts              # Two-level Redis caching
│   ├── redis.ts              # Redis client
│   ├── analytics.ts          # Custom analytics tracking
│   ├── qibla.ts              # Qibla direction calculation
│   └── preset.ts             # Preset encoding/decoding
├── contexts/
│   └── AppContext.tsx        # Global state (lang, location)
└── prayerTimes.ts            # AlAdhan API wrapper
```

## Features

### Calendar Integration
- **ICS Subscription**: Google Calendar, Apple Calendar, Outlook, webcal:// protocol
- **QR Code**: Scannable subscription link
- **Share**: Native share API + preset link generation
- **PDF Export**: Downloadable prayer timetable

### Prayer Settings
- **Calculation Methods**: 14+ Islamic calculation methods (Egyptian, ISNA, MWL, Umm Al-Qura, etc.)
- **Prayer Events**: Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Midnight (selectable)
- **Weekday Filter**: Generate events for specific days only
- **Alarms**: Multiple alarm offsets (at time, 5/10/15/20/30 min before)
- **Duration**: Customizable event duration (5-60 min)
- **Calendar Length**: 1-11 months ahead
- **Calendar Color**: Custom color for Apple Calendar & Thunderbird

### Special Modes
- **Travel Mode (Qasr)**: Shortened prayers for travelers (2 rak'at)
- **Jumu'ah Mode**: Friday prayer replacing Dhuhr
- **Ramadan Mode**: Iftar, Tarawih, Suhoor events during Ramadan
- **Busy Status**: Mark prayer events as busy to block availability

### Enrichments
- **Qibla Direction**: Compass bearing in event descriptions
- **Du'a & Adhkar**: Authentic supplications from Hisn al-Muslim
- **Iqama Offsets**: Separate Iqama events per prayer
- **Hijri Date**: Islamic calendar date display

### Internationalization
- **Languages**: English, Arabic (RTL), Turkish, French, Urdu, Indonesian
- **Prayer Names**: Separate language selection for event names

### City Pages
45+ pre-configured cities with optimized calculation methods:
- Egypt: Cairo, Alexandria, Giza
- Saudi Arabia: Makkah, Madinah, Riyadh, Jeddah
- UAE: Dubai, Abu Dhabi
- Turkey: Istanbul, Ankara
- USA: New York, LA, Chicago, Houston, Detroit
- UK: London, Birmingham
- And more...

### Integrations
- **Widget**: Embeddable iframe/JS widget with generator tool
- **Home Assistant**: RESTful sensor integration guide
- **JSON API**: Full API documentation at /api-docs

### Infrastructure
- **Caching**: Two-level (L1 in-memory per request, L2 Redis)
- **Analytics**: Request tracking, top locations, cache hit rates
- **Admin Dashboard**: Protected analytics & cache stats view
- **PWA**: Installable progressive web app
- **SEO**: JSON-LD structured data, sitemap, OG images, robots.txt

## API Endpoints

### GET /api/prayer-times.ics
Generate ICS calendar file. Key parameters:
- `address` or `latitude`+`longitude` (required)
- `method` - calculation method (default: 5)
- `duration` - event length in minutes (default: 25)
- `months` - calendar length (default: 3)
- `alarm` - comma-separated offsets (e.g., "5,10")
- `events` - prayer indices (0=Fajr...6=Midnight)
- `weekdays` - day indices (0=Sun...6=Sat)
- `lang` - en/ar/tr/fr/ur/id
- `traveler` - enable Qasr mode
- `jumuah` - enable Friday prayer
- `ramadanMode` - enable Ramadan events
- `qibla` - include Qibla direction
- `dua` - include Du'a/Adhkar
- `iqama` - comma-separated Iqama offsets
- `busy` - mark as busy status
- `color` - calendar color (URL-encoded)

### GET /api/prayer-times.json
JSON response with today's timings, next prayer, and Hijri date.

### GET /api/prayer-times.pdf
PDF export of prayer timetable.

## Environment Variables

```bash
ADMIN_KEY=xxx         # Admin dashboard access key
REDIS_URL=redis://... # Redis connection string
```

## Testing

```bash
# Unit tests
bun test

# E2E tests
npx playwright test
```

E2E tests cover widget functionality and are located in `src/__tests__/`.

## Recent Changes (Latest First)

1. **Busy Status & Weekdays Filter** - Block calendar availability, filter by days
2. **L1 Cache Key Fix** - Include all API parameters in cache key
3. **E2E Tests** - Playwright config and widget tests
4. **App Icons & OG Image** - New branding assets
5. **Coordinates Tab Auto-Switch** - When lat/lng params provided
6. **SEO Improvements** - robots.txt, city-specific keywords
7. **Redis Cache for City Pages** - Faster city page loading
8. **Dark-First Gold-Accent Theme** - Complete UI redesign
9. **Redis Analytics** - Replaced Axiom with custom Redis analytics
10. **Admin Dashboard** - Analytics and cache monitoring UI
