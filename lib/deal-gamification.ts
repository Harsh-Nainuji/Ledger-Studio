import { QuoteData, GamificationStats, GamificationAchievement } from './types';
import { validateMilestones } from './validateMilestones';
import { runProposalXRay } from './xray-engine';

export const INITIAL_ACHIEVEMENTS: GamificationAchievement[] = [
  {
    id: 'ach-scope-protector',
    title: 'Scope Protector',
    description: 'Set clear scope terms and revision limits on a proposal.',
    icon: 'Shield',
    unlocked: false,
  },
  {
    id: 'ach-margin-defender',
    title: 'Margin Defender',
    description: 'Maintain an effective hourly rate above your minimum baseline.',
    icon: 'TrendingUp',
    unlocked: false,
  },
  {
    id: 'ach-boundary-setter',
    title: 'Boundary Setter',
    description: 'Define client prerequisites and explicit milestone payments.',
    icon: 'MapPin',
    unlocked: false,
  },
  {
    id: 'ach-deal-architect',
    title: 'Deal Architect',
    description: 'Achieve an X-Ray Health Score of 85+ on a proposal.',
    icon: 'Building2',
    unlocked: false,
  },
  {
    id: 'ach-creep-survivor',
    title: 'Scope Creep Survivor',
    description: 'Complete a Scope Creep Simulation with a score above 80.',
    icon: 'Zap',
    unlocked: false,
  },
];

export function calculateGamification(
  quote: QuoteData,
  simulationCompleted?: boolean,
  simulationScore?: number
): GamificationStats {
  let xp = 0;
  const achievements = INITIAL_ACHIEVEMENTS.map((a) => ({ ...a }));

  // XP Rule 1: Defined Payment Milestones (+20 XP)
  if (quote.paymentScheduleEnabled && validateMilestones(quote.milestones).isValid) {
    xp += 20;
    const boundaryAchievement = achievements.find((a) => a.id === 'ach-boundary-setter');
    if (boundaryAchievement && quote.scopeOfWork.length > 20) {
      boundaryAchievement.unlocked = true;
    }
  }

  // XP Rule 2: Defined Revision Limits (+15 XP)
  if (/revision|round/i.test(quote.scopeOfWork + quote.notesAndTerms)) {
    xp += 15;
    const scopeAchievement = achievements.find((a) => a.id === 'ach-scope-protector');
    if (scopeAchievement) {
      scopeAchievement.unlocked = true;
    }
  }

  // XP Rule 3: Protected Minimum Rate (+20 XP)
  const totalHours = quote.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalRate = totalHours > 0 ? (quote.lineItems.reduce((s, i) => s + i.quantity * i.rate, 0)) / totalHours : 0;
  if (quote.minimumHourlyRate > 0 && totalRate >= quote.minimumHourlyRate) {
    xp += 20;
    const marginAchievement = achievements.find((a) => a.id === 'ach-margin-defender');
    if (marginAchievement) {
      marginAchievement.unlocked = true;
    }
  }

  // XP Rule 4: High X-Ray Score (+25 XP)
  const xray = runProposalXRay(quote);
  if (xray.score >= 85) {
    xp += 25;
    const architectAchievement = achievements.find((a) => a.id === 'ach-deal-architect');
    if (architectAchievement) {
      architectAchievement.unlocked = true;
    }
  }

  // XP Rule 5: Simulation (+30 XP)
  if (simulationCompleted && (simulationScore ?? 0) >= 80) {
    xp += 30;
    const creepAchievement = achievements.find((a) => a.id === 'ach-creep-survivor');
    if (creepAchievement) {
      creepAchievement.unlocked = true;
    }
  }

  const level = Math.floor(xp / 25) + 1;

  return {
    xp,
    level,
    achievements,
  };
}
