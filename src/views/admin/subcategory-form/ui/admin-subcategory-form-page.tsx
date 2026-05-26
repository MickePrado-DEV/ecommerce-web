'use client';

import { useEffect, useMemo } from 'react';
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

const selectClass =
  'flex h-10 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100';

type SubcategoryFormValues = {
  familyId: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

function slugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AdminSubcategoryFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);
  const { data: families, isLoading } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
  });

  const existing = useMemo(() => {
    if (!families || !id) return undefined;
    for (const f of families) {
      for (const c of f.categories) {
        const sub = c.subcategories.find((s) => s.id === id);
        if (sub) return { ...sub, categoryId: c.id, familyId: f.id };
      }
    }
    return undefined;
  }, [families, id]);

  const defaultFamilyId = families?.[0]?.id ?? '';
  const defaultCategoryId = families?.[0]?.categories[0]?.id ?? '';

  const form = useForm<SubcategoryFormValues>({
    values: existing
      ? {
          familyId: existing.familyId,
          categoryId: existing.categoryId,
          name: existing.name,
          slug: existing.slug,
          sortOrder: 0,
          isActive: true,
        }
      : {
          familyId: defaultFamilyId,
          categoryId: defaultCategoryId,
          name: '',
          slug: '',
          sortOrder: 0,
          isActive: true,
        },
  });

  const familyId = form.watch('familyId');

  const categoriesForFamily = useMemo(() => {
    if (!families?.length || !familyId) return [];
    return families.find((f) => f.id === familyId)?.categories ?? [];
  }, [families, familyId]);

  useEffect(() => {
    const currentCategoryId = form.getValues('categoryId');
    if (!categoriesForFamily.length) {
      if (currentCategoryId) form.setValue('categoryId', '');
      return;
    }
    if (!categoriesForFamily.some((c) => c.id === currentCategoryId)) {
      form.setValue('categoryId', categoriesForFamily[0].id);
    }
  }, [categoriesForFamily, form]);

  const save = useMutation({
    mutationFn: (body: Omit<SubcategoryFormValues, 'familyId'>) =>
      adminApi.saveSubcategory(
        {
          ...body,
          slug: body.slug || slugFromName(body.name),
        },
        isEdit ? id : undefined,
      ),
    onSuccess: () => {
      toast.success('Guardado');
      router.push('/admin/subcategories');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (data: SubcategoryFormValues) => {
    if (!data.familyId) {
      toast.error('Selecciona una familia');
      return;
    }
    if (!data.categoryId) {
      toast.error('Selecciona una categoría');
      return;
    }
    if (!data.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    const { familyId: _familyId, ...payload } = data;
    save.mutate(payload);
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <PageHeader title={isEdit ? 'Editar subcategoría' : 'Nueva subcategoría'} />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-6"
      >
        <div>
          <Label>Familia</Label>
          <select
            className={selectClass}
            disabled={isLoading || !families?.length}
            {...form.register('familyId', { required: true })}
          >
            <option value="">Selecciona una familia…</option>
            {families?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Categoría</Label>
          <select
            className={selectClass}
            disabled={!familyId || !categoriesForFamily.length}
            {...form.register('categoryId', { required: true })}
          >
            <option value="">
              {!familyId
                ? 'Primero selecciona una familia…'
                : !categoriesForFamily.length
                  ? 'Sin categorías en esta familia'
                  : 'Selecciona una categoría…'}
            </option>
            {categoriesForFamily.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Nombre</Label>
          <Input {...form.register('name', { required: true })} />
        </div>
        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500" disabled={save.isPending}>
          Guardar
        </Button>
      </form>
    </div>
  );
}
