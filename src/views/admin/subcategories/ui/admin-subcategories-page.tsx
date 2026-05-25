'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';

export function AdminSubcategoriesPage() {
  const { data: families, isLoading } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
  });

  const rows =
    families?.flatMap((f) =>
      f.categories.flatMap((c) =>
        c.subcategories.map((s) => ({ ...s, categoryName: c.name })),
      ),
    ) ?? [];

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Subcategorías" action={<Button asChild><Link href="/admin/subcategories/new">Nueva</Link></Button>} />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Nombre</th><th className="p-2">Categoría</th><th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-b border-white/5">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.categoryName}</td>
              <td className="p-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/subcategories/${s.id}/edit`}>Editar</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
