import type { AdminTableSortState } from '@/shared/types/admin-table-config';

export interface AdminTableQueryParams {
  page: number;
  pageSize: number;
  sortKey: string | null;
  sortDir: 'asc' | 'desc';
  search: string;
  familyName: string;
  categoryName: string;
}

export function parseAdminTableSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  defaultPageSize = 10,
): AdminTableQueryParams {
  const get = (key: string): string => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key) ?? '';
    const v = searchParams[key];
    return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
  };

  const page = Math.max(1, Number(get('page')) || 1);
  const pageSize = Math.max(1, Number(get('pageSize')) || defaultPageSize);
  const sortKey = get('sortKey') || null;
  const sortDir = get('sortDir') === 'desc' ? 'desc' : 'asc';

  return {
    page,
    pageSize,
    sortKey,
    sortDir,
    search: get('search'),
    familyName: get('familyName'),
    categoryName: get('categoryName'),
  };
}

export function adminTableParamsToQueryString(params: AdminTableQueryParams): string {
  const qs = new URLSearchParams();
  qs.set('page', String(params.page));
  qs.set('pageSize', String(params.pageSize));
  if (params.sortKey) qs.set('sortKey', params.sortKey);
  if (params.sortDir) qs.set('sortDir', params.sortDir);
  if (params.search) qs.set('search', params.search);
  if (params.familyName) qs.set('familyName', params.familyName);
  if (params.categoryName) qs.set('categoryName', params.categoryName);
  return qs.toString();
}

export function filtersFromParams(
  params: AdminTableQueryParams,
  columnKeys: { name?: string; familyName?: string; categoryName?: string },
): Record<string, string> {
  const f: Record<string, string> = {};
  if (columnKeys.name && params.search) f[columnKeys.name] = params.search;
  if (columnKeys.familyName && params.familyName) f[columnKeys.familyName] = params.familyName;
  if (columnKeys.categoryName && params.categoryName) f[columnKeys.categoryName] = params.categoryName;
  return f;
}

export function paramsFromFilters(
  base: AdminTableQueryParams,
  filters: Record<string, string>,
  columnKeys: { name?: string; familyName?: string; categoryName?: string },
): AdminTableQueryParams {
  return {
    ...base,
    page: 1,
    search: columnKeys.name ? (filters[columnKeys.name] ?? '') : base.search,
    familyName: columnKeys.familyName ? (filters[columnKeys.familyName] ?? '') : base.familyName,
    categoryName: columnKeys.categoryName ? (filters[columnKeys.categoryName] ?? '') : base.categoryName,
  };
}

export function sortStateFromParams(params: AdminTableQueryParams): AdminTableSortState | null {
  if (!params.sortKey) return null;
  return { key: params.sortKey, direction: params.sortDir };
}
