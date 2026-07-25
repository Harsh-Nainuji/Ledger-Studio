'use client';

import { CURRENCIES } from '@/constants/currencies';
import { getCurrencyByCode } from '@/constants/currencies';

interface CurrencySelectorProps {
  currencyCode: string;
  onChange: (code: string) => void;
}

const selectClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 appearance-none cursor-pointer';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

function RoundFlag({ flag }: { flag: string }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ledger-paper border border-ledger-text/30 text-sm overflow-hidden mr-2 transition-transform duration-300 ease-out hover:scale-110 hover:-rotate-3">
      {flag}
    </span>
  );
}

export default function CurrencySelector({
  currencyCode,
  onChange,
}: CurrencySelectorProps) {
  const current = getCurrencyByCode(currencyCode);

  return (
    <div className="space-y-2">
      <label className={labelClass}>Currency</label>
      <select
        value={currencyCode}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-grey flex items-center transition-opacity duration-300">
        <RoundFlag flag={current.flag} />
        {current.flag} {current.name}
      </p>
    </div>
  );
}
