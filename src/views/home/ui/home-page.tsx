'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { ProductCard } from '@/entities/product/ui/product-card';
import { queryKeys } from '@/shared/lib/query-keys';
import { CoverCarousel } from '@/widgets/cover-carousel/ui/cover-carousel';
import { FamilyGrid } from '@/widgets/family-grid/ui/family-grid';
import Link from 'next/link';
import { Skeleton } from '@/shared/ui/skeleton';

export function HomePage() {
  const { data: home, isLoading, isError } = useQuery({
    queryKey: queryKeys.catalogHome,
    queryFn: () => catalogApi.getHome(12),
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !home) {
    return (
      <p className="text-amber-400">
        No se pudo conectar al API. Arranca el backend en http://localhost:5088
      </p>
    );
  }

  return (
    <div className="space-y-12">
      <CoverCarousel covers={home.covers} />
      <FamilyGrid />
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Novedades</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {home.latestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <Link href="/search" className="text-violet-400 hover:underline">
        Ver todo el catálogo →
      </Link>
    </div>
  );
}
