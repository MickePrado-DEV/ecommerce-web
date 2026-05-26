'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/model/auth-store';

export function DriverRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hasRole = useAuthStore((s) => s.hasRole);
  const mustChangePassword = useAuthStore((s) => s.mustChangePassword);

  useEffect(() => {
    if (!hasRole('driver')) {
      router.replace('/forbidden');
      return;
    }
    if (mustChangePassword && !pathname.startsWith('/driver/change-password')) {
      router.replace('/driver/change-password');
    }
  }, [hasRole, mustChangePassword, pathname, router]);

  if (!hasRole('driver')) {
    return <p className="text-zinc-500">Comprobando acceso…</p>;
  }

  if (mustChangePassword && !pathname.startsWith('/driver/change-password')) {
    return <p className="text-zinc-500">Redirigiendo…</p>;
  }

  return <>{children}</>;
}
