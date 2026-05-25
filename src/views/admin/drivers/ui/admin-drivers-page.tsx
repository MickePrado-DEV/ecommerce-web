'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function AdminDriversPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminDrivers, queryFn: adminApi.listDrivers });
  const del = useMutation({
    mutationFn: adminApi.deleteDriver,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.adminDrivers }); toast.success('Eliminado'); },
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Repartidores" action={<Button asChild><Link href="/admin/drivers/new">Nuevo</Link></Button>} />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Nombre</th><th className="p-2">Teléfono</th><th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {data?.map((d) => (
            <tr key={d.id} className="border-b border-white/5">
              <td className="p-2">{d.name}</td>
              <td className="p-2">{d.phone}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" asChild><Link href={`/admin/drivers/${d.id}/edit`}>Editar</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => del.mutate(d.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
