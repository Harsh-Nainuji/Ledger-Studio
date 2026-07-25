import { Milestone } from '@/lib/types';
import { calculateTotalPercentage } from '@/lib/calculateMilestones';

export interface MilestoneValidation {
  isValid: boolean;
  totalPercentage: number;
  remaining: number;
  isOver: boolean;
  isUnder: boolean;
  message: string;
}

export function validateMilestones(milestones: Milestone[]): MilestoneValidation {
  const totalPercentage = calculateTotalPercentage(milestones);
  const remaining = 100 - totalPercentage;
  const isOver = totalPercentage > 100;
  const isUnder = totalPercentage < 100;
  const isValid = totalPercentage === 100;

  let message = '';
  if (isOver) {
    message = `Over allocated by ${Math.abs(remaining)}%`;
  } else if (isUnder) {
    message = `Remaining ${remaining}%`;
  } else {
    message = 'Fully allocated';
  }

  return {
    isValid,
    totalPercentage,
    remaining,
    isOver,
    isUnder,
    message,
  };
}
