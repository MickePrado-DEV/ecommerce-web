'use client';

import { ProductGrid } from '@/widgets/product-grid/ui/product-grid';

export function CatalogProductGrid({
  title,
  params,
}: {
  title: string;
  params: URLSearchParams;
}) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      <ProductGrid params={params} />
    </div>
  );
}
