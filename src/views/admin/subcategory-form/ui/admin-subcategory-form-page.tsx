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

export function AdminSubcategoryFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);
  const { data: families } = useQuery({ queryKey: queryKeys.families, queryFn: catalogApi.getFamilies });
  const categories = families?.flatMap((f) => f.categories) ?? [];
  const existing = categories
    .flatMap((c) => c.subcategories.map((s) => ({ ...s, categoryId: c.id })))
    .find((s) => s.id === id);

  const form = useForm({
    values: existing
      ? { categoryId: existing.categoryId, name: existing.name, slug: existing.slug, sortOrder: 0, isActive: true }
      : { categoryId: categories[0]?.id ?? '', name: '', slug: '', sortOrder: 0, isActive: true },
  });

  const save = useMutation({
    mutationFn: (body: unknown) => adminApi.saveSubcategory(body, isEdit ? id : undefined),
    onSuccess: () => { toast.success('Guardado'); router.push('/admin/subcategories'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar subcategoría' : 'Nueva subcategoría'} />
      <form onSubmit={form.handleSubmit((d) => save.mutate(d))} className="max-w-md space-y-4">
        <div>
          <Label>Categoría</Label>
          <select className="w-full rounded border border-white/10 bg-zinc-900 p-2" {...form.register('categoryId')}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
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
