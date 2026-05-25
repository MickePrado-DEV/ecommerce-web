import { env } from '@/shared/config/env';
import { useAuthStore } from '@/entities/user/model/auth-store';
import type { LoginResponse } from '@/entities/user/model/types';

let refreshInFlight: Promise<string | null> | null = null;

/** Renueva access + refresh token usando el refresh guardado en localStorage. */
export async function refreshAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${env.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return null;

      const data = (await res.json()) as LoginResponse;
      useAuthStore.getState().setSession(
        data.user,
        data.permissions,
        data.accessToken,
        data.refreshToken,
      );
      return data.accessToken;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export function clearAuthSession() {
  useAuthStore.getState().clear();
}
