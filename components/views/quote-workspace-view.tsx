'use client';

import { useState } from 'react';
import { QuoteData, SenderInfo, ClientInfo, FreelancerSettings } from '@/lib/types';
import QuoteMetadataEditor from '../forms/quote-metadata-editor';
import CurrencySelector from '../forms/currency-selector';
import SenderInfoForm from '../forms/sender-info-form';
import ClientInfoForm from '../forms/client-info-form';
import LineItemsEditor from '../forms/line-items-editor';
import TaxAndDiscountEditor from '../forms/tax-discount-editor';
import PrivateRatePanel from '../forms/private-rate-panel';
import FreelancerBaselinePanel from '../forms/freelancer-baseline-panel';
import PaymentScheduleEditor from '../forms/payment-schedule-editor';
import ScopeOfWorkEditor from '../forms/scope-of-work-editor';
import LivePreview from '../preview/live-preview';
import PreviewExportButton from '../preview/preview-export-button';
import ContextualBar from '../navigation/contextual-bar';

interface QuoteWorkspaceViewProps {
  quote: QuoteData;
  senderInfo: SenderInfo;
  freelancerSettings: FreelancerSettings;
  grandTotal: number;
  milestonesValid: boolean;
  effectiveHourlyRate: number;
  calculatedMinimumRate: number;
  onUpdateQuote: (updates: Partial<QuoteData>) => void;
  onUpdateSenderInfo: (updates: Partial<SenderInfo>) => void;
  onUpdateClientInfo: (updates: Partial<ClientInfo>) => void;
  onUpdateFreelancerSettings: (settings: FreelancerSettings) => void;
  onApplyBaselineRate: () => void;
  onOpenDealLabTab: (tab: 'hidden-work' | 'xray' | 'simulator') => void;
}

