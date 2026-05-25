'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Button } from '@/shared/ui/button';
import { StoreCard } from '@/shared/ui/store-card';

export function CheckoutSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order } = useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: () => orderApi.get(orderId),
    enabled: !!orderId,
  });

  return (
    <div className="store-page mx-auto max-w-lg px-4 py-16">
      <StoreCard className="border-emerald-500/30 bg-emerald-950/30 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
        <h1 className="mt-4 text-2xl font-bold text-emerald-300">¡Pago realizado con éxito!</h1>
        <p className="mt-2 text-sm text-slate-400">Tu pedido fue confirmado correctamente.</p>

        {order && (
          <dl className="mt-8 space-y-3 text-left text-sm">
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <dt className="text-slate-500">Transacción</dt>
              <dd className="font-mono text-slate-200">{order.orderNumber}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <dt className="text-slate-500">Autorización</dt>
              <dd className="font-mono text-slate-200">
                {order.payment?.paidAt ? 'SIM-OK' : '—'}
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-700/50 pb-2">
              <dt className="text-slate-500">Monto</dt>
              <dd className="font-semibold text-violet-400">{formatMoney(order.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Pasarela</dt>
              <dd className="text-slate-300">Simulación (desarrollo)</dd>
            </div>
          </dl>
        )}

        <Button className="mt-8 w-full bg-violet-600 hover:bg-violet-700" size="lg" asChild>
          <Link href="/">Seguir comprando</Link>
        </Button>
        {orderId && (
          <Button variant="outline" className="mt-3 w-full" asChild>
            <Link href={`/orders/${orderId}`}>Ver detalle del pedido</Link>
          </Button>
        )}
      </StoreCard>
    </div>
  );
}
