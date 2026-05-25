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

  return <CatalogProductGrid title={family.name} scope={{ familyId: family.id }} />;
}
