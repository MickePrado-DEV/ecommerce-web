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

export function AdminProductFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);
  const { data: list } = useQuery({
    queryKey: queryKeys.adminProducts(1),
    queryFn: () => adminApi.listProducts(1, 100),
    enabled: isEdit,
  });
  const { data: families } = useQuery({ queryKey: queryKeys.families, queryFn: catalogApi.getFamilies });
  const subcategories =
    families?.flatMap((f) => f.categories.flatMap((c) => c.subcategories.map((s) => ({ ...s, label: `${f.name} / ${c.name} / ${s.name}` })))) ?? [];
  const item = list?.items.find((p) => p.id === id);

  const form = useForm({
    values: item
      ? { subcategoryId: item.subcategoryId, name: item.name, slug: item.slug, description: item.description ?? '', basePrice: item.basePrice, isActive: item.isActive }
      : { subcategoryId: subcategories[0]?.id ?? '', name: '', slug: '', description: '', basePrice: 0, isActive: true },
  });

  const save = useMutation({
    mutationFn: (body: unknown) => adminApi.saveProduct(body, isEdit ? id : undefined),
    onSuccess: () => { toast.success('Guardado'); router.push('/admin/products'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar producto' : 'Nuevo producto'} />
      <form onSubmit={form.handleSubmit((d) => save.mutate(d))} className="max-w-lg space-y-4">
        <div>
          <Label>Subcategoría</Label>
          <select className="w-full rounded border border-white/10 bg-zinc-900 p-2" {...form.register('subcategoryId')}>
            {subcategories.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div><Label>Nombre</Label><Input {...form.register('name')} /></div>
        <div><Label>Slug</Label><Input {...form.register('slug')} /></div>
        <div><Label>Descripción</Label><Input {...form.register('description')} /></div>
        <div><Label>Precio base</Label><Input type="number" step="0.01" {...form.register('basePrice', { valueAsNumber: true })} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register('isActive')} /> Activo</label>
        <Button type="submit">Guardar</Button>
      </form>
    </div>
  );
}
