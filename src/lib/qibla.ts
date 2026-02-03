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

const compassPoints = {
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
};

export function bearingToCompass(bearing: number, lang: 'en' | 'ar'): string {
  const index = Math.round(bearing / 22.5) % 16;
  return compassPoints[lang][index];
}

export function formatQiblaText(lat: number, lng: number, lang: 'en' | 'ar'): string {
  const bearing = calculateQiblaBearing(lat, lng);
  const compass = bearingToCompass(bearing, lang);
  const degrees = Math.round(bearing);
  return lang === 'ar' ? `🕋 اتجاه القبلة: ${compass} (${degrees}°)` : `🕋 Qibla: ${compass} (${degrees}°)`;
}
