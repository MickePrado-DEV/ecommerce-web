'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverApi } from '@/entities/driver/api/driver-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export function DriverShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { data: shipments, isLoading } = useQuery({
    queryKey: queryKeys.driverShipments,
    queryFn: driverApi.shipments,
  });
  const s = shipments?.find((x) => x.shipmentId === id);

  const inTransit = useMutation({
    mutationFn: () => driverApi.inTransit(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.driverShipments }); toast.success('En tránsito'); },
  });
  const delivered = useMutation({
    mutationFn: () => driverApi.delivered(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.driverShipments }); toast.success('Entregado'); },
  });

  if (isLoading) return <p>Cargando…</p>;
  if (!s) return <p>Envío no encontrado. <Link href="/driver/shipments" className="text-violet-400">Volver</Link></p>;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">{s.orderNumber}</h1>
      <p>{s.status}</p>
      <p className="text-sm">{s.customerName} · {s.customerPhone}</p>
      <p>{s.street}, {s.city}, {s.postalCode}</p>
      {s.trackingNumber && <p className="text-sm text-zinc-400">Tracking: {s.trackingNumber}</p>}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => inTransit.mutate()}>En tránsito</Button>
        <Button onClick={() => delivered.mutate()}>Entregado</Button>
      </div>
      <Link href="/driver/shipments" className="text-sm text-violet-400 hover:underline">← Mis envíos</Link>
    </div>
  );
}
