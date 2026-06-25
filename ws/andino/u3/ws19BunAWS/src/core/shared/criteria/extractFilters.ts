import {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  like,
  ilike,
  inArray,
  and,
  SQL,
} from 'drizzle-orm';
import type { Column } from 'drizzle-orm';
import type { Filter } from '@core/shared/criteria';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyColumn = Column<any, any, any>;

/**
 * Extracts Drizzle ORM WHERE conditions from a list of Criteria filters.
 *
 * @param filters   - Array of Filter objects from a Criteria
 * @param columnMap - Map from field name to the Drizzle table column reference
 * @returns A single Drizzle SQL condition (and-joined), or undefined if no filters
 */
export const extractFilters = (
  filters: Filter[] | undefined,
  columnMap: Record<string, AnyColumn>,
): SQL | undefined => {
  if (!filters || filters.length === 0)
    filters = [{ field: 'isActive', operator: 'eq', value: true }];
  else
    filters.push({ field: 'isActive', operator: 'eq', value: true });

  const conditions = filters.reduce<SQL[]>((acc, filter) => {
    const column = columnMap[filter.field];
    if (!column) return acc;

    let condition: SQL | undefined;

    switch (filter.operator) {
      case 'eq':
        condition = eq(column, filter.value);
        break;
      case 'neq':
        condition = ne(column, filter.value);
        break;
      case 'gt':
        condition = gt(column, filter.value);
        break;
      case 'gte':
        condition = gte(column, filter.value);
        break;
      case 'lt':
        condition = lt(column, filter.value);
        break;
      case 'lte':
        condition = lte(column, filter.value);
        break;
      case 'like':
        condition = like(column, filter.value as string);
        break;
      case 'ilike':
        condition = ilike(column, filter.value as string);
        break;
      case 'in':
        condition = inArray(column, filter.value as unknown[]);
        break;
    }

    if (condition) acc.push(condition);
    return acc;
  }, []);

  return conditions.length > 0 ? and(...conditions) : undefined;
}
