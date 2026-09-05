export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface SenderInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  logo: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  company: string;
  address: string;
  logo: string;
}

export interface Milestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
}

export interface QuoteData {
  id: string;
  quoteNumber: string;
  date: string;
  dueDate: string;
  currencyCode: string;
  senderInfo: SenderInfo;
  clientInfo: ClientInfo;
  lineItems: LineItem[];
  taxRate: number;
  discountAmount: number;
  scopeOfWork: string;
  notesAndTerms: string;
  minimumHourlyRate: number;
  paymentScheduleEnabled: boolean;
  milestones: Milestone[];
  urgencyEnabled: boolean;
}

export interface FreelancerSettings {
  monthlySurvivalExpense: number;
  desiredMonthlyHours: number;
}

export interface LineItemPreset {
  name: string;
  description: string;
  rate: number;
}

export type HiddenWorkStatus = 'detected' | 'added_to_scope' | 'internal_task' | 'ignored';

export interface HiddenWorkItem {
  id: string;
  title: string;
  description: string;
  category: 'testing' | 'deployment' | 'configuration' | 'seo_analytics' | 'revisions' | 'security' | 'general';
  estimatedHours: number;
  suggestedRate: number;
  status: HiddenWorkStatus;
}

export type DiagnosticSeverity = 'critical' | 'warning' | 'suggestion' | 'strong';

export interface XRayDiagnostic {
  id: string;
  category: 'scope' | 'revisions' | 'payment' | 'timeline' | 'responsibilities' | 'supporting_work' | 'pricing';
  severity: DiagnosticSeverity;
  title: string;
  message: string;
  whyItMatters: string;
  fixActionLabel?: string;
  fixTargetSection?: string;
}

export type ScopeCreepDecisionType = 'accept' | 'charge' | 'reduce' | 'reject';

export interface ScopeCreepScenario {
  id: string;
  clientMessage: string;
  requestTitle: string;
  requestDescription: string;
  addedHours: number;
  suggestedExtraCost: number;
  category: string;
  impactNote: string;
}

export interface ScopeCreepDecision {
  scenarioId: string;
  decision: ScopeCreepDecisionType;
  hoursAdded: number;
  priceAdded: number;
  timestamp: string;
}

export interface GamificationAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface GamificationStats {
  xp: number;
  level: number;
  achievements: GamificationAchievement[];
}

