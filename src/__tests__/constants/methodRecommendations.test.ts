import { describe, expect, it } from 'bun:test';
import { countryToMethod, getMethodRecommendation } from '../../constants/methodRecommendations';

describe('methodRecommendations', () => {
  describe('countryToMethod', () => {
    it('should have US mapped to ISNA method 2', () => {
      expect(countryToMethod.US).toEqual({ method: '2', name: 'Islamic Society of North America (ISNA)' });
    });

    it('should have Saudi Arabia mapped to Umm Al-Qura method 4', () => {
      expect(countryToMethod.SA).toEqual({ method: '4', name: 'Umm Al-Qura University, Makkah' });
    });

    it('should have Egypt mapped to Egyptian method 5', () => {
      expect(countryToMethod.EG).toEqual({ method: '5', name: 'Egyptian General Authority of Survey' });
    });

    it('should have Pakistan mapped to Karachi method 1', () => {
      expect(countryToMethod.PK).toEqual({ method: '1', name: 'University of Islamic Sciences, Karachi' });
    });

    it('should have Turkey mapped to Diyanet method 13', () => {
      expect(countryToMethod.TR).toEqual({ method: '13', name: 'Diyanet İşleri Başkanlığı' });
    });

    it('should have DEFAULT mapped to MWL method 3', () => {
      expect(countryToMethod.DEFAULT).toEqual({ method: '3', name: 'Muslim World League' });
    });
  });

  describe('getMethodRecommendation', () => {
    it('should return null for null country code', () => {
      expect(getMethodRecommendation(null)).toBeNull();
    });

    it('should return null for empty string', () => {
      // Empty string is falsy
      expect(getMethodRecommendation('')).toBeNull();
    });

    it('should return correct method for US', () => {
      const result = getMethodRecommendation('US');
      expect(result).toEqual({ method: '2', name: 'Islamic Society of North America (ISNA)' });
    });

    it('should be case-insensitive', () => {
      expect(getMethodRecommendation('us')).toEqual(getMethodRecommendation('US'));
      expect(getMethodRecommendation('Eg')).toEqual(getMethodRecommendation('EG'));
    });

    it('should return DEFAULT for unknown country codes', () => {
      const result = getMethodRecommendation('XX');
      expect(result).toEqual(countryToMethod.DEFAULT);
    });

    it('should return DEFAULT for country not in mapping', () => {
      const result = getMethodRecommendation('ZW'); // Zimbabwe
      expect(result).toEqual({ method: '3', name: 'Muslim World League' });
    });
  });
});
