'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function AdminFamiliesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminFamilies, queryFn: adminApi.listFamilies });
  const del = useMutation({
    mutationFn: adminApi.deleteFamily,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.adminFamilies }); toast.success('Eliminada'); },
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Familias" action={<Button asChild><Link href="/admin/families/new">Nueva</Link></Button>} />
      <table className="w-full text-left text-sm">
        <thead><tr className="border-b border-white/10 text-zinc-400"><th className="p-2">Nombre</th><th className="p-2">Slug</th><th className="p-2" /></tr></thead>
        <tbody>
          {data?.map((f) => (
            <tr key={f.id} className="border-b border-white/5">
              <td className="p-2">{f.name}</td>
              <td className="p-2">{f.slug}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" asChild><Link href={`/admin/families/${f.id}/edit`}>Editar</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => del.mutate(f.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
