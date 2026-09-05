'use client';

import { QuoteData, SenderInfo } from '@/lib/types';
import { runProposalXRay } from '@/lib/xray-engine';
import { detectHiddenWork } from '@/lib/hidden-work-rules';
import PreviewExportButton from '@/components/preview/preview-export-button';

interface ContextualBarProps {
  quote: QuoteData;
  senderInfo: SenderInfo;
  onOpenDealLabTab: (tab: 'hidden-work' | 'xray' | 'simulator') => void;
}

export default function ContextualBar({
  quote,
  senderInfo,
  onOpenDealLabTab,
}: ContextualBarProps) {
  const xray = runProposalXRay(quote);
  const hiddenTasks = detectHiddenWork(quote);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-ledger-text text-ledger-cream border-t-2 border-ledger-text p-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Contextual Intelligence Summary Alerts */}
        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-ledger-grey">
              Proposal Health:
            </span>
            <span className="font-bold text-ledger-accent">{xray.score}/100</span>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-ledger-grey">
              Unpriced Hidden Work:
            </span>
            <span className="font-bold text-ledger-oxblood bg-ledger-cream px-1.5 py-0.5 text-[10px]">
              {hiddenTasks.length} Tasks Detected
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onOpenDealLabTab('hidden-work')}
            className="font-mono text-[9px] uppercase tracking-[0.1em] bg-ledger-paper text-ledger-text px-3 py-2 border border-ledger-text hover:bg-ledger-warm transition-colors"
          >
            Hidden Work ({hiddenTasks.length})
          </button>

          <button
            onClick={() => onOpenDealLabTab('xray')}
            className="font-mono text-[9px] uppercase tracking-[0.1em] bg-ledger-paper text-ledger-text px-3 py-2 border border-ledger-text hover:bg-ledger-warm transition-colors"
          >
            X-Ray Diagnostics
          </button>

          <button
            onClick={() => onOpenDealLabTab('simulator')}
            className="font-mono text-[9px] uppercase tracking-[0.1em] bg-ledger-paper text-ledger-text px-3 py-2 border border-ledger-text hover:bg-ledger-warm transition-colors"
          >
            Simulator
          </button>

          <PreviewExportButton quote={quote} senderInfo={senderInfo} />
        </div>
      </div>
    </div>
  );
}
