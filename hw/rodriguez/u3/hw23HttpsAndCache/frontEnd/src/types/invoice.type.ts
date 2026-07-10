import type { TaxPeriod } from './tax-period.type';

export type InvoiceFormat = 'XML' | 'PDF';

export interface Invoice {
  id: string;
  number: string;
  issuerRuc: string;
  issuerName: string;
  date: string;
  total: number;
  taxBase: number;
  iva: number;
  format: InvoiceFormat;
  period: TaxPeriod;
}
