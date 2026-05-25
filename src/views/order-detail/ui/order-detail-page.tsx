'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { PageHeader } from '@/shared/ui/page-header';
import { OrderStatusBadge } from '@/entities/order/ui/order-status-badge';
import { OrderTrackingCard } from '@/widgets/order-tracking-card/ui/order-tracking-card';
import { canCancelOrder, canPayOrder } from '@/shared/lib/order-status';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => orderApi.get(id),
  });
  const { data: tracking } = useQuery({
    queryKey: ['order-tracking', id],
    queryFn: () => orderApi.tracking(id),
    enabled: !!id,
  });

  const cancel = useMutation({
    mutationFn: () => orderApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.order(id) });
      toast.success('Pedido cancelado');
    },
    onError: (e: Error) => toast.error(e.message),
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
            {canPayOrder(order.status) && (
              <Button asChild>
                <Link href={`/checkout/payment/${order.id}`}>Pagar ahora</Link>
              </Button>
            )}
            {canCancelOrder(order.status) && (
              <Button variant="outline" onClick={() => cancel.mutate()} disabled={cancel.isPending}>
                Cancelar pedido
              </Button>
            )}
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
