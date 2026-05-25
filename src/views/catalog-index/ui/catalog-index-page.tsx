'use client';

import { Suspense } from 'react';
import { CatalogListingShell } from '@/widgets/catalog-listing-shell/ui/catalog-listing-shell';
import { FamilyList } from '@/widgets/catalog-family-list/ui/family-list';

function CatalogIndexContent() {
  return (
    <CatalogListingShell
      title="Catálogo"
      subtitle="Explora todas las familias de productos."
      segments={[{ label: 'Catálogo' }]}
    >
      <FamilyList />
    </CatalogListingShell>
  );
}

export function CatalogIndexPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Cargando…</p>}>
      <CatalogIndexContent />
    </Suspense>
  );
}
