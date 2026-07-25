export interface PaymentPreset {
  id: string;
  name: string;
  milestones: { name: string; percentage: number }[];
}

export const PAYMENT_PRESETS: PaymentPreset[] = [
  {
    id: 'standard',
    name: 'Standard',
    milestones: [
      { name: 'Project Start', percentage: 40 },
      { name: 'Design / Development Complete', percentage: 30 },
      { name: 'Final Delivery', percentage: 30 },
    ],
  },
  {
    id: 'half-half',
    name: '50 / 50',
    milestones: [
      { name: 'Project Start', percentage: 50 },
      { name: 'Final Delivery', percentage: 50 },
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    milestones: [
      { name: 'Month 1', percentage: 25 },
      { name: 'Month 2', percentage: 25 },
      { name: 'Month 3', percentage: 25 },
      { name: 'Month 4', percentage: 25 },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    milestones: [],
  },
];

export const DEFAULT_PRESET_ID = 'standard';

export const getDefaultMilestones = () => {
  const preset = PAYMENT_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID);
  return preset ? preset.milestones : [];
};
