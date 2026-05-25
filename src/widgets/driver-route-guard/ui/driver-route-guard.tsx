'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/model/auth-store';

export function DriverRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasRole = useAuthStore((s) => s.hasRole);

  useEffect(() => {
    if (!hasRole('driver')) {
      router.replace('/forbidden');
    }
  }, [hasRole, router]);

  if (!hasRole('driver')) {
    return <p className="text-zinc-500">Comprobando acceso…</p>;
  }

  return <>{children}</>;
}
