import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../../pages/api/prayer-times.ics';
import { getPrayerTimes } from 'prayerTimes';

// Mock the modules
jest.mock('prayerTimes', () => ({
  getPrayerTimes: jest.fn(),
}));

jest.mock('ical-generator', () => {
  const createEventMock = jest.fn().mockReturnValue({
    createAlarm: jest.fn(),
  });

  const icalMock = jest.fn().mockReturnValue({
    createEvent: createEventMock,
    toString: jest.fn().mockReturnValue('calendar-content'),
  });

  return {
    __esModule: true,
    default: icalMock,
    ICalAlarmType: {
      audio: 'audio',
    },
    createEventMock,
  };
});

jest.mock('moment/moment', () => {
  const addMock = jest.fn().mockReturnThis();
  const momentMock = jest.fn(() => ({
    toDate: jest.fn().mockReturnValue(new Date()),
    add: addMock,
    isBefore: jest.fn().mockReturnValue(false),
  }));
  (momentMock as any).tz = jest.fn().mockReturnThis();
  return { __esModule: true, default: momentMock, addMock };
});
import { addMock } from 'moment/moment';
import { createEventMock } from 'ical-generator';

describe('Prayer Times API', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'GET',
      query: {
        address: 'Cairo, Egypt',
        method: '5',
        alarm: '5',
        duration: '25',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };

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

  it('returns 405 for non-GET requests', async () => {
    req.method = 'POST';
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith({ message: 'Only GET requests allowed' });
  });

  it('returns 400 if prayer times cannot be fetched', async () => {
    (getPrayerTimes as jest.Mock).mockResolvedValue(undefined);
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid address or coordinates' });
  });

  it('returns ical data for valid request', async () => {
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/calendar');
    expect(res.send).toHaveBeenCalledWith('calendar-content');
  });

  it('respects zero duration in query', async () => {
    if (req.query) {
      req.query.duration = '0';
    }
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(addMock).toHaveBeenCalledWith(0, 'minute');
  });

  it('filters events based on events query parameter', async () => {
    // Ensure req.query is defined before updating it
    if (req.query) {
      req.query.events = '0,2,4'; // Only include Fajr, Dhuhr, and Maghrib
    }
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/calendar');
    expect(res.send).toHaveBeenCalledWith('calendar-content');

    // We can't easily test the filtering logic without inspecting the internal implementation
    // but we can confirm it processes the request successfully
  });

  it('uses arabic names when lang parameter is ar', async () => {
    if (req.query) {
      req.query.lang = 'ar';
    }
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(createEventMock).toHaveBeenCalledWith(expect.objectContaining({ summary: 'الفجر' }));
  });
  it('handles coordinate queries', async () => {
    req.query = { latitude: '30', longitude: '31', method: '5' };
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(getPrayerTimes).toHaveBeenCalledWith(expect.objectContaining({ latitude: '30', longitude: '31' }), 3);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/calendar');
  });

  it('respects months param', async () => {
    req.query!.months = '6';
    await handler(req as NextApiRequest, res as NextApiResponse);
    expect(getPrayerTimes).toHaveBeenCalledWith(expect.any(Object), 6);
  });
});
