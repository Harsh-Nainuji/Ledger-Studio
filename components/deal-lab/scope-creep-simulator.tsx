'use client';

import { useState } from 'react';
import { QuoteData } from '@/lib/types';
import { calculateGrandTotal, formatCurrency } from '@/lib/quote-utils';
import {
  SCOPE_CREEP_SCENARIOS,
  evaluateSimulation,
  SimulationResult,
} from '@/lib/scope-creep-scenarios';

interface ScopeCreepSimulatorProps {
  quote: QuoteData;
  onSimulationCompleted?: (score: number) => void;
}

export default function ScopeCreepSimulator({
  quote,
  onSimulationCompleted,
}: ScopeCreepSimulatorProps) {
  const originalPrice = calculateGrandTotal(
    quote.lineItems,
    quote.taxRate,
    quote.discountAmount
  );

  const originalHours = quote.lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHours, setCurrentHours] = useState(originalHours);
  const [currentPrice, setCurrentPrice] = useState(originalPrice);

  const [decisions, setDecisions] = useState<
    { scenarioId: string; decision: 'accept' | 'charge' | 'reduce' | 'reject' }[]
  >([]);

  const [completedResult, setCompletedResult] = useState<SimulationResult | null>(null);

  const activeScenario = SCOPE_CREEP_SCENARIOS[currentIndex];

  const handleDecision = (choice: 'accept' | 'charge' | 'reduce' | 'reject') => {
    let newHours = currentHours;
    let newPrice = currentPrice;

    if (choice === 'accept') {
      newHours += activeScenario.addedHours;
    } else if (choice === 'charge') {
      newHours += activeScenario.addedHours;
      newPrice += activeScenario.suggestedExtraCost;
    } else if (choice === 'reduce') {
      newPrice += Math.round(activeScenario.suggestedExtraCost * 0.5);
    }

    setCurrentHours(newHours);
    setCurrentPrice(newPrice);

    const nextDecisions = [
      ...decisions,
      { scenarioId: activeScenario.id, decision: choice },
    ];
    setDecisions(nextDecisions);

    if (currentIndex + 1 < SCOPE_CREEP_SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const result = evaluateSimulation(
        originalHours,
        originalPrice,
        newHours,
        newPrice,
        nextDecisions,
        quote.minimumHourlyRate
      );
      setCompletedResult(result);
      if (onSimulationCompleted) {
        onSimulationCompleted(result.finalScore);
      }
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setCurrentHours(originalHours);
    setCurrentPrice(originalPrice);
    setDecisions([]);
    setCompletedResult(null);
  };

  const creepPercent =
    originalHours > 0
      ? Math.max(0, Math.round(((currentHours - originalHours) / originalHours) * 100))
      : 0;

  const effectiveRate = currentHours > 0 ? currentPrice / currentHours : 0;

  return (
    <div className="bg-ledger-paper border-2 border-ledger-text p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ledger-text pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-cream bg-ledger-oxblood px-2.5 py-0.5 font-bold">
              SIMULATOR MODULE
            </span>
            <h2 className="font-serif text-3xl text-ledger-text">
              Scope Creep Simulator
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mt-2">
            Simulate realistic client pushback & scope changes to test your negotiation discipline.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-cream text-ledger-text border border-ledger-text px-4 py-2.5 hover:bg-ledger-warm transition-colors self-start md:self-auto"
        >
          Reset Simulation
        </button>
      </div>

      {/* Live Mutation Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-ledger-cream p-6 border-2 border-ledger-text">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey block font-bold">
            ORIGINAL QUOTE BENCHMARK
          </span>
          <div className="mt-3 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between border-b border-ledger-text/20 pb-1">
              <span>Price:</span>
              <span className="font-bold">{formatCurrency(originalPrice, quote.currencyCode)}</span>
            </div>
            <div className="flex justify-between border-b border-ledger-text/20 pb-1">
              <span>Workload:</span>
              <span className="font-bold">{originalHours} hrs</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Effective Rate:</span>
              <span className="font-bold">
                {formatCurrency(originalHours > 0 ? originalPrice / originalHours : 0, quote.currencyCode)}/hr
              </span>
            </div>
          </div>
        </div>

        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-oxblood block font-bold">
            MUTATED PROJECT STATE
          </span>
          <div className="mt-3 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between border-b border-ledger-text/20 pb-1">
              <span>Current Price:</span>
              <span className="font-bold">{formatCurrency(currentPrice, quote.currencyCode)}</span>
            </div>
            <div className="flex justify-between border-b border-ledger-text/20 pb-1">
              <span>Current Workload:</span>
              <span className="font-bold text-ledger-oxblood">{currentHours} hrs</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Current Effective Rate:</span>
              <span
                className={`font-bold ${
                  quote.minimumHourlyRate > 0 && effectiveRate < quote.minimumHourlyRate
                    ? 'text-ledger-oxblood'
                    : 'text-ledger-text'
                }`}
              >
                {formatCurrency(effectiveRate, quote.currencyCode)}/hr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scope Creep Meter */}
      <div className="space-y-2 bg-ledger-warm p-4 border border-ledger-text">
        <div className="flex justify-between font-mono text-xs">
          <span className="uppercase tracking-[0.1em] text-ledger-text font-bold">
            Scope Creep Meter
          </span>
          <span className="font-bold">
            +{creepPercent}% Growth
          </span>
        </div>
        <div className="w-full bg-ledger-cream h-4 border border-ledger-text overflow-hidden">
          <div
            className="h-full bg-ledger-oxblood transition-all duration-500"
            style={{ width: `${Math.min(100, creepPercent)}%` }}
          />
        </div>
      </div>

      {/* Simulation Active Step or Completed Report */}
      {!completedResult ? (
        <div className="border-2 border-ledger-text p-6 bg-ledger-cream space-y-6">
          <div className="flex justify-between items-center border-b border-ledger-text/30 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey font-bold">
              SCENARIO {currentIndex + 1} OF {SCOPE_CREEP_SCENARIOS.length}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] bg-ledger-warm border border-ledger-text px-2 py-0.5 text-ledger-text">
              {activeScenario.category}
            </span>
          </div>

          {/* Client Speech Bubble */}
          <div className="bg-ledger-paper border-l-4 border-ledger-oxblood p-4 font-serif italic text-lg text-ledger-text border-y border-r border-ledger-text/30">
            {activeScenario.clientMessage}
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-xl text-ledger-text font-bold">
              {activeScenario.requestTitle}
            </h3>
            <p className="font-mono text-xs text-ledger-grey">
              {activeScenario.requestDescription}
            </p>
            <p className="font-mono text-xs text-ledger-oxblood font-semibold mt-2">
              Impact: {activeScenario.impactNote} (Suggested Extra Cost: {formatCurrency(activeScenario.suggestedExtraCost, quote.currencyCode)})
            </p>
          </div>

          {/* Decision Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-ledger-text/30 font-mono text-xs">
            <button
              onClick={() => handleDecision('accept')}
              className="p-4 bg-ledger-paper text-ledger-text border border-ledger-text hover:bg-ledger-warm transition-colors text-left"
            >
              <span className="block font-bold text-xs uppercase tracking-[0.08em]">Accept (Unpaid)</span>
              <span className="text-[10px] text-ledger-grey block mt-1">
                + {activeScenario.addedHours} hrs | +{quote.currencyCode} 0
              </span>
            </button>

            <button
              onClick={() => handleDecision('charge')}
              className="p-4 bg-ledger-text text-ledger-cream border border-ledger-text hover:bg-ledger-dark transition-colors text-left"
            >
              <span className="block font-bold text-xs uppercase tracking-[0.08em]">Charge Extra</span>
              <span className="text-[10px] text-ledger-accent block mt-1">
                + {activeScenario.addedHours} hrs | +{formatCurrency(activeScenario.suggestedExtraCost, quote.currencyCode)}
              </span>
            </button>

            <button
              onClick={() => handleDecision('reduce')}
              className="p-4 bg-ledger-warm text-ledger-text border border-ledger-text hover:bg-ledger-paper transition-colors text-left"
            >
              <span className="block font-bold text-xs uppercase tracking-[0.08em]">Swap Scope</span>
              <span className="text-[10px] text-ledger-text block mt-1">
                Net 0 hrs | +{formatCurrency(Math.round(activeScenario.suggestedExtraCost * 0.5), quote.currencyCode)}
              </span>
            </button>

            <button
              onClick={() => handleDecision('reject')}
              className="p-4 bg-ledger-oxblood text-ledger-cream border border-ledger-text hover:bg-ledger-dark transition-colors text-left"
            >
              <span className="block font-bold text-xs uppercase tracking-[0.08em]">Protect Scope</span>
              <span className="text-[10px] text-ledger-cream/80 block mt-1">
                Reject request | Maintain deal
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* End-of-Simulation Report Card */
        <div className="border-2 border-ledger-text p-6 bg-ledger-warm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ledger-text pb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-cream bg-ledger-text px-2.5 py-0.5 font-bold">
                SIMULATION COMPLETE
              </span>
              <h3 className="font-serif text-3xl text-ledger-text mt-2">
                Deal Performance Report
              </h3>
            </div>
            <div className="text-right bg-ledger-cream p-4 border-2 border-ledger-text">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey block">
                Final Score
              </span>
              <span className="font-serif text-4xl font-bold text-ledger-text">
                {completedResult.finalScore}
                <span className="text-xs font-mono font-normal">/100</span>
              </span>
            </div>
          </div>

          <p className="font-mono text-xs text-ledger-text bg-ledger-cream p-4 border border-ledger-text italic">
            "{completedResult.summary}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-ledger-cream p-4 border border-ledger-text">
              <span className="text-ledger-grey text-[10px] uppercase tracking-[0.1em] block">
                Scope Protection
              </span>
              <span className="text-2xl font-bold text-ledger-text">{completedResult.scopeProtectionScore}/100</span>
            </div>
            <div className="bg-ledger-cream p-4 border border-ledger-text">
              <span className="text-ledger-grey text-[10px] uppercase tracking-[0.1em] block">
                Pricing Discipline
              </span>
              <span className="text-2xl font-bold text-ledger-text">{completedResult.pricingDisciplineScore}/100</span>
            </div>
            <div className="bg-ledger-cream p-4 border border-ledger-text">
              <span className="text-ledger-grey text-[10px] uppercase tracking-[0.1em] block">
                Negotiation Score
              </span>
              <span className="text-2xl font-bold text-ledger-text">{completedResult.negotiationScore}/100</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-text text-ledger-cream px-6 py-4 hover:bg-ledger-dark transition-colors w-full md:w-auto"
          >
            Run Another Simulation
          </button>
        </div>
      )}
    </div>
  );
}
