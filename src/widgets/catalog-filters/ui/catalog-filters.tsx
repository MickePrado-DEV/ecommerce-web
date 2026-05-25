'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { Label } from '@/shared/ui/label';
import { CATALOG_SORT_OPTIONS } from '@/shared/lib/catalog-sort';

export function CatalogFilters({
  scope,
}: {
  scope: { familyId?: string; categoryId?: string; subCategoryId?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') ?? 'recent';
  const selectedIds = (searchParams.get('optionValueIds') ?? '')
    .split(',')
    .filter(Boolean);

  const { data: filterOptions } = useQuery({
    queryKey: ['catalog-filter-options', scope],
    queryFn: () => catalogApi.getFilterOptions(scope),
  });

  const pushParams = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams.toString());
    mutate(next);
    next.delete('page');
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const onSortChange = (value: string) => {
    pushParams((next) => {
      if (value === 'recent') next.delete('sort');
      else next.set('sort', value);
    });
  };

  const toggleOptionValue = (id: string) => {
    pushParams((next) => {
      const current = (next.get('optionValueIds') ?? '').split(',').filter(Boolean);
      const updated = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      if (updated.length) next.set('optionValueIds', updated.join(','));
      else next.delete('optionValueIds');
    });
  };

  return (
    <div className="mb-6 space-y-4 rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="catalog-sort" className="text-xs text-zinc-400">
            Ordenar por
          </Label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="mt-1 block min-w-[10rem] rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
          >
            {CATALOG_SORT_OPTIONS.map((o) => (
              <option key={o.sort} value={o.sort}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        {searchParams.get('q') && (
          <p className="text-sm text-zinc-400">
            Búsqueda: <span className="text-violet-300">{searchParams.get('q')}</span>
          </p>
        )}
      </div>

      {!!filterOptions?.length && (
        <div className="space-y-3 border-t border-white/10 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Filtrar por característica
          </p>
          {filterOptions.map((opt) => (
            <div key={opt.id}>
              <p className="mb-2 text-sm font-medium">{opt.name}</p>
              <div className="flex flex-wrap gap-3">
                {opt.values.map((v) => (
                  <label key={v.id} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(v.id)}
                      onChange={() => toggleOptionValue(v.id)}
                    />
                    {v.value}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