export default function QuoteWorkspaceView({
  quote,
  senderInfo,
  freelancerSettings,
  grandTotal,
  milestonesValid,
  effectiveHourlyRate,
  calculatedMinimumRate,
  onUpdateQuote,
  onUpdateSenderInfo,
  onUpdateClientInfo,
  onUpdateFreelancerSettings,
  onApplyBaselineRate,
  onOpenDealLabTab,
}: QuoteWorkspaceViewProps) {
  const [mobileTab, setMobileTab] = useState<'builder' | 'preview'>('builder');

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Mobile Workspace Mode Switcher */}
      <div className="md:hidden flex border-2 border-ledger-text bg-ledger-paper font-mono text-xs uppercase tracking-wider mb-4">
        <button
          onClick={() => setMobileTab('builder')}
          className={`flex-1 py-3 border-r border-ledger-text text-center transition-colors ${
            mobileTab === 'builder'
              ? 'bg-ledger-text text-ledger-cream font-bold'
              : 'bg-ledger-paper text-ledger-text'
          }`}
        >
          Quote Builder
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-center transition-colors ${
            mobileTab === 'preview'
              ? 'bg-ledger-text text-ledger-cream font-bold'
              : 'bg-ledger-paper text-ledger-text'
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Builder */}
        <div
          className={`lg:col-span-7 space-y-8 ${
            mobileTab === 'preview' ? 'hidden md:block' : 'block'
          }`}
        >
          <section id="metadata-editor" className="bg-ledger-paper p-6 border-2 border-ledger-text space-y-4">
            <h3 className="font-serif text-2xl text-ledger-text font-bold">
              01. Document Metadata
            </h3>
            <QuoteMetadataEditor quote={quote} onUpdate={onUpdateQuote} />
            <div className="mt-4 max-w-xs">
              <CurrencySelector
                currencyCode={quote.currencyCode}
                onChange={(currencyCode) => onUpdateQuote({ currencyCode })}
              />
            </div>
          </section>

          <section id="parties-section" data-tour="client-section" className="bg-ledger-paper p-6 border-2 border-ledger-text space-y-6">
            <h3 className="font-serif text-2xl text-ledger-text font-bold">
              02. Parties
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <SenderInfoForm senderInfo={senderInfo} onUpdate={onUpdateSenderInfo} />
              <ClientInfoForm clientInfo={quote.clientInfo} onUpdate={onUpdateClientInfo} />
            </div>
          </section>

          <section id="services-pricing" data-tour="services-section" className="bg-ledger-paper p-6 border-2 border-ledger-text space-y-6">
            <h3 className="font-serif text-2xl text-ledger-text font-bold">
              03. Services & Line Items
            </h3>
            <LineItemsEditor
              lineItems={quote.lineItems}
              onUpdate={(lineItems) => onUpdateQuote({ lineItems })}
              minimumHourlyRate={quote.minimumHourlyRate}
              currencyCode={quote.currencyCode}
              grandTotal={grandTotal}
              onScopeUpdate={(scopeOfWork: string) => onUpdateQuote({ scopeOfWork })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-ledger-text/30">
              <TaxAndDiscountEditor
                taxRate={quote.taxRate}
                discountAmount={quote.discountAmount}
                onTaxUpdate={(taxRate) => onUpdateQuote({ taxRate })}
                onDiscountUpdate={(discountAmount) => onUpdateQuote({ discountAmount })}
                currencyCode={quote.currencyCode}
              />
              <PrivateRatePanel
                minimumHourlyRate={quote.minimumHourlyRate}
                onUpdate={(minimumHourlyRate) => onUpdateQuote({ minimumHourlyRate })}
                lineItems={quote.lineItems}
                currencyCode={quote.currencyCode}
              />
            </div>
            <div className="pt-4 border-t border-ledger-text/30">
              <FreelancerBaselinePanel
                settings={freelancerSettings}
                onUpdate={onUpdateFreelancerSettings}
                onApply={onApplyBaselineRate}
                calculatedRate={calculatedMinimumRate}
              />
            </div>
          </section>

          <section id="payment-schedule" data-tour="payment-section" className="bg-ledger-paper p-6 border-2 border-ledger-text space-y-4">
            <h3 className="font-serif text-2xl text-ledger-text font-bold">
              04. Payment Schedule
            </h3>
            <PaymentScheduleEditor
              enabled={quote.paymentScheduleEnabled}
              onToggle={(paymentScheduleEnabled) => onUpdateQuote({ paymentScheduleEnabled })}
              milestones={quote.milestones}
              onUpdate={(milestones) => onUpdateQuote({ milestones })}
              grandTotal={grandTotal}
              currencyCode={quote.currencyCode}
            />
          </section>

          <section id="scope-terms" data-tour="scope-section" className="bg-ledger-paper p-6 border-2 border-ledger-text space-y-4">
            <h3 className="font-serif text-2xl text-ledger-text font-bold">
              05. Scope of Work & Terms
            </h3>
            <ScopeOfWorkEditor
              scopeOfWork={quote.scopeOfWork}
              notesAndTerms={quote.notesAndTerms}
              onScopeUpdate={(scopeOfWork) => onUpdateQuote({ scopeOfWork })}
              onNotesUpdate={(notesAndTerms) => onUpdateQuote({ notesAndTerms })}
            />
          </section>
        </div>

        {/* Right Column: Sticky Live Preview */}
        <div
          data-tour="preview-section"
          className={`lg:col-span-5 lg:sticky lg:top-20 ${
            mobileTab === 'builder' ? 'hidden md:block' : 'block'
          }`}
        >
          <div className="bg-ledger-paper border-2 border-ledger-text p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-ledger-text pb-4">
              <h3 className="font-serif text-2xl text-ledger-text font-bold">
                Live Document Preview
              </h3>
              <PreviewExportButton quote={quote} senderInfo={senderInfo} />
            </div>

            <div className="overflow-x-auto">
              <LivePreview
                quote={quote}
                senderInfo={senderInfo}
                milestonesValid={milestonesValid}
                effectiveHourlyRate={effectiveHourlyRate}
                minimumHourlyRate={quote.minimumHourlyRate}
                currencyCode={quote.currencyCode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Contextual Bar */}
      <ContextualBar
        quote={quote}
        senderInfo={senderInfo}
        onOpenDealLabTab={onOpenDealLabTab}
      />
    </div>
  );
}
