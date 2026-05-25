'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { CatalogProductGrid } from '@/widgets/catalog-product-grid/ui/catalog-product-grid';

export function SubcategoryCatalogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: sub } = useQuery({
    queryKey: ['subcategory', slug],
    queryFn: () => catalogApi.getSubcategory(slug),
  });

  if (!sub) return <p>Cargando…</p>;

  const params = new URLSearchParams({ subCategoryId: sub.id, page: '1', pageSize: '24' });
  return <CatalogProductGrid title={sub.name} params={params} />;
}
