'use client';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
}

export default function MetricCard({
  label,
  value,
  subtext,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={`p-5 border-2 border-ledger-text flex flex-col justify-between ${
        highlight ? 'bg-ledger-text text-ledger-cream' : 'bg-ledger-paper text-ledger-text'
      }`}
    >
      <span
        className={`font-mono text-[9px] uppercase tracking-[0.15em] font-bold block mb-2 ${
          highlight ? 'text-ledger-accent' : 'text-ledger-grey'
        }`}
      >
        {label}
      </span>
      <div>
        <span className="font-serif text-3xl font-bold tracking-tight block">
          {value}
        </span>
        {subtext && (
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.08em] block mt-1 ${
              highlight ? 'text-ledger-warm' : 'text-ledger-grey'
            }`}
          >
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
