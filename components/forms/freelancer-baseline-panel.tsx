'use client';

import { FreelancerSettings } from '@/lib/types';

interface FreelancerBaselinePanelProps {
  settings: FreelancerSettings;
  onUpdate: (settings: FreelancerSettings) => void;
  onApply: () => void;
  calculatedRate: number;
}

const inputClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 placeholder:text-ledger-grey';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

export default function FreelancerBaselinePanel({
  settings,
  onUpdate,
  onApply,
  calculatedRate,
}: FreelancerBaselinePanelProps) {
  return (
    <div className="border border-ledger-oxblood bg-ledger-warm p-4 space-y-4">
      <h3 className="font-serif text-lg text-ledger-oxblood">Freelancer Baseline</h3>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-grey">
        Set your monthly survival cost and desired billable hours. The calculated rate becomes your walk-away floor.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div>
          <label className={labelClass}>Monthly Survival Expense</label>
          <input
            type="number"
            min="0"
            step="100"
            value={settings.monthlySurvivalExpense}
            onChange={(e) =>
              onUpdate({
                ...settings,
                monthlySurvivalExpense: parseFloat(e.target.value) || 0,
              })
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Desired Monthly Hours</label>
          <input
            type="number"
            min="1"
            step="1"
            value={settings.desiredMonthlyHours}
            onChange={(e) =>
              onUpdate({
                ...settings,
                desiredMonthlyHours: parseFloat(e.target.value) || 1,
              })
            }
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-ledger-text/10 pt-4">
        <div className="font-mono text-sm text-ledger-text">
          Calculated floor: <span className="text-ledger-oxblood">${calculatedRate.toFixed(2)}/hr</span>
        </div>
        <button
          onClick={onApply}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-4 py-2 hover:bg-ledger-dark transition-colors self-start"
        >
          Apply to Quote
        </button>
      </div>
    </div>
  );
}
