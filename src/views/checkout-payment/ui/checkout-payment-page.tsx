'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { canPayOrder } from '@/shared/lib/order-status';
import { usePayOrder } from '@/features/checkout/pay-order/model/use-pay-order';
import { PaymentMockForm } from '@/features/checkout/pay-order/ui/payment-mock-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { formatMoney } from '@/shared/lib/format-money';
import { OrderStatusBadge } from '@/entities/order/ui/order-status-badge';

/** Equivalente PaymentCheckout — solo pedidos payable del usuario actual. */
export function CheckoutPaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const pay = usePayOrder(orderId);

  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => orderApi.get(orderId),
    enabled: !!orderId,
  });

  useEffect(() => {
    if (!order) return;
    if (!canPayOrder(order.status)) {
      router.replace(`/checkout/success/${orderId}`);
    }
  }, [order, orderId, router]);

  if (isLoading || !order) return <p className="text-sm text-zinc-500">Cargando pedido…</p>;

  return (
    <Card className="mx-auto max-w-lg border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span>Pago — {order.orderNumber}</span>
          <OrderStatusBadge status={order.status} />
        </CardTitle>
        <p className="text-lg font-semibold text-violet-400">{formatMoney(order.total)}</p>
      </CardHeader>
      <CardContent>
        <PaymentMockForm onPay={(card) => pay.mutate(card)} loading={pay.isPending} />
      </CardContent>
    </Card>
  );
}
