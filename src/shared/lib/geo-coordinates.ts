/** ~1.1 cm de precisión; compatible con decimal(10,7) en la API. */
export const GEO_COORD_DECIMALS = 7;

export function roundGeoCoord(value: number): number {
  const factor = 10 ** GEO_COORD_DECIMALS;
  return Math.round(value * factor) / factor;
}

export type GeoFix = {
  lat: number;
  lng: number;
  accuracyMeters: number | null;
};

/**
 * Usa watchPosition y conserva la lectura con mejor precisión (menor accuracy en metros).
 */
export function getHighAccuracyPosition(): Promise<GeoFix> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocalización no disponible en este navegador'));
      return;
    }

    let best: GeolocationPosition | null = null;
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20_000,
    };

    const finish = (watchId: number, timerId: number) => {
      navigator.geolocation.clearWatch(watchId);
      window.clearTimeout(timerId);
      if (!best) {
        reject(new Error('No se pudo obtener la ubicación'));
        return;
      }
      resolve({
        lat: roundGeoCoord(best.coords.latitude),
        lng: roundGeoCoord(best.coords.longitude),
        accuracyMeters: Number.isFinite(best.coords.accuracy) ? best.coords.accuracy : null,
      });
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (!best || pos.coords.accuracy < best.coords.accuracy) best = pos;
        if (pos.coords.accuracy <= 25) finish(watchId, timerId);
      },
      (err) => {
        if (best) finish(watchId, timerId);
        else reject(new Error(err.message || 'Permiso de ubicación denegado'));
      },
      options,
    );

    const timerId = window.setTimeout(() => finish(watchId, timerId), 12_000);
  });
}
