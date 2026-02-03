/**
 * Encode settings into a base64url string for sharing as a preset.
 */
export interface PresetData {
  address?: string;
  latitude?: number;
  longitude?: number;
  method?: string;
  duration?: number;
  months?: number;
  alarms?: number[];
  events?: number[];
  weekDays?: number[];
  travelMode?: boolean;
  jumuahMode?: boolean;
  jumuahDuration?: number;
  ramadanMode?: boolean;
  iftarDuration?: number;
  traweehDuration?: number;
  suhoorDuration?: number;
  qiblaMode?: boolean;
  duaMode?: boolean;
  busyMode?: boolean;
  iqamaOffsets?: number[];
  calendarColor?: string;
  prayerLanguage?: string;
}

export function encodePreset(data: PresetData): string {
  const json = JSON.stringify(data);
  if (typeof window !== 'undefined') {
    return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(json).toString('base64url');
}

export function decodePreset(encoded: string): PresetData | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    let json: string;
    if (typeof window !== 'undefined') {
      json = atob(base64);
    } else {
      json = Buffer.from(base64, 'base64').toString('utf-8');
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}
