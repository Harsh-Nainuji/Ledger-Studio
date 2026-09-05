'use client';

import { useState } from 'react';
import SectionHeader from '../ui/section-header';
import { QuoteData, LineItem } from '@/lib/types';

interface PlaybookViewProps {
  quote: QuoteData;
  onUpdateQuote: (updates: Partial<QuoteData>) => void;
  onNavigateToQuotes: () => void;
}

export default function PlaybookView({
  quote,
  onUpdateQuote,
  onNavigateToQuotes,
}: PlaybookViewProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'templates' | 'terms'>('presets');

  const presets = [
    { title: 'UI/UX Web Design', description: 'Figma wireframes, high-fidelity UI comps, and design token handoff.', hours: 25, rate: 120 },
    { title: 'Next.js Frontend Engineering', description: 'Responsive React components, Tailwind styling, and page routing.', hours: 40, rate: 140 },
    { title: 'Cross-Browser QA & Testing', description: 'Verification across Mobile Safari, Chrome, Firefox, and Edge viewports.', hours: 10, rate: 90 },
    { title: 'Deployment & Domain Setup', description: 'Hosting pipeline, SSL configuration, DNS records, and analytics tags.', hours: 8, rate: 110 },
    { title: 'Consolidated Revision Buffer', description: 'Allocated structured time for handling consolidated client feedback.', hours: 12, rate: 100 },
  ];

  const scopeTemplates = [
    {
      title: 'Full-Stack Web Development Scope',
      content:
        'Project includes full responsive frontend development using React & Next.js, component architecture, mobile viewport optimization, basic SEO metadata configuration, and deployment on production servers. Excludes copy writing and third-party API subscription fees.',
    },
    {
      title: 'E-Commerce Storefront Scope',
      content:
        'Project includes catalog layout, cart state management, checkout flow integration, Stripe sandbox payment testing, and transactional order notification email templates. Excludes manual product data entry exceeding 20 items.',
    },
  ];

  const termsTemplates = [
    {
      title: 'Standard 2-Round Revision Term',
      content:
        'Price includes up to two (2) consolidated rounds of revisions. Additional revision requests beyond these rounds will be billed at the standard rate of $120/hr.',
    },
    {
      title: 'Client Prerequisites & Asset Delay Clause',
      content:
        'Client is responsible for providing all branding assets, final copy, and credentials prior to kickoff. Delays in client feedback or asset delivery exceeding 5 business days will adjust the target delivery schedule accordingly.',
    },
  ];

  const handleApplyPreset = (preset: { title: string; description: string; hours: number; rate: number }) => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: `${preset.title} (${preset.description})`,
      quantity: preset.hours,
      rate: preset.rate,
    };
    onUpdateQuote({ lineItems: [...quote.lineItems, newItem] });
    onNavigateToQuotes();
  };

  const handleApplyScope = (text: string) => {
    onUpdateQuote({ scopeOfWork: text });
    onNavigateToQuotes();
  };

  const handleApplyTerms = (text: string) => {
    onUpdateQuote({ notesAndTerms: text });
    onNavigateToQuotes();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        badge="FREELANCE OPERATING SYSTEM"
        title="Freelance Playbook"
        subtitle="Reusable service presets, scope templates, and contractual revision policies."
      />

      {/* Tabs */}
      <div className="flex border-b-2 border-ledger-text gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-5 py-3 border-t-2 border-x-2 transition-colors ${
            activeTab === 'presets'
              ? 'bg-ledger-cream text-ledger-text border-ledger-text font-bold -mb-px border-b-ledger-cream'
              : 'bg-ledger-paper text-ledger-grey border-ledger-text/40 hover:bg-ledger-warm'
          }`}
        >
          Service Presets
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-5 py-3 border-t-2 border-x-2 transition-colors ${
            activeTab === 'templates'
              ? 'bg-ledger-cream text-ledger-text border-ledger-text font-bold -mb-px border-b-ledger-cream'
              : 'bg-ledger-paper text-ledger-grey border-ledger-text/40 hover:bg-ledger-warm'
          }`}
        >
          Scope Templates
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-5 py-3 border-t-2 border-x-2 transition-colors ${
            activeTab === 'terms'
              ? 'bg-ledger-cream text-ledger-text border-ledger-text font-bold -mb-px border-b-ledger-cream'
              : 'bg-ledger-paper text-ledger-grey border-ledger-text/40 hover:bg-ledger-warm'
          }`}
        >
          Revision Policies
        </button>
      </div>

      {/* Tab 1: Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          {presets.map((preset, i) => (
            <div
              key={i}
              className="border-2 border-ledger-text p-6 bg-ledger-cream flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <h3 className="font-serif text-xl text-ledger-text font-bold">
                  {preset.title}
                </h3>
                <p className="font-mono text-xs text-ledger-grey">
                  {preset.description}
                </p>
                <span className="font-mono text-[11px] font-bold text-ledger-text inline-block mt-1">
                  Default: {preset.hours} hrs @ ${preset.rate}/hr
                </span>
              </div>

              <button
                onClick={() => handleApplyPreset(preset)}
                className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-text text-ledger-cream px-5 py-3 hover:bg-ledger-dark border border-ledger-text self-start md:self-auto shrink-0"
              >
                + Add to Active Quote
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Scope Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {scopeTemplates.map((tmpl, i) => (
            <div key={i} className="border-2 border-ledger-text p-6 bg-ledger-cream space-y-3">
              <h3 className="font-serif text-xl text-ledger-text font-bold">
                {tmpl.title}
              </h3>
              <p className="font-mono text-xs text-ledger-text bg-ledger-paper p-4 border border-ledger-text/30 leading-relaxed">
                {tmpl.content}
              </p>
              <button
                onClick={() => handleApplyScope(tmpl.content)}
                className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-oxblood text-ledger-cream px-5 py-2.5 hover:bg-ledger-dark border border-ledger-text inline-block"
              >
                Apply Scope to Quote →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Terms Templates */}
      {activeTab === 'terms' && (
        <div className="space-y-4">
          {termsTemplates.map((term, i) => (
            <div key={i} className="border-2 border-ledger-text p-6 bg-ledger-cream space-y-3">
              <h3 className="font-serif text-xl text-ledger-text font-bold">
                {term.title}
              </h3>
              <p className="font-mono text-xs text-ledger-text bg-ledger-paper p-4 border border-ledger-text/30 leading-relaxed">
                {term.content}
              </p>
              <button
                onClick={() => handleApplyTerms(term.content)}
                className="font-mono text-[10px] uppercase tracking-[0.1em] bg-ledger-text text-ledger-cream px-5 py-2.5 hover:bg-ledger-dark border border-ledger-text inline-block"
              >
                Apply Terms to Quote →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
