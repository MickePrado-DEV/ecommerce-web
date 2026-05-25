'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { ProductCard } from '@/entities/product/ui/product-card';
import { queryKeys } from '@/shared/lib/query-keys';
import Link from 'next/link';
import { Skeleton } from '@/shared/ui/skeleton';

export function HomePage() {
  const { data: home, isLoading, isError } = useQuery({
    queryKey: queryKeys.catalogHome,
    queryFn: () => catalogApi.getHome(12),
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (isError || !home)
    return (
      <p className="text-amber-400">
        No se pudo conectar al API. Arranca el backend en http://localhost:5088
      </p>
    );

  return (
    <div className="space-y-12">
      {home.covers.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-white/10">
          <div className="relative aspect-[3/1] bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={home.covers[0].imageUrl} alt={home.covers[0].title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-8">
              <h2 className="text-3xl font-bold">{home.covers[0].title}</h2>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Novedades</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {home.latestProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <Link href="/search?q=" className="text-violet-400 hover:underline">
          Ver catálogo →
        </Link>
      </section>
    </div>
  );
}
