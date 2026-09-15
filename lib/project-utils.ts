import { ActiveProject } from '@/components/views/projects-view';
import { QuoteData } from '@/lib/types';
import { calculateGrandTotal } from '@/lib/quote-utils';

export const PROJECTS_STORAGE_KEY = 'ledger_projects';

export function getStoredProjects(): ActiveProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading ledger_projects:', e);
  }
  return [];
}

export function saveStoredProjects(projects: ActiveProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving ledger_projects:', e);
  }
}

export function convertQuoteToActiveProject(quote: QuoteData): { project: ActiveProject; isNew: boolean } {
  const grandTotal = calculateGrandTotal(quote.lineItems, quote.taxRate, quote.discountAmount);
  
  const title = quote.clientInfo.company
    ? `${quote.clientInfo.company} - Quote #${quote.quoteNumber}`
    : quote.clientInfo.name
    ? `${quote.clientInfo.name} Proposal`
    : `Quote #${quote.quoteNumber}`;

  const clientName = quote.clientInfo.company || quote.clientInfo.name || 'Client';

  const newProject: ActiveProject = {
    id: `proj-${Date.now()}`,
    quoteId: quote.id,
    title,
    clientName,
    value: grandTotal,
    currencyCode: quote.currencyCode || 'USD',
    status: 'In Progress',
    startDate: quote.date || new Date().toISOString().split('T')[0],
    dueDate: quote.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  const currentProjects = getStoredProjects();
  const existingIdx = currentProjects.findIndex(
    (p) => (p.quoteId && p.quoteId === quote.id) || p.title === newProject.title
  );

  let updatedProjects: ActiveProject[];
  let isNew = true;

  if (existingIdx >= 0) {
    currentProjects[existingIdx] = {
      ...currentProjects[existingIdx],
      value: grandTotal,
      currencyCode: quote.currencyCode || 'USD',
      clientName,
    };
    updatedProjects = [...currentProjects];
    isNew = false;
  } else {
    updatedProjects = [newProject, ...currentProjects];
  }

  saveStoredProjects(updatedProjects);
  return { project: newProject, isNew };
}
