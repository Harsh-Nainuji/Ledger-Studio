'use client';

import { formatCurrency } from '@/lib/formatCurrency';
import { getCurrencyByCode } from '@/constants/currencies';

interface TaxAndDiscountEditorProps {
  taxRate: number;
  discountAmount: number;
  onTaxUpdate: (rate: number) => void;
  onDiscountUpdate: (amount: number) => void;
  currencyCode: string;
}

const inputClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 placeholder:text-ledger-grey';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

export default function TaxAndDiscountEditor({
  taxRate,
  discountAmount,
  onTaxUpdate,
  onDiscountUpdate,
  currencyCode,
}: TaxAndDiscountEditorProps) {
  const currency = getCurrencyByCode(currencyCode);
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg text-ledger-text">Tax & Discount</h3>

      <div>
        <label className={labelClass}>Tax Rate (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={taxRate}
          onChange={(e) => onTaxUpdate(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Discount Amount ({currency.symbol})</label>
        <input
          type="number"
          min="0"
          step="5"
          value={discountAmount}
          onChange={(e) => onDiscountUpdate(parseFloat(e.target.value) || 0)}
          className={inputClass}
        />
      </div>
    </div>
  );
}
