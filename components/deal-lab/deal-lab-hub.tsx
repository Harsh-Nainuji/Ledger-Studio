'use client';

import { useState } from 'react';
import { QuoteData } from '@/lib/types';
import HiddenWorkDetector from './hidden-work-detector';
import ProposalXRay from './proposal-xray';
import ScopeCreepSimulator from './scope-creep-simulator';
import { calculateGamification } from '@/lib/deal-gamification';
import {
  Shield,
  TrendingUp,
  MapPin,
  Building2,
  Zap,
  Search,
  Activity,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface DealLabHubProps {
  quote: QuoteData;
  onUpdateQuote: (updates: Partial<QuoteData>) => void;
  onNavigateToSection?: (sectionId: string) => void;
  initialTab?: DealLabTab;
}

export type DealLabTab = 'hidden-work' | 'xray' | 'simulator';

export default function DealLabHub({
  quote,
  onUpdateQuote,
  onNavigateToSection,
  initialTab = 'hidden-work',
}: DealLabHubProps) {
  const [activeTab, setActiveTab] = useState<DealLabTab>(initialTab);
  const [lastSimulationScore, setLastSimulationScore] = useState<number | undefined>(undefined);

  const stats = calculateGamification(
    quote,
    lastSimulationScore !== undefined,
    lastSimulationScore
  );

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="h-3.5 w-3.5 shrink-0 text-ledger-accent" />;
      case 'TrendingUp':
        return <TrendingUp className="h-3.5 w-3.5 shrink-0 text-ledger-accent" />;
      case 'MapPin':
        return <MapPin className="h-3.5 w-3.5 shrink-0 text-ledger-accent" />;
      case 'Building2':
        return <Building2 className="h-3.5 w-3.5 shrink-0 text-ledger-accent" />;
      case 'Zap':
        return <Zap className="h-3.5 w-3.5 shrink-0 text-ledger-accent" />;
      default:
        return <Shield className="h-3.5 w-3.5 shrink-0 text-ledger-accent" />;
    }
  };

  const handleBadgeClick = (achievementId: string) => {
    switch (achievementId) {
      case 'ach-scope-protector':
      case 'ach-boundary-setter':
        setActiveTab('hidden-work');
        break;
      case 'ach-margin-defender':
      case 'ach-deal-architect':
        setActiveTab('xray');
        break;
      case 'ach-creep-survivor':
        setActiveTab('simulator');
        break;
      default:
        setActiveTab('hidden-work');
    }
  };

  return (
    <div data-tour="deal-lab-hub" className="space-y-6">
      {/* Top Banner & Gamification Status Bar */}
      <div className="bg-ledger-text text-ledger-cream p-6 border-2 border-ledger-text flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-mono">
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
          <p className="font-mono text-xs text-ledger-grey pt-1">
            Click any module or achievement badge to switch tools and run diagnostics.
          </p>
        </div>

        {/* Interactive Achievement Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {stats.achievements.map((ach) => (
            <button
              key={ach.id}
              onClick={() => handleBadgeClick(ach.id)}
              title={`${ach.title}: ${ach.description} (Click to open tool)`}
              className={`flex items-center gap-2 px-3 py-2 border text-xs whitespace-nowrap transition-all cursor-pointer ${
                ach.unlocked
                  ? 'bg-ledger-paper text-ledger-text border-ledger-text font-bold hover:bg-ledger-warm'
                  : 'bg-ledger-dark text-ledger-grey border-ledger-grey/40 opacity-70 hover:opacity-100 hover:border-ledger-accent'
              }`}
            >
              {renderBadgeIcon(ach.icon)}
              <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
                {ach.title}
              </span>
              {ach.unlocked && <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs uppercase tracking-[0.1em]">
        <button
          onClick={() => setActiveTab('hidden-work')}
          className={`flex items-center justify-center gap-2 p-4 border-2 transition-all font-bold cursor-pointer ${
            activeTab === 'hidden-work'
              ? 'bg-ledger-text text-ledger-cream border-ledger-text shadow-md'
              : 'bg-ledger-paper text-ledger-text border-ledger-text/40 hover:bg-ledger-warm'
          }`}
        >
          <Search className="h-4 w-4 shrink-0" />
          <span>1. Hidden Work Detector</span>
        </button>

        <button
          onClick={() => setActiveTab('xray')}
          className={`flex items-center justify-center gap-2 p-4 border-2 transition-all font-bold cursor-pointer ${
            activeTab === 'xray'
              ? 'bg-ledger-text text-ledger-cream border-ledger-text shadow-md'
              : 'bg-ledger-paper text-ledger-text border-ledger-text/40 hover:bg-ledger-warm'
          }`}
        >
          <Activity className="h-4 w-4 shrink-0" />
          <span>2. Proposal X-Ray</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center justify-center gap-2 p-4 border-2 transition-all font-bold cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-ledger-text text-ledger-cream border-ledger-text shadow-md'
              : 'bg-ledger-paper text-ledger-text border-ledger-text/40 hover:bg-ledger-warm'
          }`}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>3. Scope Creep Simulator</span>
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
