import { ScopeCreepScenario } from './types';

export const SCOPE_CREEP_SCENARIOS: ScopeCreepScenario[] = [
  {
    id: 'sc-1',
    clientMessage:
      '"Hey! We loved the layout concepts. By the way, can you also set up a custom blog section so our marketing team can post articles?"',
    requestTitle: 'Add Blog & Content CMS Section',
    requestDescription:
      'Client requests adding a full blog layout with rich text post rendering, tag filtering, and CMS setup.',
    addedHours: 8,
    suggestedExtraCost: 800,
    category: 'Feature Expansion',
    impactNote: 'Adds 8 hours of development & styling.',
  },
  {
    id: 'sc-2',
    clientMessage:
      '"Can we add smoother page transitions and complex interactive GSAP scroll animations across all pages?"',
    requestTitle: 'Complex Interactive Scroll Animations',
    requestDescription:
      'Client requests custom micro-interactions and scroll-driven parallax animations.',
    addedHours: 6,
    suggestedExtraCost: 600,
    category: 'UI/UX Detail',
    impactNote: 'Adds 6 hours of custom motion engineering & testing.',
  },
  {
    id: 'sc-3',
    clientMessage:
      '"Our team needs to receive lead inquiries directly on WhatsApp as well as email. Can you integrate the WhatsApp Business API?"',
    requestTitle: 'WhatsApp Integration & Webhooks',
    requestDescription:
      'Client asks for real-time messaging integration alongside standard contact forms.',
    addedHours: 5,
    suggestedExtraCost: 500,
    category: 'Third-party Integration',
    impactNote: 'Adds 5 hours of API key setup & testing.',
  },
  {
    id: 'sc-4',
    clientMessage:
      '"We decided we need a client login portal so customers can view order history and download PDF receipts."',
    requestTitle: 'Client Auth & Account Dashboard',
    requestDescription:
      'Significant scope addition: user authentication, protected routes, and database tables.',
    addedHours: 16,
    suggestedExtraCost: 1800,
    category: 'Architectural Feature',
    impactNote: 'Adds 16 hours of backend & security work.',
  },
  {
    id: 'sc-5',
    clientMessage:
      '"Could we do just one more round of major revisions to redesign the hero header and color scheme?"',
    requestTitle: 'Unbudgeted Extra Revision Round',
    requestDescription:
      'Client requests an extra round of structural revisions after final design sign-off.',
    addedHours: 5,
    suggestedExtraCost: 450,
    category: 'Revision Creep',
    impactNote: 'Adds 5 hours of design tweaks & feedback meetings.',
  },
  {
    id: 'sc-6',
    clientMessage:
      '"Could you also handle full cloud deployment, DNS configuration, and set up Google Analytics & Pixel tracking?"',
    requestTitle: 'DevOps & Analytics Setup',
    requestDescription:
      'Client expects end-to-end launch deployment and analytics tag setup.',
    addedHours: 4,
    suggestedExtraCost: 400,
    category: 'DevOps & Setup',
    impactNote: 'Adds 4 hours of server config & verification.',
  },
];

export interface SimulationResult {
  scopeProtectionScore: number;
  pricingDisciplineScore: number;
  negotiationScore: number;
  finalScore: number;
  hoursChange: number;
  priceChange: number;
  effectiveRateOriginal: number;
  effectiveRateFinal: number;
  summary: string;
}

export function evaluateSimulation(
  originalHours: number,
  originalPrice: number,
  finalHours: number,
  finalPrice: number,
  decisions: { decision: 'accept' | 'charge' | 'reduce' | 'reject' }[],
  minimumRate: number
): SimulationResult {
  const acceptCount = decisions.filter((d) => d.decision === 'accept').length;
  const chargeCount = decisions.filter((d) => d.decision === 'charge').length;
  const reduceCount = decisions.filter((d) => d.decision === 'reduce').length;
  const rejectCount = decisions.filter((d) => d.decision === 'reject').length;

  const totalDecisions = decisions.length || 1;

  // Scope Protection: Penalize accepts without charging or reducing
  let scopeProtectionScore = 100 - (acceptCount / totalDecisions) * 60;
  scopeProtectionScore = Math.max(20, Math.round(scopeProtectionScore));

  // Pricing Discipline: Reward charging and maintaining effective rate
  const rateOriginal = originalHours > 0 ? originalPrice / originalHours : 0;
  const rateFinal = finalHours > 0 ? finalPrice / finalHours : 0;

  let pricingDisciplineScore = 70;
  if (chargeCount > 0) pricingDisciplineScore += chargeCount * 10;
  if (rateFinal >= rateOriginal) pricingDisciplineScore += 15;
  if (minimumRate > 0 && rateFinal < minimumRate) pricingDisciplineScore -= 35;
  pricingDisciplineScore = Math.min(100, Math.max(20, Math.round(pricingDisciplineScore)));

  // Negotiation Score: Balance of charging, reducing, and firm boundary setting
  let negotiationScore = 60 + (chargeCount + reduceCount + rejectCount) * 8;
  negotiationScore = Math.min(100, Math.max(30, Math.round(negotiationScore)));

  const finalScore = Math.round(
    scopeProtectionScore * 0.35 +
      pricingDisciplineScore * 0.4 +
      negotiationScore * 0.25
  );

  let summary = '';
  if (acceptCount === 0) {
    summary =
      'Outstanding scope control! You protected your original commitment and either billed for additional requests or held firm boundaries.';
  } else if (rateFinal >= (minimumRate > 0 ? minimumRate : rateOriginal)) {
    summary = `You absorbed ${acceptCount} request(s) for free, but managed to keep your overall effective rate profitable.`;
  } else {
    summary = `Caution: Accepting unpaid extra requests reduced your effective hourly rate below your baseline. Consider charging for new requests in future projects.`;
  }

  return {
    scopeProtectionScore,
    pricingDisciplineScore,
    negotiationScore,
    finalScore,
    hoursChange: finalHours - originalHours,
    priceChange: finalPrice - originalPrice,
    effectiveRateOriginal: rateOriginal,
    effectiveRateFinal: rateFinal,
    summary,
  };
}
