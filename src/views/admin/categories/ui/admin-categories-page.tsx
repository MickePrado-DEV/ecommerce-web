'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';

export function AdminCategoriesPage() {
  const { data: families, isLoading } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
  });

  const rows =
    families?.flatMap((f) =>
      f.categories.map((c) => ({ ...c, familyName: f.name })),
    ) ?? [];

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Categorías" action={<Button asChild><Link href="/admin/categories/new">Nueva</Link></Button>} />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Nombre</th><th className="p-2">Familia</th><th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id} className="border-b border-white/5">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.familyName}</td>
              <td className="p-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/categories/${c.id}/edit`}>Editar</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
