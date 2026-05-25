'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { getOrderStatusLabel } from '@/shared/lib/order-status';
import { StoreCard } from '@/shared/ui/store-card';
import { PillBadge } from '@/shared/ui/pill-badge';
import { Button } from '@/shared/ui/button';
import { OrderTrackingCard } from '@/widgets/order-tracking-card/ui/order-tracking-card';
import { OrderReviewPrompts } from '@/widgets/order-review-prompts/ui/order-review-prompts';
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

  if (isLoading || !order) {
    return <p className="store-page p-8 text-slate-500">Cargando pedido…</p>;
  }

  const statusLabel = getOrderStatusLabel(order.status);

  return (
    <div className="store-page mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Button variant="ghost" size="sm" className="text-slate-400" asChild>
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mis pedidos
        </Link>
      </Button>

      <StoreCard>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Pedido #{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {new Date(order.createdAt).toLocaleString('es-MX')}
            </p>
          </div>
          <PillBadge variant={order.status === 'ReadyToDispatch' ? 'success' : 'info'}>
            {statusLabel}
          </PillBadge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <RetryPaymentButton orderId={order.id} status={order.status} />
          <CancelOrderButton orderId={order.id} status={order.status} />
        </div>
      </StoreCard>

      <OrderReviewPrompts items={order.items} orderStatus={order.status} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StoreCard>
          <h2 className="mb-4 font-semibold text-white">Productos</h2>
          <ul className="space-y-3">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between gap-2 text-sm border-b border-slate-800 pb-2 last:border-0">
                <span className="text-slate-300">
                  {item.productSlug ? (
                    <Link href={`/products/${item.productSlug}`} className="hover:text-violet-400">
                      {item.productName}
                    </Link>
                  ) : (
                    item.productName
                  )}{' '}
                  × {item.quantity}
                  <span className="block text-xs text-slate-500">{item.sku}</span>
                </span>
                <span className="shrink-0 text-violet-400">{formatMoney(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-slate-700/50 pt-4 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Envío</span>
              <span>{formatMoney(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-violet-400">{formatMoney(order.total)}</span>
            </div>
          </div>
        </StoreCard>

        <div className="space-y-6">
          {order.address && (
            <StoreCard>
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <MapPin className="h-4 w-4 text-violet-400" />
                Dirección de envío
              </h2>
              <p className="text-slate-300">{order.address.fullName}</p>
              <p className="text-sm text-slate-500">
                {order.address.street}, {order.address.city}, {order.address.state}{' '}
                {order.address.postalCode}
              </p>
              {order.address.phone && (
                <p className="mt-1 text-sm text-slate-500">{order.address.phone}</p>
              )}
            </StoreCard>
          )}

          {order.payment && (
            <StoreCard>
              <h2 className="mb-3 font-semibold text-white">Pago</h2>
              <p className="text-sm text-slate-400">
                Estado: <span className="text-slate-200">{order.payment.status}</span>
              </p>
              <p className="text-sm text-slate-400">
                Monto: <span className="text-violet-400">{formatMoney(order.payment.amount)}</span>
              </p>
              {order.payment.paidAt && (
                <p className="text-xs text-slate-500">
                  Pagado: {new Date(order.payment.paidAt).toLocaleString('es-MX')}
                </p>
              )}
            </StoreCard>
          )}

          {tracking && (
            <StoreCard>
              <h2 className="mb-4 font-semibold text-white">Seguimiento</h2>
              <OrderTrackingCard tracking={tracking} />
            </StoreCard>
          )}
        </div>
      </div>
    </div>
  );
}
