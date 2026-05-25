import { MEXICAN_STATES } from '@/shared/config/mexican-states';

export type PostalLookupResult = {
  state: string;
  municipalities: string[];
  neighborhoods: string[];
  city?: string;
};

/** Normaliza nombre de estado de APIs externas al catálogo local. */
function normalizeState(name: string): string {
  const n = name.trim();
  const map: Record<string, string> = {
    'Distrito Federal': 'Ciudad de México',
    'Ciudad de Mexico': 'Ciudad de México',
    'México': 'Estado de México',
    'Mexico': 'Estado de México',
    'Veracruz de Ignacio de la Llave': 'Veracruz',
    'Michoacán de Ocampo': 'Michoacán',
    'Coahuila de Zaragoza': 'Coahuila',
  };
  if (map[n]) return map[n];
  const found = MEXICAN_STATES.find(
    (s) => s.toLowerCase() === n.toLowerCase() || s.toLowerCase().includes(n.toLowerCase()),
  );
  return found ?? n;
}

/**
 * Consulta C.P. México vía Zippopotam (sin API key).
 * Devuelve colonias (place name), estado y municipios sugeridos.
 */
export async function lookupMexicoPostalCode(postalCode: string): Promise<PostalLookupResult | null> {
  const cp = postalCode.replace(/\D/g, '');
  if (cp.length !== 5) return null;

  try {
    const res = await fetch(`https://api.zippopotam.us/mx/${cp}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      places?: Array<{
        'place name'?: string;
        state?: string;
        latitude?: string;
        longitude?: string;
      }>;
    };
    const places = data.places ?? [];
    if (!places.length) return null;

    const neighborhoods = [
      ...new Set(places.map((p) => p['place name']?.trim()).filter(Boolean) as string[]),
    ];
    const state = normalizeState(places[0]?.state ?? '');
    const municipalities = neighborhoods.length ? [...neighborhoods] : [];

    return {
      state,
      municipalities,
      neighborhoods,
      city: neighborhoods[0],
    };
  } catch {
    return null;
  }
}
