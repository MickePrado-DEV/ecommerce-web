'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { ProductCard } from '@/entities/product/ui/product-card';
import { queryKeys } from '@/shared/lib/query-keys';

export function CatalogProductGrid({
  title,
  params,
}: {
  title: string;
  params: URLSearchParams;
}) {
  const qs = params.toString();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.products(qs),
    queryFn: () => catalogApi.getProducts(params),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      {isLoading && <p>Cargando…</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data?.items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {!isLoading && !data?.items.length && (
        <p className="text-zinc-500">No hay productos en esta sección.</p>
      )}
    </div>
  );
}
