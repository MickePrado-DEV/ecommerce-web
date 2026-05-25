export type CatalogFiltersState = Record<string, string[]>;

export const DEFAULT_PAGE_SIZE = 12;

export function parseFiltersFromSearchParams(params: URLSearchParams): CatalogFiltersState {
  const filters: CatalogFiltersState = {};
  params.forEach((value, key) => {
    if (!key.startsWith('f_')) return;
    const optionId = key.slice(2);
    const ids = value.split(',').filter(Boolean);
    if (ids.length) filters[optionId] = ids;
  });
  const legacy = params.get('optionValueIds');
  if (legacy) {
    filters._legacy = legacy.split(',').filter(Boolean);
  }
  return filters;
}

export function filtersToOptionValueIds(filters: CatalogFiltersState): string[] {
  const ids = Object.entries(filters).flatMap(([key, values]) =>
    key === '_legacy' ? values : values,
  );
  return [...new Set(ids)];
}

export function setFilterInSearchParams(
  base: URLSearchParams,
  optionId: string,
  valueId: string,
  checked: boolean,
): URLSearchParams {
  const next = new URLSearchParams(base.toString());
  const key = `f_${optionId}`;
  const current = new Set((next.get(key) ?? '').split(',').filter(Boolean));
  if (checked) current.add(valueId);
  else current.delete(valueId);
  if (current.size) next.set(key, [...current].join(','));
  else next.delete(key);
  next.delete('optionValueIds');
  next.set('page', '1');
  return next;
}

export function clearFiltersInSearchParams(base: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(base.toString());
  [...next.keys()].forEach((key) => {
    if (key.startsWith('f_') || key === 'optionValueIds') next.delete(key);
  });
  next.set('page', '1');
  return next;
}

export function buildProductQueryParams(
  scope: { familyId?: string; categoryId?: string; subCategoryId?: string },
  searchParams: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams();
  if (scope.familyId) params.set('familyId', scope.familyId);
  if (scope.categoryId) params.set('categoryId', scope.categoryId);
  if (scope.subCategoryId) params.set('subCategoryId', scope.subCategoryId);

  params.set('page', searchParams.get('page') ?? '1');
  params.set('pageSize', searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE));
  params.set('sort', searchParams.get('sort') ?? 'recent');

  const q = searchParams.get('q');
  if (q) params.set('q', q);

  const optionValueIds = filtersToOptionValueIds(parseFiltersFromSearchParams(searchParams));
  if (optionValueIds.length) params.set('optionValueIds', optionValueIds.join(','));

  return params;
}
