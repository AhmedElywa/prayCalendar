// Country to recommended calculation method mapping
// Based on commonly used methods in each region

export const countryToMethod: Record<string, { method: string; name: string }> = {
  // North America
  US: { method: '2', name: 'Islamic Society of North America (ISNA)' },
  CA: { method: '2', name: 'Islamic Society of North America (ISNA)' },

  // Europe
  GB: { method: '3', name: 'Muslim World League' },
  FR: { method: '12', name: 'Union Organization Islamic de France' },
  DE: { method: '3', name: 'Muslim World League' },
  NL: { method: '3', name: 'Muslim World League' },
  BE: { method: '3', name: 'Muslim World League' },
  IT: { method: '3', name: 'Muslim World League' },
  ES: { method: '3', name: 'Muslim World League' },
  SE: { method: '3', name: 'Muslim World League' },
  NO: { method: '3', name: 'Muslim World League' },
  DK: { method: '3', name: 'Muslim World League' },
  AT: { method: '3', name: 'Muslim World League' },
  CH: { method: '3', name: 'Muslim World League' },

  // Turkey
  TR: { method: '13', name: 'Diyanet İşleri Başkanlığı' },

  // Russia
  RU: { method: '14', name: 'Spiritual Administration of Muslims of Russia' },

  // Middle East
  SA: { method: '4', name: 'Umm Al-Qura University, Makkah' },
  AE: { method: '8', name: 'Gulf Region' },
  QA: { method: '10', name: 'Qatar' },
  KW: { method: '9', name: 'Kuwait' },
  BH: { method: '8', name: 'Gulf Region' },
  OM: { method: '8', name: 'Gulf Region' },
  JO: { method: '3', name: 'Muslim World League' },
  LB: { method: '3', name: 'Muslim World League' },
  SY: { method: '3', name: 'Muslim World League' },
  IQ: { method: '3', name: 'Muslim World League' },
  YE: { method: '4', name: 'Umm Al-Qura University, Makkah' },

  // North Africa
  EG: { method: '5', name: 'Egyptian General Authority of Survey' },
  LY: { method: '5', name: 'Egyptian General Authority of Survey' },
  TN: { method: '3', name: 'Muslim World League' },
  DZ: { method: '3', name: 'Muslim World League' },
  MA: { method: '3', name: 'Muslim World League' },

  // South Asia
  PK: { method: '1', name: 'University of Islamic Sciences, Karachi' },
  IN: { method: '1', name: 'University of Islamic Sciences, Karachi' },
  BD: { method: '1', name: 'University of Islamic Sciences, Karachi' },
  AF: { method: '1', name: 'University of Islamic Sciences, Karachi' },
  NP: { method: '1', name: 'University of Islamic Sciences, Karachi' },

  // Iran
  IR: { method: '7', name: 'Institute of Geophysics, University of Tehran' },

  // Southeast Asia
  MY: { method: '3', name: 'Muslim World League' },
  SG: { method: '11', name: 'Majlis Ugama Islam Singapura' },
  ID: { method: '11', name: 'Majlis Ugama Islam Singapura' },
  BN: { method: '11', name: 'Majlis Ugama Islam Singapura' },

  // Default for other countries
  DEFAULT: { method: '3', name: 'Muslim World League' },
};

// Get recommendation based on country code
export function getMethodRecommendation(countryCode: string | null): { method: string; name: string } | null {
  if (!countryCode) return null;
  return countryToMethod[countryCode.toUpperCase()] || countryToMethod.DEFAULT;
}
