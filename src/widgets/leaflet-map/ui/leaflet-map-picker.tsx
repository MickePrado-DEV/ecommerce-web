'use client';

import dynamic from 'next/dynamic';

export const LeafletMapPicker = dynamic(
  () => import('./leaflet-map-picker-inner').then((m) => m.LeafletMapPickerInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/60 text-sm text-slate-500">
        Cargando mapa…
      </div>
    ),
  },
);
