/** Equivalente Laravel Filter.orderBy → query API `sort`. */
export const CATALOG_SORT_OPTIONS = [
  { orderBy: 1, sort: 'recent', label: 'Relevancia' },
  { orderBy: 2, sort: 'price:desc', label: 'Precio ↓' },
  { orderBy: 3, sort: 'price:asc', label: 'Precio ↑' },
] as const;

export type CatalogSort = (typeof CATALOG_SORT_OPTIONS)[number]['sort'];

export function sortFromOrderBy(orderBy: number): CatalogSort {
  return CATALOG_SORT_OPTIONS.find((o) => o.orderBy === orderBy)?.sort ?? 'recent';
}

export function orderByFromSort(sort: string): number {
  return CATALOG_SORT_OPTIONS.find((o) => o.sort === sort)?.orderBy ?? 1;
}
