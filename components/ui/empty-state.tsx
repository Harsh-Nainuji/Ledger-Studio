'use client';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="border-2 border-dashed border-ledger-text/40 bg-ledger-cream p-8 md:p-12 text-center max-w-lg mx-auto space-y-4">
      <div className="font-serif text-2xl text-ledger-text font-bold">
        {title}
      </div>
      <p className="font-mono text-xs text-ledger-grey leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-text text-ledger-cream px-6 py-3 hover:bg-ledger-dark transition-colors inline-block border border-ledger-text"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
