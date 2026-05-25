'use client';

import { useQuery } from '@tanstack/react-query';
import { driverApi } from '@/entities/driver/api/driver-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { DriverShipmentCard } from '@/widgets/driver-shipment-card/ui/driver-shipment-card';
import { EmptyState } from '@/shared/ui/empty-state';

export function DriverShipmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.driverShipments,
    queryFn: driverApi.shipments,
  });

  if (isLoading) return <p>Cargando envíos…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Mis envíos</h1>
      {data?.map((s) => (
        <DriverShipmentCard key={s.shipmentId} shipment={s} />
      ))}
      {!data?.length && <EmptyState message="Sin envíos asignados" />}
    </div>
  );
}
