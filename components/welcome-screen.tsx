'use client';

import { useState, useEffect } from 'react';

export default function WelcomeScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('ledger-studio-welcome-seen');
    if (hasSeenWelcome) {
      setVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('ledger-studio-welcome-seen', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ledger-cream flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-2xl w-full">
        <div className="bg-ledger-paper border-2 border-ledger-text p-8 md:p-12">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Ledger Studio Logo" className="h-20 w-auto mx-auto mb-6" />
            <h1 className="font-serif text-4xl md:text-5xl text-ledger-text tracking-tight mb-2">
              Ledger Studio
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey">
              Editorial Quotation System
            </p>
          </div>

          <div className="border-t border-b border-ledger-text/30 py-6 mb-8">
            <p className="font-serif text-lg text-ledger-text leading-relaxed text-center">
              Create professional, editorial-style quotations with complete privacy. 
              Your data never leaves this browser.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <rect x="4" y="4" width="8" height="8" fill="#1a1918" />
                  <rect x="12" y="4" width="8" height="8" fill="#1a1918" />
                  <rect x="20" y="4" width="8" height="8" fill="#1a1918" />
                  <rect x="4" y="12" width="8" height="8" fill="#1a1918" />
                  <rect x="12" y="12" width="8" height="8" fill="#1a1918" />
                  <rect x="20" y="12" width="8" height="8" fill="#1a1918" />
                  <rect x="4" y="20" width="8" height="8" fill="#1a1918" />
                  <rect x="12" y="20" width="8" height="8" fill="#1a1918" />
                  <rect x="20" y="20" width="8" height="8" fill="#1a1918" />
                </svg>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-ledger-text mb-1">
                  100% Private
                </h3>
                <p className="font-serif text-sm text-ledger-grey">
                  All data stored locally. No cloud, no tracking, no servers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <rect x="8" y="4" width="16" height="4" fill="#1a1918" />
                  <rect x="4" y="8" width="24" height="20" fill="#1a1918" />
                  <rect x="8" y="12" width="16" height="2" fill="#f5f1ed" />
                  <rect x="8" y="16" width="16" height="2" fill="#f5f1ed" />
                  <rect x="8" y="20" width="12" height="2" fill="#f5f1ed" />
                </svg>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-ledger-text mb-1">
                  Editorial Design
                </h3>
                <p className="font-serif text-sm text-ledger-grey">
                  Professional PDF exports with classic typography and rigid grid layouts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 flex-shrink-0">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <rect x="4" y="8" width="8" height="16" fill="#1a1918" />
                  <rect x="12" y="4" width="8" height="24" fill="#1a1918" />
                  <rect x="20" y="12" width="8" height="12" fill="#1a1918" />
                </svg>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-ledger-text mb-1">
                  Offline First
                </h3>
                <p className="font-serif text-sm text-ledger-grey">
                  Works entirely in your browser. No internet connection required.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-6 py-4 hover:bg-ledger-dark transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
