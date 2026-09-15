'use client';

import { useState, useEffect } from 'react';
import { QuoteData, SenderInfo, ClientInfo, FreelancerSettings } from '@/lib/types';
import { createEmptyQuote, calculateGrandTotal } from '@/lib/quote-utils';
import { validateMilestones } from '@/lib/validateMilestones';
import { convertQuoteToActiveProject } from '@/lib/project-utils';
import Navbar, { ViewMode } from './navigation/navbar';
import DashboardView from './views/dashboard-view';
import QuoteWorkspaceView from './views/quote-workspace-view';
import ProjectsView from './views/projects-view';
import DealLabHub, { DealLabTab } from './deal-lab/deal-lab-hub';
import PlaybookView from './views/playbook-view';
import ProfileView from './views/profile-view';
import WelcomeScreen from './welcome-screen';
import DataAudit from './data-audit';
import Footer from './footer';
import { TourProvider } from './tour/tour-context';
import { SpotlightOverlay } from './tour/spotlight-overlay';
import { TourPanel } from './tour/tour-panel';
import { FolderCheck, ArrowRight, X } from 'lucide-react';

const DEFAULT_FREELANCER_SETTINGS: FreelancerSettings = {
  monthlySurvivalExpense: 4000,
  desiredMonthlyHours: 160,
};

export default function QuoteGenerator() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [dealLabTab, setDealLabTab] = useState<DealLabTab>('hidden-work');
  const [projectToast, setProjectToast] = useState<string | null>(null);

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
    setCurrentView('quotes');
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

  const handleOpenDealLabTab = (tab: DealLabTab) => {
    setDealLabTab(tab);
    setCurrentView('deal-lab');
  };

  const handleNavigateToSection = (sectionId: string) => {
    setCurrentView('quotes');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleConvertToProject = () => {
    if (!quote) return;
    const { project, isNew } = convertQuoteToActiveProject(quote);
    setProjectToast(
      isNew
        ? `Added "${project.title}" to Active Projects!`
        : `Updated "${project.title}" in Active Projects!`
    );
  };

  if (!quote || !senderInfo) {
    return <div className="font-mono text-sm text-ledger-text text-center py-20">Loading Ledger Studio...</div>;
  }

  return (
    <TourProvider onNavigate={setCurrentView}>
      <div className="min-h-screen bg-ledger-cream flex flex-col justify-between">
        <div>
        <WelcomeScreen />

        {/* Project Conversion Success Toast */}
        {projectToast && (
          <div className="bg-ledger-text text-ledger-cream px-6 py-3 border-b-2 border-ledger-text fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between font-mono text-xs gap-4">
              <div className="flex items-center gap-2">
                <FolderCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-bold">{projectToast}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setProjectToast(null);
                    setCurrentView('projects');
                  }}
                  className="bg-ledger-oxblood text-ledger-cream px-3 py-1 border border-ledger-cream hover:bg-ledger-dark transition-colors font-bold uppercase tracking-wider text-[10px] inline-flex items-center gap-1"
                >
                  <span>View in Projects</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setProjectToast(null)}
                  className="text-ledger-grey hover:text-ledger-cream"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Master Navigation Bar Shell */}
        <Navbar
          currentView={currentView}
          onSelectView={setCurrentView}
          onNewDocument={() => setShowNewQuoteConfirm(true)}
        />

        {/* Dynamic View Main Container */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {currentView === 'dashboard' && (
            <DashboardView
              quote={quote}
              senderInfo={senderInfo}
              onNavigate={setCurrentView}
              onNewDocument={() => setShowNewQuoteConfirm(true)}
              onConvertToProject={handleConvertToProject}
            />
          )}

          {currentView === 'quotes' && (
            <QuoteWorkspaceView
              quote={quote}
              senderInfo={senderInfo}
              freelancerSettings={freelancerSettings}
              grandTotal={grandTotal}
              milestonesValid={milestonesValid}
              effectiveHourlyRate={effectiveHourlyRate}
              calculatedMinimumRate={calculatedMinimumRate}
              onUpdateQuote={updateQuote}
              onUpdateSenderInfo={updateSenderInfo}
              onUpdateClientInfo={updateClientInfo}
              onUpdateFreelancerSettings={setFreelancerSettings}
              onApplyBaselineRate={applyBaselineRate}
              onOpenDealLabTab={handleOpenDealLabTab}
              onConvertToProject={handleConvertToProject}
            />
          )}

          {currentView === 'projects' && <ProjectsView />}

          {currentView === 'deal-lab' && (
            <DealLabHub
              quote={quote}
              onUpdateQuote={updateQuote}
              onNavigateToSection={handleNavigateToSection}
              initialTab={dealLabTab}
            />
          )}

          {currentView === 'playbook' && (
            <PlaybookView
              quote={quote}
              onUpdateQuote={updateQuote}
              onNavigateToQuotes={() => setCurrentView('quotes')}
            />
          )}

          {currentView === 'profile' && <ProfileView quote={quote} />}
        </main>
      </div>

      {/* Confirmation Dialog for New Document */}
      {showNewQuoteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-fade-in">
          <div className="bg-ledger-cream border-2 border-ledger-text p-6 max-w-sm w-full space-y-4">
            <h3 className="font-serif text-xl text-ledger-text font-bold">
              Start new quote document?
            </h3>
            <p className="font-mono text-xs text-ledger-grey">
              This will reset current line items and quote numbers. Sender info will be preserved.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowNewQuoteConfirm(false)}
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2.5 border border-ledger-text text-ledger-text hover:bg-ledger-warm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleNewQuote}
                className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2.5 bg-ledger-oxblood text-ledger-cream hover:bg-ledger-dark transition-colors border border-ledger-text"
              >
                Clear & Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <DataAudit />
      <Footer />
      <SpotlightOverlay />
      <TourPanel />
    </div>
    </TourProvider>
  );
}
