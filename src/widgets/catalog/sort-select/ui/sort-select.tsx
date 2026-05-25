'use client';

import { CATALOG_SORT_OPTIONS } from '@/shared/lib/catalog/sort';
import { useCatalogQueryState } from '@/shared/hooks/catalog/use-query-state';

const DISPLAY_OPTIONS = [
  { sort: 'recent', label: 'Relevancia' },
  { sort: 'price:desc', label: 'Precio' },
  { sort: 'price:asc', label: 'Más nuevos' },
] as const;

export function SortSelect() {
  const { sort, setSort } = useCatalogQueryState();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-400">
      <span className="shrink-0">Ordenar por:</span>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white"
      >
        {DISPLAY_OPTIONS.map((o) => (
          <option key={o.sort} value={o.sort}>
            {o.label}
          </option>
        ))}
        {!DISPLAY_OPTIONS.some((o) => o.sort === sort) &&
          CATALOG_SORT_OPTIONS.map((o) => (
            <option key={o.sort} value={o.sort}>
              {o.label}
            </option>
          ))}
      </select>
    </label>
  );
}
