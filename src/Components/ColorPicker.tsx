import { CheckIcon } from '@heroicons/react/24/outline';
import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';

export const CALENDAR_COLORS = [
  { hex: '#1BADF8', en: 'Blue', ar: 'ازرق' },
  { hex: '#2DC653', en: 'Green', ar: 'اخضر' },
  { hex: '#17BEBB', en: 'Teal', ar: 'ازرق مخضر' },
  { hex: '#9B59B6', en: 'Purple', ar: 'بنفسجي' },
  { hex: '#E74C3C', en: 'Red', ar: 'احمر' },
  { hex: '#F39C12', en: 'Orange', ar: 'برتقالي' },
  { hex: '#E91E63', en: 'Pink', ar: 'وردي' },
  { hex: '#795548', en: 'Brown', ar: 'بني' },
  { hex: '#D4AF37', en: 'Gold', ar: 'ذهبي' },
  { hex: '#1B5E20', en: 'Dark Green', ar: 'اخضر غامق' },
  { hex: '#1A237E', en: 'Navy', ar: 'كحلي' },
  { hex: '#607D8B', en: 'Gray', ar: 'رمادي' },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { lang } = useAppContext();

  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
        {translations[lang].calendarColor}
      </label>
      <p className="mb-3 text-xs text-text-muted">{translations[lang].calendarColorDescription}</p>
      <div className="flex flex-wrap gap-1.5">
        {/* Default (no color) */}
        <button
          type="button"
          onClick={() => onChange('')}
          title={translations[lang].colorNone}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 bg-bg-elevated transition ${
            value === '' ? 'border-text-primary shadow-[0_0_0_2px_var(--bg-primary)]' : 'border-transparent'
          }`}
        >
          {value === '' && <CheckIcon className="h-3 w-3 text-text-primary" />}
        </button>
        {CALENDAR_COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            onClick={() => onChange(c.hex)}
            title={c[lang]}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition hover:scale-110 ${
              value === c.hex ? 'border-text-primary shadow-[0_0_0_2px_var(--bg-primary)]' : 'border-transparent'
            }`}
            style={{ backgroundColor: c.hex }}
          >
            {value === c.hex && <CheckIcon className="h-3 w-3 text-white drop-shadow" />}
          </button>
        ))}
      </div>
    </div>
  );
}
