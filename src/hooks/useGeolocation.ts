import { useCallback, useEffect, useRef, useState } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const SESSION_KEY = 'pray-calendar-geolocation';

/**
 * Hook for requesting browser geolocation with permission handling.
 * Caches result in sessionStorage to avoid repeat permission prompts.
 */
export function useGeolocation() {
  // Lazy initialization from sessionStorage
  const [state, setState] = useState<GeolocationState>(() => {
    if (typeof window === 'undefined') {
      return { latitude: null, longitude: null, error: null, loading: false };
    }
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) {
      try {
        const { latitude, longitude } = JSON.parse(cached);
        return { latitude, longitude, error: null, loading: false };
      } catch {
        // Invalid cache, continue with defaults
      }
    }
    return { latitude: null, longitude: null, error: null, loading: false };
  });

  // Store watch ID in ref to avoid re-renders
  const watchIdRef = useRef<number | null>(null);

  const requestLocation = useCallback(() => {
    // Early exit if already have cached coords
    if (state.latitude !== null && state.longitude !== null) {
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation not supported',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Cache in sessionStorage
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ latitude, longitude }));

        setState({
          latitude,
          longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'Failed to get location';
        }
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  }, [state.latitude, state.longitude]);

  const clearLocation = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setState({ latitude: null, longitude: null, error: null, loading: false });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    ...state,
    requestLocation,
    clearLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  };
}
