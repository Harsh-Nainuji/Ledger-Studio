'use client';

import { QuoteData } from '@/lib/types';
import { formatDate } from '@/lib/quote-utils';

interface QuoteMetadataEditorProps {
  quote: QuoteData;
  onUpdate: (updates: Partial<QuoteData>) => void;
}

const URGENCY_MARKER = '**Notice of Ledger Closure:**';

const inputClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 placeholder:text-ledger-grey';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

export default function QuoteMetadataEditor({
  quote,
  onUpdate,
}: QuoteMetadataEditorProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl text-ledger-text">Document Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div>
          <label className={labelClass}>Quote Number</label>
          <input
            type="text"
            value={quote.quoteNumber}
            onChange={(e) => onUpdate({ quoteNumber: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={quote.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="max-w-xs">
        <label className={labelClass}>Due Date</label>
        <input
          type="date"
          value={quote.dueDate}
          onChange={(e) => onUpdate({ dueDate: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 border border-ledger-text p-3 bg-ledger-warm">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={quote.urgencyEnabled}
            onChange={(e) => {
              const enabled = e.target.checked;
              const expiryDate = new Date(quote.date);
              expiryDate.setDate(expiryDate.getDate() + 7);
              const formattedExpiry = formatDate(expiryDate.toISOString().split('T')[0]);

              const urgencyBlock = `> **Notice of Ledger Closure:** Due to current capacity routing, these rates and timelines are strictly secured until **${formattedExpiry}**. After this window, the ledger will close and pricing is subject to reassessment based on availability.`;

              let notesAndTerms = quote.notesAndTerms || '';
              const markerIndex = notesAndTerms.indexOf(URGENCY_MARKER);

              if (enabled) {
                if (markerIndex === -1) {
                  notesAndTerms = notesAndTerms
                    ? `${notesAndTerms}\n\n${urgencyBlock}`
                    : urgencyBlock;
                }
              } else {
                if (markerIndex !== -1) {
                  const before = notesAndTerms.slice(0, markerIndex);
                  const afterBlock = notesAndTerms.slice(markerIndex);
                  const nextNewline = afterBlock.indexOf('\n\n');
                  const cleaned =
                    nextNewline !== -1
                      ? before + afterBlock.slice(nextNewline + 2)
                      : before;
                  notesAndTerms = cleaned.replace(/\n\s*\n/g, '\n\n').trim();
                }
              }

              onUpdate({ urgencyEnabled: enabled, notesAndTerms });
            }}
            className="sr-only peer"
          />
          <div className="h-5 w-9 border border-ledger-text bg-ledger-cream peer-checked:bg-ledger-oxblood peer-focus:outline-none transition-colors" />
          <div className="absolute left-0.5 top-0.5 h-3.5 w-3.5 bg-ledger-text transition-transform peer-checked:translate-x-4" />
        </label>
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-text">
          Apply Ledger Urgency Constraints (7-Day Expiry)
        </span>
      </div>
    </div>
  );
}
