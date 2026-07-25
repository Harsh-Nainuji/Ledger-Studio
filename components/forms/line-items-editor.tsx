'use client';

import { useState } from 'react';
import { LineItem, LineItemPreset } from '@/lib/types';
import { LINE_ITEM_PRESETS } from '@/lib/quote-utils';
import { isBelowMinimumRate } from '@/lib/quote-utils';
import { formatCurrency } from '@/lib/formatCurrency';
import { getCurrencyByCode } from '@/constants/currencies';

interface LineItemsEditorProps {
  lineItems: LineItem[];
  onUpdate: (items: LineItem[]) => void;
  minimumHourlyRate: number;
  currencyCode: string;
  grandTotal: number;
  onScopeUpdate: (scope: string) => void;
}

const inputClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 placeholder:text-ledger-grey';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

const buttonClass =
  'font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-4 py-2 hover:bg-ledger-dark transition-colors';

const outlineButtonClass =
  'font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-text border border-ledger-text px-4 py-2 hover:bg-ledger-warm transition-colors';

export default function LineItemsEditor({
  lineItems,
  onUpdate,
  minimumHourlyRate,
  currencyCode,
  grandTotal,
  onScopeUpdate,
}: LineItemsEditorProps) {
  const currency = getCurrencyByCode(currencyCode);
  const [showPresets, setShowPresets] = useState(false);

  const generateTieredPricing = () => {
    const core = grandTotal;
    const professional = Math.round(grandTotal * 1.4);
    const comprehensive = Math.round(grandTotal * 2.2);

    const table = [
      '| Tier | What\'s Included | Investment |',
      '|------|------------------|------------|',
      `| Core | Basic requirements to achieve the baseline outcome. | ${formatCurrency(core, currency)} |`,
      `| **Professional** (Recommended) | Includes priority support, extended revisions, and standard optimizations. | ${formatCurrency(professional, currency)} |`,
      `| Comprehensive | Full-service white-glove delivery, unlimited revisions, and dedicated resources. | ${formatCurrency(comprehensive, currency)} |`,
    ].join('\n');

    const preamble = `## Tiered Pricing Options\n\nChoose the package that best aligns with your timeline and resource needs:\n\n`;
    onScopeUpdate(`${preamble}${table}`);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
    };
    onUpdate([...lineItems, newItem]);
  };

  const addPreset = (preset: LineItemPreset) => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: preset.description,
      quantity: 1,
      rate: preset.rate,
    };
    onUpdate([...lineItems, newItem]);
    setShowPresets(false);
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    onUpdate(
      lineItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeLineItem = (id: string) => {
    onUpdate(lineItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-ledger-text">Line Items</h3>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-text hover:text-ledger-oxblood"
        >
          {showPresets ? 'Hide Presets' : 'Show Presets'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={generateTieredPricing}
          disabled={grandTotal <= 0}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-4 py-2 hover:bg-ledger-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Tiered Pricing
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-grey">1x / 1.4x / 2.2x</span>
      </div>

      {showPresets && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-ledger-warm border border-ledger-text/20">
          {LINE_ITEM_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => addPreset(preset)}
              className="text-left p-2 hover:bg-ledger-paper border border-ledger-text/10 transition-colors"
            >
              <div className="font-serif text-sm text-ledger-text">{preset.name}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-grey">
                {formatCurrency(preset.rate, currency)}/hr
              </div>
            </button>
          ))}
        </div>
      )}

      {lineItems.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-ledger-grey/40">
          <p className="font-serif text-sm text-ledger-grey mb-4">No line items yet</p>
          <button onClick={addLineItem} className={buttonClass}>
            Add Item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {lineItems.map((item) => (
            <div key={item.id} className="space-y-3 p-4 border border-ledger-text/20 bg-ledger-warm">
              <div>
                <label className={labelClass}>Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateLineItem(item.id, { description: e.target.value })
                  }
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Qty</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={item.quantity}
                    onChange={(e) =>
                      updateLineItem(item.id, {
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Rate</label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={item.rate}
                    onChange={(e) =>
                      updateLineItem(item.id, {
                        rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={`${inputClass} ${
                      isBelowMinimumRate(item.rate, minimumHourlyRate)
                        ? 'border-ledger-oxblood'
                        : ''
                    }`}
                  />
                </div>

                <div>
                  <label className={labelClass}>Total</label>
                  <div className="font-mono text-sm text-ledger-text pt-1">
                    {formatCurrency(item.quantity * item.rate, currency)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => removeLineItem(item.id)}
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-oxblood hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button onClick={addLineItem} className={outlineButtonClass}>
            Add Item
          </button>
        </div>
      )}
    </div>
  );
}
