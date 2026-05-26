'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/entities/admin/api/admin-api';
import type { CoverAdminDto } from '@/entities/admin/model/types';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { resolveMediaUrl } from '@/shared/lib/media-url';

const PAGE_SIZE = 10;

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isPrincipal(c: CoverAdminDto) {
  return c.isEffectivelyActive && c.sortOrder >= 1 && c.sortOrder <= 5;
}

function SortablePrincipalCard({
  cover,
  displayOrder,
  onDelete,
}: {
  cover: CoverAdminDto;
  displayOrder: number;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cover.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-900/80 p-3"
    >
      <button
        type="button"
        className="cursor-grab rounded p-1 hover:bg-white/10 active:cursor-grabbing"
        aria-label="Arrastrar para reordenar"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-zinc-500" />
      </button>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-sm font-semibold text-violet-300">
        {displayOrder}
      </span>
      <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={resolveMediaUrl(cover.imageUrl)} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-white">{cover.title}</p>
        <p className="mt-1 text-xs text-zinc-400">
          {formatDate(cover.startsAt)} — {formatDate(cover.endsAt)}
        </p>
      </div>
      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        Activa
      </span>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/admin/covers/${cover.id}/edit`}>
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Editar
          </Link>
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(cover.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function AdminCoversPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);

  const { data: allCovers, isLoading: loadingAll } = useQuery({
    queryKey: queryKeys.adminCovers,
    queryFn: adminApi.listCovers,
  });

  const { data: paged, isLoading: loadingPaged } = useQuery({
    queryKey: queryKeys.adminCoversPaged(page),
    queryFn: () => adminApi.listCoversPaged(page, PAGE_SIZE),
  });

  const principal = useMemo(
    () =>
      [...(allCovers ?? [])]
        .filter(isPrincipal)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [allCovers],
  );

  const [localPrincipal, setLocalPrincipal] = useState<CoverAdminDto[] | null>(null);
  const displayPrincipal = localPrincipal ?? principal;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const invalidate = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: queryKeys.adminCovers }),
      qc.invalidateQueries({ queryKey: ['admin', 'covers', 'paged'] }),
      qc.invalidateQueries({ queryKey: queryKeys.catalogHome }),
    ]);

  const del = useMutation({
    mutationFn: adminApi.deleteCover,
    onSuccess: async () => {
      await invalidate();
      toast.success('Portada eliminada');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: (ids: string[]) => adminApi.reorderCovers(ids),
    onSuccess: async () => {
      setLocalPrincipal(null);
      await invalidate();
      toast.success('Orden guardado');
    },
    onError: (e: Error) => {
      setLocalPrincipal(null);
      toast.error(e.message);
    },
  });

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = displayPrincipal.findIndex((c) => c.id === active.id);
    const newIndex = displayPrincipal.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(displayPrincipal, oldIndex, newIndex);
    const next = reordered.map((c, i) => ({ ...c, sortOrder: i + 1 }));
    setLocalPrincipal(next);
    reorder.mutate(reordered.map((c) => c.id));
  };

  const totalPages = paged ? Math.max(1, Math.ceil(paged.total / PAGE_SIZE)) : 1;

  if (loadingAll) return <p className="text-zinc-400">Cargando portadas…</p>;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Portadas"
        action={
          <Button asChild className="bg-violet-600 hover:bg-violet-500">
            <Link href="/admin/covers/new">+ Crear portada</Link>
          </Button>
        }
      />

      <section>
        <h2 className="mb-1 text-lg font-semibold text-white">
          Portadas principales (máx 5 activas)
        </h2>
        <p className="mb-4 text-sm text-zinc-400">
          Arrastra para cambiar el orden en el home. Solo portadas activas y vigentes.
        </p>
        {displayPrincipal.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
            No hay portadas principales. Activa una portada desde el formulario de edición.
          </p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              items={displayPrincipal.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {displayPrincipal.map((c, index) => (
                  <SortablePrincipalCard
                    key={c.id}
                    cover={c}
                    displayOrder={index + 1}
                    onDelete={(id) => del.mutate(id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Todas las portadas</h2>
        {loadingPaged && <p className="text-zinc-400">Cargando…</p>}
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-900/50 text-zinc-400">
                <th className="p-3 w-24" />
                <th className="p-3">Título</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fechas</th>
                <th className="p-3">Orden</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {paged?.items.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-3">
                    <div className="h-12 w-20 overflow-hidden rounded-md bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveMediaUrl(c.imageUrl)} alt="" className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="p-3 font-medium">{c.title}</td>
                  <td className="p-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        c.isEffectivelyActive
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-zinc-700/50 text-zinc-400',
                      )}
                    >
                      {c.isEffectivelyActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-zinc-400">
                    {formatDate(c.startsAt)} — {formatDate(c.endsAt)}
                  </td>
                  <td className="p-3 text-zinc-400">
                    {c.isEffectivelyActive && c.sortOrder > 0 ? c.sortOrder : '—'}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/covers/${c.id}/edit`}>Editar</Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => del.mutate(c.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paged && paged.total > PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
            <span>
              Página {page} de {totalPages} ({paged.total} total)
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
        {!loadingPaged && !paged?.items.length && (
          <p className="mt-4 text-zinc-500">No hay portadas registradas.</p>
        )}
      </section>
    </div>
  );
}
