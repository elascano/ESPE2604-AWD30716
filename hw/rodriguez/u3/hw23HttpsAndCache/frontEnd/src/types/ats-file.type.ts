import type { TaxPeriod } from './tax-period.type';

export type AtsFileFormat = 'XLSM' | 'XML';

export interface AtsFile {
  id: string;
  name: string;
  format: AtsFileFormat;
  period: TaxPeriod;
  createdAt: string;
  invoiceCount: number;
  validationErrors: number;
  downloadUrl?: string;
}
