'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/entities/user/api/auth-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { cartApi } from '@/entities/cart/api/cart-api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await authApi.login(data);
      setSession(res.user, res.permissions, res.accessToken, res.refreshToken);
      const guest = localStorage.getItem('guestToken');
      if (guest) await cartApi.merge(guest);
      toast.success('Bienvenido');
      router.push(params.get('redirect') ?? '/');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error de login');
    }
  });

  return (
    <Card className="mx-auto w-full max-w-md border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" {...form.register('email')} />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" {...form.register('password')} />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
          <p className="text-center text-sm text-zinc-400">
            <Link
              href={params.get('redirect') ? `/register?redirect=${encodeURIComponent(params.get('redirect')!)}` : '/register'}
              className="text-violet-400 hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
