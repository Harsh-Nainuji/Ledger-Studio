'use client';

import { useState } from 'react';

export type ViewMode = 'dashboard' | 'quotes' | 'projects' | 'deal-lab' | 'playbook' | 'profile';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onNewDocument: () => void;
}

export default function Navbar({
  currentView,
  onSelectView,
  onNewDocument,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewMode; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'quotes', label: 'Quote Workspace' },
    { id: 'projects', label: 'Projects' },
    { id: 'deal-lab', label: 'Deal Lab' },
    { id: 'playbook', label: 'Playbook' },
    { id: 'profile', label: 'Stats' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ledger-cream border-b-2 border-ledger-text shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Ledger Studio Logo" className="h-8 w-auto" />
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-ledger-text tracking-tight leading-none">
              Ledger Studio
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-ledger-grey mt-0.5">
              Deal Intelligence OS
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`px-3.5 py-2 border transition-all ${
                currentView === item.id
                  ? 'bg-ledger-text text-ledger-cream border-ledger-text font-bold'
                  : 'text-ledger-text border-transparent hover:bg-ledger-warm'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNewDocument}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-oxblood px-4 py-2 hover:bg-ledger-dark transition-colors border border-ledger-text"
          >
            + New Quote
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden font-mono text-xs uppercase px-3 py-1.5 border border-ledger-text bg-ledger-paper"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ledger-paper border-b-2 border-ledger-text p-4 space-y-2 font-mono text-xs uppercase tracking-wider animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-3 border ${
                currentView === item.id
                  ? 'bg-ledger-text text-ledger-cream border-ledger-text font-bold'
                  : 'bg-ledger-cream text-ledger-text border-ledger-text/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
