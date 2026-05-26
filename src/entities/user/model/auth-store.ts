'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDto } from './types';

interface AuthState {
  user: UserDto | null;
  permissions: string[];
  mustChangePassword: boolean;
  setSession: (
    user: UserDto,
    permissions: string[],
    accessToken: string,
    refreshToken: string,
    mustChangePassword?: boolean,
  ) => void;
  clear: () => void;
  hasPermission: (p: string) => boolean;
  hasRole: (r: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      permissions: [],
      mustChangePassword: false,
      setSession: (user, permissions, accessToken, refreshToken, mustChangePassword = false) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('accessToken', accessToken);
          document.cookie = `accessToken=${accessToken}; path=/; max-age=900; SameSite=Lax`;
        }
        set({
          user: { ...user, mustChangePassword },
          permissions,
          mustChangePassword,
        });
        if (typeof window !== 'undefined') localStorage.setItem('refreshToken', refreshToken);
      },
      clear: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('accessToken');
          document.cookie = 'accessToken=; path=/; max-age=0';
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, permissions: [], mustChangePassword: false });
      },
      hasPermission: (p) => get().permissions.includes(p),
      hasRole: (r) => get().user?.roles.includes(r) ?? false,
    }),
    {
      name: 'auth-store',
      partialize: (s) => ({
        user: s.user,
        permissions: s.permissions,
        mustChangePassword: s.mustChangePassword,
      }),
    },
  ),
);
