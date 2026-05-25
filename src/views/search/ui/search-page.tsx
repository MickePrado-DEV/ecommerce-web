'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { ProductCard } from '@/entities/product/ui/product-card';
import { Suspense } from 'react';

function SearchContent() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => catalogApi.search(q),
    enabled: q.length > 0,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Búsqueda: {q || '—'}</h1>
      {isLoading && <p>Buscando…</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

export function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
