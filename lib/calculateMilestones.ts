import { Milestone } from '@/lib/types';

export function calculateMilestoneAmount(
  percentage: number,
  grandTotal: number
): number {
  return (percentage / 100) * grandTotal;
}

export function calculateMilestoneAmounts(
  milestones: Milestone[],
  grandTotal: number
): Milestone[] {
  return milestones.map((m) => ({
    ...m,
    amount: calculateMilestoneAmount(m.percentage, grandTotal),
  }));
}

export function calculateTotalPercentage(milestones: Milestone[]): number {
  return milestones.reduce((sum, m) => sum + m.percentage, 0);
}
