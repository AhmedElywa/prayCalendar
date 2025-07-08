import { NextRequest } from 'next/server';
import { GET } from '../../../../app/api/prayer-times.ics/route';
import { getPrayerTimes } from 'prayerTimes';

// Get the mock functions
const { mockCreateEvent } = jest.requireMock('ical-generator');
const { mockMomentAdd } = jest.requireMock('moment/moment');

// Mock the modules
jest.mock('prayerTimes', () => ({
  getPrayerTimes: jest.fn(),
}));

jest.mock('ical-generator', () => {
  const mockCreateEvent = jest.fn().mockReturnValue({
    createAlarm: jest.fn(),
  });

  const mockIcal = jest.fn().mockReturnValue({
    createEvent: mockCreateEvent,
    toString: jest.fn().mockReturnValue('calendar-content'),
  });

  return {
    __esModule: true,
    default: mockIcal,
    ICalAlarmType: {
      audio: 'audio',
    },
    mockCreateEvent,
  };
});

jest.mock('moment/moment', () => {
  const mockMomentAdd = jest.fn().mockReturnThis();

  // Create a proper mock moment object with chained methods
  const createMockMoment = (): any => {
    const mockDate = new Date('2025-01-01T12:00:00.571Z');
    return {
      add: mockMomentAdd,
      subtract: jest.fn(() => createMockMoment()),
      toDate: jest.fn(() => mockDate),
      format: jest.fn(() => '01-01-2023'),
      isBefore: jest.fn(() => false),
      startOf: jest.fn(() => createMockMoment()),
      utc: jest.fn(() => createMockMoment()),
      diff: jest.fn(() => 12),
    };
  };

  const mockMoment = jest.fn(() => createMockMoment());

  // Add static methods to the mock
  Object.assign(mockMoment, {
    add: mockMomentAdd,
  });

  return {
    __esModule: true,
    default: mockMoment,
    mockMomentAdd,
  };
});

// Helper function to create a mock NextRequest
function createMockRequest(searchParams: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/prayer-times.ics');
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return {
    nextUrl: url,
    method: 'GET',
  } as NextRequest;
}

