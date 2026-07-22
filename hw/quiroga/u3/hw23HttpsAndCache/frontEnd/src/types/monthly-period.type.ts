import type { Period } from './period.type';

export interface MonthlyPeriod extends Period {
  type: 'monthly';
  month: number;
}
