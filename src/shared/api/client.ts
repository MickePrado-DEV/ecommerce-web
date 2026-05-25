import { env } from '@/shared/config/env';
import { parseApiErrorMessage } from '@/shared/api/parse-api-error';
import { clearAuthSession, refreshAccessToken } from '@/shared/api/refresh-session';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
  }
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('accessToken');
}

function getGuestToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('guestToken');
}

/** Rutas donde un 401 no debe disparar refresh (credenciales inválidas, etc.). */
function skipsRefreshOnUnauthorized(path: string) {
  return (
    path.startsWith('/auth/login') ||
    path.startsWith('/auth/register') ||
    path.startsWith('/auth/refresh')
  );
}

export type ApiOptions = RequestInit & {
  guest?: boolean;
  auth?: boolean;
  /** Uso interno: evita bucle al reintentar tras refresh. */
  _retriedAfterRefresh?: boolean;
};

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = parseApiErrorMessage(body, res.statusText);
    throw new ApiError(res.status, msg, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.auth !== false) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (options.guest) {
    const guest = getGuestToken();
    if (guest) headers['X-Guest-Token'] = guest;
  }

  const res = await fetch(`${env.apiUrl}${path}`, { ...options, headers });

  const shouldTryRefresh =
    res.status === 401 &&
    options.auth !== false &&
    !options._retriedAfterRefresh &&
    !skipsRefreshOnUnauthorized(path);

  if (shouldTryRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return api<T>(path, { ...options, _retriedAfterRefresh: true });
    }
    clearAuthSession();
  }

  return parseResponse<T>(res);
}

export function persistGuestTokenFromCart(cart: { guestToken?: string | null }) {
  if (cart.guestToken && typeof window !== 'undefined') {
    localStorage.setItem('guestToken', cart.guestToken);
  }
}
