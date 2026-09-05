'use client';

import { useState } from 'react';
import { QuoteData, HiddenWorkItem } from '@/lib/types';
import { detectHiddenWork } from '@/lib/hidden-work-rules';
import { calculateGrandTotal, formatCurrency } from '@/lib/quote-utils';

interface HiddenWorkDetectorProps {
  quote: QuoteData;
  onUpdateQuote: (updates: Partial<QuoteData>) => void;
}

export default function HiddenWorkDetector({
  quote,
  onUpdateQuote,
}: HiddenWorkDetectorProps) {
  const [items, setItems] = useState<HiddenWorkItem[]>(() =>
    detectHiddenWork(quote)
  );

  const grandTotal = calculateGrandTotal(
    quote.lineItems,
    quote.taxRate,
    quote.discountAmount
  );

  const visibleHours = quote.lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const supportingHours = items
    .filter((i) => i.status === 'added_to_scope' || i.status === 'internal_task')
    .reduce((sum, item) => sum + item.estimatedHours, 0);

  const totalWorkloadHours = visibleHours + supportingHours;

  const trueEffectiveRate =
    totalWorkloadHours > 0 ? grandTotal / totalWorkloadHours : 0;

  const handleAction = (id: string, action: 'added_to_scope' | 'internal_task' | 'ignored') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );

    if (action === 'added_to_scope') {
      const itemToAdd = items.find((i) => i.id === id);
      if (itemToAdd) {
        const newLineItem = {
          id: `item-${Date.now()}`,
          description: `${itemToAdd.title} (${itemToAdd.description})`,
          quantity: itemToAdd.estimatedHours,
          rate: itemToAdd.suggestedRate,
        };
        onUpdateQuote({
          lineItems: [...quote.lineItems, newLineItem],
        });
      }
    }
  };

  const handleRescan = () => {
    setItems(detectHiddenWork(quote));
  };

  return (
    <div className="bg-ledger-paper border-2 border-ledger-text p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ledger-text pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-cream bg-ledger-oxblood px-2.5 py-0.5 font-bold">
              DIAGNOSTIC AUDIT
            </span>
            <h2 className="font-serif text-3xl text-ledger-text">
              Hidden Work Detector
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mt-2">
            Detect unpriced supporting tasks (testing, deployment, setup) that drain hourly margins.
          </p>
        </div>

        <button
          onClick={handleRescan}
          className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-text text-ledger-cream px-5 py-3 hover:bg-ledger-dark transition-colors self-start md:self-auto"
        >
          Rescan Quote
        </button>
      </div>

      {/* Visual Moment: WHAT THE CLIENT SEES vs WHAT IT ACTUALLY TAKES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-ledger-text p-6 bg-ledger-cream">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey block mb-2 font-bold">
            CLIENT VIEW (VISIBLE ITEMS)
          </span>
          <h3 className="font-serif text-xl text-ledger-text mb-4">
            What the Client Sees
          </h3>
          <ul className="space-y-2">
            {quote.lineItems.length === 0 ? (
              <li className="font-mono text-xs italic text-ledger-grey">
                No visible line items added yet.
              </li>
            ) : (
              quote.lineItems.map((item) => (
                <li
                  key={item.id}
                  className="font-mono text-xs text-ledger-text flex justify-between border-b border-ledger-text/20 pb-1.5"
                >
                  <span>• {item.description}</span>
                  <span className="font-bold">{item.quantity} hrs</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="border-2 border-ledger-text p-6 bg-ledger-warm">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-oxblood block mb-2 font-bold">
            REAL EFFORT (VISIBLE + SUPPORTING)
          </span>
          <h3 className="font-serif text-xl text-ledger-text mb-4">
            What It Actually Takes
          </h3>
          <ul className="space-y-2">
            {quote.lineItems.map((item) => (
              <li
                key={item.id}
                className="font-mono text-xs text-ledger-text opacity-70 flex justify-between border-b border-ledger-text/20 pb-1.5"
              >
                <span>✓ {item.description}</span>
                <span>{item.quantity} hrs</span>
              </li>
            ))}
            {items
              .filter((i) => i.status !== 'ignored')
              .map((item) => (
                <li
                  key={item.id}
                  className={`font-mono text-xs flex justify-between border-b pb-1.5 font-bold ${
                    item.status === 'added_to_scope'
                      ? 'text-ledger-text border-ledger-text'
                      : 'text-ledger-oxblood border-ledger-oxblood/40'
                  }`}
                >
                  <span>
                    + {item.title} ({item.status === 'added_to_scope' ? 'Scope' : 'Internal'})
                  </span>
                  <span>+{item.estimatedHours} hrs</span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Work Impact Bar */}
      <div className="bg-ledger-text text-ledger-cream p-6 border-2 border-ledger-text grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div>
          <span className="text-ledger-grey text-[10px] uppercase tracking-[0.1em] block">
            Visible Work
          </span>
          <span className="text-xl font-bold text-ledger-cream">{visibleHours} hrs</span>
        </div>
        <div>
          <span className="text-ledger-grey text-[10px] uppercase tracking-[0.1em] block">
            Supporting Work
          </span>
          <span className="text-xl font-bold text-ledger-accent">+{supportingHours} hrs</span>
        </div>
        <div>
          <span className="text-ledger-grey text-[10px] uppercase tracking-[0.1em] block">
            Total Workload
          </span>
          <span className="text-xl font-bold text-ledger-cream">{totalWorkloadHours} hrs</span>
        </div>
        <div>
          <span className="text-ledger-grey text-[10px] uppercase tracking-[0.1em] block">
            True Effective Rate
          </span>
          <span
            className={`text-xl font-bold ${
              quote.minimumHourlyRate > 0 && trueEffectiveRate < quote.minimumHourlyRate
                ? 'text-ledger-oxblood'
                : 'text-ledger-cream'
            }`}
          >
            {formatCurrency(trueEffectiveRate, quote.currencyCode)}/hr
          </span>
        </div>
      </div>

      {/* Detected Tasks Cards */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-ledger-text">
          Potential Hidden Work ({items.length} Detected)
        </h3>

        {items.length === 0 ? (
          <p className="font-mono text-xs text-ledger-grey italic">
            No unaddressed supporting tasks detected! Your current scope appears thorough.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-ledger-text p-5 bg-ledger-cream flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 bg-ledger-warm text-ledger-text border border-ledger-text">
                      {item.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-serif text-lg text-ledger-text">
                      {item.title}
                    </h4>
                  </div>
                  <p className="font-mono text-xs text-ledger-grey">
                    {item.description}
                  </p>
                  <span className="font-mono text-[11px] text-ledger-text inline-block font-semibold">
                    Est. Effort: {item.estimatedHours} hrs @ {formatCurrency(item.suggestedRate, quote.currencyCode)}/hr
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  <button
                    onClick={() => handleAction(item.id, 'added_to_scope')}
                    disabled={item.status === 'added_to_scope'}
                    className={`font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2.5 border border-ledger-text transition-all ${
                      item.status === 'added_to_scope'
                        ? 'bg-ledger-text text-ledger-cream'
                        : 'bg-ledger-paper text-ledger-text hover:bg-ledger-warm'
                    }`}
                  >
                    {item.status === 'added_to_scope' ? '✓ In Scope' : '+ Add to Scope'}
                  </button>

                  <button
                    onClick={() => handleAction(item.id, 'internal_task')}
                    disabled={item.status === 'internal_task'}
                    className={`font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2.5 border border-ledger-text transition-all ${
                      item.status === 'internal_task'
                        ? 'bg-ledger-oxblood text-ledger-cream'
                        : 'bg-ledger-paper text-ledger-text hover:bg-ledger-warm'
                    }`}
                  >
                    {item.status === 'internal_task' ? '✓ Internal' : 'Internal Task'}
                  </button>

                  <button
                    onClick={() => handleAction(item.id, 'ignored')}
                    disabled={item.status === 'ignored'}
                    className={`font-mono text-[10px] uppercase tracking-[0.1em] px-3 py-2.5 border transition-all ${
                      item.status === 'ignored'
                        ? 'bg-ledger-grey text-ledger-cream border-ledger-grey'
                        : 'text-ledger-grey border-ledger-grey/40 hover:text-ledger-text'
                    }`}
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
