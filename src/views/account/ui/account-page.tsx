'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { authApi } from '@/entities/user/api/auth-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function AccountPage() {
  const qc = useQueryClient();
  const { data: user } = useQuery({ queryKey: queryKeys.me, queryFn: authApi.me });
  const form = useForm({
    values: user
      ? { firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' }
      : undefined,
  });

  const save = useMutation({
    mutationFn: (body: { firstName: string; lastName: string; phone?: string }) =>
      authApi.updateProfile(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.me });
      toast.success('Perfil actualizado');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <PageHeader title="Mi cuenta" />
      <form
        onSubmit={form.handleSubmit((d) => save.mutate(d))}
        className="space-y-4 rounded-lg border border-white/10 p-6"
      >
        <div><Label>Nombre</Label><Input {...form.register('firstName')} /></div>
        <div><Label>Apellido</Label><Input {...form.register('lastName')} /></div>
        <div><Label>Teléfono</Label><Input {...form.register('phone')} /></div>
        <p className="text-sm text-zinc-500">{user?.email}</p>
        <Button type="submit">Guardar</Button>
      </form>
      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild><Link href="/account/addresses">Mis direcciones</Link></Button>
        <Button variant="outline" asChild><Link href="/account/password">Cambiar contraseña</Link></Button>
      </div>
    </div>
  );
}
