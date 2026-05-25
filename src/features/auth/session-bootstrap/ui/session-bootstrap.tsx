'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { authApi } from '@/entities/user/api/auth-api';
import { refreshAccessToken, clearAuthSession } from '@/shared/api/refresh-session';

/** Valida sesión al cargar la tienda; renueva token o limpia sesión inválida. */
export function SessionBootstrap() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      try {
        await authApi.me();
      } catch {
        const token = await refreshAccessToken();
        if (cancelled) return;
        if (!token) {
          clearAuthSession();
        } else {
          try {
            await authApi.me();
          } catch {
            clearAuthSession();
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return null;
}
