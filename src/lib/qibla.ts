import type { Lang } from '../hooks/useLanguage';

/**
 * Calculate Qibla direction from a given latitude/longitude.
 * Returns bearing in degrees (0-360) from North.
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (kaabaLat * Math.PI) / 180;
  const kaabaLngRad = (kaabaLng * Math.PI) / 180;

  const dLng = kaabaLngRad - lngRad;

  const x = Math.sin(dLng);
  const y = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);

  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return ((bearing % 360) + 360) % 360;
}

// Compass directions with language support (fallback to English for unsupported languages)
const compassPoints: Record<string, string[]> = {
  en: ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'],
  ar: [
    'شمال',
    'شمال شمال شرق',
    'شمال شرق',
    'شرق شمال شرق',
    'شرق',
    'شرق جنوب شرق',
    'جنوب شرق',
    'جنوب جنوب شرق',
    'جنوب',
    'جنوب جنوب غرب',
    'جنوب غرب',
    'غرب جنوب غرب',
    'غرب',
    'غرب شمال غرب',
    'شمال غرب',
    'شمال شمال غرب',
  ],
  tr: ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB'],
  ur: [
    'شمال',
    'شمال شمال مشرق',
    'شمال مشرق',
    'مشرق شمال مشرق',
    'مشرق',
    'مشرق جنوب مشرق',
    'جنوب مشرق',
    'جنوب جنوب مشرق',
    'جنوب',
    'جنوب جنوب مغرب',
    'جنوب مغرب',
    'مغرب جنوب مغرب',
    'مغرب',
    'مغرب شمال مغرب',
    'شمال مغرب',
    'شمال شمال مغرب',
  ],
};

const qiblaLabels: Record<string, string> = {
  en: 'Qibla',
  ar: 'اتجاه القبلة',
  tr: 'Kıble',
  fr: 'Qibla',
  ur: 'قبلہ',
  id: 'Kiblat',
};

export function bearingToCompass(bearing: number, lang: Lang): string {
  const index = Math.round(bearing / 22.5) % 16;
  const points = compassPoints[lang] || compassPoints.en;
  return points[index];
}

export function formatQiblaText(lat: number, lng: number, lang: Lang): string {
  const bearing = calculateQiblaBearing(lat, lng);
  const compass = bearingToCompass(bearing, lang);
  const degrees = Math.round(bearing);
  const label = qiblaLabels[lang] || qiblaLabels.en;
  return `🕋 ${label}: ${compass} (${degrees}°)`;
}
