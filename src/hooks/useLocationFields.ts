import React from 'react';

type InputMode = 'address' | 'coords';

/** location mode & fields + geolocation helper */
export function useLocationFields() {
  const [inputMode, setInputMode] = React.useState<InputMode>('address');
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState<number | ''>('');
  const [longitude, setLongitude] = React.useState<number | ''>('');
  const [locating, setLocating] = React.useState(false);

  // reset opposite fields when mode toggles
  React.useEffect(() => {
    if (inputMode === 'address') {
      setLatitude('');
      setLongitude('');
    } else {
      setAddress('');
    }
  }, [inputMode]);

  const handleUseLocation = React.useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        if (inputMode === 'coords') {
          setLatitude(lat);
          setLongitude(lon);
        } else {
          try {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
              headers: { 'User-Agent': 'pray-calendar-app' },
            });
            const j = await r.json();
            const a = j.address || {};
            // Prefer city → town → village; then state & country
            const city = a.city || a.town || a.village || '';
            const state = a.state || a.county || '';
            const country = a.country || '';
            const formatted = [city, state, country].filter(Boolean).join(', ');
            setAddress(formatted || `${lat},${lon}`);
          } catch {
            setAddress(`${lat},${lon}`);
          }
        }
        setLocating(false);
      },
      () => setLocating(false),
    );
  }, [inputMode]);

  return {
    inputMode,
    setInputMode,
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    locating,
    handleUseLocation,
  };
}

export type { InputMode };
