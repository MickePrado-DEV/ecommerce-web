'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/entities/user/api/auth-api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

const schema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export function ChangePasswordForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  const save = useMutation({
    mutationFn: ({ currentPassword, newPassword }: z.infer<typeof schema>) =>
      authApi.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success('Contraseña actualizada');
      form.reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={form.handleSubmit((d) => save.mutate(d))}
      className="space-y-4 rounded-lg border border-white/10 p-6"
    >
      <div>
        <Label>Contraseña actual</Label>
        <Input type="password" {...form.register('currentPassword')} />
      </div>
      <div>
        <Label>Nueva contraseña</Label>
        <Input type="password" {...form.register('newPassword')} />
      </div>
      <div>
        <Label>Confirmar nueva</Label>
        <Input type="password" {...form.register('confirmPassword')} />
      </div>
      <Button type="submit" disabled={save.isPending}>
        Actualizar
      </Button>
    </form>
  );
}
