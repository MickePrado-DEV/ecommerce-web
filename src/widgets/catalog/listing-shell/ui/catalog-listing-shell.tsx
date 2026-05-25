import type { ReactNode } from 'react';
import { CatalogBreadcrumb, type BreadcrumbSegment } from '@/widgets/catalog/breadcrumb/ui/catalog-breadcrumb';

export function CatalogListingShell({
  title,
  subtitle = 'Explora productos y filtra por características.',
  segments,
  children,
}: {
  title: string;
  subtitle?: string;
  segments: BreadcrumbSegment[];
  children: ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col">
      <div className="shrink-0 space-y-4 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
        </div>
        <CatalogBreadcrumb segments={segments} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
