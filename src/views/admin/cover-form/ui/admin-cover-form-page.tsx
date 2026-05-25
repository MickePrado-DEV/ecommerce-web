'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '@/entities/admin/api/admin-api';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function AdminCoverFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);

  const { data } = useQuery({
    queryKey: ['admin-cover', id],
    queryFn: () => adminApi.getCover(id!),
    enabled: isEdit,
  });

  const form = useForm({
    values: data ?? { title: '', imageUrl: '', linkUrl: '', sortOrder: 0, isActive: true },
  });

  const save = useMutation({
    mutationFn: (body: unknown) => adminApi.saveCover(body, isEdit ? id : undefined),
    onSuccess: () => { toast.success('Guardado'); router.push('/admin/covers'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar portada' : 'Nueva portada'} />
      <form onSubmit={form.handleSubmit((d) => save.mutate(d))} className="max-w-md space-y-4">
        <div><Label>Título</Label><Input {...form.register('title')} /></div>
        <div><Label>URL imagen</Label><Input {...form.register('imageUrl')} /></div>
        <div><Label>Enlace</Label><Input {...form.register('linkUrl')} /></div>
        <div><Label>Orden</Label><Input type="number" {...form.register('sortOrder', { valueAsNumber: true })} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register('isActive')} /> Activa</label>
        <Button type="submit">Guardar</Button>
      </form>
    </div>
  );
}
