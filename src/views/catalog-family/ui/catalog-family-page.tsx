'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { CatalogListingShell } from '@/widgets/catalog-listing-shell/ui/catalog-listing-shell';
import { CatalogProductListing } from '@/widgets/catalog-product-listing/ui/catalog-product-listing';

function CatalogFamilyContent({ slug }: { slug: string }) {
  const { data: family, isError } = useQuery({
    queryKey: ['family', slug],
    queryFn: () => catalogApi.getFamily(slug),
  });

  if (isError) return <p className="text-gray-500">Familia no encontrada.</p>;
  if (!family) return <p className="text-gray-500">Cargando…</p>;

  return (
    <CatalogListingShell
      title={family.name}
      segments={[
        { label: 'Catálogo', href: '/catalog' },
        { label: family.name },
      ]}
    >
      <CatalogProductListing scope={{ familyId: family.id }} />
    </CatalogListingShell>
  );
}

export function CatalogFamilyPage() {
  const { familySlug } = useParams<{ familySlug: string }>();
  return (
    <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
      <CatalogFamilyContent slug={familySlug} />
    </Suspense>
  );
}
