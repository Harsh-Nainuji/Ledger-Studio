'use client';

import { useState, useEffect } from 'react';
import { QuoteData, SenderInfo, ClientInfo, FreelancerSettings } from '@/lib/types';
import { createEmptyQuote } from '@/lib/quote-utils';
import SenderInfoForm from './forms/sender-info-form';
import ClientInfoForm from './forms/client-info-form';
import LineItemsEditor from './forms/line-items-editor';
import TaxAndDiscountEditor from './forms/tax-discount-editor';
import QuoteMetadataEditor from './forms/quote-metadata-editor';
import ScopeOfWorkEditor from './forms/scope-of-work-editor';
import PrivateRatePanel from './forms/private-rate-panel';
import CurrencySelector from './forms/currency-selector';
import PaymentScheduleEditor from './forms/payment-schedule-editor';
import FreelancerBaselinePanel from './forms/freelancer-baseline-panel';
import LivePreview from './preview/live-preview';
import PreviewExportButton from './preview/preview-export-button';
import DataAudit from './data-audit';
import HowItWorks from './how-it-works';
import WelcomeScreen from './welcome-screen';
import Footer from './footer';
import { calculateGrandTotal } from '@/lib/quote-utils';
import { validateMilestones } from '@/lib/validateMilestones';

const DEFAULT_FREELANCER_SETTINGS: FreelancerSettings = {
  monthlySurvivalExpense: 4000,
  desiredMonthlyHours: 160,
};

