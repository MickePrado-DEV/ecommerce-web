'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { CatalogProductGrid } from '@/widgets/catalog-product-grid/ui/catalog-product-grid';

export function CategoryCatalogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => catalogApi.getCategory(slug),
  });

  if (!category) return <p>Cargando…</p>;

  const params = new URLSearchParams({ categoryId: category.id, page: '1', pageSize: '24' });
  return <CatalogProductGrid title={category.name} params={params} />;
}
