'use client';

import SectionHeader from '../ui/section-header';
import MetricCard from '../ui/metric-card';
import { QuoteData } from '@/lib/types';
import { calculateGamification } from '@/lib/deal-gamification';
import { runProposalXRay } from '@/lib/xray-engine';

interface ProfileViewProps {
  quote: QuoteData;
}

export default function ProfileView({ quote }: ProfileViewProps) {
  const stats = calculateGamification(quote);
  const xray = runProposalXRay(quote);

  const xpProgress = Math.min(100, Math.round(((stats.xp % 25) / 25) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        badge="FREELANCER PROFILE & STATS"
        title="Freelancer Performance"
        subtitle="Deal intelligence level, unlocked achievements, and archetype metrics."
      />

      {/* Level & XP Banner */}
      <div className="bg-ledger-text text-ledger-cream p-6 border-2 border-ledger-text space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-ledger-accent font-bold">
              FREELANCER ARCHETYPE
            </span>
            <h3 className="font-serif text-3xl text-ledger-cream mt-1 font-bold">
              Margin Defender & Scope Protector
            </h3>
          </div>
          <div className="bg-ledger-oxblood px-4 py-2 border border-ledger-cream text-center self-start md:self-auto">
            <span className="text-[9px] uppercase tracking-widest block text-ledger-cream/80">
              Current Rank
            </span>
            <span className="font-serif text-2xl font-bold text-ledger-cream">
              Level {stats.level}
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1.5 font-mono text-xs pt-2">
          <div className="flex justify-between">
            <span className="text-[10px] uppercase text-ledger-grey">XP Progression</span>
            <span className="font-bold text-ledger-accent">{stats.xp} Total XP</span>
          </div>
          <div className="w-full bg-ledger-dark h-3 border border-ledger-grey/40 overflow-hidden">
            <div
              className="h-full bg-ledger-accent transition-all"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Proposal Health Score"
          value={`${xray.score}/100`}
          subtext="Latest Quote Diagnostic"
        />

        <MetricCard
          label="Unlocked Achievements"
          value={`${stats.achievements.filter((a) => a.unlocked).length} / ${stats.achievements.length}`}
          subtext="Badges Earned"
        />

        <MetricCard
          label="Minimum Rate Protection"
          value={quote.minimumHourlyRate > 0 ? `$${quote.minimumHourlyRate}/hr` : 'Not Set'}
          subtext="Survival Baseline Guard"
        />
      </div>

      {/* Achievements Grid */}
      <div className="border-2 border-ledger-text p-6 bg-ledger-cream space-y-4">
        <h3 className="font-serif text-2xl text-ledger-text font-bold border-b border-ledger-text pb-4">
          Unlocked Achievements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 border-2 transition-all ${
                ach.unlocked
                  ? 'bg-ledger-paper border-ledger-text text-ledger-text'
                  : 'bg-ledger-cream border-ledger-grey/40 text-ledger-grey opacity-50'
              }`}
            >
              <div className="text-2xl mb-2">{ach.icon}</div>
              <h4 className="font-serif text-lg font-bold text-ledger-text">
                {ach.title}
              </h4>
              <p className="font-mono text-xs text-ledger-grey mt-1">
                {ach.description}
              </p>
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.1em] inline-block mt-3 px-2 py-0.5 border ${
                  ach.unlocked
                    ? 'bg-ledger-text text-ledger-cream border-ledger-text'
                    : 'bg-ledger-grey/20 text-ledger-grey border-ledger-grey/30'
                }`}
              >
                {ach.unlocked ? '✓ Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
