'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { PageHeader } from '@/shared/ui/page-header';
import { OrderStatusBadge } from '@/entities/order/ui/order-status-badge';
import { OrderTrackingCard } from '@/widgets/order-tracking-card/ui/order-tracking-card';
import { CancelOrderButton } from '@/features/order/cancel-order/ui/cancel-order-button';
import { RetryPaymentButton } from '@/features/order/retry-payment/ui/retry-payment-button';

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
          <OrderStatusBadge status={order.status} />
          <div className="mt-4 flex flex-wrap gap-2">
            <RetryPaymentButton orderId={order.id} status={order.status} />
            <CancelOrderButton orderId={order.id} status={order.status} />
          </div>
        </section>
        <section className="rounded-lg border border-white/10 p-6">
          <h2 className="mb-4 font-semibold">Seguimiento</h2>
          {tracking ? <OrderTrackingCard tracking={tracking} /> : <p className="text-sm text-zinc-500">Cargando…</p>}
        </section>
      </div>
      <section className="rounded-lg border border-white/10 p-6">
        <h2 className="mb-4 font-semibold">Artículos</h2>
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>
                {item.productName} × {item.quantity}
              </span>
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
