'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/entities/user/api/auth-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function ProfileForm() {
  const qc = useQueryClient();
  const { data: user } = useQuery({ queryKey: queryKeys.me, queryFn: authApi.me });
  const form = useForm({
    values: user
      ? { firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' }
      : undefined,
  });

  const save = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.me });
      toast.success('Perfil actualizado');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={form.handleSubmit((d) => save.mutate(d))}
      className="space-y-4 rounded-lg border border-gray-800 bg-gray-900/80 p-6"
    >
      <div>
        <Label>Nombre</Label>
        <Input {...form.register('firstName')} />
      </div>
      <div>
        <Label>Apellido</Label>
        <Input {...form.register('lastName')} />
      </div>
      <div>
        <Label>Teléfono</Label>
        <Input {...form.register('phone')} />
      </div>
      <div>
        <Label>Correo electrónico</Label>
        <Input value={user?.email ?? ''} disabled className="bg-gray-950 text-gray-400" />
        <p className="mt-1 text-xs text-gray-500">El correo no se puede cambiar desde aquí.</p>
      </div>
      <Button type="submit" disabled={save.isPending}>
        Guardar
      </Button>
    </form>
  );
}
