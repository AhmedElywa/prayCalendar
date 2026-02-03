import { describe, expect, test } from 'bun:test';

describe('Widget URL generation', () => {
  const baseUrl = 'http://localhost:3300';

  test('generates URL with coordinates', () => {
    const params = new URLSearchParams();
    params.set('lat', '30.0444');
    params.set('lng', '31.2357');
    params.set('method', '5');

    const url = `${baseUrl}/widget?${params.toString()}`;

    expect(url).toContain('lat=30.0444');
    expect(url).toContain('lng=31.2357');
    expect(url).toContain('method=5');
  });

  test('generates URL with address', () => {
    const params = new URLSearchParams();
    params.set('address', 'Cairo, Egypt');
    params.set('method', '5');

    const url = `${baseUrl}/widget?${params.toString()}`;

    expect(url).toContain('address=Cairo');
    expect(url).toContain('method=5');
  });

  test('includes optional parameters', () => {
    const params = new URLSearchParams();
    params.set('lat', '30.0444');
    params.set('lng', '31.2357');
    params.set('method', '5');
    params.set('lang', 'ar');
    params.set('theme', 'light');
    params.set('compact', 'true');

    const url = `${baseUrl}/widget?${params.toString()}`;

    expect(url).toContain('lang=ar');
    expect(url).toContain('theme=light');
    expect(url).toContain('compact=true');
  });
});

describe('Widget embed code generation', () => {
  test('generates valid iframe code', () => {
    const widgetUrl = 'http://localhost:3300/widget?lat=30&lng=31&method=5';
    const width = 300;
    const height = 400;

    const iframeCode = `<iframe src="${widgetUrl}" width="${width}" height="${height}" frameborder="0" style="border-radius: 8px;"></iframe>`;

    expect(iframeCode).toContain('src="http://localhost:3300/widget');
    expect(iframeCode).toContain('width="300"');
    expect(iframeCode).toContain('height="400"');
    expect(iframeCode).toContain('frameborder="0"');
  });

  test('generates compact iframe with reduced height', () => {
    const widgetUrl = 'http://localhost:3300/widget?lat=30&lng=31&compact=true';
    const width = 300;
    const height = 60; // Compact height

    const iframeCode = `<iframe src="${widgetUrl}" width="${width}" height="${height}" frameborder="0"></iframe>`;

    expect(iframeCode).toContain('height="60"');
    expect(iframeCode).toContain('compact=true');
  });

  test('generates JavaScript embed code', () => {
    const baseUrl = 'http://localhost:3300';
    const lat = '30.0444';
    const lng = '31.2357';
    const method = '5';
    const lang = 'en';
    const theme = 'dark';

    const jsCode = `<div id="pray-calendar-widget" data-lat="${lat}" data-lng="${lng}" data-method="${method}" data-lang="${lang}" data-theme="${theme}"></div>
<script src="${baseUrl}/widget-loader.js" async></script>`;

    expect(jsCode).toContain('id="pray-calendar-widget"');
    expect(jsCode).toContain('data-lat="30.0444"');
    expect(jsCode).toContain('data-lng="31.2357"');
    expect(jsCode).toContain('widget-loader.js');
  });
});

describe('Widget prayer time display', () => {
  const mockTimes = {
    Fajr: '05:23',
    Sunrise: '06:50',
    Dhuhr: '12:12',
    Asr: '15:17',
    Maghrib: '17:34',
    Isha: '18:53',
  };

  test('prayer times are in correct format (HH:MM)', () => {
    const timeRegex = /^\d{2}:\d{2}$/;

    for (const [_prayer, time] of Object.entries(mockTimes)) {
      expect(time).toMatch(timeRegex);
    }
  });

  test('prayer order is correct', () => {
    const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    prayerOrder.forEach((expectedPrayer, index) => {
      expect(Object.keys(mockTimes)[index]).toBe(expectedPrayer);
    });
  });

  test('calculates next prayer correctly', () => {
    const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // Mock current time as 10:00 AM
    const mockNow = new Date();
    mockNow.setHours(10, 0, 0, 0);

    let nextPrayer: string | null = null;

    for (const prayer of prayerOrder) {
      const [h, m] = mockTimes[prayer as keyof typeof mockTimes].split(':').map(Number);
      const prayerTime = new Date(mockNow);
      prayerTime.setHours(h, m, 0, 0);

      if (prayerTime > mockNow) {
        nextPrayer = prayer;
        break;
      }
    }

    // At 10:00 AM, next prayer should be Dhuhr (12:12)
    expect(nextPrayer).toBe('Dhuhr');
  });
});

describe('Widget loader script', () => {
  test('loader builds correct URL from data attributes', () => {
    // Simulate what the loader does
    const lat = '30.0444';
    const lng = '31.2357';
    const method = '5';
    const lang = 'en';
    const theme = 'dark';

    const baseUrl = 'https://pray.ahmedelywa.com';
    const params = [];

    if (lat && lng) {
      params.push(`lat=${encodeURIComponent(lat)}`);
      params.push(`lng=${encodeURIComponent(lng)}`);
    }
    params.push(`method=${encodeURIComponent(method)}`);
    params.push(`lang=${encodeURIComponent(lang)}`);
    params.push(`theme=${encodeURIComponent(theme)}`);

    const widgetUrl = `${baseUrl}/widget?${params.join('&')}`;

    expect(widgetUrl).toBe('https://pray.ahmedelywa.com/widget?lat=30.0444&lng=31.2357&method=5&lang=en&theme=dark');
  });

  test('loader handles address parameter', () => {
    const address = 'Cairo, Egypt';
    const method = '5';

    const baseUrl = 'https://pray.ahmedelywa.com';
    const params = [];

    params.push(`address=${encodeURIComponent(address)}`);
    params.push(`method=${encodeURIComponent(method)}`);

    const widgetUrl = `${baseUrl}/widget?${params.join('&')}`;

    expect(widgetUrl).toContain('address=Cairo%2C%20Egypt');
  });

  test('loader includes compact flag when true', () => {
    const compact = true;
    const params: string[] = [];

    if (compact) params.push('compact=true');

    expect(params).toContain('compact=true');
  });
});
