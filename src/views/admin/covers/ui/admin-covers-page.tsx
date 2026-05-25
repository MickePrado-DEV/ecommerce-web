'use client';

import { useMemo } from 'react';
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
import { adminApi } from '@/entities/admin/api/admin-api';
import type { CoverAdminDto } from '@/entities/admin/model/types';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { GripVertical } from 'lucide-react';

function SortableCoverRow({
  cover,
  onDelete,
}: {
  cover: CoverAdminDto;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cover.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-white/5 bg-zinc-950/50">
      <td className="p-2">
        <button
          type="button"
          className="cursor-grab rounded p-1 hover:bg-white/10 active:cursor-grabbing"
          aria-label="Arrastrar"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-zinc-500" />
        </button>
      </td>
      <td className="p-2">{cover.title}</td>
      <td className="p-2">{cover.isActive ? 'Sí' : 'No'}</td>
      <td className="flex gap-2 p-2">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/admin/covers/${cover.id}/edit`}>Editar</Link>
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(cover.id)}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
}

export function AdminCoversPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminCovers, queryFn: adminApi.listCovers });

  const sorted = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [data],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((c) => c.id === active.id);
    const newIndex = sorted.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(sorted, oldIndex, newIndex);
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
      <p className="mb-4 text-sm text-zinc-400">Arrastra las filas para reordenar (PATCH /admin/covers/reorder).</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-400">
              <th className="w-10 p-2" />
              <th className="p-2">Título</th>
              <th className="p-2">Activa</th>
              <th className="p-2" />
            </tr>
          </thead>
          <SortableContext items={sorted.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {sorted.map((c) => (
                <SortableCoverRow key={c.id} cover={c} onDelete={(id) => del.mutate(id)} />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
    </div>
  );
}
