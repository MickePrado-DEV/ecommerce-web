'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { formatMoney } from '@/shared/lib/format-money';

export function AdminProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminProducts(1),
    queryFn: () => adminApi.listProducts(1, 50),
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Productos" action={<Button asChild><Link href="/admin/products/new">Nuevo</Link></Button>} />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Nombre</th><th className="p-2">Precio</th><th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {data?.items.map((p) => (
            <tr key={p.id} className="border-b border-white/5">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{formatMoney(p.basePrice)}</td>
              <td className="p-2 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild><Link href={`/admin/products/${p.id}/edit`}>Editar</Link></Button>
                <Button size="sm" variant="outline" asChild><Link href={`/admin/products/${p.id}/variants`}>Variantes</Link></Button>
                <Button size="sm" variant="outline" asChild><Link href={`/admin/products/${p.id}/options`}>Opciones</Link></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
