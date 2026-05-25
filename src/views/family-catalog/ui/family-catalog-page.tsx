'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { CatalogProductGrid } from '@/widgets/catalog-product-grid/ui/catalog-product-grid';

export function FamilyCatalogPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: family } = useQuery({
    queryKey: ['family', slug],
    queryFn: () => catalogApi.getFamily(slug),
  });

  if (!family) return <p>Cargando…</p>;

  const params = new URLSearchParams({ familyId: family.id, page: '1', pageSize: '24' });
  return <CatalogProductGrid title={family.name} params={params} />;
}
