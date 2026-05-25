import { env } from '@/shared/config/env';

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

export type ApiOptions = RequestInit & {
  guest?: boolean;
  auth?: boolean;
};

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

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const errors = (body as { errors?: Array<{ message?: string }> })?.errors;
    const msg = errors?.[0]?.message ?? (body as { title?: string })?.title ?? res.statusText;
    throw new ApiError(res.status, msg, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function persistGuestTokenFromCart(cart: { guestToken?: string | null }) {
  if (cart.guestToken && typeof window !== 'undefined') {
    localStorage.setItem('guestToken', cart.guestToken);
  }
}
