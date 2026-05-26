'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/entities/user/api/auth-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

const schema = z
  .object({
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export function DriverChangePasswordPage() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await authApi.changePasswordMandatory({ newPassword: data.newPassword });
      toast.success('Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
      clear();
      router.replace('/login?redirect=/driver');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No se pudo cambiar la contraseña');
    }
  });

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <h1 className="mb-2 text-2xl font-bold text-white">Cambiar contraseña</h1>
      <p className="mb-6 text-sm text-zinc-400">
        Tu cuenta usa una contraseña temporal asignada por el administrador. Elige una contraseña nueva
        para continuar.
      </p>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-white/10 bg-zinc-900/60 p-6">
        <div>
          <Label>Nueva contraseña</Label>
          <Input type="password" className="mt-1" {...form.register('newPassword')} />
          {form.formState.errors.newPassword && (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <Label>Confirmar contraseña</Label>
          <Input type="password" className="mt-1" {...form.register('confirmPassword')} />
          {form.formState.errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-400">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500">
          Guardar y continuar
        </Button>
      </form>
    </div>
  );
}
