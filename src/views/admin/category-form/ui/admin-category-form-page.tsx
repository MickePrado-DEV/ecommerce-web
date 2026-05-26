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

const selectClass =
  'flex h-10 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100';

type CategoryFormValues = {
  familyId: string;
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

export function AdminCategoryFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);
  const { data: families, isLoading } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
  });
  const existing = families
    ?.flatMap((f) => f.categories.map((c) => ({ ...c, familyId: f.id })))
    .find((c) => c.id === id);

  const form = useForm<CategoryFormValues>({
    values: existing
      ? {
          familyId: existing.familyId,
          name: existing.name,
          slug: existing.slug,
          sortOrder: 0,
          isActive: true,
        }
      : {
          familyId: families?.[0]?.id ?? '',
          name: '',
          slug: '',
          sortOrder: 0,
          isActive: true,
        },
  });

  const save = useMutation({
    mutationFn: (body: CategoryFormValues) =>
      adminApi.saveCategory(
        {
          ...body,
          slug: body.slug || slugFromName(body.name),
        },
        isEdit ? id : undefined,
      ),
    onSuccess: () => {
      toast.success('Guardado');
      router.push('/admin/categories');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (data: CategoryFormValues) => {
    if (!data.familyId) {
      toast.error('Selecciona una familia');
      return;
    }
    if (!data.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    save.mutate(data);
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <PageHeader title={isEdit ? 'Editar categoría' : 'Nueva categoría'} />
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