export default function QuoteGenerator() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [senderInfo, setSenderInfo] = useState<SenderInfo | null>(null);
  const [showNewQuoteConfirm, setShowNewQuoteConfirm] = useState(false);
  const [freelancerSettings, setFreelancerSettings] = useState<FreelancerSettings>(
    DEFAULT_FREELANCER_SETTINGS
  );

  const grandTotal = quote
    ? calculateGrandTotal(quote.lineItems, quote.taxRate, quote.discountAmount)
    : 0;
  const milestoneValidation = quote ? validateMilestones(quote.milestones) : null;
  const milestonesValid = !quote?.paymentScheduleEnabled || (milestoneValidation?.isValid ?? false);

  const totalEstimatedHours = quote
    ? quote.lineItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const effectiveHourlyRate =
    totalEstimatedHours > 0 ? grandTotal / totalEstimatedHours : 0;
  const calculatedMinimumRate =
    freelancerSettings.desiredMonthlyHours > 0
      ? freelancerSettings.monthlySurvivalExpense / freelancerSettings.desiredMonthlyHours
      : 0;

  useEffect(() => {
    try {
      const savedQuote = localStorage.getItem('currentQuote');
      const savedSender = localStorage.getItem('senderInfo');
      const savedFreelancerSettings = localStorage.getItem('freelancerSettings');

      if (savedSender) {
        setSenderInfo(JSON.parse(savedSender));
      } else {
        setSenderInfo({
          name: '',
          email: '',
          phone: '',
          company: '',
          address: '',
          logo: '',
        });
      }

      if (savedFreelancerSettings) {
        setFreelancerSettings(JSON.parse(savedFreelancerSettings));
      }

      if (savedQuote) {
        const parsed = JSON.parse(savedQuote);
        if (!parsed.currencyCode) parsed.currencyCode = 'USD';
        if (typeof parsed.paymentScheduleEnabled !== 'boolean') parsed.paymentScheduleEnabled = false;
        if (typeof parsed.urgencyEnabled !== 'boolean') parsed.urgencyEnabled = false;
        if (!Array.isArray(parsed.milestones)) parsed.milestones = [];
        if (!parsed.senderInfo?.logo) parsed.senderInfo = { ...parsed.senderInfo, logo: '' };
        if (!parsed.clientInfo?.logo) parsed.clientInfo = { ...parsed.clientInfo, logo: '' };
        setQuote(parsed);
      } else {
        setQuote(createEmptyQuote());
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setSenderInfo({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        logo: '',
      });
      setQuote(createEmptyQuote());
    }
  }, []);

  useEffect(() => {
    if (quote) {
      localStorage.setItem('currentQuote', JSON.stringify(quote));
    }
  }, [quote]);

  useEffect(() => {
    if (senderInfo) {
      localStorage.setItem('senderInfo', JSON.stringify(senderInfo));
    }
  }, [senderInfo]);

  useEffect(() => {
    localStorage.setItem('freelancerSettings', JSON.stringify(freelancerSettings));
  }, [freelancerSettings]);

  const handleNewQuote = () => {
    const newQuote = createEmptyQuote();
    if (quote) {
      newQuote.currencyCode = quote.currencyCode;
    }
    setQuote(newQuote);
    setShowNewQuoteConfirm(false);
  };

  const updateQuote = (updates: Partial<QuoteData>) => {
    if (quote) {
      setQuote({ ...quote, ...updates });
    }
  };

  const updateSenderInfo = (updates: Partial<SenderInfo>) => {
    if (senderInfo) {
      setSenderInfo({ ...senderInfo, ...updates });
      updateQuote({ senderInfo: { ...senderInfo, ...updates } });
    }
  };

  const updateClientInfo = (updates: Partial<ClientInfo>) => {
    if (quote) {
      updateQuote({ clientInfo: { ...quote.clientInfo, ...updates } });
    }
  };

  const applyBaselineRate = () => {
    if (quote) {
      const rate =
        freelancerSettings.desiredMonthlyHours > 0
          ? freelancerSettings.monthlySurvivalExpense / freelancerSettings.desiredMonthlyHours
          : 0;
      updateQuote({ minimumHourlyRate: rate });
    }
  };

  if (!quote || !senderInfo) {
    return <div className="font-mono text-sm text-ledger-text text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-ledger-cream">
      <WelcomeScreen />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Ledger Studio Logo" className="h-12 w-auto" />
            <div>
              <h1 className="font-serif text-4xl md:text-6xl text-ledger-text tracking-tight">
                Ledger Studio
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey mt-2">
                Editorial Quotation System
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewQuoteConfirm(true)}
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-5 py-3 hover:bg-ledger-dark transition-colors self-start"
          >
            New Document
          </button>
        </header>

        <section className="mb-10">
          <QuoteMetadataEditor quote={quote} onUpdate={updateQuote} />
          <div className="mt-6 max-w-xs">
            <CurrencySelector
              currencyCode={quote.currencyCode}
              onChange={(currencyCode) => updateQuote({ currencyCode })}
            />
          </div>
        </section>

        <hr className="border-ledger-text my-8" />

        <section className="mb-10">
          <h2 className="font-serif text-2xl text-ledger-text mb-6">Parties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <SenderInfoForm senderInfo={senderInfo} onUpdate={updateSenderInfo} />
            <ClientInfoForm clientInfo={quote.clientInfo} onUpdate={updateClientInfo} />
          </div>
        </section>

        <hr className="border-ledger-text my-8" />

        <section className="mb-10">
          <h2 className="font-serif text-2xl text-ledger-text mb-6">Services & Pricing</h2>
          <LineItemsEditor
            lineItems={quote.lineItems}
            onUpdate={(lineItems) => updateQuote({ lineItems })}
            minimumHourlyRate={quote.minimumHourlyRate}
            currencyCode={quote.currencyCode}
            grandTotal={grandTotal}
            onScopeUpdate={(scopeOfWork: string) => updateQuote({ scopeOfWork })}
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <TaxAndDiscountEditor
              taxRate={quote.taxRate}
              discountAmount={quote.discountAmount}
              onTaxUpdate={(taxRate) => updateQuote({ taxRate })}
              onDiscountUpdate={(discountAmount) => updateQuote({ discountAmount })}
              currencyCode={quote.currencyCode}
            />
            <PrivateRatePanel
              minimumHourlyRate={quote.minimumHourlyRate}
              onUpdate={(minimumHourlyRate) => updateQuote({ minimumHourlyRate })}
              lineItems={quote.lineItems}
              currencyCode={quote.currencyCode}
            />
          </div>
          <div className="mt-8">
            <FreelancerBaselinePanel
              settings={freelancerSettings}
              onUpdate={setFreelancerSettings}
              onApply={applyBaselineRate}
              calculatedRate={calculatedMinimumRate}
            />
          </div>
        </section>

        <hr className="border-ledger-text my-8" />

        <section className="mb-10">
          <h2 className="font-serif text-2xl text-ledger-text mb-6">Payment Schedule</h2>
          <PaymentScheduleEditor
            enabled={quote.paymentScheduleEnabled}
            onToggle={(paymentScheduleEnabled) => updateQuote({ paymentScheduleEnabled })}
            milestones={quote.milestones}
            onUpdate={(milestones) => updateQuote({ milestones })}
            grandTotal={grandTotal}
            currencyCode={quote.currencyCode}
          />
        </section>

        <hr className="border-ledger-text my-8" />

        <section className="mb-10">
          <h2 className="font-serif text-2xl text-ledger-text mb-6">Scope & Terms</h2>
          <ScopeOfWorkEditor
            scopeOfWork={quote.scopeOfWork}
            notesAndTerms={quote.notesAndTerms}
            onScopeUpdate={(scopeOfWork) => updateQuote({ scopeOfWork })}
            onNotesUpdate={(notesAndTerms) => updateQuote({ notesAndTerms })}
          />
        </section>

        <hr className="border-ledger-text my-8" />

        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <h2 className="font-serif text-2xl text-ledger-text">Document Preview</h2>
            <div className="hidden md:block w-full md:w-auto">
              <PreviewExportButton quote={quote} senderInfo={senderInfo} />
            </div>
          </div>
          <LivePreview
            quote={quote}
            senderInfo={senderInfo}
            milestonesValid={milestonesValid}
            effectiveHourlyRate={effectiveHourlyRate}
            minimumHourlyRate={quote.minimumHourlyRate}
            currencyCode={quote.currencyCode}
          />
          <div className="mt-6 md:hidden">
            <PreviewExportButton
              quote={quote}
              senderInfo={senderInfo}
              className="w-full text-center"
            />
          </div>
        </section>
      </main>

      {showNewQuoteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-ledger-cream border border-ledger-text p-6 max-w-sm w-full">
            <h2 className="font-serif text-xl text-ledger-text mb-4">
              Clear current document?
            </h2>
            <p className="font-mono text-xs text-ledger-grey mb-6">
              This will clear all quote data and start fresh. Your sender information will be preserved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewQuoteConfirm(false)}
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2 border border-ledger-text text-ledger-text hover:bg-ledger-warm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewQuote}
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2 bg-ledger-oxblood text-ledger-cream hover:bg-ledger-dark transition-colors"
              >
                Clear Document
              </button>
            </div>
          </div>
        </div>
      )}

      <DataAudit />
      <HowItWorks />
      <Footer />
    </div>
  );
}
