'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/entities/user/api/auth-api';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function AccountPasswordPage() {
  const form = useForm({
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const save = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('Contraseña actualizada');
      form.reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Cambiar contraseña" />
      <form
        onSubmit={form.handleSubmit((d) => save.mutate(d))}
        className="space-y-4 rounded-lg border border-white/10 p-6"
      >
        <div><Label>Contraseña actual</Label><Input type="password" {...form.register('currentPassword')} /></div>
        <div><Label>Nueva contraseña</Label><Input type="password" {...form.register('newPassword')} /></div>
        <Button type="submit">Actualizar</Button>
      </form>
    </div>
  );
}
