'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { HeroCarousel } from '@/widgets/hero-carousel/ui/hero-carousel';
import { LatestProducts } from '@/widgets/latest-products/ui/latest-products';
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
    <div className="space-y-16">
      <HeroCarousel covers={home.covers} />
      <LatestProducts products={home.latestProducts} />
    </div>
  );
}
