'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function AdminCoversPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminCovers, queryFn: adminApi.listCovers });
  const del = useMutation({
    mutationFn: adminApi.deleteCover,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminCovers });
      toast.success('Eliminada');
    },
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Portadas" action={<Button asChild><Link href="/admin/covers/new">Nueva</Link></Button>} />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Título</th><th className="p-2">Orden</th><th className="p-2">Activa</th><th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {data?.map((c) => (
            <tr key={c.id} className="border-b border-white/5">
              <td className="p-2">{c.title}</td>
              <td className="p-2">{c.sortOrder}</td>
              <td className="p-2">{c.isActive ? 'Sí' : 'No'}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" asChild><Link href={`/admin/covers/${c.id}/edit`}>Editar</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => del.mutate(c.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
