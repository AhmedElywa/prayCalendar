<div align="center">

# PrayCalendar

**Sync accurate prayer times to Google, Apple, or Outlook calendars**

[![Live Demo](https://img.shields.io/badge/demo-pray.ahmedelywa.com-gold?style=for-the-badge)](https://pray.ahmedelywa.com)
[![License](https://img.shields.io/badge/license-ISC-blue?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

Subscribe once. Get accurate prayer times synced to your calendar — updated automatically.

[Live Demo](https://pray.ahmedelywa.com) · [Report Bug](https://github.com/AhmedElywa/prayCalendar/issues/new?labels=bug&template=bug_report.md) · [Request Feature](https://github.com/AhmedElywa/prayCalendar/issues/new?labels=enhancement&template=feature_request.md)

</div>

---

## Features

### Calendar Integration
- **One-click subscribe** to Google Calendar, Apple Calendar, or Outlook
- **QR code** for easy mobile subscription
- **PDF export** for printable timetables
- **Shareable presets** for mosques and communities

### Prayer Customization
- **14+ calculation methods** — Egyptian, ISNA, MWL, Umm Al-Qura, Diyanet, and more
- **Customizable alarms** — at prayer time or 5/10/15/20/30 minutes before
- **Select specific prayers** — Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Midnight
- **Weekday filtering** — generate events for specific days only
- **Custom event duration** — 5 to 60 minutes

### Special Modes
- **Ramadan Mode** — automatic Iftar, Tarawih, and Suhoor events
- **Travel Mode (Qasr)** — shortened prayers for travelers
- **Jumu'ah Mode** — Friday prayer replacing Dhuhr
- **Busy Status** — block calendar availability during prayers

### Enrichments
- **Qibla direction** — compass bearing in event descriptions
- **Du'a & Adhkar** — authentic supplications from Hisn al-Muslim
- **Iqama offsets** — separate Iqama events for each prayer
- **Hijri date** — Islamic calendar date display

### Multi-Language Support
English, Arabic (RTL), Turkish, French, Urdu, and Indonesian

### 45+ Pre-configured Cities
Quick access pages for major cities worldwide with optimized calculation methods:
- Makkah, Madinah, Cairo, Istanbul, Dubai, London, New York, and many more

### Developer Features
- **JSON API** — RESTful endpoint for prayer times data
- **Embeddable Widget** — iframe/JS widget with generator tool
- **Home Assistant** — smart home integration guide

---

## Quick Start

### Use Online
Visit **[pray.ahmedelywa.com](https://pray.ahmedelywa.com)** to generate your calendar subscription link.

### Self-Host

#### Prerequisites
- [Bun](https://bun.sh) (recommended) or Node.js 18+
- Redis (optional, for caching)

#### Installation

```bash
# Clone the repository
git clone https://github.com/AhmedElywa/prayCalendar.git
cd prayCalendar

# Install dependencies
bun install

# Start development server
bun dev
```

The app will be available at `http://localhost:3300`

#### Environment Variables

```bash
# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: Admin dashboard access
ADMIN_KEY=your-secret-key
```

---

## API Reference

### ICS Calendar Feed
```
GET /api/prayer-times.ics
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `address` | string | — | City or address (e.g., "Cairo, Egypt") |
| `latitude` | number | — | Latitude (alternative to address) |
| `longitude` | number | — | Longitude (alternative to address) |
| `method` | number | 5 | [Calculation method](https://pray.ahmedelywa.com/api-docs) |
| `duration` | number | 25 | Event duration in minutes |
| `months` | number | 3 | Calendar length (1-11) |
| `alarm` | string | 5 | Alarm offsets, comma-separated |
| `events` | string | all | Prayer indices (0=Fajr...6=Midnight) |
| `lang` | string | en | Language (en/ar/tr/fr/ur/id) |
| `traveler` | boolean | false | Enable Qasr mode |
| `jumuah` | boolean | false | Enable Friday prayer |
| `ramadanMode` | boolean | false | Enable Ramadan events |
| `qibla` | boolean | false | Include Qibla direction |
| `dua` | boolean | false | Include Du'a/Adhkar |
| `busy` | boolean | false | Mark as busy status |

**Example:**
```
https://pray.ahmedelywa.com/api/prayer-times.ics?address=Cairo,Egypt&method=5&alarm=5,10
```

### JSON API
```
GET /api/prayer-times.json
```
Returns today's timings, next prayer countdown, and Hijri date.

### Full Documentation
See [API Docs](https://pray.ahmedelywa.com/api-docs) for complete parameter reference.

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Language:** [TypeScript 5.9](https://typescriptlang.org)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **Runtime:** [Bun](https://bun.sh)
- **Caching:** [Redis](https://redis.io)
- **Calendar:** [ical-generator](https://github.com/sebbo2002/ical-generator)
- **Testing:** [Playwright](https://playwright.dev) (E2E), Bun test (unit)
- **Linting:** [Biome](https://biomejs.dev)

---

## Scripts

```bash
bun dev          # Start development server
bun build        # Production build
bun start        # Start production server
bun test         # Run unit tests
bun test:watch   # Run tests in watch mode
bun lint         # Run linter
bun format       # Format code
bun check:fix    # Fix linting issues
```

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- How to submit bug reports and feature requests
- Development workflow and code style
- Pull request process

---

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Prayer times calculated using the [AlAdhan API](https://aladhan.com/prayer-times-api)
- Du'a and Adhkar sourced from Hisn al-Muslim

---

<div align="center">

**[pray.ahmedelywa.com](https://pray.ahmedelywa.com)**

Made with care by [Ahmed Elywa](https://ahmedelywa.com)

</div>
