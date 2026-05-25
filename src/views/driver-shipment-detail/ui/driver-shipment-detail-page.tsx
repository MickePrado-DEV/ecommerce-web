'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { driverApi } from '@/entities/driver/api/driver-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { MarkInTransitButton } from '@/features/driver/mark-in-transit/ui/mark-in-transit-button';
import { MarkDeliveredButton } from '@/features/driver/mark-delivered/ui/mark-delivered-button';

export function DriverShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: shipments, isLoading } = useQuery({
    queryKey: queryKeys.driverShipments,
    queryFn: driverApi.shipments,
  });
  const s = shipments?.find((x) => x.shipmentId === id);

  if (isLoading) return <p>Cargando…</p>;
  if (!s) {
    return (
      <p>
        Envío no encontrado.{' '}
        <Link href="/driver/shipments" className="text-violet-400 hover:underline">
          Volver
        </Link>
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">{s.orderNumber}</h1>
      <p>{s.status}</p>
      <p className="text-sm">
        {s.customerName} · {s.customerPhone}
      </p>
      <p>
        {s.street}, {s.city}, {s.postalCode}
      </p>
      {s.trackingNumber && <p className="text-sm text-zinc-400">Tracking: {s.trackingNumber}</p>}
      <div className="flex gap-2">
        <MarkInTransitButton shipmentId={s.shipmentId} />
        <MarkDeliveredButton shipmentId={s.shipmentId} />
      </div>
      <Link href="/driver/shipments" className="text-sm text-violet-400 hover:underline">
        ← Mis envíos
      </Link>
    </div>
  );
}
