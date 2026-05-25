'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '@/entities/admin/api/admin-api';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function AdminCategoryFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);
  const { data: families } = useQuery({ queryKey: queryKeys.families, queryFn: catalogApi.getFamilies });
  const existing = families?.flatMap((f) => f.categories.map((c) => ({ ...c, familyId: f.id }))).find((c) => c.id === id);

  const form = useForm({
    values: existing
      ? { familyId: existing.familyId, name: existing.name, slug: existing.slug, sortOrder: 0, isActive: true }
      : { familyId: families?.[0]?.id ?? '', name: '', slug: '', sortOrder: 0, isActive: true },
  });

  const save = useMutation({
    mutationFn: (body: unknown) => adminApi.saveCategory(body, isEdit ? id : undefined),
    onSuccess: () => { toast.success('Guardado'); router.push('/admin/categories'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar categoría' : 'Nueva categoría'} />
      <form onSubmit={form.handleSubmit((d) => save.mutate(d))} className="max-w-md space-y-4">
        <div>
          <Label>Familia</Label>
          <select className="w-full rounded border border-white/10 bg-zinc-900 p-2" {...form.register('familyId')}>
            {families?.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div><Label>Nombre</Label><Input {...form.register('name')} /></div>
        <div><Label>Slug</Label><Input {...form.register('slug')} /></div>
        <div><Label>Orden</Label><Input type="number" {...form.register('sortOrder', { valueAsNumber: true })} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register('isActive')} /> Activa</label>
        <Button type="submit">Guardar</Button>
      </form>
    </div>
  );
}
