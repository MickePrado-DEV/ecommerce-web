'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Suspense, useState } from 'react';

function ProductFiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set('q', q);
    else params.delete('q');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Input
        placeholder="Filtrar en resultados…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-xs"
      />
      <Button type="button" variant="outline" onClick={apply}>
        Aplicar
      </Button>
    </div>
  );
}

export function ProductFilters() {
  return (
    <Suspense>
      <ProductFiltersContent />
    </Suspense>
  );
}
