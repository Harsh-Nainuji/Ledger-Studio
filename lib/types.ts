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
