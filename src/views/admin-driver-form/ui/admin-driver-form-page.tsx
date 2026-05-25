'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function AdminDriverFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);
  const { data: drivers } = useQuery({ queryKey: queryKeys.adminDrivers, queryFn: adminApi.listDrivers, enabled: isEdit });
  const item = drivers?.find((d) => d.id === id);

  const form = useForm({
    values: item ?? { name: '', phone: '', isActive: true },
  });

  const save = useMutation({
    mutationFn: (body: unknown) => adminApi.saveDriver(body, isEdit ? id : undefined),
    onSuccess: () => { toast.success('Guardado'); router.push('/admin/drivers'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar repartidor' : 'Nuevo repartidor'} />
      <form onSubmit={form.handleSubmit((d) => save.mutate(d))} className="max-w-md space-y-4">
        <div><Label>Nombre</Label><Input {...form.register('name')} /></div>
        <div><Label>Teléfono</Label><Input {...form.register('phone')} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register('isActive')} /> Activo</label>
        <Button type="submit">Guardar</Button>
      </form>
    </div>
  );
}
