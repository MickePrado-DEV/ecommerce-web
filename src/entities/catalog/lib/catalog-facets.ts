import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { buildProductQueryParams } from '@/shared/lib/catalog/query-state';
import type { CatalogOptionDto } from '@/entities/catalog/model/types';

export type FacetOption = {
  value: string;
  label: string;
  count: number;
};

export type FacetGroup = {
  key: string;
  label: string;
  options: FacetOption[];
};

export async function getFacetsForScope(
  scope: { familyId?: string; categoryId?: string; subCategoryId?: string },
): Promise<FacetGroup[]> {
  const filterOptions = await catalogApi.getFilterOptions(scope);
  if (!filterOptions.length) return [];

  const facets = await Promise.all(
    filterOptions.map(async (opt: CatalogOptionDto) => {
      const options = await Promise.all(
        opt.values.map(async (v) => {
          const params = buildProductQueryParams(scope, new URLSearchParams());
          params.set('optionValueIds', v.id);
          params.set('page', '1');
          params.set('pageSize', '1');
          const result = await catalogApi.getProducts(params);
          return { value: v.id, label: v.value, count: result.total };
        }),
      );
      return { key: opt.id, label: opt.name, options };
    }),
  );

  return facets;
}
