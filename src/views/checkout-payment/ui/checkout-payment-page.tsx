'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { canPayOrder } from '@/shared/lib/order-status';
import { formatMoney } from '@/shared/lib/format-money';
import { usePayOrder } from '@/features/checkout/pay-order/model/use-pay-order';
import { PaymentMockForm } from '@/features/checkout/pay-order/ui/payment-mock-form';
import { OrderSummary } from '@/widgets/order-summary/ui/order-summary';
import { OrderStatusBadge } from '@/entities/order/ui/order-status-badge';
import { Button } from '@/shared/ui/button';
import { PillBadge } from '@/shared/ui/pill-badge';

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

  if (isLoading || !order) {
    return <p className="store-page p-8 text-slate-500">Cargando pedido…</p>;
  }

  return (
    <div className="store-page mx-auto max-w-6xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6 text-slate-400" asChild>
        <Link href="/checkout/shipping">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al envío
        </Link>
      </Button>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-white">Pago seguro</h1>
        <OrderStatusBadge status={order.status} />
        <PillBadge variant="info">Pedido {order.orderNumber}</PillBadge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentMockForm
            onPay={(card) => pay.mutate(card)}
            loading={pay.isPending}
            totalLabel={`Pagar ${formatMoney(order.total)}`}
          />
        </div>
        <OrderSummary
          shippingAmount={order.shippingCost}
          showItems
          action={null}
        />
      </div>
    </div>
  );
}
