'use client';

import { Milestone } from '@/lib/types';
import { formatCurrency } from '@/lib/formatCurrency';
import { calculateMilestoneAmounts, calculateTotalPercentage } from '@/lib/calculateMilestones';
import { validateMilestones } from '@/lib/validateMilestones';
import { PAYMENT_PRESETS } from '@/constants/paymentPresets';
import { getCurrencyByCode } from '@/constants/currencies';

interface PaymentScheduleEditorProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
  grandTotal: number;
  currencyCode: string;
}

const inputClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 placeholder:text-ledger-grey';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

const buttonClass =
  'font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-4 py-2 hover:bg-ledger-dark transition-colors';

const outlineButtonClass =
  'font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-text border border-ledger-text px-3 py-1.5 hover:bg-ledger-warm transition-colors';

export default function PaymentScheduleEditor({
  enabled,
  onToggle,
  milestones,
  onUpdate,
  grandTotal,
  currencyCode,
}: PaymentScheduleEditorProps) {
  const currency = getCurrencyByCode(currencyCode);
  const calculated = calculateMilestoneAmounts(milestones, grandTotal);
  const validation = validateMilestones(milestones);

  const applyPreset = (presetId: string) => {
    const preset = PAYMENT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const newMilestones: Milestone[] = preset.milestones.map((m, i) => ({
      id: `milestone-${Date.now()}-${i}`,
      name: m.name,
      percentage: m.percentage,
      amount: calculateMilestoneAmounts([{ ...m, id: '', amount: 0 }], grandTotal)[0].amount,
    }));
    onUpdate(newMilestones);
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      name: '',
      percentage: 0,
      amount: 0,
    };
    onUpdate([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    onUpdate(
      milestones.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const removeMilestone = (id: string) => {
    onUpdate(milestones.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-ledger-text">Payment Schedule</h3>
        <button
          onClick={() => onToggle(!enabled)}
          className={`relative w-12 h-6 border border-ledger-text transition-colors ${
            enabled ? 'bg-ledger-oxblood' : 'bg-ledger-warm'
          }`}
          aria-label="Toggle payment schedule"
        >
          <div
            className={`absolute top-[2px] w-[18px] h-[18px] bg-ledger-cream border border-ledger-text transition-transform ${
              enabled ? 'left-[26px]' : 'left-[4px]'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={outlineButtonClass}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {calculated.map((milestone) => (
              <div
                key={milestone.id}
                className="space-y-3 p-4 border border-ledger-text/20 bg-ledger-warm"
              >
                <div>
                  <label className={labelClass}>Milestone Name</label>
                  <input
                    type="text"
                    placeholder="Milestone Name"
                    value={milestone.name}
                    onChange={(e) =>
                      updateMilestone(milestone.id, { name: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className={labelClass}>Percentage</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={milestone.percentage}
                      onChange={(e) =>
                        updateMilestone(milestone.id, {
                          percentage: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Amount</label>
                    <div className="font-mono text-sm text-ledger-text pb-1">
                      {formatCurrency(milestone.amount, currency)}
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      onClick={() => removeMilestone(milestone.id)}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-oxblood hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addMilestone} className={buttonClass}>
              Add Milestone
            </button>
          </div>

          <div className="p-4 border border-ledger-text/20 bg-ledger-cream space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey">
                Total Allocation
              </span>
              <span
                className={`font-mono text-sm font-bold ${
                  validation.isValid ? 'text-ledger-text' : 'text-ledger-oxblood'
                }`}
              >
                {validation.totalPercentage}%
              </span>
            </div>

            <div className="h-2 bg-ledger-warm border border-ledger-text/20 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  validation.isValid
                    ? 'bg-ledger-text'
                    : validation.isOver
                    ? 'bg-ledger-oxblood'
                    : 'bg-ledger-accent'
                }`}
                style={{ width: `${Math.min(validation.totalPercentage, 100)}%` }}
              />
            </div>

            {!validation.isValid && (
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-oxblood">
                {validation.message}
              </p>
            )}
            {validation.isValid && (
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-text">
                {validation.message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
