'use client';

import { LineItem } from '@/lib/types';
import { isBelowMinimumRate } from '@/lib/quote-utils';
import { formatCurrency } from '@/lib/formatCurrency';
import { getCurrencyByCode } from '@/constants/currencies';

interface PrivateRatePanelProps {
  minimumHourlyRate: number;
  onUpdate: (rate: number) => void;
  lineItems: LineItem[];
  currencyCode: string;
}

const inputClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 placeholder:text-ledger-grey';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

export default function PrivateRatePanel({
  minimumHourlyRate,
  onUpdate,
  lineItems,
  currencyCode,
}: PrivateRatePanelProps) {
  const currency = getCurrencyByCode(currencyCode);
  const belowMinimumCount = lineItems.filter((item) =>
    isBelowMinimumRate(item.rate, minimumHourlyRate)
  ).length;

  return (
    <div className="p-4 border border-ledger-oxblood bg-ledger-warm space-y-3">
      <h3 className="font-serif text-lg text-ledger-oxblood">Minimum Hourly Rate</h3>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-grey">
        Current minimum: {formatCurrency(minimumHourlyRate, currency)}/hr. Items below this rate will be highlighted.
      </p>

      <div>
        <label className={labelClass}>Rate</label>
        <input
          type="number"
          min="0"
          step="5"
          value={minimumHourlyRate}
          onChange={(e) => onUpdate(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </div>

      {belowMinimumCount > 0 && (
        <div className="p-2 bg-ledger-oxblood/10 border border-ledger-oxblood">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-oxblood">
            {belowMinimumCount} item{belowMinimumCount === 1 ? '' : 's'} below minimum rate
          </p>
        </div>
      )}
    </div>
  );
}
