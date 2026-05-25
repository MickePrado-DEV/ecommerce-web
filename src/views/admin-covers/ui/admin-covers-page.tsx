'use client';

import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AdminCoversPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminCovers, queryFn: adminApi.listCovers });
  const [order, setOrder] = useState<string[]>([]);

  const sorted = useMemo(() => {
    const list = [...(data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    if (order.length === list.length && order.every((id, i) => list[i]?.id === id)) return list;
    if (order.length) {
      const map = new Map(list.map((c) => [c.id, c]));
      return order.map((id) => map.get(id)).filter(Boolean) as typeof list;
    }
    return list;
  }, [data, order]);

  const syncOrder = (items: typeof sorted) => setOrder(items.map((c) => c.id));

  const del = useMutation({
    mutationFn: adminApi.deleteCover,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminCovers });
      toast.success('Eliminada');
    },
  });

  const reorder = useMutation({
    mutationFn: (ids: string[]) => adminApi.reorderCovers(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminCovers });
      toast.success('Orden guardado');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const move = (index: number, dir: -1 | 1) => {
    const next = [...sorted];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    syncOrder(next);
    reorder.mutate(next.map((c) => c.id));
  };

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader
        title="Portadas"
        action={
          <Button asChild>
            <Link href="/admin/covers/new">Nueva</Link>
          </Button>
        }
      />
      <p className="mb-4 text-sm text-zinc-400">
        Usa las flechas para reordenar (equivalente al drag de Laravel → POST sort/covers).
      </p>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Orden</th>
            <th className="p-2">Título</th>
            <th className="p-2">Activa</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, index) => (
            <tr key={c.id} className="border-b border-white/5">
              <td className="p-2">
                <div className="flex items-center gap-1">
                  <span className="w-6 text-zinc-500">{index + 1}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={index === 0 || reorder.isPending}
                    onClick={() => move(index, -1)}
                    aria-label="Subir"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={index === sorted.length - 1 || reorder.isPending}
                    onClick={() => move(index, 1)}
                    aria-label="Bajar"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </td>
              <td className="p-2">{c.title}</td>
              <td className="p-2">{c.isActive ? 'Sí' : 'No'}</td>
              <td className="flex gap-2 p-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/covers/${c.id}/edit`}>Editar</Link>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => del.mutate(c.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
