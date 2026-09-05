'use client';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ledger-text pb-4 mb-6">
      <div className="space-y-1">
        {badge && (
          <span className="font-mono text-[9px] uppercase tracking-[0.15em] bg-ledger-oxblood text-ledger-cream px-2.5 py-0.5 font-bold inline-block border border-ledger-text">
            {badge}
          </span>
        )}
        <h2 className="font-serif text-3xl text-ledger-text font-bold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="self-start md:self-auto shrink-0">{action}</div>}
    </div>
  );
}
