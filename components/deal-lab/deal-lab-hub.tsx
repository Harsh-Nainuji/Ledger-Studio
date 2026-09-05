'use client';

import { useState } from 'react';
import { QuoteData } from '@/lib/types';
import HiddenWorkDetector from './hidden-work-detector';
import ProposalXRay from './proposal-xray';
import ScopeCreepSimulator from './scope-creep-simulator';
import { calculateGamification } from '@/lib/deal-gamification';

interface DealLabHubProps {
  quote: QuoteData;
  onUpdateQuote: (updates: Partial<QuoteData>) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export type DealLabTab = 'hidden-work' | 'xray' | 'simulator';

export default function DealLabHub({
  quote,
  onUpdateQuote,
  onNavigateToSection,
}: DealLabHubProps) {
  const [activeTab, setActiveTab] = useState<DealLabTab>('hidden-work');
  const [lastSimulationScore, setLastSimulationScore] = useState<number | undefined>(undefined);

  const stats = calculateGamification(
    quote,
    lastSimulationScore !== undefined,
    lastSimulationScore
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Gamification Status Bar */}
      <div className="bg-ledger-text text-ledger-cream p-6 border-2 border-ledger-text flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] bg-ledger-oxblood px-2.5 py-0.5 text-ledger-cream font-bold">
              DEAL INTELLIGENCE
            </span>
            <span className="text-[10px] uppercase tracking-[0.1em] text-ledger-accent font-bold">
              Level {stats.level} ({stats.xp} XP)
            </span>
          </div>
          <h2 className="font-serif text-3xl text-ledger-cream">
            Deal Intelligence Lab
          </h2>
        </div>

        {/* Badges / Achievements display */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {stats.achievements.map((ach) => (
            <div
              key={ach.id}
              title={`${ach.title}: ${ach.description}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs whitespace-nowrap transition-all ${
                ach.unlocked
                  ? 'bg-ledger-paper text-ledger-text border-ledger-text font-bold'
                  : 'bg-ledger-dark text-ledger-grey border-ledger-grey/40 opacity-50'
              }`}
            >
              <span>{ach.icon}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
                {ach.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap border-b border-ledger-text gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
        <button
          onClick={() => setActiveTab('hidden-work')}
          className={`px-5 py-3 border-t-2 border-x-2 transition-colors ${
            activeTab === 'hidden-work'
              ? 'bg-ledger-cream text-ledger-text border-ledger-text font-bold -mb-px border-b-ledger-cream'
              : 'bg-ledger-paper text-ledger-grey border-ledger-text/40 hover:bg-ledger-warm hover:text-ledger-text'
          }`}
        >
          1. Hidden Work Detector
        </button>

        <button
          onClick={() => setActiveTab('xray')}
          className={`px-5 py-3 border-t-2 border-x-2 transition-colors ${
            activeTab === 'xray'
              ? 'bg-ledger-cream text-ledger-text border-ledger-text font-bold -mb-px border-b-ledger-cream'
              : 'bg-ledger-paper text-ledger-grey border-ledger-text/40 hover:bg-ledger-warm hover:text-ledger-text'
          }`}
        >
          2. Proposal X-Ray
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-5 py-3 border-t-2 border-x-2 transition-colors ${
            activeTab === 'simulator'
              ? 'bg-ledger-cream text-ledger-text border-ledger-text font-bold -mb-px border-b-ledger-cream'
              : 'bg-ledger-paper text-ledger-grey border-ledger-text/40 hover:bg-ledger-warm hover:text-ledger-text'
          }`}
        >
          3. Scope Creep Simulator
        </button>
      </div>

      {/* Module Contents */}
      {activeTab === 'hidden-work' && (
        <HiddenWorkDetector quote={quote} onUpdateQuote={onUpdateQuote} />
      )}

      {activeTab === 'xray' && (
        <ProposalXRay
          quote={quote}
          onNavigateToSection={onNavigateToSection}
        />
      )}

      {activeTab === 'simulator' && (
        <ScopeCreepSimulator
          quote={quote}
          onSimulationCompleted={(score) => setLastSimulationScore(score)}
        />
      )}
    </div>
  );
}
