'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { getHighAccuracyPosition } from '@/shared/lib/geo-coordinates';

const DEFAULT_CENTER: [number, number] = [19.4326, -99.1332];
const LOCATED_ZOOM = 18;

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);
  return null;
}

function MapInvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const t1 = window.setTimeout(() => map.invalidateSize(), 0);
    const t2 = window.setTimeout(() => map.invalidateSize(), 200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [map]);
  return null;
}

function MapClickHandler({
  onPick,
  draggable,
  position,
}: {
  onPick: (lat: number, lng: number) => void;
  draggable: boolean;
  position: [number, number];
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={draggable}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          onPick(lat, lng);
        },
      }}
    />
  );
}

export function LeafletMapPickerInner({
  latitude,
  longitude,
  onChange,
  heightClass = 'h-56',
  draggable = true,
  zoom = LOCATED_ZOOM,
  requestGeolocationOnMount = true,
}: {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (lat: number, lng: number) => void;
  heightClass?: string;
  draggable?: boolean;
  zoom?: number;
  requestGeolocationOnMount?: boolean;
}) {
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [accuracyMeters, setAccuracyMeters] = useState<number | null>(null);
  const hasCoords =
    latitude != null && longitude != null && Number.isFinite(latitude) && Number.isFinite(longitude);
  const position = useMemo<[number, number]>(
    () => (hasCoords ? [latitude!, longitude!] : DEFAULT_CENTER),
    [hasCoords, latitude, longitude],
  );

  const useMyLocation = useCallback(() => {
    setGeoStatus('loading');
    getHighAccuracyPosition()
      .then((fix) => {
        onChange(fix.lat, fix.lng);
        setAccuracyMeters(fix.accuracyMeters);
        setGeoStatus('idle');
      })
      .catch(() => {
        setGeoStatus('error');
        setAccuracyMeters(null);
      });
  }, [onChange]);

  useEffect(() => {
    if (!requestGeolocationOnMount || hasCoords) return;
    useMyLocation();
  }, [requestGeolocationOnMount, hasCoords, useMyLocation]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          Haz clic en el mapa o usa tu ubicación actual.
          {accuracyMeters != null && geoStatus === 'idle' && (
            <span className="ml-1 text-slate-400">(~{Math.round(accuracyMeters)} m)</span>
          )}
        </p>
        <Button type="button" size="sm" variant="outline" onClick={useMyLocation} disabled={geoStatus === 'loading'}>
          <LocateFixed className="mr-1 h-3.5 w-3.5" />
          {geoStatus === 'loading' ? 'Ubicando…' : 'Mi ubicación'}
        </Button>
      </div>
      {geoStatus === 'error' && (
        <p className="text-xs text-amber-400">
          No se pudo obtener la ubicación. Permite acceso GPS o marca el punto en el mapa.
        </p>
      )}
      <div className={`overflow-hidden rounded-xl border border-slate-700/50 ${heightClass}`}>
        <MapContainer
          center={position}
          zoom={hasCoords ? zoom : 12}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={position} zoom={hasCoords ? zoom : 12} />
          <MapInvalidateSize />
          <MapClickHandler onPick={onChange} draggable={draggable} position={position} />
        </MapContainer>
      </div>
    </div>
  );
}
