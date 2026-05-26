'use client';

import { useCallback, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { AdminTableConfig, AdminTableSortState } from '@/shared/types/admin-table-config';
import type { AdminTableQueryParams } from '@/shared/lib/admin-table-url';
import {
  adminTableParamsToQueryString,
  filtersFromParams,
  groupFiltersFromParams,
  paramsFromFilters,
  paramsFromGroupFilters,
  parseAdminTableSearchParams,
  sortStateFromParams,
} from '@/shared/lib/admin-table-url';
import { getDefaultPageSize } from '@/widgets/admin/data-table/lib/table-data';

const TABLE_STALE_MS = 5 * 60 * 1000;

export interface UseAdminTableQueryOptions<T> {
  queryKey: (params: AdminTableQueryParams) => readonly unknown[];
  fetchPage: (params: AdminTableQueryParams) => Promise<{
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }>;
  tableConfig: AdminTableConfig<T>;
  filterKeys?: { name?: string; familyName?: string; categoryName?: string };
}

export function useAdminTableQuery<T extends object>({
  queryKey,
  fetchPage,
  tableConfig,
  filterKeys = { name: 'name' },
}: UseAdminTableQueryOptions<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultPageSize = getDefaultPageSize(tableConfig);

  const params = useMemo(
    () => parseAdminTableSearchParams(searchParams, defaultPageSize),
    [searchParams, defaultPageSize],
  );

  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const quickDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const replaceParams = useCallback(
    (next: AdminTableQueryParams) => {
      const qs = adminTableParamsToQueryString(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const query = useQuery({
    queryKey: queryKey(params),
    queryFn: () => fetchPage(params),
    staleTime: TABLE_STALE_MS,
    gcTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const groupFilters = groupFiltersFromParams(params);

  return {
    data: query.data?.items ?? [],
    paging: {
      page: query.data?.page ?? params.page,
      pageSize: query.data?.pageSize ?? params.pageSize,
      total: query.data?.total ?? 0,
    },
    sort: sortStateFromParams(params),
    filters: filtersFromParams(params, filterKeys),
    groupFilters,
    quickSearch: params.search,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    params,
    onSort: (next: AdminTableSortState) => {
      replaceParams({
        ...params,
        page: 1,
        sortKey: next.direction ? next.key : null,
        sortDir: next.direction ?? 'asc',
      });
    },
    onPageChange: (page: number, pageSize: number) => {
      replaceParams({ ...params, page, pageSize });
    },
    onFilterChange: (nextFilters: Record<string, string>) => {
      if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
      filterDebounceRef.current = setTimeout(() => {
        replaceParams(paramsFromFilters(params, nextFilters, filterKeys));
      }, 350);
    },
    onGroupFiltersChange: (next: typeof groupFilters) => {
      if (groupDebounceRef.current) clearTimeout(groupDebounceRef.current);
      groupDebounceRef.current = setTimeout(() => {
        replaceParams(paramsFromGroupFilters(params, next));
      }, 300);
    },
    onQuickSearchChange: (value: string) => {
      if (quickDebounceRef.current) clearTimeout(quickDebounceRef.current);
      quickDebounceRef.current = setTimeout(() => {
        replaceParams({ ...params, page: 1, search: value });
      }, 350);
    },
  };
}
