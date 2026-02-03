import { translations } from '../constants/translations';
import { useAppContext } from '../contexts/AppContext';
import defaultMethod from './defaultMethod';

export interface MethodSelectProps {
  method: string;
  setMethod: (method: string) => void;
}

export function MethodSelectFields({ method, setMethod }: MethodSelectProps) {
  const { lang } = useAppContext();
  return (
    <>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-muted">
        {translations[lang].method}
      </label>
      <div className="relative">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-[var(--radius-sm)] border border-border-subtle bg-bg-secondary px-4 py-3 text-sm text-text-primary outline-none transition focus:border-gold focus:shadow-[0_0_0_3px_var(--gold-glow)]"
          style={{
            fontFamily: 'var(--font-sans)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
          }}
        >
          {defaultMethod.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label[lang]}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default function MethodSelect(props: MethodSelectProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border-subtle bg-bg-card p-6">
      <MethodSelectFields {...props} />
    </div>
  );
}
