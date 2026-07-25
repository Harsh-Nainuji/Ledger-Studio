import { QuoteData, LineItem, Milestone } from './types';
import { DEFAULT_CURRENCY_CODE } from '@/constants/currencies';
import { getDefaultMilestones } from '@/constants/paymentPresets';
export { formatCurrency } from '@/lib/formatCurrency';

/**
 * Calculate subtotal from line items
 */
export const calculateSubtotal = (lineItems: LineItem[]): number => {
  return lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
};

/**
 * Calculate tax amount
 */
export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100);
};

/**
 * Calculate grand total
 */
export const calculateGrandTotal = (
  lineItems: LineItem[],
  taxRate: number,
  discountAmount: number
): number => {
  const subtotal = calculateSubtotal(lineItems);
  const tax = calculateTax(subtotal, taxRate);
  return subtotal + tax - discountAmount;
};

/**
 * Generate quote number
 */
export const generateQuoteNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `QT-${timestamp}-${random}`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Check if rate is below minimum hourly rate (for warning)
 */
export const isBelowMinimumRate = (
  rate: number,
  minimumHourlyRate: number
): boolean => {
  return rate > 0 && rate < minimumHourlyRate && minimumHourlyRate > 0;
};

/**
 * Default line item presets
 */
export const LINE_ITEM_PRESETS = [
  { name: 'Design', description: 'Design work', rate: 100 },
  { name: 'Development', description: 'Development work', rate: 120 },
  { name: 'Consulting', description: 'Consulting services', rate: 150 },
  { name: 'Content', description: 'Content creation', rate: 80 },
  { name: 'Testing', description: 'QA & Testing', rate: 75 },
];

/**
 * Default quote data
 */
export const createEmptyQuote = (): QuoteData => {
  return {
    id: Date.now().toString(),
    quoteNumber: generateQuoteNumber(),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    senderInfo: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      logo: '',
    },
    clientInfo: {
      name: '',
      email: '',
      company: '',
      address: '',
      logo: '',
    },
    lineItems: [],
    taxRate: 0,
    discountAmount: 0,
    scopeOfWork: '',
    notesAndTerms: '',
    minimumHourlyRate: 50,
    currencyCode: DEFAULT_CURRENCY_CODE,
    paymentScheduleEnabled: false,
    milestones: getDefaultMilestones().map((m, i) => ({
      id: `milestone-${Date.now()}-${i}`,
      name: m.name,
      percentage: m.percentage,
      amount: 0,
    })),
    urgencyEnabled: false,
  };
};
