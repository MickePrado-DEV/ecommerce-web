'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { buildProductQueryParams } from '@/shared/lib/catalog-query-state';
import { useCatalogQueryState } from '@/shared/hooks/use-catalog-query-state';
import { FiltersPanel } from '@/widgets/catalog-filters-panel/ui/filters-panel';
import { SortSelect } from '@/widgets/catalog-sort-select/ui/sort-select';
import { PaginationBar } from '@/widgets/catalog-pagination/ui/pagination-bar';
import { CatalogProductCard } from '@/widgets/catalog-product-listing/ui/catalog-product-card';
import { LoadingGrid } from '@/shared/ui/loading-grid';
import { EmptyState } from '@/shared/ui/empty-state';
import type { CatalogScope } from '@/entities/catalog/lib/resolve-catalog-scope';

function CatalogProductListingInner({
  scope,
}: {
  scope: CatalogScope;
}) {
  const searchParams = useSearchParams();
  const { page, pageSize, setPage } = useCatalogQueryState();
  const params = buildProductQueryParams(scope, searchParams);
  const qs = params.toString();

  const { data, isLoading } = useQuery({
    queryKey: ['catalog-products', qs],
    queryFn: () => catalogApi.getProducts(params),
  });

  const total = data?.total ?? 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <aside className="flex w-full min-h-0 shrink-0 flex-col lg:h-full lg:w-72">
        <FiltersPanel scope={scope} />
      </aside>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="shrink-0 border-b border-gray-800 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">{total}</span> productos encontrados
            </p>
            <SortSelect />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          {isLoading && <LoadingGrid />}
          {!isLoading && !data?.items.length && (
            <EmptyState message="No hay productos con estos filtros." />
          )}
          {!isLoading && !!data?.items.length && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.items.map((p) => (
                <CatalogProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        <PaginationBar
          page={page}
          pageSize={data?.pageSize ?? pageSize}
          total={total}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}

export function CatalogProductListing({ scope }: { scope: CatalogScope }) {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Cargando productos…</p>}>
      <CatalogProductListingInner scope={scope} />
    </Suspense>
  );
}
