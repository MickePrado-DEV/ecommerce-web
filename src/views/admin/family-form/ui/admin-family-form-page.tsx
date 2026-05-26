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

function slugFromName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function AdminFamilyFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id);
  const { data: families } = useQuery({ queryKey: queryKeys.adminFamilies, queryFn: adminApi.listFamilies, enabled: isEdit });
  const item = families?.find((f) => f.id === id);

  const form = useForm({
    values: item ?? { name: '', slug: '', sortOrder: 0, isActive: true },
  });

  const save = useMutation({
    mutationFn: (body: unknown) => adminApi.saveFamily(body, isEdit ? id : undefined),
    onSuccess: () => { toast.success('Guardado'); router.push('/admin/families'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <PageHeader title={isEdit ? 'Editar familia' : 'Nueva familia'} />
      <form
        onSubmit={form.handleSubmit((d) => {
          if (!d.name.trim()) {
            toast.error('El nombre es obligatorio');
            return;
          }
          save.mutate({
            ...d,
            slug: d.slug || slugFromName(d.name),
            sortOrder: d.sortOrder ?? 0,
            isActive: d.isActive ?? true,
          });
        })}
        className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/40 p-6"
      >
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
