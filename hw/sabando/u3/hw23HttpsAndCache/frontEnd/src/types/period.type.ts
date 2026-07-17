export type TaxPeriodType = 'monthly' | 'semi-annual';

export interface Period {
  type: TaxPeriodType;
  year: number;
}
