'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';

/** Opciones por producto (modelo .NET); equivalente al índice Laravel. */
export function AdminOptionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminProducts(1),
    queryFn: () => adminApi.listProducts(1, 50),
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Opciones de producto" />
      <p className="mb-6 text-sm text-zinc-400">
        En este proyecto las opciones (talla, color, etc.) se configuran por producto.
      </p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Producto</th>
            <th className="p-2">Slug</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {data?.items.map((p) => (
            <tr key={p.id} className="border-b border-white/5">
              <td className="p-2">{p.name}</td>
              <td className="p-2 text-zinc-400">{p.slug}</td>
              <td className="p-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/products/${p.id}/options`}>Gestionar opciones</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
