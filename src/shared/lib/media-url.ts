import { env } from '@/shared/config/env';

/** Origen del API sin el prefijo /api/v1 (p. ej. http://localhost:5088). */
export function getApiOrigin(): string {
  try {
    return new URL(env.apiUrl).origin;
  } catch {
    return env.apiUrl.replace(/\/api\/v1\/?$/i, '');
  }
}

/**
 * Convierte rutas del API en URL absoluta.
 * Los archivos estáticos (/uploads/...) se sirven en la raíz del host, no bajo /api/v1.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${getApiOrigin()}${url}`;
  if (url.startsWith('/')) return `${env.apiUrl}${url}`;
  return url;
}
