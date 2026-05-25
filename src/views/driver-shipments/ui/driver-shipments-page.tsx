'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { driverApi } from '@/entities/driver/api/driver-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function DriverShipmentsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.driverShipments,
    queryFn: driverApi.shipments,
  });

  const inTransit = useMutation({
    mutationFn: (id: string) => driverApi.inTransit(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.driverShipments });
      toast.success('En tránsito');
    },
  });

  const delivered = useMutation({
    mutationFn: (id: string) => driverApi.delivered(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.driverShipments });
      toast.success('Entregado');
    },
  });

  if (isLoading) return <p>Cargando envíos…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Mis envíos</h1>
      {data?.map((s) => (
        <div key={s.shipmentId} className="rounded-lg border border-white/10 p-4">
          <p className="font-medium">
            <Link href={`/driver/shipments/${s.shipmentId}`} className="text-violet-400 hover:underline">
              {s.orderNumber}
            </Link>
            {' '}· {s.status}
          </p>
          <p className="text-sm text-zinc-400">{s.customerName}</p>
          <p className="text-sm">{s.street}, {s.city}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => inTransit.mutate(s.shipmentId)}>
              En tránsito
            </Button>
            <Button size="sm" onClick={() => delivered.mutate(s.shipmentId)}>Entregado</Button>
          </div>
        </div>
      ))}
      {!data?.length && <p className="text-zinc-500">Sin envíos asignados</p>}
    </div>
  );
}
