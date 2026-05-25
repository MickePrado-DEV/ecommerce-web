'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { CatalogListingShell } from '@/widgets/catalog-listing-shell/ui/catalog-listing-shell';
import { CatalogProductListing } from '@/widgets/catalog-product-listing/ui/catalog-product-listing';

function CatalogCategoryContent({
  familySlug,
  categorySlug,
}: {
  familySlug: string;
  categorySlug: string;
}) {
  const { data: family } = useQuery({
    queryKey: ['family', familySlug],
    queryFn: () => catalogApi.getFamily(familySlug),
  });
  const { data: category, isError } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: () => catalogApi.getCategory(categorySlug),
  });

  if (isError) return <p className="text-gray-500">Categoría no encontrada.</p>;
  if (!family || !category) return <p className="text-gray-500">Cargando…</p>;
  if (category.familyId !== family.id) {
    return <p className="text-gray-500">La categoría no pertenece a esta familia.</p>;
  }

  return (
    <CatalogListingShell
      title={category.name}
      segments={[
        { label: 'Catálogo', href: '/catalog' },
        { label: family.name, href: `/catalog/${family.slug}` },
        { label: category.name },
      ]}
    >
      <CatalogProductListing scope={{ familyId: family.id, categoryId: category.id }} />
    </CatalogListingShell>
  );
}

export function CatalogCategoryPage() {
  const { familySlug, categorySlug } = useParams<{
    familySlug: string;
    categorySlug: string;
  }>();
  return (
    <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
      <CatalogCategoryContent familySlug={familySlug} categorySlug={categorySlug} />
    </Suspense>
  );
}
