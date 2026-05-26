'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/admin-api';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import type { FilterOption, GroupFiltersState } from '@/shared/types/admin-table-config';

const OPTIONS_STALE_MS = 10 * 60 * 1000;

export function useAdminFilterOptions(groupFilters?: GroupFiltersState) {
  const { data: families } = useQuery({
    queryKey: queryKeys.adminFamilies,
    queryFn: adminApi.listFamilies,
    staleTime: OPTIONS_STALE_MS,
    gcTime: 30 * 60 * 1000,
  });

  const { data: tree } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
    staleTime: OPTIONS_STALE_MS,
    gcTime: 30 * 60 * 1000,
  });

  const familyOptions: FilterOption[] = useMemo(
    () => (families ?? []).map((f) => ({ label: f.name, value: f.id })),
    [families],
  );

  const categoryOptions: FilterOption[] = useMemo(() => {
    const selectedFamilies = groupFilters?.familyId ?? [];
    const rows =
      tree?.flatMap((f) =>
        f.categories.map((c) => ({
          familyId: f.id,
          id: c.id,
          name: c.name,
        })),
      ) ?? [];
    const filtered =
      selectedFamilies.length > 0
        ? rows.filter((c) => selectedFamilies.includes(c.familyId))
        : rows;
    return filtered.map((c) => ({ label: c.name, value: c.id }));
  }, [tree, groupFilters?.familyId]);

  return {
    families: familyOptions,
    categories: categoryOptions,
  };
}
