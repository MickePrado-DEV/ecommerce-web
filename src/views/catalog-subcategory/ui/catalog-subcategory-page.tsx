'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { CatalogListingShell } from '@/widgets/catalog-listing-shell/ui/catalog-listing-shell';
import { CatalogProductListing } from '@/widgets/catalog-product-listing/ui/catalog-product-listing';

function CatalogSubcategoryContent({
  familySlug,
  categorySlug,
  subCategorySlug,
}: {
  familySlug: string;
  categorySlug: string;
  subCategorySlug: string;
}) {
  const { data: family } = useQuery({
    queryKey: ['family', familySlug],
    queryFn: () => catalogApi.getFamily(familySlug),
  });
  const { data: category } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: () => catalogApi.getCategory(categorySlug),
  });
  const { data: subcategory, isError } = useQuery({
    queryKey: ['subcategory', subCategorySlug],
    queryFn: () => catalogApi.getSubcategory(subCategorySlug),
  });

  if (isError) return <p className="text-gray-500">Subcategoría no encontrada.</p>;
  if (!family || !category || !subcategory) return <p className="text-gray-500">Cargando…</p>;
  if (category.familyId !== family.id || subcategory.categoryId !== category.id) {
    return <p className="text-gray-500">Ruta de catálogo no válida.</p>;
  }

  return (
    <CatalogListingShell
      title={subcategory.name}
      segments={[
        { label: 'Catálogo', href: '/catalog' },
        { label: family.name, href: `/catalog/${family.slug}` },
        { label: category.name, href: `/catalog/${family.slug}/${category.slug}` },
        { label: subcategory.name },
      ]}
    >
      <CatalogProductListing
        scope={{
          familyId: family.id,
          categoryId: category.id,
          subCategoryId: subcategory.id,
        }}
      />
    </CatalogListingShell>
  );
}

export function CatalogSubcategoryPage() {
  const { familySlug, categorySlug, subCategorySlug } = useParams<{
    familySlug: string;
    categorySlug: string;
    subCategorySlug: string;
  }>();
  return (
    <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
      <CatalogSubcategoryContent
        familySlug={familySlug}
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
      />
    </Suspense>
  );
}
