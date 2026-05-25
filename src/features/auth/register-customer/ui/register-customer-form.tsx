'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/entities/user/api/auth-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
});

export function RegisterCustomerForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await authApi.registerCustomer(data);
      setSession(res.user, res.permissions, res.accessToken, res.refreshToken);
      toast.success('Cuenta creada');
      router.push('/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al registrarse');
    }
  });

  return (
    <Card className="mx-auto w-full max-w-md border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div><Label>Nombre</Label><Input {...form.register('firstName')} /></div>
          <div><Label>Apellido</Label><Input {...form.register('lastName')} /></div>
          <div><Label>Email</Label><Input type="email" {...form.register('email')} /></div>
          <div><Label>Teléfono</Label><Input {...form.register('phone')} /></div>
          <div><Label>Contraseña</Label><Input type="password" {...form.register('password')} /></div>
          <Button type="submit" className="w-full">Registrarse</Button>
          <p className="text-center text-sm text-zinc-400">
            <Link href="/login" className="text-violet-400 hover:underline">Ya tengo cuenta</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
