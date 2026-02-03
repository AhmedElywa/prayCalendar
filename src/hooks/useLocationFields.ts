import React from 'react';

type InputMode = 'address' | 'coords';

/** location mode & fields + geolocation helper */
export function useLocationFields() {
  const [inputMode, setInputMode] = React.useState<InputMode>('address');
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState<number | ''>('');
  const [longitude, setLongitude] = React.useState<number | ''>('');
  const [locating, setLocating] = React.useState(false);
  // Store coordinates and country from address autocomplete selection
  const [selectedLat, setSelectedLat] = React.useState<number | null>(null);
  const [selectedLng, setSelectedLng] = React.useState<number | null>(null);
  const [countryCode, setCountryCode] = React.useState<string | null>(null);

  // reset opposite fields when mode toggles
  React.useEffect(() => {
    if (inputMode === 'address') {
      setLatitude('');
      setLongitude('');
    } else {
      setAddress('');
      setSelectedLat(null);
      setSelectedLng(null);
      setCountryCode(null);
    }
  }, [inputMode]);

  // Handle address autocomplete selection
  const handleAddressSelect = React.useCallback((addr: string, lat: number, lng: number, country?: string) => {
    setAddress(addr);
    setSelectedLat(lat);
    setSelectedLng(lng);
    setCountryCode(country || null);
  }, []);

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
            const r = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`,
              {
                headers: { 'User-Agent': 'pray-calendar-app' },
              },
            );
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
    // Address autocomplete support
    selectedLat,
    selectedLng,
    countryCode,
    handleAddressSelect,
  };
}

export type { InputMode };
