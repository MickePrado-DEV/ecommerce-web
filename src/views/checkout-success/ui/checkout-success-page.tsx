'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Button } from '@/shared/ui/button';

/** Equivalente PaymentSuccess — lectura del pedido recién pagado. */
export function CheckoutSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order } = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => orderApi.get(orderId),
    enabled: !!orderId,
  });

  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-2xl font-bold text-green-400">¡Pedido confirmado!</h1>
      {order ? (
        <p className="mt-2 text-zinc-400">
          Pedido <span className="font-mono text-violet-300">{order.orderNumber}</span>
          {order.total > 0 && <> · {formatMoney(order.total)}</>}
        </p>
      ) : (
        <p className="mt-2 text-zinc-400">Tu pago fue procesado (modo demo).</p>
      )}
      <div className="mt-6 flex justify-center gap-4">
        <Button asChild>
          <Link href={orderId ? `/orders/${orderId}` : '/orders'}>Ver pedido</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Inicio</Link>
        </Button>
      </div>
    </div>
  );
}
