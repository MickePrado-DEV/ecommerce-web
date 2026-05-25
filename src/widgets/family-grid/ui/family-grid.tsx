'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Skeleton } from '@/shared/ui/skeleton';

export function FamilyGrid() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
  });

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (!data?.length) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Categorías</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((f) => (
          <Link
            key={f.id}
            href={`/families/${f.slug}`}
            className="rounded-lg border border-white/10 bg-white/5 p-6 transition hover:border-violet-500/50 hover:bg-violet-600/10"
          >
            <p className="font-medium">{f.name}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {f.categories.length} categoría{f.categories.length !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
