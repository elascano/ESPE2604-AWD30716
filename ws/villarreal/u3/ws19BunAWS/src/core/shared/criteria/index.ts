export { extractFilters } from './extractFilters';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in';

export interface Filter {
  field: string;
  value: unknown;
  operator: FilterOperator;
}

export interface Criteria {
  limit: number;
  offset: number;
  filters?: Filter[];
}