describe('Prayer Times API', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock return value for getPrayerTimes
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
        date: {
          gregorian: {
            date: '01-01-2023',
          },
        },
        meta: {
          timezone: 'Africa/Cairo',
        },
      },
    ];

    (getPrayerTimes as jest.Mock).mockResolvedValue(mockPrayerData);
  });

  it('returns 400 if prayer times cannot be fetched', async () => {
    (getPrayerTimes as jest.Mock).mockResolvedValue(undefined);

    const request = createMockRequest({
      address: 'Invalid Address',
      method: '5',
    });

    const response = await GET(request);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData).toEqual({ message: 'Invalid address or coordinates' });
  });

  it('returns ical data for valid address request', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      alarm: '5',
      duration: '25',
    });

    const response = await GET(request);
    const responseText = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/calendar; charset=utf-8');
    expect(responseText).toBe('calendar-content');
  });

  it('handles coordinate queries', async () => {
    const request = createMockRequest({
      latitude: '30.0444',
      longitude: '31.2357',
      method: '5',
    });

    const response = await GET(request);

    expect(getPrayerTimes).toHaveBeenCalledWith(
      expect.objectContaining({
        latitude: '30.0444',
        longitude: '31.2357',
        method: '5',
      }),
      3,
      expect.objectContaining({
        latitude: '30.0444',
        longitude: '31.2357',
        method: '5',
        lang: 'en',
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/calendar; charset=utf-8');
  });

  it('respects months parameter', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      months: '6',
    });

    await GET(request);

    expect(getPrayerTimes).toHaveBeenCalledWith(
      expect.any(Object),
      6,
      expect.objectContaining({
        address: 'Cairo, Egypt',
        method: '5',
        months: '6',
        lang: 'en',
      }),
    );
  });

  it('caps months parameter at 11', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      months: '20',
    });

    await GET(request);

    expect(getPrayerTimes).toHaveBeenCalledWith(
      expect.any(Object),
      11,
      expect.objectContaining({
        address: 'Cairo, Egypt',
        method: '5',
        months: '11',
        lang: 'en',
      }),
    );
  });

  it('floors months parameter to 1', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      months: '0',
    });

    await GET(request);

    expect(getPrayerTimes).toHaveBeenCalledWith(
      expect.any(Object),
      1,
      expect.objectContaining({
        address: 'Cairo, Egypt',
        method: '5',
        months: '1',
        lang: 'en',
      }),
    );
  });

  it('respects duration parameter', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      duration: '0',
    });

    await GET(request);

    expect(mockMomentAdd).toHaveBeenCalledWith(0, 'minute');
  });

  it('filters events based on events query parameter', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      events: '0,2,4', // Only include Fajr, Dhuhr, and Maghrib
    });

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/calendar; charset=utf-8');
  });

  it('uses Arabic names when lang parameter is ar', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      lang: 'ar',
    });

    await GET(request);

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'الفجر' }));
  });

  it('uses English names when lang parameter is en or not specified', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      lang: 'en',
    });

    await GET(request);

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Fajr' }));
  });

  it('handles alarm parameters correctly', async () => {
    const mockEvent = {
      createAlarm: jest.fn(),
    };
    mockCreateEvent.mockReturnValue(mockEvent);

    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      alarm: '5,0,-5', // Before, at time, and after
    });

    await GET(request);

    expect(mockEvent.createAlarm).toHaveBeenCalledWith({
      type: 'audio',
      triggerBefore: 300, // 5 minutes * 60 seconds
    });
    expect(mockEvent.createAlarm).toHaveBeenCalledWith({
      type: 'audio',
      trigger: 0,
    });
    expect(mockEvent.createAlarm).toHaveBeenCalledWith({
      type: 'audio',
      triggerAfter: 300, // 5 minutes * 60 seconds
    });
  });

  it('handles Ramadan mode parameters correctly', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      ramadanMode: 'true',
      iftarDuration: '45',
      traweehDuration: '90',
    });

    await GET(request);

    expect(getPrayerTimes).toHaveBeenCalledWith(
      expect.objectContaining({
        address: 'Cairo, Egypt',
        method: '5',
      }),
      3,
      expect.objectContaining({
        address: 'Cairo, Egypt',
        method: '5',
        ramadanMode: 'true',
        iftarDuration: '45',
        traweehDuration: '90',
        lang: 'en',
      }),
    );
    expect(mockCreateEvent).toHaveBeenCalled();
  });

  it('creates separate Iftar and Tarawih events during Ramadan', async () => {
    // Mock the prayer data to include Hijri month 9 (Ramadan)
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
          gregorian: {
            date: '01-04-2024', // Date in Ramadan
          },
          hijri: {
            month: {
              number: 9, // Ramadan month
            },
          },
        },
        meta: {
          timezone: 'Africa/Cairo',
        },
      },
    ];

    (getPrayerTimes as jest.Mock).mockResolvedValue(mockRamadanData);

    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      ramadanMode: 'true',
      iftarDuration: '45',
      traweehDuration: '90',
      lang: 'en',
    });

    await GET(request);

    // Should create regular prayer events plus separate Iftar and Tarawih events
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Maghrib' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Isha' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Iftar' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Tarawih' }));
  });

  it('does not create Tarawih event when duration is 0', async () => {
    // Mock the prayer data to include Hijri month 9 (Ramadan)
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
          gregorian: {
            date: '01-04-2024', // Date in Ramadan
          },
          hijri: {
            month: {
              number: 9, // Ramadan month
            },
          },
        },
        meta: {
          timezone: 'Africa/Cairo',
        },
      },
    ];

    (getPrayerTimes as jest.Mock).mockResolvedValue(mockRamadanData);

    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      ramadanMode: 'true',
      iftarDuration: '30',
      traweehDuration: '0', // No Tarawih
      lang: 'en',
    });

    await GET(request);

    // Should create Iftar but not Tarawih when duration is 0
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Iftar' }));
    expect(mockCreateEvent).not.toHaveBeenCalledWith(expect.objectContaining({ summary: 'Tarawih' }));
  });

  it('creates separate Iftar and Tarawih events with Arabic names', async () => {
    // Mock the prayer data to include Hijri month 9 (Ramadan)
    const mockRamadanData = [
      {
        timings: {
          Maghrib: '18:00',
          Isha: '19:30',
        },
        date: {
          gregorian: {
            date: '01-04-2024', // Date in Ramadan
          },
          hijri: {
            month: {
              number: 9, // Ramadan month
            },
          },
        },
        meta: {
          timezone: 'Africa/Cairo',
        },
      },
    ];

    (getPrayerTimes as jest.Mock).mockResolvedValue(mockRamadanData);

    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
      ramadanMode: 'true',
      iftarDuration: '45',
      traweehDuration: '90',
      lang: 'ar',
    });

    await GET(request);

    // Should create Arabic-named Iftar and Tarawih events
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'الإفطار' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'التراويح' }));
  });

  it('defaults to 3 months when months parameter is not provided', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
    });

    await GET(request);

    expect(getPrayerTimes).toHaveBeenCalledWith(
      expect.any(Object),
      3,
      expect.objectContaining({
        address: 'Cairo, Egypt',
        method: '5',
        lang: 'en',
      }),
    );
  });

  it('defaults to English when lang parameter is not provided', async () => {
    const request = createMockRequest({
      address: 'Cairo, Egypt',
      method: '5',
    });

    await GET(request);

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Fajr' }));
  });

  it('should create Suhoor events before Fajr during Ramadan', async () => {
    // Mock the prayer data to include Hijri month 9 (Ramadan)
    const mockRamadanData = [
      {
        timings: {
          Fajr: '04:30',
          Maghrib: '18:00',
          Isha: '19:30',
        },
        date: {
          gregorian: {
            date: '01-04-2024',
          },
          hijri: {
            month: {
              number: 9,
            },
          },
        },
        meta: {
          timezone: 'Africa/Cairo',
        },
      },
    ];

    (getPrayerTimes as jest.Mock).mockResolvedValue(mockRamadanData);

    const request = createMockRequest({
      latitude: '30.7945942',
      longitude: '30.9563828',
      method: '5',
      ramadanMode: 'true',
      iftarDuration: '30',
      traweehDuration: '90',
      suhoorDuration: '45',
      lang: 'en',
    });

    const response = await GET(request);

    expect(response.status).toBe(200);

    // Should create Suhoor, Iftar, and Tarawih events
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Suhoor' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Iftar' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Tarawih' }));
  });

  it('should not create Suhoor events when duration is 0', async () => {
    // Mock the prayer data to include Hijri month 9 (Ramadan)
    const mockRamadanData = [
      {
        timings: {
          Fajr: '04:30',
          Maghrib: '18:00',
          Isha: '19:30',
        },
        date: {
          gregorian: {
            date: '01-04-2024',
          },
          hijri: {
            month: {
              number: 9,
            },
          },
        },
        meta: {
          timezone: 'Africa/Cairo',
        },
      },
    ];

    (getPrayerTimes as jest.Mock).mockResolvedValue(mockRamadanData);

    const request = createMockRequest({
      latitude: '30.7945942',
      longitude: '30.9563828',
      method: '5',
      ramadanMode: 'true',
      iftarDuration: '30',
      traweehDuration: '90',
      suhoorDuration: '0',
      lang: 'en',
    });

    const response = await GET(request);

    expect(response.status).toBe(200);

    // Should create Iftar and Tarawih but not Suhoor when duration is 0
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Iftar' }));
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({ summary: 'Tarawih' }));
    expect(mockCreateEvent).not.toHaveBeenCalledWith(expect.objectContaining({ summary: 'Suhoor' }));
  });
});
