'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { useCatalogQueryState } from '@/shared/hooks/catalog/use-query-state';
import { PaginationBar } from '@/widgets/catalog/pagination/ui/pagination-bar';
import { DEFAULT_PAGE_SIZE } from '@/shared/lib/catalog/query-state';
import { ChevronRight } from 'lucide-react';

export function FamilyList() {
  const { page, pageSize, setPage } = useCatalogQueryState();
  const { data: families, isLoading } = useQuery({
    queryKey: ['catalog-families'],
    queryFn: catalogApi.getFamilies,
  });

  if (isLoading) return <p className="text-gray-500">Cargando familias…</p>;
  if (!families?.length) return <p className="text-gray-500">No hay familias en el catálogo.</p>;

  const size = pageSize || DEFAULT_PAGE_SIZE;
  const total = families.length;
  const start = (page - 1) * size;
  const pageItems = families.slice(start, start + size);

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="shrink-0 border-b border-gray-800 px-4 py-3">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">{total}</span> familias
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((f) => (
            <li key={f.id}>
              <Link
                href={`/catalog/${f.slug}`}
                className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/80 px-4 py-4 text-white transition hover:border-purple-500/50"
              >
                <span className="font-semibold">{f.name}</span>
                <ChevronRight className="h-5 w-5 text-purple-400" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <PaginationBar page={page} pageSize={size} total={total} onPageChange={setPage} />
    </div>
  );
}
