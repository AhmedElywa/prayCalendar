import { beforeEach, describe, expect, mock, test } from 'bun:test';
import type { NextRequest } from 'next/server';

// --- Mocks ---

const mockCreateEvent = mock(() => ({ createAlarm: mock(() => {}) }));
const mockMomentAdd = mock(function (this: any) {
  return this;
});

const mockDate = new Date('2025-01-01T12:00:00.571Z');
function createMockMoment(): any {
  return {
    add: mockMomentAdd,
    subtract: mock(() => createMockMoment()),
    toDate: mock(() => mockDate),
    format: mock(() => '01-01-2023'),
    isBefore: mock(() => false),
    startOf: mock(() => createMockMoment()),
    utc: mock(() => createMockMoment()),
    tz: mock(() => createMockMoment()),
    diff: mock(() => 12),
  };
}

const mockMoment: any = mock(() => createMockMoment());
Object.assign(mockMoment, {
  add: mockMomentAdd,
  utc: mock(() => createMockMoment()),
  tz: mock(() => createMockMoment()),
});

mock.module('moment/moment', () => ({ default: mockMoment }));
mock.module('moment-timezone', () => ({ default: mockMoment }));

const mockIcal = mock(() => ({
  createEvent: mockCreateEvent,
  toString: mock(() => 'calendar-content'),
  x: mock(() => {}),
}));

mock.module('ical-generator', () => ({
  default: mockIcal,
  ICalAlarmType: { audio: 'audio' },
  ICalCalendarMethod: { PUBLISH: 'PUBLISH' },
}));

const mockGetPrayerTimes = mock(() => Promise.resolve(undefined as any));
mock.module('prayerTimes', () => ({ getPrayerTimes: mockGetPrayerTimes }));

mock.module('lib/cache', () => ({
  getCachedICS: mock(() => Promise.resolve(null)),
  setCachedICS: mock(() => Promise.resolve(undefined)),
  getCoordinates: mock(() => Promise.resolve(null)),
  normalizeLocation: mock((params: any) => {
    if (params.address) return String(params.address).toLowerCase().trim().replace(/\s+/g, '-');
    return `${Number(params.latitude).toFixed(2)},${Number(params.longitude).toFixed(2)}`;
  }),
  normalizeIcsParams: mock((allParams: any, coords?: string) => {
    const normalized = { ...allParams };
    if (coords && normalized.address) {
      const [lat, lng] = coords.split(',');
      delete normalized.address;
      normalized.latitude = lat;
      normalized.longitude = lng;
    }
    return normalized;
  }),
}));

mock.module('lib/analytics', () => ({
  trackRequest: () => {},
}));

mock.module('../../../constants/translations', () => ({
  translations: {
    en: { calendarName: 'Prayer Times' },
    ar: { calendarName: 'أوقات الصلاة' },
  },
}));

// Import after mocks
const { GET } = await import('../../../../app/api/prayer-times.ics/route');

// --- Helpers ---

function createMockRequest(searchParams: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/prayer-times.ics');
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }
  return { nextUrl: url, method: 'GET', headers: new Headers() } as unknown as NextRequest;
}

const mockPrayerData = [
  {
    timings: {
      Fajr: '04:30',
      Sunrise: '06:00',
      Dhuhr: '12:00',
      Asr: '15:30',
      Maghrib: '18:00',
      Isha: '19:30',
      Midnight: '00:00',
    },
    date: { gregorian: { date: '01-01-2023' } },
    meta: { timezone: 'Africa/Cairo' },
  },
];

const mockRamadanData = [
  {
    timings: {
      Fajr: '04:30',
      Sunrise: '06:00',
      Dhuhr: '12:00',
      Asr: '15:30',
      Maghrib: '18:00',
      Isha: '19:30',
      Midnight: '00:00',
    },
    date: {
      gregorian: { date: '01-04-2024' },
      hijri: { month: { number: 9 } },
    },
    meta: { timezone: 'Africa/Cairo' },
  },
];

// --- Tests ---

