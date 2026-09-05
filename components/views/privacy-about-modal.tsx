'use client';

interface PrivacyAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyAboutModal({
  isOpen,
  onClose,
}: PrivacyAboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
      <div className="bg-ledger-cream border-2 border-ledger-text p-6 md:p-8 max-w-2xl w-full space-y-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-ledger-text pb-4">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] bg-ledger-oxblood text-ledger-cream px-2.5 py-0.5 font-bold">
              ABOUT & PRIVACY
            </span>
            <h2 className="font-serif text-3xl text-ledger-text font-bold mt-1">
              Ledger Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-[0.1em] px-3 py-1.5 border border-ledger-text bg-ledger-paper hover:bg-ledger-text hover:text-ledger-cream transition-colors"
          >
            Close
          </button>
        </div>

        {/* About Section */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl text-ledger-text font-bold">
            About Ledger Studio
          </h3>
          <p className="font-mono text-xs text-ledger-text leading-relaxed">
            Ledger Studio is a clean, offline-first tool designed to help freelancers and independent creators draft professional quotes, protect their minimum hourly rates, and avoid unpaid scope creep.
          </p>
          <p className="font-mono text-xs text-ledger-grey leading-relaxed">
            Created by <strong>Harsh</strong>, founder of <strong>Atarico</strong>.
          </p>
        </div>

        <hr className="border-ledger-text/30" />

        {/* Simple Privacy Policy */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl text-ledger-text font-bold">
            Privacy Policy
          </h3>
          <div className="bg-ledger-paper p-4 border border-ledger-text space-y-2 font-mono text-xs">
            <p className="font-bold text-ledger-text">
              100% Local Browser Privacy
            </p>
            <p className="text-ledger-grey leading-relaxed">
              Your quotes, client names, line items, and financial settings never leave your computer. Everything is saved directly in your browser's local storage. We do not use external servers, databases, or tracking cookies.
            </p>
          </div>
        </div>

        <hr className="border-ledger-text/30" />

        {/* Creator & Links */}
        <div className="space-y-3 font-mono text-xs">
          <span className="text-[10px] uppercase tracking-[0.1em] text-ledger-grey block font-bold">
            Connect & Enquiries
          </span>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.linkedin.com/in/harsh-coding/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-ledger-text bg-ledger-paper hover:bg-ledger-text hover:text-ledger-cream transition-colors font-bold"
            >
              LinkedIn →
            </a>
            <a
              href="https://github.com/Harsh-Nainuji"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-ledger-text bg-ledger-paper hover:bg-ledger-text hover:text-ledger-cream transition-colors font-bold"
            >
              GitHub →
            </a>
            <a
              href="https://www.atarico.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 border border-ledger-text bg-ledger-oxblood text-ledger-cream hover:bg-ledger-dark transition-colors font-bold"
            >
              atarico.dev →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
