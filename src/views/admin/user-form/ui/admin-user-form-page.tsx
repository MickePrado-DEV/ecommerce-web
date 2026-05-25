'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

const ALL_ROLES = [
  { code: 'admin', label: 'Administrador' },
  { code: 'customer', label: 'Cliente' },
  { code: 'driver', label: 'Repartidor' },
];

export function AdminUserFormPage() {
  const id = useParams().id as string;
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.adminUser(id),
    queryFn: () => adminApi.getUser(id),
  });

  const form = useForm({
    values: user
      ? { isActive: user.isActive, roles: user.roles }
      : undefined,
  });

  const save = useMutation({
    mutationFn: (body: { isActive: boolean; roleCodes: string[] }) => adminApi.updateUser(id, body),
    onSuccess: () => {
      toast.success('Usuario actualizado');
      router.push('/admin/users');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !user) return <p>Cargando…</p>;

  const selectedRoles = form.watch('roles') ?? [];

  const toggleRole = (code: string) => {
    const next = selectedRoles.includes(code)
      ? selectedRoles.filter((r) => r !== code)
      : [...selectedRoles, code];
    form.setValue('roles', next);
  };

  return (
    <div className="max-w-lg">
      <PageHeader
        title={`Editar usuario`}
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/users">← Usuarios</Link>
          </Button>
        }
      />
      <p className="mb-6 text-sm text-zinc-400">{user.email}</p>
      <form
        onSubmit={form.handleSubmit((d) =>
          save.mutate({ isActive: d.isActive, roleCodes: d.roles }),
        )}
        className="space-y-6 rounded-lg border border-white/10 p-6"
      >
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          {user.phone && <p className="text-sm text-zinc-400">{user.phone}</p>}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register('isActive')} />
          Usuario activo
        </label>
        <div>
          <Label className="mb-2 block">Roles</Label>
          <div className="flex flex-col gap-2">
            {ALL_ROLES.map((r) => (
              <label key={r.code} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(r.code)}
                  onChange={() => toggleRole(r.code)}
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={save.isPending || selectedRoles.length === 0}>
          Guardar
        </Button>
      </form>
    </div>
  );
}