describe('Prayer Times API', () => {
  beforeEach(() => {
    mockCreateEvent.mockClear();
    mockGetPrayerTimes.mockReset();
    mockGetPrayerTimes.mockResolvedValue({ data: mockPrayerData, resolvedCoords: null, apiCalls: 0, apiErrors: 0 });
  });

  test('returns 400 if prayer times cannot be fetched', async () => {
    mockGetPrayerTimes.mockResolvedValue(undefined);
    const response = await GET(createMockRequest({ address: 'Invalid Address', method: '5' }));
    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data).toEqual({ message: 'Invalid address or coordinates' });
  });

  test('returns ical data for valid address request', async () => {
    const response = await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', alarm: '5', duration: '25' }));
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/calendar; charset=utf-8');
    expect(await response.text()).toBe('calendar-content');
  });

  test('handles coordinate queries', async () => {
    const response = await GET(createMockRequest({ latitude: '30.0444', longitude: '31.2357', method: '5' }));
    expect(response.status).toBe(200);
    expect(mockGetPrayerTimes).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: '30.0444', longitude: '31.2357', method: '5' }),
      3,
    );
  });

  test('respects months parameter', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', months: '6' }));
    expect(mockGetPrayerTimes).toHaveBeenCalledWith(expect.any(Object), 6);
  });

  test('caps months parameter at 11', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', months: '20' }));
    expect(mockGetPrayerTimes).toHaveBeenCalledWith(expect.any(Object), 11);
  });

  test('floors months parameter to 1', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', months: '0' }));
    expect(mockGetPrayerTimes).toHaveBeenCalledWith(expect.any(Object), 1);
  });

  test('respects duration parameter', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', duration: '0' }));
    expect(mockMomentAdd).toHaveBeenCalledWith(0, 'minute');
  });

  test('filters events based on events query parameter', async () => {
    const response = await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', events: '0,2,4' }));
    expect(response.status).toBe(200);
  });

  test('uses Arabic names when lang=ar', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', lang: 'ar' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'الفجر' }));
  });

  test('uses English names when lang=en', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', lang: 'en' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Fajr' }));
  });

  test('handles alarm parameters correctly', async () => {
    const mockEvent = { createAlarm: mock(() => {}) };
    mockCreateEvent.mockReturnValue(mockEvent);

    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5', alarm: '5,0,-5' }));

    expect(mockEvent.createAlarm).toHaveBeenCalledWith({ type: 'audio', triggerBefore: 300 });
    expect(mockEvent.createAlarm).toHaveBeenCalledWith({ type: 'audio', trigger: 0 });
    expect(mockEvent.createAlarm).toHaveBeenCalledWith({ type: 'audio', triggerAfter: 300 });
  });

  test('creates Ramadan events (Iftar, Tarawih, Suhoor)', async () => {
    mockGetPrayerTimes.mockResolvedValue({ data: mockRamadanData, resolvedCoords: null, apiCalls: 0, apiErrors: 0 });

    await GET(
      createMockRequest({
        address: 'Cairo, Egypt',
        method: '5',
        ramadanMode: 'true',
        iftarDuration: '45',
        traweehDuration: '90',
        suhoorDuration: '30',
        lang: 'en',
      }),
    );

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Maghrib' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Isha' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Iftar' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Tarawih' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Suhoor' }));
  });

  test('does not create Tarawih when duration is 0', async () => {
    mockGetPrayerTimes.mockResolvedValue({ data: mockRamadanData, resolvedCoords: null, apiCalls: 0, apiErrors: 0 });

    await GET(
      createMockRequest({
        address: 'Cairo, Egypt',
        method: '5',
        ramadanMode: 'true',
        iftarDuration: '30',
        traweehDuration: '0',
        lang: 'en',
      }),
    );

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Iftar' }));
    expect(mockCreateEvent).not.toHaveBeenCalledWith(expect.objectContaining({ summary: 'Tarawih' }));
  });

  test('does not create Suhoor when duration is 0', async () => {
    mockGetPrayerTimes.mockResolvedValue({ data: mockRamadanData, resolvedCoords: null, apiCalls: 0, apiErrors: 0 });

    await GET(
      createMockRequest({
        latitude: '30.79',
        longitude: '30.96',
        method: '5',
        ramadanMode: 'true',
        iftarDuration: '30',
        traweehDuration: '90',
        suhoorDuration: '0',
        lang: 'en',
      }),
    );

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Iftar' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Tarawih' }));
    expect(mockCreateEvent).not.toHaveBeenCalledWith(expect.objectContaining({ summary: 'Suhoor' }));
  });

  test('creates Arabic Ramadan event names when lang=ar', async () => {
    const ramadanSubset = [
      {
        timings: { Maghrib: '18:00', Isha: '19:30' },
        date: { gregorian: { date: '01-04-2024' }, hijri: { month: { number: 9 } } },
        meta: { timezone: 'Africa/Cairo' },
      },
    ];
    mockGetPrayerTimes.mockResolvedValue({ data: ramadanSubset, resolvedCoords: null, apiCalls: 0, apiErrors: 0 });

    await GET(
      createMockRequest({
        address: 'Cairo, Egypt',
        method: '5',
        ramadanMode: 'true',
        iftarDuration: '45',
        traweehDuration: '90',
        lang: 'ar',
      }),
    );

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'الإفطار' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'التراويح' }));
  });

  test('defaults to 3 months when months not provided', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5' }));
    expect(mockGetPrayerTimes).toHaveBeenCalledWith(expect.any(Object), 3);
  });

  test('defaults to English when lang not provided', async () => {
    await GET(createMockRequest({ address: 'Cairo, Egypt', method: '5' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Fajr' }));
  });
});
