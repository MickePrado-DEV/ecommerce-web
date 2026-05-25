'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { ProductCard } from '@/entities/product/ui/product-card';
import { queryKeys } from '@/shared/lib/query-keys';
import { LoadingGrid } from '@/shared/ui/loading-grid';
import { EmptyState } from '@/shared/ui/empty-state';
import { CatalogFilters } from '@/widgets/catalog-filters/ui/catalog-filters';

function CatalogProductGridInner({
  title,
  scope,
}: {
  title: string;
  scope: Record<string, string>;
}) {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') ?? 'recent';
  const q = searchParams.get('q') ?? '';
  const page = searchParams.get('page') ?? '1';
  const optionValueIds = searchParams.get('optionValueIds') ?? '';

  const params = new URLSearchParams({
    ...scope,
    page,
    pageSize: '12',
    sort,
  });
  if (q) params.set('q', q);
  if (optionValueIds) params.set('optionValueIds', optionValueIds);

  const qs = params.toString();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.products(qs),
    queryFn: () => catalogApi.getProducts(params),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <CatalogFilters scope={scope} />
      {isLoading && <LoadingGrid />}
      {!isLoading && !data?.items.length && <EmptyState message="No hay productos." />}
      {!isLoading && !!data?.items.length && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CatalogProductGrid({
  title,
  scope,
}: {
  title: string;
  scope: Record<string, string>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Cargando catálogo…</p>}>
      <CatalogProductGridInner title={title} scope={scope} />
    </Suspense>
  );
}
