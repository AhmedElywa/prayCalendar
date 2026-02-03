'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface PhotonFeature {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    osm_value?: string;
  };
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: string, lat: number, lng: number, countryCode?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const PHOTON_API = 'https://photon.komoot.io/api/';
const DEBOUNCE_MS = 250;

function AddressAutocompleteComponent({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter city or address...',
  disabled = false,
  className = '',
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(value, DEBOUNCE_MS);

  // Fetch suggestions from Photon API
  useEffect(() => {
    // Early exit if query is too short
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();

    async function fetchSuggestions() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          limit: '5',
        });
        const res = await fetch(`${PHOTON_API}?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setSuggestions(data.features || []);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();

    return () => controller.abort();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format suggestion for display
  const formatSuggestion = useCallback((feature: PhotonFeature): string => {
    const { name, city, state, country } = feature.properties;
    const parts = [name, city, state, country].filter(Boolean);
    // Remove duplicates (e.g., when name === city)
    return [...new Set(parts)].join(', ');
  }, []);

  // Handle suggestion selection
  const handleSelect = useCallback(
    (feature: PhotonFeature) => {
      const formatted = formatSuggestion(feature);
      const [lng, lat] = feature.geometry.coordinates;
      const countryCode = feature.properties.countrycode;
      onChange(formatted);
      onSelect(formatted, lat, lng, countryCode);
      setIsOpen(false);
      setSuggestions([]);
    },
    [formatSuggestion, onChange, onSelect],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && suggestions[activeIndex]) {
            handleSelect(suggestions[activeIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, suggestions, activeIndex, handleSelect],
  );

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        className={`w-full rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)] ${className}`}
        style={{ fontFamily: 'var(--font-sans)' }}
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute end-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 animate-spin text-text-muted" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[var(--radius-sm)] border border-border-subtle bg-bg-card shadow-lg"
        >
          {suggestions.map((feature, index) => (
            <div
              key={`${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}-${index}`}
              role="option"
              tabIndex={0}
              aria-selected={index === activeIndex}
              onClick={() => handleSelect(feature)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(feature)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`cursor-pointer px-4 py-3 text-sm transition ${
                index === activeIndex ? 'bg-gold-glow text-text-primary' : 'text-text-secondary hover:bg-bg-secondary'
              }`}
            >
              <div className="font-medium">{feature.properties.name || feature.properties.city}</div>
              <div className="text-xs text-text-muted">
                {[feature.properties.state, feature.properties.country].filter(Boolean).join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const AddressAutocomplete = memo(AddressAutocompleteComponent);
