import type { AdminTableSortState } from '@/shared/types/admin-table-config';
import type { GroupFiltersState } from '@/shared/types/admin-table-config';

export interface AdminTableQueryParams {
  page: number;
  pageSize: number;
  sortKey: string | null;
  sortDir: 'asc' | 'desc';
  search: string;
  familyName: string;
  categoryName: string;
  familyIds: string[];
  categoryIds: string[];
  nameInitials: string[];
  idBuckets: string[];
}

const GROUP_FIELD_TO_PARAM: Record<string, keyof AdminTableQueryParams> = {
  familyId: 'familyIds',
  categoryId: 'categoryIds',
  nameInitial: 'nameInitials',
  idBucket: 'idBuckets',
};

export function parseAdminTableSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  defaultPageSize = 10,
): AdminTableQueryParams {
  const get = (key: string): string => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key) ?? '';
    const v = searchParams[key];
    return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
  };

  const splitList = (key: string) =>
    get(key)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  return {
    page: Math.max(1, Number(get('page')) || 1),
    pageSize: Math.max(1, Number(get('pageSize')) || defaultPageSize),
    sortKey: get('sortKey') || null,
    sortDir: get('sortDir') === 'desc' ? 'desc' : 'asc',
    search: get('search'),
    familyName: get('familyName'),
    categoryName: get('categoryName'),
    familyIds: splitList('familyIds'),
    categoryIds: splitList('categoryIds'),
    nameInitials: splitList('initials'),
    idBuckets: splitList('idBuckets'),
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
  if (params.familyIds.length) qs.set('familyIds', params.familyIds.join(','));
  if (params.categoryIds.length) qs.set('categoryIds', params.categoryIds.join(','));
  if (params.nameInitials.length) qs.set('initials', params.nameInitials.join(','));
  if (params.idBuckets.length) qs.set('idBuckets', params.idBuckets.join(','));
  return qs.toString();
}

export function groupFiltersFromParams(params: AdminTableQueryParams): GroupFiltersState {
  const state: GroupFiltersState = {};
  if (params.familyIds.length) state.familyId = params.familyIds;
  if (params.categoryIds.length) state.categoryId = params.categoryIds;
  if (params.nameInitials.length) state.nameInitial = params.nameInitials;
  if (params.idBuckets.length) state.idBucket = params.idBuckets;
  return state;
}

export function paramsFromGroupFilters(
  base: AdminTableQueryParams,
  groupFilters: GroupFiltersState,
): AdminTableQueryParams {
  const next = { ...base, page: 1, familyIds: [] as string[], categoryIds: [] as string[], nameInitials: [] as string[], idBuckets: [] as string[] };
  for (const [field, values] of Object.entries(groupFilters)) {
    const param = GROUP_FIELD_TO_PARAM[field];
    if (!param || !values.length) continue;
    (next[param] as string[]) = values;
  }
  return next;
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
