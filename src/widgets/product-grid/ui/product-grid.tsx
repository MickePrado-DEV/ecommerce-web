'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { ProductCard } from '@/entities/product/ui/product-card';
import { queryKeys } from '@/shared/lib/query-keys';
import { LoadingGrid } from '@/shared/ui/loading-grid';
import { EmptyState } from '@/shared/ui/empty-state';

export function ProductGrid({ params }: { params: URLSearchParams }) {
  const qs = params.toString();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.products(qs),
    queryFn: () => catalogApi.getProducts(params),
  });

  if (isLoading) return <LoadingGrid />;
  if (!data?.items.length) return <EmptyState message="No hay productos." />;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
