import { describe, expect, it } from 'bun:test';
import { type CalendarApp, getCalendarAppInfo } from '../../hooks/useCalendarDetection';

describe('useCalendarDetection', () => {
  describe('getCalendarAppInfo', () => {
    it('should return Apple Calendar info in English', () => {
      const result = getCalendarAppInfo('apple', 'en');
      expect(result.name).toBe('Apple Calendar');
      expect(result.icon).toBe('🍎');
    });

    it('should return Apple Calendar info in Arabic', () => {
      const result = getCalendarAppInfo('apple', 'ar');
      expect(result.name).toBe('تقويم Apple');
      expect(result.icon).toBe('🍎');
    });

    it('should return Google Calendar info', () => {
      const result = getCalendarAppInfo('google', 'en');
      expect(result.name).toBe('Google Calendar');
      expect(result.icon).toBe('📅');
    });

    it('should return Outlook info', () => {
      const result = getCalendarAppInfo('outlook', 'en');
      expect(result.name).toBe('Outlook');
      expect(result.icon).toBe('📧');
    });

    it('should return generic Calendar info', () => {
      const result = getCalendarAppInfo('generic', 'en');
      expect(result.name).toBe('Calendar');
      expect(result.icon).toBe('📆');
    });

    it('should return generic Calendar info in Arabic', () => {
      const result = getCalendarAppInfo('generic', 'ar');
      expect(result.name).toBe('التقويم');
    });

    it('should default to English when no language specified', () => {
      const result = getCalendarAppInfo('google');
      expect(result.name).toBe('Google Calendar');
    });

    it('should return correct info for all calendar types', () => {
      const types: CalendarApp[] = ['apple', 'google', 'outlook', 'generic'];
      for (const type of types) {
        const result = getCalendarAppInfo(type, 'en');
        expect(result.name).toBeDefined();
        expect(result.icon).toBeDefined();
      }
    });
  });
});
