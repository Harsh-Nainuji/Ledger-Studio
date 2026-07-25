'use client';

import { useState } from 'react';

export default function HowItWorks() {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      number: '01',
      title: 'Enter Your Details',
      description: 'Fill in your sender information and client details. Upload logos for a professional touch.',
    },
    {
      number: '02',
      title: 'Add Line Items',
      description: 'List your services or products with quantities and rates. Use presets for quick entry.',
    },
    {
      number: '03',
      title: 'Set Terms',
      description: 'Define payment schedule, tax rates, and discounts. Add scope of work and terms.',
    },
    {
      number: '04',
      title: 'Export PDF',
      description: 'Generate a professional, editorial-style PDF document ready to send to clients.',
    },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 h-16 w-16 md:h-20 md:w-20 rounded-full bg-ledger-text text-ledger-cream flex items-center justify-center border-2 border-ledger-cream hover:bg-ledger-dark hover:scale-105 transition-all duration-300 ease-out"
        aria-label="How It Works"
      >
        <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.08em] text-center leading-tight">
          How<br />It<br />Works
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/30 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full bg-ledger-paper text-ledger-text p-6 md:p-8 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-8">
                <h2 className="font-mono text-xs uppercase tracking-[0.15em]">
                  How It Works
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-text hover:text-ledger-oxblood"
                >
                  Close
                </button>
              </div>
              <div className="space-y-8">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-ledger-text text-ledger-cream flex items-center justify-center font-mono text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold mb-2">{step.title}</h3>
                      <p className="font-mono text-sm text-ledger-grey">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-ledger-text/20">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-ledger-grey">
                  All data stored locally in your browser. No cloud. No tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
