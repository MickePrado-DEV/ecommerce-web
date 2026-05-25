'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  clearFiltersInSearchParams,
  parseFiltersFromSearchParams,
  setFilterInSearchParams,
  type CatalogFiltersState,
} from '@/shared/lib/catalog/query-state';

export function useCatalogQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const replaceParams = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const setSort = useCallback(
    (sort: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (sort === 'recent') next.delete('sort');
      else next.set('sort', sort);
      next.set('page', '1');
      replaceParams(next);
    },
    [searchParams, replaceParams],
  );

  const setPage = useCallback(
    (page: number) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('page', String(page));
      replaceParams(next);
    },
    [searchParams, replaceParams],
  );

  const toggleFilter = useCallback(
    (optionId: string, valueId: string, checked: boolean) => {
      replaceParams(setFilterInSearchParams(searchParams, optionId, valueId, checked));
    },
    [searchParams, replaceParams],
  );

  const clearFilters = useCallback(() => {
    replaceParams(clearFiltersInSearchParams(searchParams));
  }, [searchParams, replaceParams]);

  return {
    searchParams,
    filters: filters as CatalogFiltersState,
    sort: searchParams.get('sort') ?? 'recent',
    page: Math.max(1, Number(searchParams.get('page') ?? '1') || 1),
    pageSize: Number(searchParams.get('pageSize') ?? '12') || 12,
    setSort,
    setPage,
    toggleFilter,
    clearFilters,
  };
}
