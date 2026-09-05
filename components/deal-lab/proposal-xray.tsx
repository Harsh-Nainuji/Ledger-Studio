'use client';

import { useState } from 'react';
import { QuoteData, DiagnosticSeverity } from '@/lib/types';
import { runProposalXRay } from '@/lib/xray-engine';

interface ProposalXRayProps {
  quote: QuoteData;
  onNavigateToSection?: (sectionId: string) => void;
}

export default function ProposalXRay({
  quote,
  onNavigateToSection,
}: ProposalXRayProps) {
  const [filterSeverity, setFilterSeverity] = useState<DiagnosticSeverity | 'all'>('all');

  const report = runProposalXRay(quote);

  const filteredDiagnostics =
    filterSeverity === 'all'
      ? report.diagnostics
      : report.diagnostics.filter((d) => d.severity === filterSeverity);

  const getSeverityBadge = (severity: DiagnosticSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 font-bold bg-ledger-oxblood text-ledger-cream border border-ledger-text">
            CRITICAL RISK
          </span>
        );
      case 'warning':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 font-bold bg-ledger-accent text-ledger-dark border border-ledger-text">
            WARNING
          </span>
        );
      case 'suggestion':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 font-bold bg-ledger-warm text-ledger-text border border-ledger-text">
            SUGGESTION
          </span>
        );
      case 'strong':
        return (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] px-2.5 py-0.5 font-bold bg-ledger-paper text-ledger-text border border-ledger-text">
            STRONG
          </span>
        );
    }
  };

  return (
    <div className="bg-ledger-paper border-2 border-ledger-text p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ledger-text pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-cream bg-ledger-text px-2.5 py-0.5 font-bold">
              PRE-FLIGHT DIAGNOSTICS
            </span>
            <h2 className="font-serif text-3xl text-ledger-text">
              Proposal X-Ray
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mt-2">
            Automated inspection detecting contract weaknesses, revision traps, and pricing risks before sending.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="flex items-center gap-4 bg-ledger-cream p-4 border-2 border-ledger-text self-start md:self-auto">
          <div className="text-right">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey block">
              PROPOSAL HEALTH
            </span>
            <span className="font-mono text-xs font-bold text-ledger-text">
              Overall Score
            </span>
          </div>
          <div className="font-serif text-4xl font-bold px-4 py-2 border-2 border-ledger-text bg-ledger-paper text-ledger-text">
            {report.score}
            <span className="text-xs text-ledger-grey font-mono font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 bg-ledger-cream p-4 border border-ledger-text font-mono text-[11px]">
        {Object.entries(report.categoryScores).map(([cat, score]) => (
          <div key={cat} className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-[0.1em] text-ledger-grey block truncate">
              {cat}
            </span>
            <div className="w-full bg-ledger-warm h-2.5 border border-ledger-text">
              <div
                className="h-full bg-ledger-text transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="font-bold text-ledger-text">{score}%</span>
          </div>
        ))}
      </div>

      {/* Diagnostic Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-serif text-2xl text-ledger-text">
          Diagnostic Audit Log ({filteredDiagnostics.length} Items)
        </h3>

        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em]">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-2 border border-ledger-text transition-colors ${
              filterSeverity === 'all'
                ? 'bg-ledger-text text-ledger-cream font-bold'
                : 'bg-ledger-paper text-ledger-text hover:bg-ledger-warm'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`px-3 py-2 border border-ledger-text transition-colors ${
              filterSeverity === 'critical'
                ? 'bg-ledger-oxblood text-ledger-cream font-bold'
                : 'bg-ledger-paper text-ledger-text hover:bg-ledger-warm'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-3 py-2 border border-ledger-text transition-colors ${
              filterSeverity === 'warning'
                ? 'bg-ledger-accent text-ledger-dark font-bold'
                : 'bg-ledger-paper text-ledger-text hover:bg-ledger-warm'
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilterSeverity('suggestion')}
            className={`px-3 py-2 border border-ledger-text transition-colors ${
              filterSeverity === 'suggestion'
                ? 'bg-ledger-warm text-ledger-text font-bold'
                : 'bg-ledger-paper text-ledger-text hover:bg-ledger-warm'
            }`}
          >
            Suggestions
          </button>
        </div>
      </div>

      {/* Diagnostics List */}
      <div className="space-y-4">
        {filteredDiagnostics.length === 0 ? (
          <p className="font-mono text-xs text-ledger-grey italic">
            No diagnostic items match the selected severity filter.
          </p>
        ) : (
          filteredDiagnostics.map((diag) => (
            <div
              key={diag.id}
              className="border border-ledger-text p-5 bg-ledger-cream flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(diag.severity)}
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey">
                    [{diag.category}]
                  </span>
                  <h4 className="font-serif text-lg text-ledger-text font-bold">
                    {diag.title}
                  </h4>
                </div>
                <p className="font-mono text-xs text-ledger-text">
                  {diag.message}
                </p>
                <p className="font-mono text-[11px] text-ledger-grey italic">
                  Why it matters: {diag.whyItMatters}
                </p>
              </div>

              {diag.fixActionLabel && diag.fixTargetSection && (
                <button
                  onClick={() =>
                    onNavigateToSection &&
                    onNavigateToSection(diag.fixTargetSection!)
                  }
                  className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-oxblood text-ledger-cream px-5 py-3 hover:bg-ledger-dark transition-colors self-start md:self-auto shrink-0 border border-ledger-text"
                >
                  Fix This →
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
