type ApiErrorItem = { message?: string; code?: string; propertyName?: string };
type ValidationProblemBody = { errors?: Record<string, string[]> };

/** Extrae mensajes legibles del formato unificado de la API .NET. */
export function parseApiErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;

  const legacy = (body as { error?: string }).error;
  if (legacy) return legacy;

  const list = (body as { errors?: ApiErrorItem[] | Record<string, string[]> }).errors;
  if (Array.isArray(list) && list.length > 0) {
    return list.map((e) => e.message).filter(Boolean).join(' ') || fallback;
  }

  if (list && typeof list === 'object' && !Array.isArray(list)) {
    const dict = list as ValidationProblemBody['errors'];
    const first = Object.values(dict ?? {})[0]?.[0];
    if (first) return first;
  }

  const title = (body as { title?: string }).title;
  return title ?? fallback;
}

export function parseApiFieldErrors(body: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!body || typeof body !== 'object') return out;

  const list = (body as { errors?: ApiErrorItem[] }).errors;
  if (Array.isArray(list)) {
    for (const e of list) {
      const key = e.propertyName ?? 'request';
      if (e.message) out[key] = e.message;
    }
    return out;
  }

  const dict = (body as ValidationProblemBody).errors;
  if (dict) {
    for (const [key, messages] of Object.entries(dict)) {
      if (messages[0]) out[key] = messages[0];
    }
  }
  return out;
}
