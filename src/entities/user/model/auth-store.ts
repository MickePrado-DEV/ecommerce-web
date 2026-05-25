'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDto } from './types';

interface AuthState {
  user: UserDto | null;
  permissions: string[];
  setSession: (user: UserDto, permissions: string[], accessToken: string, refreshToken: string) => void;
  clear: () => void;
  hasPermission: (p: string) => boolean;
  hasRole: (r: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      permissions: [],
      setSession: (user, permissions, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('accessToken', accessToken);
          document.cookie = `accessToken=${accessToken}; path=/; max-age=900; SameSite=Lax`;
        }
        set({ user, permissions });
        if (typeof window !== 'undefined') localStorage.setItem('refreshToken', refreshToken);
      },
      clear: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('accessToken');
          document.cookie = 'accessToken=; path=/; max-age=0';
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, permissions: [] });
      },
      hasPermission: (p) => get().permissions.includes(p),
      hasRole: (r) => get().user?.roles.includes(r) ?? false,
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user, permissions: s.permissions }) },
  ),
);
