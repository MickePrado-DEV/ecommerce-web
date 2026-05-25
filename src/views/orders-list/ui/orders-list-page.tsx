'use client';

import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/entities/order/api/order-api';
import { formatMoney } from '@/shared/lib/format-money';
import Link from 'next/link';

export function OrdersListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders', 1],
    queryFn: () => orderApi.list(1, 20),
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mis pedidos</h1>
      <ul className="space-y-3">
        {data?.items.map((o) => (
          <li key={o.id}>
            <Link
              href={`/orders/${o.id}`}
              className="flex items-center justify-between rounded-lg border border-white/10 p-4 hover:border-violet-500/50"
            >
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="text-sm text-zinc-400">{o.status}</p>
              </div>
              <span className="text-violet-400">{formatMoney(o.total)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
