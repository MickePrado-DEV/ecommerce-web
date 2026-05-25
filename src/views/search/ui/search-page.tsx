'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { ProductCard } from '@/entities/product/ui/product-card';
import { LoadingGrid } from '@/shared/ui/loading-grid';
import { EmptyState } from '@/shared/ui/empty-state';
import { Suspense } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get('q') ?? '';
  const [term, setTerm] = useState(q);

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => catalogApi.search(q),
    enabled: q.length > 0,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Búsqueda</h1>
      <form onSubmit={submit} className="mb-8 flex gap-2">
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar productos…"
          className="max-w-md"
        />
        <Button type="submit">Buscar</Button>
      </form>
      {!q && <EmptyState message="Escribe un término para buscar." />}
      {q && isLoading && <LoadingGrid />}
      {q && !isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data?.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      {q && !isLoading && !data?.items.length && (
        <EmptyState message={`Sin resultados para "${q}"`} />
      )}
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
