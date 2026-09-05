'use client';

import { useState } from 'react';
import PrivacyAboutModal from './views/privacy-about-modal';

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);

  const links = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harsh-coding/' },
    { label: 'GitHub', href: 'https://github.com/Harsh-Nainuji' },
    { label: 'Website (atarico.dev)', href: 'https://www.atarico.dev' },
  ];

  return (
    <>
      <footer className="border-t-2 border-ledger-text bg-ledger-cream mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h4 className="font-serif text-xl font-bold text-ledger-text">
              Ledger Studio
            </h4>
            <p className="font-mono text-xs text-ledger-grey max-w-md">
              Developed by Harsh (Atarico). Built for freelancers who want to create clear proposals and protect project economics.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey">
              100% Client-Side Privacy. Your data stays in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-2 border border-ledger-text bg-ledger-paper hover:bg-ledger-text hover:text-ledger-cream transition-colors font-bold uppercase tracking-[0.08em]"
            >
              Privacy & About
            </button>

            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 border border-ledger-text bg-ledger-cream hover:bg-ledger-text hover:text-ledger-cream transition-colors font-bold uppercase tracking-[0.08em]"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </footer>

      <PrivacyAboutModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
