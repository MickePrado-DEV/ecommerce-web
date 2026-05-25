'use client';

import dynamic from 'next/dynamic';

export const LeafletMapStatic = dynamic(
  () => import('./leaflet-map-static-inner').then((m) => m.LeafletMapStaticInner),
  {
    ssr: false,
    loading: () => <div className="h-32 animate-pulse rounded-xl bg-slate-800/80" />,
  },
);
