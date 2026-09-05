import { QuoteData, XRayDiagnostic } from './types';
import { calculateGrandTotal } from './quote-utils';
import { validateMilestones } from './validateMilestones';
import { detectHiddenWork } from './hidden-work-rules';

export interface XRayReport {
  score: number;
  categoryScores: {
    scope: number;
    revisions: number;
    payment: number;
    timeline: number;
    responsibilities: number;
    supportingWork: number;
    pricing: number;
  };
  diagnostics: XRayDiagnostic[];
}

export function runProposalXRay(quote: QuoteData): XRayReport {
  const diagnostics: XRayDiagnostic[] = [];

  const textToAnalyze = (
    quote.scopeOfWork +
    ' ' +
    quote.notesAndTerms +
    ' ' +
    quote.lineItems.map((i) => i.description).join(' ')
  ).toLowerCase();

  // Category 1: Scope Clarity
  let scopeScore = 100;
  const vagueWords = [
    'modern',
    'premium',
    'advanced',
    'professional',
    'custom',
    'fully optimized',
    'unlimited',
  ];
  const foundVagueWords = vagueWords.filter((word) => textToAnalyze.includes(word));

  if (quote.lineItems.length === 0) {
    scopeScore -= 50;
    diagnostics.push({
      id: 'xray-no-line-items',
      category: 'scope',
      severity: 'critical',
      title: 'No Line Items Defined',
      message: 'The quote does not contain any billable services or line items.',
      whyItMatters:
        'Clients need explicit itemized deliverables to understand what they are paying for and prevent scope creep.',
      fixActionLabel: 'Add Line Items',
      fixTargetSection: 'services-pricing',
    });
  }

  if (!quote.scopeOfWork || quote.scopeOfWork.trim().length < 20) {
    scopeScore -= 30;
    diagnostics.push({
      id: 'xray-vague-scope',
      category: 'scope',
      severity: 'warning',
      title: 'Undefined Scope of Work',
      message: 'Scope of Work description is missing or very brief.',
      whyItMatters:
        'A vague scope invites client assumptions and unbudgeted feature requests during project execution.',
      fixActionLabel: 'Edit Scope of Work',
      fixTargetSection: 'scope-terms',
    });
  }

  if (foundVagueWords.length > 0) {
    scopeScore -= foundVagueWords.length * 5;
    diagnostics.push({
      id: 'xray-subjective-words',
      category: 'scope',
      severity: 'suggestion',
      title: `Subjective Terms Detected (${foundVagueWords.join(', ')})`,
      message: `Proposal uses vague descriptors: ${foundVagueWords.join(', ')}.`,
      whyItMatters:
        'Subjective words like "premium" or "advanced" have no objective measure. Clarify precise metrics or deliverables.',
      fixActionLabel: 'Clarify Scope Words',
      fixTargetSection: 'scope-terms',
    });
  }
  scopeScore = Math.max(0, scopeScore);

  // Category 2: Revision Protection
  let revisionsScore = 100;
  const hasRevisionMention = /revision|round|feedback cycle/i.test(textToAnalyze);
  const hasUnlimitedRevisions = /unlimited revision/i.test(textToAnalyze);

  if (hasUnlimitedRevisions) {
    revisionsScore = 0;
    diagnostics.push({
      id: 'xray-unlimited-revisions',
      category: 'revisions',
      severity: 'critical',
      title: 'Unlimited Revisions Risk',
      message: 'Proposal grants unlimited revisions.',
      whyItMatters:
        'Unlimited revisions lock you into endless unpaid tweak cycles and destroy project profitability.',
      fixActionLabel: 'Set Revision Limit',
      fixTargetSection: 'scope-terms',
    });
  } else if (!hasRevisionMention) {
    revisionsScore = 40;
    diagnostics.push({
      id: 'xray-no-revision-policy',
      category: 'revisions',
      severity: 'warning',
      title: 'Missing Revision Policy',
      message: 'No maximum number of revision rounds is specified.',
      whyItMatters:
        'Without a clear limit (e.g., "Includes 2 rounds of revisions"), clients assume infinite revisions are included.',
      fixActionLabel: 'Add Revision Policy',
      fixTargetSection: 'scope-terms',
    });
  } else {
    diagnostics.push({
      id: 'xray-revisions-ok',
      category: 'revisions',
      severity: 'strong',
      title: 'Revision Limits Defined',
      message: 'Proposal explicitly mentions revision terms.',
      whyItMatters: 'Protects your time and sets clear client boundaries.',
    });
  }

  // Category 3: Payment Protection
  let paymentScore = 100;
  if (!quote.paymentScheduleEnabled) {
    paymentScore -= 30;
    diagnostics.push({
      id: 'xray-no-payment-schedule',
      category: 'payment',
      severity: 'warning',
      title: 'No Milestone Payment Schedule',
      message: 'Milestone payment schedule is currently disabled.',
      whyItMatters:
        'Lump-sum payments on completion carry high cash flow risk and payment delay vulnerability.',
      fixActionLabel: 'Enable Payment Schedule',
      fixTargetSection: 'payment-schedule',
    });
  } else {
    const validation = validateMilestones(quote.milestones);
    if (!validation.isValid) {
      paymentScore -= 50;
      diagnostics.push({
        id: 'xray-invalid-milestones',
        category: 'payment',
        severity: 'critical',
        title: 'Payment Milestones Do Not Equal 100%',
        message: validation.message,
        whyItMatters:
          'Incorrect milestone allocation causes billing disputes and contract inconsistencies.',
        fixActionLabel: 'Fix Payment Milestones',
        fixTargetSection: 'payment-schedule',
      });
    } else {
      const hasUpfrontDeposit = quote.milestones.some(
        (m) =>
          /deposit|upfront|start|kickoff/i.test(m.name) && m.percentage >= 20
      );
      if (!hasUpfrontDeposit) {
        paymentScore -= 20;
        diagnostics.push({
          id: 'xray-low-deposit',
          category: 'payment',
          severity: 'warning',
          title: 'Low or Missing Upfront Deposit',
          message: 'No upfront deposit (20%+ recommended) is specified in milestones.',
          whyItMatters:
            'An upfront deposit confirms client commitment before work begins.',
          fixActionLabel: 'Adjust Deposit Milestone',
          fixTargetSection: 'payment-schedule',
        });
      } else {
        diagnostics.push({
          id: 'xray-payment-ok',
          category: 'payment',
          severity: 'strong',
          title: 'Solid Payment Schedule',
          message: 'Milestones equal 100% and include an upfront deposit.',
          whyItMatters: 'Ensures reliable cash flow throughout the project lifecycle.',
        });
      }
    }
  }
  paymentScore = Math.max(0, paymentScore);

  // Category 4: Timeline Clarity
  let timelineScore = 100;
  const hasTimelineMention = /timeline|delivery|weeks|days|schedule|completion date/i.test(
    textToAnalyze
  );
  const hasClientDependencyMention = /client feedback|assets provided|client delay/i.test(
    textToAnalyze
  );

  if (!quote.dueDate && !hasTimelineMention) {
    timelineScore -= 40;
    diagnostics.push({
      id: 'xray-missing-timeline',
      category: 'timeline',
      severity: 'warning',
      title: 'Missing Delivery Date or Timeline',
      message: 'No due date or estimated project timeline is defined.',
      whyItMatters:
        'Open-ended project dates cause projects to drag indefinitely without accountability.',
      fixActionLabel: 'Set Due Date',
      fixTargetSection: 'metadata-editor',
    });
  }

  if (hasTimelineMention && !hasClientDependencyMention) {
    timelineScore -= 20;
    diagnostics.push({
      id: 'xray-client-delay-clause',
      category: 'timeline',
      severity: 'suggestion',
      title: 'Timeline Lacks Client Feedback Dependency',
      message:
        'Timeline exists, but does not specify that delays in client feedback extend delivery dates.',
      whyItMatters:
        'Protects you from missed deadlines caused by late client responses or assets.',
      fixActionLabel: 'Add Delay Clause',
      fixTargetSection: 'scope-terms',
    });
  }
  timelineScore = Math.max(0, timelineScore);

  // Category 5: Client Responsibilities
  let responsibilitiesScore = 100;
  const hasResponsibilities = /client is responsible for|provided by client|assets|content|credentials/i.test(
    textToAnalyze
  );

  if (!hasResponsibilities) {
    responsibilitiesScore = 50;
    diagnostics.push({
      id: 'xray-missing-client-responsibilities',
      category: 'responsibilities',
      severity: 'warning',
      title: 'Client Prerequisites & Responsibilities Unclear',
      message: 'Does not clarify who provides content, copy, images, or logins.',
      whyItMatters:
        'Freelancers frequently end up writing copy or sourcing images for free when responsibilities are unstated.',
      fixActionLabel: 'Add Client Terms',
      fixTargetSection: 'scope-terms',
    });
  } else {
    diagnostics.push({
      id: 'xray-responsibilities-ok',
      category: 'responsibilities',
      severity: 'strong',
      title: 'Client Prerequisites Stated',
      message: 'Proposal defines client asset and feedback requirements.',
      whyItMatters: 'Reduces risk of project stalls.',
    });
  }

  // Category 6: Supporting Work (Hidden Work)
  let supportingWorkScore = 100;
  const detectedHiddenItems = detectHiddenWork(quote);
  if (detectedHiddenItems.length > 0) {
    supportingWorkScore = Math.max(0, 100 - detectedHiddenItems.length * 15);
    diagnostics.push({
      id: 'xray-hidden-work-detected',
      category: 'supporting_work',
      severity: 'warning',
      title: `${detectedHiddenItems.length} Potential Supporting Tasks Unaddressed`,
      message: `Detected ${detectedHiddenItems.length} supporting tasks (e.g. ${detectedHiddenItems[0].title}) not explicitly listed in scope.`,
      whyItMatters:
        'Unpriced supporting work reduces your true hourly earnings.',
      fixActionLabel: 'Review Hidden Work',
      fixTargetSection: 'hidden-work-detector',
    });
  } else {
    diagnostics.push({
      id: 'xray-supporting-work-ok',
      category: 'supporting_work',
      severity: 'strong',
      title: 'Supporting Work Covered',
      message: 'No obvious unpriced supporting tasks detected.',
      whyItMatters: 'Ensures comprehensive project coverage.',
    });
  }

  // Category 7: Pricing Health
  let pricingScore = 100;
  const grandTotal = calculateGrandTotal(
    quote.lineItems,
    quote.taxRate,
    quote.discountAmount
  );
  const totalEstimatedHours = quote.lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const effectiveRate =
    totalEstimatedHours > 0 ? grandTotal / totalEstimatedHours : 0;

  if (
    quote.minimumHourlyRate > 0 &&
    effectiveRate > 0 &&
    effectiveRate < quote.minimumHourlyRate
  ) {
    pricingScore -= 40;
    diagnostics.push({
      id: 'xray-below-baseline-rate',
      category: 'pricing',
      severity: 'critical',
      title: 'Effective Hourly Rate Below Minimum Baseline',
      message: `Effective rate (${quote.currencyCode} ${effectiveRate.toFixed(
        2
      )}/hr) is lower than your baseline (${quote.currencyCode} ${quote.minimumHourlyRate.toFixed(
        2
      )}/hr).`,
      whyItMatters:
        'Working below your survival baseline rate causes net financial loss.',
      fixActionLabel: 'Adjust Pricing',
      fixTargetSection: 'services-pricing',
    });
  }

  if (quote.discountAmount > 0 && grandTotal > 0) {
    const discountRatio = quote.discountAmount / (grandTotal + quote.discountAmount);
    if (discountRatio > 0.2) {
      pricingScore -= 25;
      diagnostics.push({
        id: 'xray-heavy-discount',
        category: 'pricing',
        severity: 'warning',
        title: 'Excessive Discount (>20%)',
        message: 'Discount exceeds 20% of total project value.',
        whyItMatters:
          'Deep discounts devalue your work and set low expectations for future work.',
        fixActionLabel: 'Review Discount',
        fixTargetSection: 'services-pricing',
      });
    }
  }
  pricingScore = Math.max(0, pricingScore);

  const categoryScores = {
    scope: scopeScore,
    revisions: revisionsScore,
    payment: paymentScore,
    timeline: timelineScore,
    responsibilities: responsibilitiesScore,
    supportingWork: supportingWorkScore,
    pricing: pricingScore,
  };

  const totalWeighted =
    scopeScore * 0.2 +
    revisionsScore * 0.15 +
    paymentScore * 0.15 +
    timelineScore * 0.15 +
    responsibilitiesScore * 0.1 +
    supportingWorkScore * 0.1 +
    pricingScore * 0.15;

  const score = Math.round(totalWeighted);

  return {
    score,
    categoryScores,
    diagnostics,
  };
}
