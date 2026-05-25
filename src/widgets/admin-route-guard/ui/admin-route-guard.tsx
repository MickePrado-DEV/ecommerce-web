'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/model/auth-store';
import {
  canAccessAdminPanel,
  permissionForAdminPath,
} from '@/widgets/admin-sidebar/model/nav-config';

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const permissions = useAuthStore((s) => s.permissions);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  useEffect(() => {
    if (!canAccessAdminPanel(permissions)) {
      router.replace('/forbidden');
      return;
    }
    const required = permissionForAdminPath(pathname);
    if (required && !hasPermission(required)) {
      router.replace('/forbidden');
    }
  }, [pathname, permissions, hasPermission, router]);

  if (!canAccessAdminPanel(permissions)) {
    return <p className="text-zinc-500">Comprobando permisos…</p>;
  }

  const required = permissionForAdminPath(pathname);
  if (required && !hasPermission(required)) {
    return <p className="text-zinc-500">Sin permiso para esta sección…</p>;
  }

  return <>{children}</>;
}
