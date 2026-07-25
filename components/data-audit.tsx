'use client';

import { useState } from 'react';

export default function DataAudit() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 h-16 w-16 md:h-20 md:w-20 rounded-full bg-ledger-text text-ledger-cream flex items-center justify-center border-2 border-ledger-cream hover:bg-ledger-dark hover:scale-105 transition-all duration-300 ease-out"
        aria-label="Privacy Audit"
      >
        <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.08em] text-center leading-tight">
          Privacy<br />Audit
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/30 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full bg-ledger-text text-ledger-cream p-6 md:p-8 max-h-[60vh] overflow-y-auto animate-slide-up">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em]">
                  PRIVACY AUDIT REPORT
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream hover:text-ledger-oxblood"
                >
                  Close
                </button>
              </div>
              <pre className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
{`Status: 100% Private.
This quotation system never transmits your data. No servers, no cloud, no tracking. Every client detail, price, and project note is locked inside your own browser. We cannot see your numbers. Clear your browser storage and the information is gone. You remain the sole owner of your ledger.`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
