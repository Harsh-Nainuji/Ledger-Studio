import { QuoteData, HiddenWorkItem } from './types';

export function detectHiddenWork(quote: QuoteData): HiddenWorkItem[] {
  const textToAnalyze = (
    quote.lineItems.map((i) => i.description).join(' ') +
    ' ' +
    quote.scopeOfWork +
    ' ' +
    quote.notesAndTerms
  ).toLowerCase();

  const detectedItems: HiddenWorkItem[] = [];

  const defaultRate = quote.minimumHourlyRate > 0 ? quote.minimumHourlyRate : 50;

  // Rule 1: Web / Frontend
  if (
    /website|landing page|web app|react|next\.js|frontend|portal|site/i.test(
      textToAnalyze
    )
  ) {
    if (!/responsive|mobile/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-responsive',
        title: 'Responsive & Mobile Layout Testing',
        description:
          'Ensuring layout adapts across mobile screens, tablets, and desktop viewports.',
        category: 'testing',
        estimatedHours: 4,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }

    if (!/deploy|hosting|vercel|netlify|domain/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-deployment',
        title: 'Deployment & Environment Setup',
        description:
          'Configuring production hosting, SSL, custom domain DNS, and build pipelines.',
        category: 'deployment',
        estimatedHours: 3,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }

    if (!/seo|meta|analytics|google analytics/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-seo',
        title: 'SEO Metadata & Analytics Tracking',
        description:
          'Setting up meta tags, OpenGraph images, favicons, and analytics tracking.',
        category: 'seo_analytics',
        estimatedHours: 2,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }

    if (!/browser testing|cross-browser/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-browser-testing',
        title: 'Cross-Browser Verification',
        description:
          'Testing across Safari, Chrome, Firefox, and Edge to prevent layout bugs.',
        category: 'testing',
        estimatedHours: 3,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }
  }

  // Rule 2: E-Commerce
  if (/e-commerce|shop|store|checkout|stripe|cart|products/i.test(textToAnalyze)) {
    if (!/payment gateway|sandbox|stripe config/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-payment-gateway',
        title: 'Payment Gateway Sandbox & Testing',
        description:
          'Configuring test keys, webhook listeners, failure recovery, and live keys.',
        category: 'configuration',
        estimatedHours: 5,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }

    if (!/email notification|receipt|order email/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-order-emails',
        title: 'Transactional Order Emails',
        description:
          'Designing and configuring automated customer order receipts and admin alerts.',
        category: 'configuration',
        estimatedHours: 3,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }
  }

  // Rule 3: Mobile App
  if (/mobile app|react native|flutter|ios|android/i.test(textToAnalyze)) {
    if (!/app store|play store|submission/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-store-submission',
        title: 'App Store & Play Store Preparation',
        description:
          'Creating app icons, screenshots, store listing metadata, and signing builds.',
        category: 'deployment',
        estimatedHours: 6,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }
  }

  // Rule 4: API & Backend
  if (/api|backend|node|database|postgres|graphql|server/i.test(textToAnalyze)) {
    if (!/env|environment variables|security/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-security-env',
        title: 'Secrets Management & Environment Security',
        description:
          'Setting up environment variables, API key encryption, and security headers.',
        category: 'security',
        estimatedHours: 3,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }

    if (!/documentation|swagger|postman/i.test(textToAnalyze)) {
      detectedItems.push({
        id: 'hw-api-docs',
        title: 'API Endpoints & Integration Documentation',
        description:
          'Documenting API routes, request/response formats for client developers.',
        category: 'general',
        estimatedHours: 4,
        suggestedRate: defaultRate,
        status: 'detected',
      });
    }
  }

  // Universal Rule: Client Handover & Revision Buffer
  if (!/handover|training|documentation|walkthrough/i.test(textToAnalyze)) {
    detectedItems.push({
      id: 'hw-handover',
      title: 'Client Handover & Documentation',
      description:
        'Preparing instruction guide, video walkthrough, and account credential transfer.',
      category: 'general',
      estimatedHours: 2,
      suggestedRate: defaultRate,
      status: 'detected',
    });
  }

  if (!/revision|feedback round/i.test(textToAnalyze)) {
    detectedItems.push({
      id: 'hw-revisions',
      title: 'Consolidated Revision Rounds Buffer',
      description:
        'Allocating structured time for processing client feedback and minor adjustments.',
      category: 'revisions',
      estimatedHours: 5,
      suggestedRate: defaultRate,
      status: 'detected',
    });
  }

  return detectedItems;
}
