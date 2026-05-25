'use client';

import { authApi } from '@/entities/user/api/auth-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { Button } from '@/shared/ui/button';

export function LogoutButton({ className }: { className?: string }) {
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      useAuthStore.getState().clear();
      window.location.href = '/';
    }
  };

  return (
    <Button variant="ghost" size="sm" className={className} onClick={logout}>
      Salir
    </Button>
  );
}
