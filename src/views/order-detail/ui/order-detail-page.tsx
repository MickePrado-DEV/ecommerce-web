'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { PageHeader } from '@/shared/ui/page-header';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => orderApi.get(id),
  });
  const { data: tracking } = useQuery({
    queryKey: ['order-tracking', id],
    queryFn: () => orderApi.tracking(id),
    enabled: !!id,
  });

  if (isLoading || !order) return <p>Cargando…</p>;

  return (
    <div className="space-y-8">
      <PageHeader title={`Pedido ${order.orderNumber}`} />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="mb-4 font-semibold">Estado</h2>
          <p>{order.status}</p>
          {order.status === 'PendingPayment' && (
            <Button className="mt-4" asChild>
              <Link href={`/checkout/payment/${order.id}`}>Pagar ahora</Link>
            </Button>
          )}
        </section>
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="mb-4 font-semibold">Seguimiento</h2>
          {tracking?.shipment ? (
            <ul className="space-y-2 text-sm">
              <li>Envío: {tracking.shipment.status}</li>
              {tracking.shipment.trackingNumber && <li>Tracking: {tracking.shipment.trackingNumber}</li>}
              {tracking.shipment.driverName && <li>Repartidor: {tracking.shipment.driverName}</li>}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">Sin envío asignado aún.</p>
          )}
        </section>
      </div>
      <section className="rounded-lg border border-white/10 p-6">
        <h2 className="mb-4 font-semibold">Artículos</h2>
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{item.productName} × {item.quantity}</span>
              <span>{formatMoney(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right text-lg font-bold">{formatMoney(order.total)}</p>
      </section>
      {order.address && (
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="mb-4 font-semibold">Dirección</h2>
          <p>{order.address.fullName}</p>
          <p className="text-sm text-zinc-400">
            {order.address.street}, {order.address.city}, {order.address.postalCode}
          </p>
        </section>
      )}
    </div>
  );
}
