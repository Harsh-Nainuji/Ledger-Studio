'use client';

import { QuoteData, SenderInfo } from '@/lib/types';
import SectionHeader from '../ui/section-header';
import MetricCard from '../ui/metric-card';
import { calculateGrandTotal, formatCurrency, formatDate } from '@/lib/quote-utils';
import { runProposalXRay } from '@/lib/xray-engine';
import { ViewMode } from '../navigation/navbar';

interface DashboardViewProps {
  quote: QuoteData;
  senderInfo: SenderInfo;
  onNavigate: (view: ViewMode) => void;
  onNewDocument: () => void;
}

export default function DashboardView({
  quote,
  senderInfo,
  onNavigate,
  onNewDocument,
}: DashboardViewProps) {
  const grandTotal = calculateGrandTotal(
    quote.lineItems,
    quote.taxRate,
    quote.discountAmount
  );

  const xray = runProposalXRay(quote);
  const totalHours = quote.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const effectiveRate = totalHours > 0 ? grandTotal / totalHours : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        badge="FREELANCE COMMAND CENTER"
        title="Dashboard"
        subtitle="Executive summary of your active deals, quote economics, and proposal diagnostics."
        action={
          <button
            onClick={onNewDocument}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-oxblood px-5 py-3 hover:bg-ledger-dark transition-colors border border-ledger-text font-bold"
          >
            + New Quote
          </button>
        }
      />

      {/* Top Metric Cards */}
      <div data-tour="dashboard-metrics" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Active Quote Total"
          value={formatCurrency(grandTotal, quote.currencyCode)}
          subtext={`Quote #${quote.quoteNumber}`}
          highlight
        />

        <MetricCard
          label="Proposal Health Score"
          value={`${xray.score}/100`}
          subtext={xray.score >= 80 ? 'Healthy Deal' : 'Action Required'}
        />

        <MetricCard
          label="Effective Hourly Rate"
          value={`${formatCurrency(effectiveRate, quote.currencyCode)}/hr`}
          subtext={`Baseline: ${formatCurrency(quote.minimumHourlyRate, quote.currencyCode)}/hr`}
        />

        <MetricCard
          label="Estimated Workload"
          value={`${totalHours} hrs`}
          subtext={`${quote.lineItems.length} line items added`}
        />
      </div>

      {/* Primary Action Launcher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-ledger-text p-6 bg-ledger-paper space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-oxblood font-bold block">
            01. WORKSPACE
          </span>
          <h3 className="font-serif text-2xl text-ledger-text font-bold">
            Quote Workspace
          </h3>
          <p className="font-mono text-xs text-ledger-grey">
            Edit your line items, scope of work, payment schedule, and terms.
          </p>
          <button
            onClick={() => onNavigate('quotes')}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-4 py-2.5 hover:bg-ledger-dark transition-colors border border-ledger-text inline-block"
          >
            Open Workspace →
          </button>
        </div>

        <div data-tour="deal-lab" className="border-2 border-ledger-text p-6 bg-ledger-paper space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-oxblood font-bold block">
            02. DIAGNOSTICS
          </span>
          <h3 className="font-serif text-2xl text-ledger-text font-bold">
            Deal Intelligence Lab
          </h3>
          <p className="font-mono text-xs text-ledger-grey">
            Run Hidden Work scans, Proposal X-Ray diagnostics, or Scope Creep simulations.
          </p>
          <button
            onClick={() => onNavigate('deal-lab')}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-oxblood px-4 py-2.5 hover:bg-ledger-dark transition-colors border border-ledger-text inline-block"
          >
            Open Deal Lab →
          </button>
        </div>

        <div className="border-2 border-ledger-text p-6 bg-ledger-paper space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-oxblood font-bold block">
            03. TEMPLATES
          </span>
          <h3 className="font-serif text-2xl text-ledger-text font-bold">
            Freelance Playbook
          </h3>
          <p className="font-mono text-xs text-ledger-grey">
            Apply reusable service presets, revision policies, and scope templates.
          </p>
          <button
            onClick={() => onNavigate('playbook')}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-text bg-ledger-warm px-4 py-2.5 hover:bg-white transition-colors border border-ledger-text inline-block font-bold"
          >
            Open Playbook →
          </button>
        </div>
      </div>

      {/* Active Quote Overview Table */}
      <div className="border-2 border-ledger-text bg-ledger-cream p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-ledger-text pb-4">
          <h3 className="font-serif text-2xl text-ledger-text font-bold">
            Active Proposal Details
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey">
            Date: {formatDate(quote.date)}
          </span>
        </div>

        <div className="font-mono text-xs space-y-2">
          <div className="flex justify-between border-b border-ledger-text/20 pb-2">
            <span className="text-ledger-grey">Document ID:</span>
            <span className="font-bold">{quote.quoteNumber}</span>
          </div>
          <div className="flex justify-between border-b border-ledger-text/20 pb-2">
            <span className="text-ledger-grey">Client Name:</span>
            <span className="font-bold">{quote.clientInfo.name || 'Not Specified'}</span>
          </div>
          <div className="flex justify-between border-b border-ledger-text/20 pb-2">
            <span className="text-ledger-grey">Client Company:</span>
            <span className="font-bold">{quote.clientInfo.company || 'Not Specified'}</span>
          </div>
          <div className="flex justify-between border-b border-ledger-text/20 pb-2">
            <span className="text-ledger-grey">Payment Schedule:</span>
            <span className="font-bold">
              {quote.paymentScheduleEnabled ? `${quote.milestones.length} Milestones` : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
