'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFacetsForScope } from '@/entities/catalog/lib/catalog-facets';
import { useCatalogQueryState } from '@/shared/hooks/use-catalog-query-state';
import { FilterAccordion } from '@/widgets/catalog-filters-panel/ui/filter-accordion';
import { Button } from '@/shared/ui/button';

export function FiltersPanel({
  scope,
}: {
  scope: { familyId?: string; categoryId?: string; subCategoryId?: string };
}) {
  const [openFacetKey, setOpenFacetKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { filters, toggleFilter, clearFilters } = useCatalogQueryState();

  const { data: facets, isLoading } = useQuery({
    queryKey: ['catalog-facets', scope],
    queryFn: () => getFacetsForScope(scope),
  });

  const panel = (
    <div className="flex min-h-0 max-h-[min(70vh,100%)] flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/90 lg:max-h-full lg:h-full">
      <div className="shrink-0 border-b border-gray-800 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-white">Filtros</h3>
            <p className="text-xs text-gray-400">Refina tu búsqueda</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-purple-400 hover:text-purple-300"
            onClick={clearFilters}
          >
            Limpiar
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pt-3">
        {isLoading && <p className="text-sm text-gray-500">Cargando filtros…</p>}
        {!isLoading && !facets?.length && (
          <p className="text-sm text-gray-500">No hay filtros para este catálogo.</p>
        )}
        {facets && facets.length > 0 && (
          <FilterAccordion
            facets={facets}
            filters={filters}
            openFacetKey={openFacetKey}
            onOpenFacetKey={setOpenFacetKey}
            onToggle={toggleFilter}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-col lg:h-full">
      <button
        type="button"
        className="mb-4 w-full shrink-0 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-white lg:hidden"
        onClick={() => setMobileOpen((o) => !o)}
      >
        {mobileOpen ? 'Ocultar filtros' : 'Filtros'}
      </button>
      <div
        className={
          mobileOpen
            ? 'flex min-h-0 flex-1 flex-col'
            : 'hidden min-h-0 flex-1 flex-col lg:flex'
        }
      >
        {panel}
      </div>
    </div>
  );
}
