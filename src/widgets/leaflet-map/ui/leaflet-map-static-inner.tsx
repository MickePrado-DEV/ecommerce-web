'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function LeafletMapStaticInner({
  latitude,
  longitude,
  heightClass = 'h-32',
}: {
  latitude: number;
  longitude: number;
  heightClass?: string;
}) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-700/50 ${heightClass}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        className="h-full w-full pointer-events-none"
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
